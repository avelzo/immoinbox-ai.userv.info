import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth-server";
import { getCurrentUserOrganizationId } from "@/lib/current-user";
import { MailboxForm } from "@/components/mailboxes/MailboxForm";
import { TestMailboxButton } from "@/components/mailboxes/TestMailboxButton";
import { CopyN8nConfigButton } from "@/components/mailboxes/CopyN8nConfigButton";
import { DeleteMailboxButton } from "@/components/mailboxes/DeleteMailboxButton";

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
      users: true,
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
  const localApiBaseUrl = "http://host.docker.internal:3000";

  return (
    <main className="p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Paramètres
          </h1>

          <p className="mt-2 text-slate-600">
            Informations de l’agence et configuration technique.
          </p>
        </div>

        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            Organisation
          </h2>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-sm text-slate-500">Nom</p>
              <p className="mt-1 font-medium text-slate-900">
                {organization.name}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">ID organisation</p>
              <p className="mt-1 break-all rounded-xl bg-slate-100 px-3 py-2 font-mono text-sm text-slate-700">
                {organization.id}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            Utilisateur connecté
          </h2>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-sm text-slate-500">Email</p>
              <p className="mt-1 font-medium text-slate-900">
                {session.user.email}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Nom</p>
              <p className="mt-1 font-medium text-slate-900">
                {session.user.name ?? "Non renseigné"}
              </p>
            </div>
          </div>
        </section>
        <MailboxForm />
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            Boîtes mail connectées
          </h2>

          {organization.mailboxes.length === 0 ? (
            <p className="mt-4 text-slate-500">
              Aucune boîte mail connectée pour le moment.
            </p>
          ) : (
            <div className="mt-6 grid gap-4">
              {organization.mailboxes.map((mailbox) => {
                const isConnected = mailbox.connectionStatus === "CONNECTED";
                const hasError = mailbox.connectionStatus === "ERROR";

                return (
                  <div
                    key={mailbox.id}
                    className="rounded-2xl border bg-white p-5 shadow-sm"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-slate-900">
                            {mailbox.email}
                          </p>

                          {isConnected ? (
                            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                              Connectée
                            </span>
                          ) : hasError ? (
                            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                              Erreur
                            </span>
                          ) : (
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                              Non testée
                            </span>
                          )}
                        </div>

                        <div className="mt-3 grid gap-2 text-sm text-slate-600 md:grid-cols-2">
                          <p>
                            <span className="text-slate-400">Provider :</span>{" "}
                            {mailbox.provider}
                          </p>

                          <p>
                            <span className="text-slate-400">IMAP :</span>{" "}
                            {mailbox.imapHost ?? "Non configuré"}:{mailbox.imapPort ?? "—"}
                          </p>

                          <p>
                            <span className="text-slate-400">Utilisateur :</span>{" "}
                            {mailbox.imapUsername ?? "Non configuré"}
                          </p>

                          <p>
                            <span className="text-slate-400">Dernier test :</span>{" "}
                            {mailbox.lastTestedAt
                              ? new Intl.DateTimeFormat("fr-FR", {
                                  dateStyle: "short",
                                  timeStyle: "short",
                                }).format(mailbox.lastTestedAt)
                              : "Jamais"}
                          </p>
                        </div>

                        {mailbox.lastError && (
                          <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
                            {mailbox.lastError}
                          </div>
                        )}

                        <details className="mt-4">
                          <summary className="cursor-pointer text-sm font-medium text-slate-700">
                            Voir configuration n8n
                          </summary>

                          <div className="mt-3 space-y-2 text-xs">
                            <code className="block break-all rounded-lg bg-slate-100 p-2 text-slate-700">
                              {localApiBaseUrl}/api/n8n/mailboxes/{mailbox.id}
                            </code>

                            <code className="block break-all rounded-lg bg-slate-100 p-2 text-slate-700">
                              {localApiBaseUrl}/api/analyze-email
                            </code>
                          </div>
                        </details>
                      </div>

                      <div className="flex flex-wrap gap-2 md:justify-end">
                        <TestMailboxButton mailboxId={mailbox.id} />

                        <CopyN8nConfigButton
                          mailboxId={mailbox.id}
                          configEndpoint={`${localApiBaseUrl}/api/n8n/mailboxes/${mailbox.id}`}
                          analyzeEndpoint={`${localApiBaseUrl}/api/analyze-email`}
                        />

                        <Link
                          href={`/dashboard/settings/mailboxes/${mailbox.id}`}
                          className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                        >
                          Modifier
                        </Link>

                        <DeleteMailboxButton mailboxId={mailbox.id} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>            
          )}
        </section>

        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            Configuration n8n
          </h2>

          <p className="mt-2 text-slate-600">
            Ces informations servent à connecter un workflow n8n à cette agence.
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <p className="text-sm text-slate-500">Endpoint API</p>
              <p className="mt-1 break-all rounded-xl bg-slate-100 px-3 py-2 font-mono text-sm text-slate-700">
                {localApiBaseUrl}/api/analyze-email
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">organizationId</p>
              <p className="mt-1 break-all rounded-xl bg-slate-100 px-3 py-2 font-mono text-sm text-slate-700">
                {organization.id}
              </p>
            </div>

            {organization.mailboxes[0] && (
              <div>
                <p className="text-sm text-slate-500">mailboxId principal</p>
                <p className="mt-1 break-all rounded-xl bg-slate-100 px-3 py-2 font-mono text-sm text-slate-700">
                  {organization.mailboxes[0].id}
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <h2 className="text-xl font-semibold text-amber-900">
            Note MVP
          </h2>

          <p className="mt-2 text-amber-900">
            Pour le moment, la connexion email se configure encore dans n8n.
            Plus tard, cette page permettra d’ajouter une boîte mail directement
            depuis l’interface.
          </p>
        </section>
      </div>
    </main>
  );
}