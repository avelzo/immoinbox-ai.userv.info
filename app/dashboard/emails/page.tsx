import type { Metadata } from "next";
import Link from "next/link";
import { EmailCategory, EmailStatus, Prisma } from "@prisma/client";
import { Inbox } from "lucide-react";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUserOrganizationId } from "@/lib/current-user";
import { EmailListRow } from "@/components/emails/EmailListRow";
import { InboxFilters } from "@/components/emails/InboxFilters";

export const metadata: Metadata = { title: "Boîte de réception" };

export default async function EmailsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const organizationId = await getCurrentUserOrganizationId();
  if (!organizationId) redirect("/login");
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : "";
  const status =
    typeof params.status === "string" &&
    Object.values(EmailStatus).includes(params.status as EmailStatus)
      ? (params.status as EmailStatus)
      : undefined;
  const category =
    typeof params.category === "string" &&
    Object.values(EmailCategory).includes(params.category as EmailCategory)
      ? (params.category as EmailCategory)
      : undefined;
  const urgent = params.urgent === "true";
  const sort = typeof params.sort === "string" ? params.sort : "recent";
  const page = Math.max(
    1,
    Math.min(10000, Number.parseInt(String(params.page ?? "1"), 10) || 1),
  );
  const where: Prisma.EmailWhereInput = {
    organizationId,
    ...(status ? { status } : {}),
    ...(category ? { category } : {}),
    ...(urgent ? { urgency: { gte: 4 } } : {}),
    ...(q
      ? {
          OR: ["subject", "from", "summary"].map((field) => ({
            [field]: { contains: q, mode: "insensitive" },
          })),
        }
      : {}),
  };
  const orderBy: Prisma.EmailOrderByWithRelationInput[] =
    sort === "urgent"
      ? [{ urgency: "desc" }, { receivedAt: "desc" }]
      : sort === "new"
        ? [{ status: "asc" }, { receivedAt: "desc" }]
        : [{ receivedAt: sort === "oldest" ? "asc" : "desc" }];
  const [
    emails,
    filteredCount,
    newCount,
    urgentCount,
    processedCount,
    organization,
  ] = await Promise.all([
    prisma.email.findMany({
      where,
      orderBy,
      skip: (page - 1) * 50,
      take: 50,
      include: { interventions: true },
    }),
    prisma.email.count({ where }),
    prisma.email.count({ where: { organizationId, status: "NEW" } }),
    prisma.email.count({
      where: { organizationId, status: "NEW", urgency: { gte: 4 } },
    }),
    prisma.email.count({ where: { organizationId, status: "PROCESSED" } }),
    prisma.organization.findUnique({
      where: { id: organizationId },
      select: { name: true },
    }),
  ]);
  function pageUrl(value: number) {
    const next = new URLSearchParams({ q, sort, page: String(value) });
    if (status) next.set("status", status);
    if (category) next.set("category", category);
    if (urgent) next.set("urgent", "true");
    return "/dashboard/emails?" + next.toString();
  }
  const date = new Intl.DateTimeFormat("fr-FR", {
    month: "long",
    year: "numeric",
    timeZone: "Europe/Paris",
  }).format(new Date());
  return (
    <main className="flex min-h-full flex-col">
      <div className="border-b border-line bg-white px-4 pb-4 pt-6 sm:px-6">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold text-anthracite">
              Boîte de réception
            </h1>
            <p className="mt-0.5 text-sm text-anthracite/60">
              {organization?.name ?? "Votre agence"} — {date}
            </p>
          </div>
          <div className="flex items-center gap-4 divide-x divide-line">
            {[
              { label: "Nouveaux", value: newCount, color: "text-forest" },
              { label: "Urgences", value: urgentCount, color: "text-red-600" },
              {
                label: "Traités",
                value: processedCount,
                color: "text-green-600",
              },
            ].map((item) => (
              <div key={item.label} className="pl-4 text-center first:pl-0">
                <p className={"text-xl font-bold leading-none " + item.color}>
                  {item.value}
                </p>
                <p className="mt-1 text-[10px] text-anthracite/60">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
        <InboxFilters
          key={q}
          q={q}
          status={status}
          category={category}
          urgent={urgent}
          sort={sort}
        />
      </div>
      <div className="hidden grid-cols-[180px_minmax(0,1fr)_115px_85px_85px_85px] gap-3 border-b border-line bg-ivory px-6 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-anthracite/60 xl:grid">
        <span>Expéditeur</span>
        <span>Objet · Résumé IA</span>
        <span>Catégorie</span>
        <span>Urgence</span>
        <span>Statut</span>
        <span className="text-right">Date</span>
      </div>
      {emails.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
          <Inbox size={40} className="mb-3 text-anthracite/25" />
          <p className="text-sm font-medium text-anthracite/60">
            Aucun email correspondant
          </p>
          <p className="mt-1 text-xs text-anthracite/50">
            Modifiez vos filtres ou attendez une nouvelle demande.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-line">
          {emails.map((email) => (
            <EmailListRow
              key={email.id}
              email={email}
              formattedReceivedAt={new Intl.DateTimeFormat("fr-FR", {
                dateStyle: "short",
                timeStyle: "short",
                timeZone: "Europe/Paris",
              }).format(email.receivedAt)}
            />
          ))}
        </div>
      )}
      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-line px-6 py-3 text-xs text-anthracite/60">
        <span>
          {filteredCount} email{filteredCount > 1 ? "s" : ""} · Page {page} sur{" "}
          {Math.max(1, Math.ceil(filteredCount / 50))}
        </span>
        <div className="flex gap-3">
          {page > 1 && (
            <Link
              className="font-medium text-forest hover:underline"
              href={pageUrl(page - 1)}
            >
              Précédente
            </Link>
          )}
          {page * 50 < filteredCount && (
            <Link
              className="font-medium text-forest hover:underline"
              href={pageUrl(page + 1)}
            >
              Suivante
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
