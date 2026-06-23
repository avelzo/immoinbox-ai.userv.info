import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { InterventionListRow } from "@/components/interventions/InterventionListRow";
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
//   const where = status ? { status: status as any } : {};
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
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Interventions
            </h1>

            <p className="mt-2 text-slate-600">
              Suivi des réparations et interventions techniques.
            </p>
          </div>

          <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
            Nouvelle intervention
          </button>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
            <Link
                href="/dashboard/interventions"
                className={
                !status
                    ? "rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white"
                    : "rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
                }
            >
                Toutes ({totalCount})
            </Link>

            <Link
                href="/dashboard/interventions?status=PENDING"
                className={
                status === "PENDING"
                    ? "rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white"
                    : "rounded-full bg-orange-100 px-4 py-2 text-sm font-medium text-orange-700 hover:bg-orange-200"
                }
            >
                En attente ({pendingCount})
            </Link>

            <Link
                href="/dashboard/interventions?status=SCHEDULED"
                className={
                status === "SCHEDULED"
                    ? "rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white"
                    : "rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200"
                }
            >
                Planifiées ({scheduledCount})
            </Link>

            <Link
                href="/dashboard/interventions?status=IN_PROGRESS"
                className={
                status === "IN_PROGRESS"
                    ? "rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white"
                    : "rounded-full bg-cyan-100 px-4 py-2 text-sm font-medium text-cyan-700 hover:bg-cyan-200"
                }
            >
                En cours ({inProgressCount})
            </Link>

            <Link
                href="/dashboard/interventions?status=COMPLETED"
                className={
                status === "COMPLETED"
                    ? "rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white"
                    : "rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-200"
                }
            >
                Terminées ({completedCount})
            </Link>
        </div>

        {interventions.length === 0 ? (
          <div className="rounded-2xl border border-dashed bg-white p-12 text-center">
            <p className="text-lg font-medium text-slate-700">
              Aucune intervention
            </p>

            <p className="mt-2 text-slate-500">
              Les interventions créées apparaîtront ici.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full border-collapse text-left">
              <thead className="bg-slate-100 text-sm text-slate-600">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Intervention</th>
                  <th className="px-4 py-3">Technicien</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="px-4 py-3">Incident lié</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-sm">
                {interventions.map((intervention) => (
                  <InterventionListRow
                    key={intervention.id}
                    intervention={intervention}
                    formattedCreatedAt={formatInterventionDate(
                      intervention.createdAt
                    )}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}