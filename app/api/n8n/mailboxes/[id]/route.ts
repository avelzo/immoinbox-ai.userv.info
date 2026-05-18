import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { decryptText } from "@/lib/crypto";

type RouteProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: Request, { params }: RouteProps) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.N8N_WEBHOOK_SECRET}`) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = await params;

  const mailbox = await prisma.mailbox.findUnique({
    where: { id },
    include: {
      organization: true,
    },
  });

  if (!mailbox) {
    return NextResponse.json(
      { error: "Mailbox not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    id: mailbox.id,
    organizationId: mailbox.organizationId,
    organizationName: mailbox.organization.name,
    email: mailbox.email,
    provider: mailbox.provider,
    imapHost: mailbox.imapHost,
    imapPort: mailbox.imapPort,
    imapSecure: mailbox.imapSecure,
    imapUsername: mailbox.imapUsername,
    imapPassword: mailbox.imapPassword
        ? decryptText(mailbox.imapPassword)
        : null,
  });
}