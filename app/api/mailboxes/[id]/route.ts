import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserOrganizationId } from "@/lib/current-user";
import { z } from "zod";
import { encryptText } from "@/lib/crypto";

type RouteProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(_request: Request, { params }: RouteProps) {
  try {
    const { id } = await params;
    const organizationId = await getCurrentUserOrganizationId();

    if (!organizationId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const mailbox = await prisma.mailbox.findFirst({
      where: {
        id,
        organizationId,
      },
    });

    if (!mailbox) {
      return NextResponse.json(
        { error: "Mailbox not found" },
        { status: 404 }
      );
    }

    await prisma.mailbox.delete({
      where: {
        id: mailbox.id,
      },
    });
    
    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Delete mailbox error:", error);

    return NextResponse.json(
      { error: "Unable to delete mailbox" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: RouteProps
) {
  try {
    const { id } = await params;

    const organizationId =
      await getCurrentUserOrganizationId();

    if (!organizationId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const mailbox = await prisma.mailbox.findFirst({
      where: {
        id,
        organizationId,
      },
    });

    if (!mailbox) {
      return NextResponse.json(
        { error: "Mailbox not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const UpdateMailboxSchema = z.object({
      email: z.string().email(),
      provider: z.string().min(1),
      imapHost: z.string().min(1),
      imapPort: z.coerce.number().int().positive(),
      imapSecure: z.boolean(),
      imapUsername: z.string().min(1),
      imapPassword: z.string().optional(),
    });
    const parsed =
      UpdateMailboxSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid payload",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const updatedMailbox =
      await prisma.mailbox.update({
        where: {
          id,
        },
        data: {
          email: parsed.data.email,
          provider: parsed.data.provider,

          imapHost: parsed.data.imapHost,
          imapPort: parsed.data.imapPort,
          imapSecure: parsed.data.imapSecure,
          imapUsername: parsed.data.imapUsername,

          ...(parsed.data.imapPassword
            ? {
                imapPassword: encryptText(
                  parsed.data.imapPassword
                ),
              }
            : {}),
        },
      });

    return NextResponse.json({
      success: true,
      mailbox: updatedMailbox,
    });
  } catch (error) {
    console.error("Update mailbox error:", error);

    return NextResponse.json(
      {
        error: "Unable to update mailbox",
      },
      { status: 500 }
    );
  }
}