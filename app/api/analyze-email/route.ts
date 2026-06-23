import { NextResponse } from "next/server";
import OpenAI from "openai";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isValidN8nRequest } from "@/lib/n8n-auth";
import {
  buildAnalyzeEmailDuplicateResponse,
  ensureInterventionForEmail,
} from "@/lib/intervention-from-email";
import { formatInterventionForApi } from "@/lib/intervention-ui";
import { buildEmailAnalysisPrompt } from "@/lib/prompts/email-analysis";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const BodySchema = z.object({
  organizationId: z.string(),
  mailboxId: z.string().optional(),
  subject: z.string().min(1),
  from: z.string().min(1),
  to: z.array(z.string()).optional().default([]),
  content: z.string().min(1),
  externalMessageId: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    if (!isValidN8nRequest(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = BodySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid payload",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const {
      organizationId,
      mailboxId,
      subject,
      from,
      to,
      content,
      externalMessageId: rawExternalMessageId,
    } = parsed.data;

    const externalMessageId = rawExternalMessageId?.trim() || undefined;

    if (externalMessageId) {
      const existingEmail = await prisma.email.findFirst({
        where: {
          externalMessageId,
          organizationId,
        },
      });

      if (existingEmail) {
        return NextResponse.json(
          await buildAnalyzeEmailDuplicateResponse(existingEmail)
        );
      }
    }
    const cleanContent = content
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 6000);
    const prompt = buildEmailAnalysisPrompt({
      subject,
      from,
      content: cleanContent,
    });
    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
      text: {
        format: {
          type: "json_schema",
          name: "email_analysis",
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              category: {
                type: "string",
                enum: [
                  "INCIDENT",
                  "INTERVENTION",
                  "DEMANDE_LOCATAIRE",
                  "CANDIDATURE",
                  "QUITTANCE",
                  "FACTURE",
                  "URGENT",
                  "ADMINISTRATIF",
                  "SPAM",
                ],
              },
              senderRole: {
                type: "string",
                enum: [
                  "TENANT",
                  "TECHNICIAN",
                  "OWNER",
                  "SYNDIC",
                  "CANDIDATE",
                  "ADMINISTRATION",
                  "UNKNOWN",
                ],
              },
              urgency: {
                type: "integer",
                minimum: 1,
                maximum: 5,
              },
              summary: {
                type: "string",
              },
              recommendedAction: {
                type: "string",
              },
              suggestedReply: {
                type: "string",
              },
            },
            required: [
              "category",
              "urgency",
              "summary",
              "recommendedAction",
              "suggestedReply",
              "senderRole",
            ],
          },
          strict: true,
        },
      },
    });

    const analysis = JSON.parse(response.output_text);

    if (externalMessageId) {
      const existingAfterAnalysis = await prisma.email.findFirst({
        where: {
          externalMessageId,
          organizationId,
        },
      });

      if (existingAfterAnalysis) {
        return NextResponse.json(
          await buildAnalyzeEmailDuplicateResponse(existingAfterAnalysis)
        );
      }
    }

    let savedEmail;
    try {
      savedEmail = await prisma.email.create({
        data: {
          organizationId,
          mailboxId,

          externalMessageId,
          from,
          to,
          subject,
          textContent: cleanContent,

          category: analysis.category,
          urgency: analysis.urgency,
          summary: analysis.summary,
          recommendedAction: analysis.recommendedAction,
          suggestedReply: analysis.suggestedReply,
          senderRole: analysis.senderRole,
          status: "NEW",
        },
      });
    } catch (error) {
      if (
        externalMessageId &&
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        const existingEmail = await prisma.email.findFirst({
          where: {
            externalMessageId,
            organizationId,
          },
        });

        if (existingEmail) {
          return NextResponse.json(
            await buildAnalyzeEmailDuplicateResponse(existingEmail)
          );
        }
      }

      throw error;
    }
    
    const createdIntervention = await ensureInterventionForEmail({
      organizationId,
      email: savedEmail,
      category: analysis.category,
      summary: analysis.summary,
      recommendedAction: analysis.recommendedAction,
      subject,
      from,
      senderRole: analysis.senderRole,
    });

    return NextResponse.json({
      success: true,
      duplicated: false,
      email: savedEmail,
      intervention: createdIntervention
        ? formatInterventionForApi(createdIntervention)
        : null,
    });
  } catch (error) {
    console.error("Analyze email error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}