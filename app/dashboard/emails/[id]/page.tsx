import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CopyButton } from "@/components/CopyButton";
import { EmailStatusButton } from "@/components/EmailStatusButton";
import { CreateInterventionButton } from "@/components/CreateInterventionButton";
import { getCurrentUserOrganizationId } from "@/lib/current-user";
import { redirect } from "next/navigation";
import {
  getCategoryLabel,
  getCategoryClass,
  getUrgencyLabel,
  getUrgencyClass,
  getStatusLabel,
  getStatusClass,
} from "@/lib/email-ui";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EmailDetailPage({ params }: PageProps) {
  const organizationId = await getCurrentUserOrganizationId();
  if (!organizationId) {
    redirect("/login");
  }
  const { id } = await params;

  const email = await prisma.email.findFirst({
    where: { id, organizationId },
    include: {
      interventions: true,
    },
  });

  if (!email) {
    notFound();
  }

  return (
    <main className="p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-col gap-4 rounded-2xl border bg-white p-6 shadow-sm">
          <div>
            <Link
              href="/dashboard/emails"
              className="text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              ← Retour aux emails
            </Link>

            <h1 className="mt-4 text-3xl font-bold text-slate-900">
              {email.subject}
            </h1>

            <p className="mt-2 text-slate-600">
              De : {email.from}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Reçu le{" "}
              {new Intl.DateTimeFormat("fr-FR", {
                dateStyle: "full",
                timeStyle: "short",
              }).format(email.receivedAt)}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${getCategoryClass(
                email.category
              )}`}
            >
              {getCategoryLabel(email.category)}
            </span>

            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${getUrgencyClass(
                email.urgency
              )}`}
            >
              {getUrgencyLabel(email.urgency)}
            </span>

            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                email.status
              )}`}
            >
              {getStatusLabel(email.status)}
            </span>

            <EmailStatusButton
              emailId={email.id}
              initialStatus={email.status}
            />
            {email.category === "INCIDENT" && (
              <>
                {email.interventions.length > 0 ? (
                  <Link
                    href={`/dashboard/interventions/${email.interventions[0].id}`}
                    className="rounded-xl bg-cyan-100 px-3 py-1 text-sm font-medium text-cyan-700 hover:bg-cyan-200"
                  >
                    Voir l’intervention liée
                  </Link>
                ) : (
                  <CreateInterventionButton emailId={email.id} />
                )}
              </>
            )}
          </div>
          
        </div>

        <section className="rounded-2xl border border-orange-200 bg-orange-50 p-6 shadow-sm">
          <h2 className="mb-2 text-lg font-semibold text-orange-900">
            Action recommandée
          </h2>

          <p className="text-orange-900">
            {email.recommendedAction ?? "Aucune action recommandée."}
          </p>
        </section>

        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-xl font-semibold text-slate-700">
            Résumé IA
          </h2>

          <p className="text-slate-800">
            {email.summary ?? "Aucun résumé disponible."}
          </p>
        </section>

        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-slate-700">
              Réponse suggérée
            </h2>

            <CopyButton text={email.suggestedReply} />
          </div>

          <div className="whitespace-pre-wrap rounded-xl bg-slate-100 p-4 text-slate-800">
            {email.suggestedReply ?? "Aucune réponse suggérée."}
          </div>
        </section>

        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-xl font-semibold text-slate-700">
            Email original
          </h2>

          <div className="whitespace-pre-wrap rounded-xl bg-slate-100 p-4 text-slate-800">
            {email.textContent}
          </div>
        </section>
      </div>
    </main>
  );
}