import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUserOrganizationId } from "@/lib/current-user";
import { EMAIL_CATEGORIES } from "@/lib/email-categories";
import { getCategoryLabel } from "@/lib/email-ui";
import { getInterventionStatusLabel } from "@/lib/intervention-ui";
import { DashboardStatCard } from "@/components/dashboard/DashboardStatCard";
import {
  CategoryChart,
  WeeklyChart,
  DistributionBars,
} from "@/components/dashboard/ActivityCharts";

export const metadata: Metadata = { title: "Statistiques" };

export default async function StatsPage() {
  const organizationId = await getCurrentUserOrganizationId();
  if (!organizationId) redirect("/login");
  const reportTime = new Date().getTime();
  const [
    total,
    newCount,
    processed,
    urgent,
    categoryCounts,
    interventionCounts,
    recentEmails,
  ] = await Promise.all([
    prisma.email.count({ where: { organizationId } }),
    prisma.email.count({ where: { organizationId, status: "NEW" } }),
    prisma.email.count({ where: { organizationId, status: "PROCESSED" } }),
    prisma.email.count({ where: { organizationId, urgency: { gte: 4 } } }),
    prisma.email.groupBy({
      by: ["category"],
      where: { organizationId },
      _count: { _all: true },
    }),
    prisma.intervention.groupBy({
      by: ["status"],
      where: { organizationId },
      _count: { _all: true },
    }),
    prisma.email.findMany({
      where: {
        organizationId,
        receivedAt: { gte: new Date(reportTime - 7 * 86400000) },
      },
      select: { receivedAt: true },
    }),
  ]);
  const colors: Record<string, string> = {
    INCIDENT: "#dc2626",
    INTERVENTION: "#ea580c",
    DEMANDE_LOCATAIRE: "#2563eb",
    CANDIDATURE: "#7c3aed",
    QUITTANCE: "#0d9488",
    FACTURE: "#d97706",
    ADMINISTRATIF: "#6b7280",
    SPAM: "#9ca3af",
    URGENT: "#b91c1c",
  };
  const categories = Object.keys(EMAIL_CATEGORIES).map((key) => ({
    label: getCategoryLabel(key),
    count:
      categoryCounts.find((item) => item.category === key)?._count._all ?? 0,
    color: colors[key],
  }));
  const unclassified =
    categoryCounts.find((item) => item.category === null)?._count._all ?? 0;
  if (unclassified)
    categories.push({
      label: "Non classé",
      count: unclassified,
      color: "#9ca3af",
    });
  const interventions = [
    "PENDING",
    "SCHEDULED",
    "IN_PROGRESS",
    "COMPLETED",
  ].map((status, index) => ({
    label: getInterventionStatusLabel(status),
    count:
      interventionCounts.find((item) => item.status === status)?._count._all ??
      0,
    color: ["#d97706", "#2563eb", "#ea580c", "#16a34a"][index],
  }));
  const formatter = new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(reportTime - (6 - index) * 86400000);
    return {
      label: new Intl.DateTimeFormat("fr-FR", {
        weekday: "short",
        timeZone: "Europe/Paris",
      }).format(date),
      count: recentEmails.filter(
        (email) =>
          formatter.format(email.receivedAt) === formatter.format(date),
      ).length,
    };
  });
  return (
    <main className="max-w-5xl px-4 py-6 sm:px-6">
      <h1 className="mb-6 text-lg font-semibold text-anthracite">
        Statistiques
      </h1>
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <DashboardStatCard
          label="Total emails"
          value={total}
          description="Depuis le début"
        />
        <DashboardStatCard
          label="Nouveaux"
          value={newCount}
          description="En attente de traitement"
          accent="slate"
        />
        <DashboardStatCard
          label="Traités"
          value={processed}
          description="Marqués comme traités"
          accent="slate"
        />
        <DashboardStatCard
          label="Urgences"
          value={urgent}
          description="Urgence ≥ 4 sur 5"
          accent="red"
        />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-line bg-white p-5">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-anthracite/60">
            Emails reçus — 7 derniers jours
          </h2>
          <WeeklyChart days={days} />
        </section>
        <section className="rounded-2xl border border-line bg-white p-5">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-anthracite/60">
            Répartition par catégorie
          </h2>
          <CategoryChart series={categories} />
        </section>
        <section className="rounded-2xl border border-line bg-white p-5">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-anthracite/60">
            Emails par catégorie
          </h2>
          <DistributionBars series={categories} />
        </section>
        <section className="rounded-2xl border border-line bg-white p-5">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-anthracite/60">
            Interventions par statut
          </h2>
          <DistributionBars series={interventions} />
          <div className="mt-5 grid grid-cols-2 gap-3 border-t border-line pt-4">
            {interventions.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 text-xs text-anthracite/70"
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: item.color }}
                />
                {item.label}
                <span className="ml-auto font-bold">{item.count}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
