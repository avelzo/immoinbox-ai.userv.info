import { redirect } from "next/navigation";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Inbox,
  Mail,
  Wrench,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentUserOrganizationId } from "@/lib/current-user";
import { EMAIL_CATEGORIES } from "@/lib/email-categories";
import {
  getCategoryClass,
  getCategoryLabel,
} from "@/lib/email-ui";
import {
  getInterventionStatusClass,
  getInterventionStatusLabel,
} from "@/lib/intervention-ui";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { DashboardSectionHeader } from "@/components/dashboard/DashboardSectionHeader";
import { DashboardStatCard } from "@/components/dashboard/DashboardStatCard";
import {
  categoryBarColors,
  interventionBarColors,
} from "@/lib/dashboard-ui";

export default async function StatsPage() {
  const organizationId = await getCurrentUserOrganizationId();

  if (!organizationId) {
    redirect("/login");
  }

  const [
    totalEmails,
    newEmails,
    urgentEmails,
    processedEmails,
    categoryCountsRaw,
    totalInterventions,
    pendingInterventions,
    scheduledInterventions,
    inProgressInterventions,
    completedInterventions,
  ] = await Promise.all([
    prisma.email.count({
      where: { organizationId },
    }),

    prisma.email.count({
      where: { organizationId, status: "NEW" },
    }),

    prisma.email.count({
      where: { organizationId, urgency: { gte: 4 } },
    }),

    prisma.email.count({
      where: { organizationId, status: "PROCESSED" },
    }),

    prisma.email.groupBy({
      by: ["category"],
      where: { organizationId },
      _count: { category: true },
    }),

    prisma.intervention.count({
      where: { organizationId },
    }),

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
  ]);

  const categoryCounts = Object.fromEntries(
    categoryCountsRaw.map((item) => [
      item.category,
      item._count.category,
    ])
  );

  const interventionStats = [
    {
      status: "PENDING",
      count: pendingInterventions,
    },
    {
      status: "SCHEDULED",
      count: scheduledInterventions,
    },
    {
      status: "IN_PROGRESS",
      count: inProgressInterventions,
    },
    {
      status: "COMPLETED",
      count: completedInterventions,
    },
  ];

  const processedRate =
    totalEmails > 0
      ? Math.round((processedEmails / totalEmails) * 100)
      : 0;

  const urgentRate =
    totalEmails > 0
      ? Math.round((urgentEmails / totalEmails) * 100)
      : 0;

  return (
    <main className="p-6">
      <div className="mx-auto max-w-5xl space-y-8">
        <DashboardPageHeader
          title="Statistiques"
          description="Vue d'ensemble de l'activité emails et interventions."
        />

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardStatCard
            label="Emails"
            value={totalEmails}
            description="Analysés par l'IA"
            icon={Mail}
            accent="indigo"
          />

          <DashboardStatCard
            label="Non traités"
            value={newEmails}
            description="Encore à traiter"
            icon={Inbox}
            accent="orange"
          />

          <DashboardStatCard
            label="Urgents"
            value={urgentEmails}
            description={`${urgentRate}% des emails`}
            icon={AlertTriangle}
            accent="red"
          />

          <DashboardStatCard
            label="Interventions"
            value={totalInterventions}
            description="Demandes techniques"
            icon={Wrench}
            accent="cyan"
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <DashboardSectionHeader
              icon={Mail}
              title="Emails par catégorie"
              description="Répartition du volume analysé"
            />

            <div className="space-y-4 p-6 pt-2">
              {Object.entries(EMAIL_CATEGORIES).map(([key]) => {
                const count = categoryCounts[key] ?? 0;
                const percentage =
                  totalEmails > 0
                    ? Math.round((count / totalEmails) * 100)
                    : 0;

                return (
                  <div key={key}>
                    <div className="mb-1.5 flex items-center justify-between gap-2 text-sm">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getCategoryClass(
                          key
                        )}`}
                      >
                        {getCategoryLabel(key)}
                      </span>

                      <span className="shrink-0 text-slate-500">
                        {count} · {percentage}%
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full transition-all ${
                          categoryBarColors[key] ?? "bg-indigo-500"
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <DashboardSectionHeader
              icon={Wrench}
              title="Interventions par statut"
              description="Suivi opérationnel en cours"
            />

            <div className="space-y-4 p-6 pt-2">
              {interventionStats.map((item) => {
                const percentage =
                  totalInterventions > 0
                    ? Math.round((item.count / totalInterventions) * 100)
                    : 0;

                return (
                  <div key={item.status}>
                    <div className="mb-1.5 flex items-center justify-between gap-2 text-sm">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getInterventionStatusClass(
                          item.status
                        )}`}
                      >
                        {getInterventionStatusLabel(item.status)}
                      </span>

                      <span className="shrink-0 text-slate-500">
                        {item.count} · {percentage}%
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full transition-all ${
                          interventionBarColors[item.status] ?? "bg-indigo-500"
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <DashboardSectionHeader
              icon={CheckCircle2}
              title="Traitement emails"
              description="Part des emails marqués comme traités"
            />

            <div className="p-6 pt-2">
              <p className="text-4xl font-bold tracking-tight text-indigo-600">
                {processedRate}%
              </p>

              <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all"
                  style={{ width: `${processedRate}%` }}
                />
              </div>

              <p className="mt-3 text-sm text-slate-500">
                {processedEmails} emails traités sur {totalEmails}.
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <DashboardSectionHeader
              icon={BarChart3}
              title="Lecture métier"
              description="Indicateurs clés pour votre agence"
            />

            <div className="space-y-4 p-6 pt-2 text-sm leading-relaxed text-slate-600">
              <p>
                Les emails urgents représentent{" "}
                <strong className="text-slate-900">{urgentRate}%</strong> des
                messages analysés.
              </p>

              <p>
                Les interventions transforment les incidents en suivi technique
                concret, avec{" "}
                <strong className="text-slate-900">
                  {totalInterventions}
                </strong>{" "}
                dossiers ouverts au total.
              </p>

              <p className="rounded-xl bg-indigo-50/60 px-4 py-3 text-indigo-900/80">
                Cette page évoluera pour mesurer le temps gagné, le volume
                traité et la réactivité de l&apos;agence.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
