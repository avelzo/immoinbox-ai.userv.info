import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getCurrentUserOrganizationId } from "@/lib/current-user";
import { EditMailboxForm } from "@/components/mailboxes/EditMailboxForm";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditMailboxPage({ params }: PageProps) {
  const { id } = await params;
  const organizationId = await getCurrentUserOrganizationId();

  if (!organizationId) {
    redirect("/login");
  }

  const mailbox = await prisma.mailbox.findFirst({
    where: {
      id,
      organizationId,
    },
  });

  if (!mailbox) {
    notFound();
  }

  return (
    <main className="p-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <Link
          href="/dashboard/settings"
          className="text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          ← Retour aux paramètres
        </Link>

        <EditMailboxForm mailbox={mailbox} />
      </div>
    </main>
  );
}