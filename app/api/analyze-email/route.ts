import { NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

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
      externalMessageId,
    } = parsed.data;

    if (externalMessageId) {
      const existingEmail = await prisma.email.findFirst({
        where: {
          externalMessageId,
          organizationId,
        },
      });

      if (existingEmail) {
        return NextResponse.json({
          success: true,
          duplicated: true,
          email: existingEmail,
        });
      }
    }
    const cleanContent = content
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 6000);
    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: `
        Tu es un assistant spécialisé en gestion locative.

        Analyse cet email immobilier.

        Sujet: ${subject}
        Expéditeur: ${from}
        Contenu:
        ${cleanContent}
      `,
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
                  "DEMANDE_LOCATAIRE",
                  "CANDIDATURE",
                  "QUITTANCE",
                  "FACTURE",
                  "URGENT",
                  "ADMINISTRATIF",
                  "SPAM",
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
            ],
          },
          strict: true,
        },
      },
    });

    const analysis = JSON.parse(response.output_text);

    const savedEmail = await prisma.email.create({
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

        status: "NEW",
      },
    });

    return NextResponse.json({
      success: true,
      duplicated: false,
      email: savedEmail,
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