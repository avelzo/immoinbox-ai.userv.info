import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CopyButton } from "@/components/CopyButton";
import { EmailStatusButton } from "@/components/EmailStatusButton";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

function getCategoryLabel(category?: string | null) {
  const labels: Record<string, string> = {
    INCIDENT: "Incident",
    DEMANDE_LOCATAIRE: "Demande locataire",
    CANDIDATURE: "Candidature",
    QUITTANCE: "Quittance",
    FACTURE: "Facture",
    URGENT: "Urgent",
    ADMINISTRATIF: "Administratif",
    SPAM: "Spam",
  };

  return category ? labels[category] ?? category : "Non classé";
}

function getCategoryClass(category?: string | null) {
  const classes: Record<string, string> = {
    INCIDENT: "bg-red-100 text-red-700",
    DEMANDE_LOCATAIRE: "bg-blue-100 text-blue-700",
    CANDIDATURE: "bg-violet-100 text-violet-700",
    QUITTANCE: "bg-emerald-100 text-emerald-700",
    FACTURE: "bg-amber-100 text-amber-700",
    URGENT: "bg-orange-100 text-orange-700",
    ADMINISTRATIF: "bg-slate-100 text-slate-700",
    SPAM: "bg-zinc-200 text-zinc-700",
  };

  return classes[category ?? ""] ?? "bg-slate-100 text-slate-700";
}

function getUrgencyLabel(urgency?: number | null) {
  if (!urgency) return "Non défini";
  if (urgency >= 5) return "Très urgent";
  if (urgency === 4) return "Urgent";
  if (urgency === 3) return "Moyen";
  if (urgency === 2) return "Faible";
  return "Très faible";
}

function getUrgencyClass(urgency?: number | null) {
  if (!urgency) return "bg-slate-100 text-slate-700";
  if (urgency >= 5) return "bg-red-100 text-red-700";
  if (urgency === 4) return "bg-orange-100 text-orange-700";
  if (urgency === 3) return "bg-amber-100 text-amber-700";
  return "bg-slate-100 text-slate-700";
}

function getStatusLabel(status: string) {
  return status === "PROCESSED" ? "Traité" : "Non traité";
}

function getStatusClass(status: string) {
  return status === "PROCESSED"
    ? "bg-emerald-100 text-emerald-700"
    : "bg-slate-100 text-slate-700";
}

export default async function EmailDetailPage({ params }: PageProps) {
  const { id } = await params;

  const email = await prisma.email.findUnique({
    where: { id },
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
          <h2 className="mb-3 text-xl font-semibold">
            Résumé IA
          </h2>

          <p className="text-slate-800">
            {email.summary ?? "Aucun résumé disponible."}
          </p>
        </section>

        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">
              Réponse suggérée
            </h2>

            <CopyButton text={email.suggestedReply} />
          </div>

          <div className="whitespace-pre-wrap rounded-xl bg-slate-100 p-4 text-slate-800">
            {email.suggestedReply ?? "Aucune réponse suggérée."}
          </div>
        </section>

        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-xl font-semibold">
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