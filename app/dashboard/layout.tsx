import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth-server";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { getCurrentUserOrganizationId } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const organizationId = await getCurrentUserOrganizationId();
  if (!organizationId) redirect("/login");
  const [organization, newCount, urgentCount, interventionCount] =
    await Promise.all([
      prisma.organization.findUnique({
        where: { id: organizationId },
        select: { name: true },
      }),
      prisma.email.count({ where: { organizationId, status: "NEW" } }),
      prisma.email.count({
        where: { organizationId, status: "NEW", urgency: { gte: 4 } },
      }),
      prisma.intervention.count({
        where: { organizationId, status: { in: ["PENDING", "IN_PROGRESS"] } },
      }),
    ]);
  return (
    <DashboardShell
      organizationName={organization?.name ?? "Votre agence"}
      email={session.user.email}
      name={session.user.name ?? null}
      newCount={newCount}
      urgentCount={urgentCount}
      interventionCount={interventionCount}
    >
      {children}
    </DashboardShell>
  );
}
