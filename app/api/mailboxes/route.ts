import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUserOrganizationId } from "@/lib/current-user";
import { encryptText } from "@/lib/crypto";

const BodySchema = z.object({
  email: z.string().email(),
  provider: z.string().min(1),
  imapHost: z.string().min(1),
  imapPort: z.coerce.number().int().positive(),
  imapSecure: z.boolean().default(true),
  imapUsername: z.string().min(1),
  imapPassword: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const organizationId = await getCurrentUserOrganizationId();

    if (!organizationId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
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

    const mailbox = await prisma.mailbox.create({
      data: {
        organizationId,
        email: parsed.data.email,
        provider: parsed.data.provider,
        imapHost: parsed.data.imapHost,
        imapPort: parsed.data.imapPort,
        imapSecure: parsed.data.imapSecure,
        imapUsername: parsed.data.imapUsername,
        imapPassword: encryptText(parsed.data.imapPassword),
      },
    });

    return NextResponse.json({
      success: true,
      mailbox,
    });
  } catch (error) {
    console.error("Create mailbox error:", error);

    return NextResponse.json(
      { error: "Unable to create mailbox" },
      { status: 500 }
    );
  }
}