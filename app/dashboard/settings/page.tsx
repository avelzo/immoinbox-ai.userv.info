import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth-server";
import { getCurrentUserOrganizationId } from "@/lib/current-user";
import { SettingsTabs } from "@/components/settings/SettingsTabs";

export default async function SettingsPage() {
  const session = await getSession();
  const organizationId = await getCurrentUserOrganizationId();

  if (!session?.user?.email || !organizationId) {
    redirect("/login");
  }

  const organization = await prisma.organization.findUnique({
    where: {
      id: organizationId,
    },
    include: {
      mailboxes: true,
    },
  });

  if (!organization) {
    return (
      <main className="px-4 py-6 sm:px-6">
        <div className="max-w-5xl rounded-2xl border border-dashed bg-white p-12 text-center">
          <p className="text-lg font-medium text-anthracite/80">
            Aucune organisation trouvée
          </p>

          <p className="mt-2 text-anthracite/60">
            Votre compte n’est pas encore rattaché à une agence.
          </p>
        </div>
      </main>
    );
  }

  const n8nApiBaseUrl = process.env.APP_URL ?? "http://localhost:3000";

  return (
    <main className="px-4 py-6 sm:px-6">
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-anthracite">
            Paramètres
          </h1>

          <p className="mt-2 text-anthracite/70">
            Configurez votre agence, vos boîtes mail et les intégrations.
          </p>
        </div>

        <SettingsTabs
          organization={{
            id: organization.id,
            name: organization.name,
            interventionNotifyEmail: organization.interventionNotifyEmail,
          }}
          user={{
            email: session.user.email,
            name: session.user.name ?? null,
          }}
          mailboxes={organization.mailboxes.map((mailbox) => ({
            id: mailbox.id,
            email: mailbox.email,
            provider: mailbox.provider,
            connectionStatus: mailbox.connectionStatus,
            imapHost: mailbox.imapHost,
            imapPort: mailbox.imapPort,
            imapUsername: mailbox.imapUsername,
            lastTestedAt: mailbox.lastTestedAt?.toISOString() ?? null,
            lastError: mailbox.lastError,
          }))}
          n8nApiBaseUrl={n8nApiBaseUrl}
        />
      </div>
    </main>
  );
}
export const metadata: Metadata = {
  title: "Paramètres de l’agence",
};
