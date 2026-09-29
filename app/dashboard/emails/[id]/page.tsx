import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ArrowLeft, Bot, FileText } from "lucide-react";
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
    <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <Link
        href="/dashboard/emails"
        className="mb-5 flex w-fit items-center gap-1.5 text-sm text-anthracite/60 hover:text-forest"
      >
        <ArrowLeft size={14} />
        Boîte de réception
      </Link>
      <section className="mb-4 rounded-2xl border border-line bg-white p-5">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="mb-2 text-base font-semibold leading-snug text-anthracite">
              {email.subject}
            </h1>
            <p className="break-all text-sm font-medium text-anthracite/80">
              {email.from}
            </p>
            <p className="mt-1 text-xs text-anthracite/50">
              {new Intl.DateTimeFormat("fr-FR", {
                dateStyle: "full",
                timeStyle: "short",
                timeZone: "Europe/Paris",
              }).format(email.receivedAt)}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end">
            <span
              className={`rounded-md px-2 py-0.5 text-[10px] font-medium ${getCategoryClass(email.category)}`}
            >
              {getCategoryLabel(email.category)}
            </span>
            <span
              className={`rounded-md px-2 py-0.5 text-[10px] font-medium ${getUrgencyClass(email.urgency)}`}
            >
              {getUrgencyLabel(email.urgency)}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 border-t border-line pt-4">
          <span className="mr-1 text-xs text-anthracite/60">Statut :</span>
          <span
            className={`rounded-md px-2 py-0.5 text-[10px] font-medium ${getStatusClass(email.status)}`}
          >
            {getStatusLabel(email.status)}
          </span>
          <EmailStatusButton emailId={email.id} initialStatus={email.status} />
          <div className="flex-1" />
          {email.interventions.length > 0 ? (
            <Link
              href={`/dashboard/interventions/${email.interventions[0].id}`}
              className="rounded-xl bg-sage px-3 py-1.5 text-xs font-medium text-forest hover:bg-sage-dark"
            >
              Voir l’intervention
            </Link>
          ) : email.category === "INCIDENT" ? (
            <CreateInterventionButton emailId={email.id} />
          ) : null}
        </div>
      </section>
      <section className="mb-4 overflow-hidden rounded-2xl border border-line bg-white">
        <div className="flex items-center gap-2 border-b border-line bg-ivory px-5 py-3">
          <FileText size={13} className="text-anthracite/50" />
          <h2 className="text-xs font-semibold uppercase tracking-wide text-anthracite/60">
            Message original
          </h2>
        </div>
        <div className="whitespace-pre-wrap break-words px-5 py-4 text-sm leading-relaxed text-anthracite/80">
          {email.textContent}
        </div>
      </section>
      <section className="mb-4 overflow-hidden rounded-2xl border border-sage bg-sage/30">
        <div className="flex items-center gap-2 border-b border-sage px-5 py-3">
          <Bot size={13} className="text-forest" />
          <h2 className="text-xs font-semibold uppercase tracking-wide text-forest">
            Analyse IA
          </h2>
        </div>
        <div className="space-y-4 px-5 py-4 text-sm text-anthracite">
          <div>
            <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-anthracite/60">
              Résumé
            </h3>
            <p>{email.summary ?? "Aucun résumé disponible."}</p>
          </div>
          <div>
            <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-anthracite/60">
              Action recommandée
            </h3>
            <p>{email.recommendedAction ?? "Aucune action recommandée."}</p>
          </div>
        </div>
      </section>
      <section className="overflow-hidden rounded-2xl border border-line bg-white">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-5 py-3">
          <div className="flex items-center gap-2">
            <Bot size={13} className="text-forest" />
            <h2 className="text-xs font-semibold uppercase tracking-wide text-anthracite/60">
              Réponse suggérée
            </h2>
          </div>
          <CopyButton text={email.suggestedReply} />
        </div>
        <div className="whitespace-pre-wrap break-words px-5 py-4 text-sm leading-relaxed text-anthracite/80">
          {email.suggestedReply ?? "Aucune réponse suggérée."}
        </div>
        <p className="border-t border-line bg-ivory px-5 py-3 text-xs text-anthracite/60">
          Cette réponse est une suggestion générée par IA. Relisez et adaptez
          avant utilisation.
        </p>
      </section>
    </main>
  );
}
export const metadata: Metadata = { title: "Détail de la demande" };
