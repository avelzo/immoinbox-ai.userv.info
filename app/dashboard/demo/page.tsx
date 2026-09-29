import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Mail,
  PlayCircle,
  Presentation,
  Wrench,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentUserOrganizationId } from "@/lib/current-user";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { DashboardPanel } from "@/components/dashboard/DashboardPanel";
import { DashboardSectionHeader } from "@/components/dashboard/DashboardSectionHeader";
import { DashboardStatCard } from "@/components/dashboard/DashboardStatCard";
import { LiveDemoEmailCard } from "@/components/demo/LiveDemoEmailCard";
import {
  DEMO_MAILBOX_EMAIL,
  DEMO_PREFIX,
  LIVE_DEMO_EMAILS,
} from "@/lib/demo-config";
import { getCategoryLabel } from "@/lib/email-ui";

export default async function DemoGuidePage() {
  const organizationId = await getCurrentUserOrganizationId();

  if (!organizationId) {
    redirect("/login");
  }

  const [
    totalEmails,
    newEmails,
    processedEmails,
    urgentEmails,
    categoryCountsRaw,
    totalInterventions,
    pendingInterventions,
    scheduledInterventions,
    inProgressInterventions,
    completedInterventions,
    recentEmails,
  ] = await Promise.all([
    prisma.email.count({ where: { organizationId } }),
    prisma.email.count({ where: { organizationId, status: "NEW" } }),
    prisma.email.count({ where: { organizationId, status: "PROCESSED" } }),
    prisma.email.count({ where: { organizationId, urgency: { gte: 4 } } }),
    prisma.email.groupBy({
      by: ["category"],
      where: { organizationId },
      _count: { category: true },
    }),
    prisma.intervention.count({ where: { organizationId } }),
    prisma.intervention.count({
      where: { organizationId, status: "PENDING" },
    }),
    prisma.intervention.count({
      where: { organizationId, status: "SCHEDULED" },
    }),
    prisma.intervention.count({
      where: { organizationId, status: "IN_PROGRESS" },
    }),
    prisma.intervention.count({
      where: { organizationId, status: "COMPLETED" },
    }),
    prisma.email.findMany({
      where: {
        organizationId,
        externalMessageId: { startsWith: DEMO_PREFIX },
      },
      orderBy: { receivedAt: "desc" },
      take: 5,
      select: {
        subject: true,
        category: true,
        urgency: true,
        status: true,
      },
    }),
  ]);

  const categoryCounts: Record<string, number> = Object.fromEntries(
    categoryCountsRaw.map((item) => [
      item.category ?? "UNCLASSIFIED",
      item._count.category,
    ]),
  );

  return (
    <main className="px-4 py-6 sm:px-6">
      <div className="max-w-5xl space-y-8">
        <DashboardPageHeader
          title="Guide démo"
          description="Scénario cohérent pour présenter ImmoInbox AI aux agences immobilières."
        />

        <DashboardPanel className="border-sage bg-sage/30">
          <p className="text-sm font-medium text-forest-dark">
            Scénario en une phrase
          </p>
          <p className="mt-2 text-sm leading-relaxed text-forest-dark/90">
            Une agence brestoise reçoit chaque jour des emails de locataires,
            propriétaires et artisans. L&apos;IA classe, résume et priorise —
            l&apos;équipe traite les urgences en premier et suit les
            interventions planifiées.
          </p>
        </DashboardPanel>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardStatCard
            label="Emails"
            value={totalEmails}
            description={`${processedEmails} traités · ${newEmails} à traiter`}
            icon={Mail}
            accent="indigo"
          />
          <DashboardStatCard
            label="Urgents"
            value={urgentEmails}
            description="Urgence ≥ 4/5"
            icon={AlertTriangle}
            accent="red"
          />
          <DashboardStatCard
            label="Interventions"
            value={totalInterventions}
            description={`${scheduledInterventions} planifiées`}
            icon={Wrench}
            accent="cyan"
          />
          <DashboardStatCard
            label="Terminées"
            value={completedInterventions}
            description={`${pendingInterventions} en attente · ${inProgressInterventions} en cours`}
            icon={CheckCircle2}
            accent="emerald"
          />
        </section>

        <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
          <DashboardSectionHeader
            icon={Presentation}
            title="Panel de données seedées"
            description="Répartition prévue après npm run seed:demo"
          />

          <div className="grid gap-6 p-6 lg:grid-cols-2">
            <div>
              <p className="mb-3 text-sm font-semibold text-anthracite">
                Emails par catégorie
              </p>
              <ul className="space-y-2 text-sm text-anthracite/70">
                {Object.entries(categoryCounts).length === 0 ? (
                  <li className="text-anthracite/60">
                    Aucune donnée — lancez{" "}
                    <code className="rounded bg-sage/30 px-1.5 py-0.5 text-xs">
                      npm run seed:demo
                    </code>
                  </li>
                ) : (
                  Object.entries(categoryCounts).map(([key, count]) => (
                    <li key={key} className="flex justify-between gap-4">
                      <span>{getCategoryLabel(key)}</span>
                      <span className="font-medium text-anthracite">
                        {count}
                      </span>
                    </li>
                  ))
                )}
              </ul>
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold text-anthracite">
                Interventions par statut
              </p>
              <ul className="space-y-2 text-sm text-anthracite/70">
                <li className="flex justify-between gap-4">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-orange-500" />
                    En attente
                  </span>
                  <span className="font-medium text-anthracite">
                    {pendingInterventions}
                  </span>
                </li>
                <li className="flex justify-between gap-4">
                  <span className="inline-flex items-center gap-1.5">
                    <PlayCircle className="h-3.5 w-3.5 text-cyan-500" />
                    Planifiées / en cours
                  </span>
                  <span className="font-medium text-anthracite">
                    {scheduledInterventions + inProgressInterventions}
                  </span>
                </li>
                <li className="flex justify-between gap-4">
                  <span className="inline-flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    Terminées
                  </span>
                  <span className="font-medium text-anthracite">
                    {completedInterventions}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {recentEmails.length > 0 && (
            <div className="border-t border-line px-6 py-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-anthracite/60">
                Exemples récents (seed)
              </p>
              <ul className="space-y-2 text-sm">
                {recentEmails.map((email) => (
                  <li
                    key={email.subject}
                    className="flex flex-wrap items-center gap-2 text-anthracite/80"
                  >
                    <span className="font-medium text-anthracite">
                      {email.subject}
                    </span>
                    <span className="text-anthracite/45">·</span>
                    <span>{getCategoryLabel(email.category)}</span>
                    <span className="text-anthracite/45">·</span>
                    <span>urgence {email.urgency}/5</span>
                    {email.status === "PROCESSED" && (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                        Traité
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-anthracite">
              Emails à envoyer en live
            </h2>
            <p className="mt-1 text-sm text-anthracite/70">
              Envoyez ces messages à{" "}
              <strong className="text-anthracite">{DEMO_MAILBOX_EMAIL}</strong>{" "}
              pendant la démo. n8n les analysera en temps réel via OpenAI.
            </p>
          </div>

          <div className="grid gap-4">
            {LIVE_DEMO_EMAILS.map((email) => (
              <LiveDemoEmailCard
                key={email.id}
                label={email.label}
                subject={email.subject}
                body={email.body}
                expected={email.expected}
              />
            ))}
          </div>
        </div>

        <DashboardPanel>
          <p className="text-sm font-semibold text-anthracite">
            Réinitialiser les données démo
          </p>
          <p className="mt-2 text-sm text-anthracite/70">
            Supprime tous les emails et interventions de l&apos;organisation,
            puis recrée 20 emails (3 traités) et 7 interventions.
          </p>
          <pre className="mt-4 overflow-x-auto rounded-xl bg-forest-dark px-4 py-3 text-sm text-slate-100">
            npm run seed:demo
          </pre>
          <p className="mt-3 text-sm text-anthracite/60">
            Doc complète :{" "}
            <Link
              href="/dashboard/settings/guide"
              className="font-medium text-forest hover:text-forest"
            >
              guide n8n
            </Link>{" "}
            · fichier{" "}
            <code className="rounded bg-sage/30 px-1.5 py-0.5 text-xs">
              docs/DEMO.md
            </code>
          </p>
        </DashboardPanel>
      </div>
    </main>
  );
}
export const metadata: Metadata = {
  title: "Guide de démonstration",
};
