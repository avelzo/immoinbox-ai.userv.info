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
      <main className="p-6">
        <div className="mx-auto max-w-5xl rounded-2xl border border-dashed bg-white p-12 text-center">
          <p className="text-lg font-medium text-slate-700">
            Aucune organisation trouvée
          </p>

          <p className="mt-2 text-slate-500">
            Votre compte n’est pas encore rattaché à une agence.
          </p>
        </div>
      </main>
    );
  }

  const n8nApiBaseUrl = "http://app:3000";

  return (
    <main className="p-6">
      <div className="mx-auto max-w-5xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Paramètres
          </h1>

          <p className="mt-2 text-slate-600">
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
