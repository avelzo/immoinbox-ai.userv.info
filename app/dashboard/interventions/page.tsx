import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  CheckCircle2,
  Clock,
  PlayCircle,
  Wrench,
} from "lucide-react";
import { InterventionListRow } from "@/components/interventions/InterventionListRow";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { DashboardStatCard } from "@/components/dashboard/DashboardStatCard";
import { filterPillClass } from "@/lib/dashboard-ui";
import { getCurrentUserOrganizationId } from "@/lib/current-user";
import { redirect } from "next/navigation";

type InterventionsPageProps = {
  searchParams: Promise<{
    status?: string;
  }>;
};

function formatInterventionDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "Europe/Paris",
  }).format(date);
}

export default async function InterventionsPage({
  searchParams,
}: InterventionsPageProps) {
  const organizationId = await getCurrentUserOrganizationId();
  if (!organizationId) {
    redirect("/login");
  }
  const params = await searchParams;
  const status = params.status;
  const baseWhere = {
    organizationId,
  };
  const where = status
    ? {
        ...baseWhere,
        status: status as any,
      }
    : baseWhere;

  const [
    interventions,
    totalCount,
    pendingCount,
    scheduledCount,
    inProgressCount,
    completedCount,
  ] = await Promise.all([
    prisma.intervention.findMany({
      where,
      include: {
        incidentEmail: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.intervention.count({
      where: baseWhere,
    }),

    prisma.intervention.count({
      where: { ...baseWhere, status: "PENDING" },
    }),

    prisma.intervention.count({
      where: { ...baseWhere, status: "SCHEDULED" },
    }),

    prisma.intervention.count({
      where: { ...baseWhere, status: "IN_PROGRESS" },
    }),

    prisma.intervention.count({
      where: { ...baseWhere, status: "COMPLETED" },
    }),
  ]);

  return (
    <main className="p-6">
      <div className="mx-auto max-w-5xl">
        <DashboardPageHeader
          title="Interventions"
          description="Suivi des réparations et interventions techniques."
          action={
            <button
              type="button"
              className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
            >
              Nouvelle intervention
            </button>
          }
        />

        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardStatCard
            label="Total"
            value={totalCount}
            icon={Wrench}
            accent="indigo"
          />

          <DashboardStatCard
            label="En attente"
            value={pendingCount}
            icon={Clock}
            accent="orange"
          />

          <DashboardStatCard
            label="En cours"
            value={inProgressCount}
            icon={PlayCircle}
            accent="cyan"
          />

          <DashboardStatCard
            label="Terminées"
            value={completedCount}
            icon={CheckCircle2}
            accent="emerald"
          />
        </div>

        <div className="mb-6 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Filtrer par statut
          </p>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/dashboard/interventions"
              className={filterPillClass(!status)}
            >
              Toutes ({totalCount})
            </Link>

            <Link
              href="/dashboard/interventions?status=PENDING"
              className={filterPillClass(status === "PENDING", "orange")}
            >
              En attente ({pendingCount})
            </Link>

            <Link
              href="/dashboard/interventions?status=SCHEDULED"
              className={filterPillClass(status === "SCHEDULED", "blue")}
            >
              Planifiées ({scheduledCount})
            </Link>

            <Link
              href="/dashboard/interventions?status=IN_PROGRESS"
              className={filterPillClass(status === "IN_PROGRESS", "cyan")}
            >
              En cours ({inProgressCount})
            </Link>

            <Link
              href="/dashboard/interventions?status=COMPLETED"
              className={filterPillClass(status === "COMPLETED", "emerald")}
            >
              Terminées ({completedCount})
            </Link>
          </div>
        </div>

        {interventions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
            <p className="text-lg font-medium text-slate-700">
              Aucune intervention
            </p>

            <p className="mt-2 text-slate-500">
              Les interventions créées apparaîtront ici.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {interventions.map((intervention) => (
              <InterventionListRow
                key={intervention.id}
                intervention={intervention}
                formattedCreatedAt={formatInterventionDate(
                  intervention.createdAt
                )}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
