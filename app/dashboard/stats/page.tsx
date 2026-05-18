import { redirect } from "next/navigation";
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

function StatCard({
  label,
  value,
  description,
}: {
  label: string;
  value: number;
  description: string;
}) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-4xl font-bold text-slate-900">{value}</p>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
  );
}

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
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Statistiques
          </h1>

          <p className="mt-2 text-slate-600">
            Vue d’ensemble de l’activité emails et interventions.
          </p>
        </div>

        <section className="grid gap-4 md:grid-cols-4">
          <StatCard
            label="Emails"
            value={totalEmails}
            description="Emails analysés par l’IA."
          />

          <StatCard
            label="Non traités"
            value={newEmails}
            description="Emails encore à traiter."
          />

          <StatCard
            label="Urgents"
            value={urgentEmails}
            description={`${urgentRate}% des emails.`}
          />

          <StatCard
            label="Interventions"
            value={totalInterventions}
            description="Demandes techniques créées."
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              Emails par catégorie
            </h2>

            <div className="mt-6 space-y-3">
              {Object.entries(EMAIL_CATEGORIES).map(([key]) => {
                const count = categoryCounts[key] ?? 0;
                const percentage =
                  totalEmails > 0
                    ? Math.round((count / totalEmails) * 100)
                    : 0;

                return (
                  <div key={key}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getCategoryClass(
                          key
                        )}`}
                      >
                        {getCategoryLabel(key)}
                      </span>

                      <span className="text-slate-500">
                        {count} — {percentage}%
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-slate-900"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              Interventions par statut
            </h2>

            <div className="mt-6 space-y-3">
              {interventionStats.map((item) => {
                const percentage =
                  totalInterventions > 0
                    ? Math.round((item.count / totalInterventions) * 100)
                    : 0;

                return (
                  <div key={item.status}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getInterventionStatusClass(
                          item.status
                        )}`}
                      >
                        {getInterventionStatusLabel(item.status)}
                      </span>

                      <span className="text-slate-500">
                        {item.count} — {percentage}%
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-slate-900"
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
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              Traitement emails
            </h2>

            <div className="mt-6">
              <p className="text-sm text-slate-500">
                Emails marqués comme traités
              </p>

              <p className="mt-2 text-4xl font-bold text-slate-900">
                {processedRate}%
              </p>

              <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-emerald-600"
                  style={{ width: `${processedRate}%` }}
                />
              </div>

              <p className="mt-3 text-sm text-slate-500">
                {processedEmails} emails traités sur {totalEmails}.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              Lecture métier
            </h2>

            <div className="mt-6 space-y-4 text-sm text-slate-600">
              <p>
                Les emails urgents représentent{" "}
                <strong className="text-slate-900">{urgentRate}%</strong>{" "}
                des messages analysés.
              </p>

              <p>
                Les interventions permettent de transformer les incidents en
                suivi technique concret.
              </p>

              <p>
                Cette page servira ensuite à mesurer le temps gagné, le volume
                traité et la réactivité de l’agence.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}