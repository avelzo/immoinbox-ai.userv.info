import { NextResponse } from "next/server";
import { ImapFlow } from "imapflow";
import { prisma } from "@/lib/prisma";
import { getCurrentUserOrganizationId } from "@/lib/current-user";
import { decryptText } from "@/lib/crypto";

type RouteProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(_request: Request, { params }: RouteProps) {
  const { id } = await params;
  const organizationId = await getCurrentUserOrganizationId();
  if (!organizationId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
  let mailbox = null;
  try {
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

    if (
      !mailbox.imapHost ||
      !mailbox.imapPort ||
      !mailbox.imapUsername ||
      !mailbox.imapPassword
    ) {
      return NextResponse.json(
        { error: "Configuration IMAP incomplète" },
        { status: 400 }
      );
    }

    const client = new ImapFlow({
      host: mailbox.imapHost,
      port: mailbox.imapPort,
      secure: mailbox.imapSecure,
      auth: {
        user: mailbox.imapUsername,
        pass: decryptText(mailbox.imapPassword),
      },
      logger: false,
    });

    await client.connect();

    const mailboxStatus = await client.status("INBOX", {
      messages: true,
      unseen: true,
    });

    await client.logout();
    await prisma.mailbox.update({
      where: { id: mailbox.id },
      data: {
        connectionStatus: "CONNECTED",
        lastTestedAt: new Date(),
        lastError: null,
      },
    });
    return NextResponse.json({
      success: true,
      message: "Connexion IMAP réussie",
      status: {
        messages: mailboxStatus.messages,
        unseen: mailboxStatus.unseen,
      },
    });
  } catch (error) {

    console.error("Test mailbox error:", error);
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
    await prisma.mailbox.update({
      where: { id: mailbox.id },
      data: {
        connectionStatus: "ERROR",
        lastTestedAt: new Date(),
        lastError:
          error instanceof Error ? error.message : "Unknown error",
      },
    });

    return NextResponse.json(
      {
        error: "Connexion IMAP impossible",
        details:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      { status: 500 }
    );
  }
}