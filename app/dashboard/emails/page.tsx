import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Prisma } from "@prisma/client";
import { AlertTriangle, Inbox, Mail } from "lucide-react";
import { EmailListRow } from "@/components/emails/EmailListRow";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { DashboardPanel } from "@/components/dashboard/DashboardPanel";
import { DashboardStatCard } from "@/components/dashboard/DashboardStatCard";
import { EMAIL_CATEGORIES } from "@/lib/email-categories";
import { filterPillClass } from "@/lib/dashboard-ui";
import { getCurrentUserOrganizationId } from "@/lib/current-user";
import { redirect } from "next/navigation";

type EmailsPageProps = {
  searchParams: Promise<{
    q?: string;
    status?: string;
    category?: string;
    urgent?: string;
    sort?: string;
  }>;
};

function buildUrl(params: Record<string, string | undefined>) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      searchParams.set(key, value);
    }
  });

  const query = searchParams.toString();

  return query ? `/dashboard/emails?${query}` : "/dashboard/emails";
}

function formatEmailDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "Europe/Paris",
  }).format(date);
}

export default async function EmailsPage({ searchParams }: EmailsPageProps) {
  const organizationId = await getCurrentUserOrganizationId();
  if (!organizationId) {
    redirect("/login");
  }
  const params = await searchParams;
  const q = params.q ?? "";
  const status = params.status;
  const category = params.category;
  const urgent = params.urgent;
  const sort = params.sort ?? "recent";

  const where: Prisma.EmailWhereInput = {
    organizationId,
    ...(status ? { status: status as any } : {}),

    ...(category
      ? {
          category: category as any,
        }
      : {}),

    ...(urgent === "true"
      ? {
          urgency: {
            gte: 4,
          },
        }
      : {}),

    ...(q
      ? {
          OR: [
            {
              subject: {
                contains: q,
                mode: "insensitive",
              },
            },
            {
              from: {
                contains: q,
                mode: "insensitive",
              },
            },
            {
              summary: {
                contains: q,
                mode: "insensitive",
              },
            },
          ],
        }
      : {}),
  };

  const orderBy =
    sort === "urgent"
      ? [{ urgency: "desc" as const }]
      : sort === "new"
        ? [{ status: "asc" as const }]
        : [{ receivedAt: "desc" as const }];

  const [emails, totalCount, newCount, urgentCount, categoryCountsRaw] =
    await Promise.all([
      prisma.email.findMany({
        where,
        orderBy,
        take: 50,
        include: {
          interventions: true,
        },
      }),

      prisma.email.count({
        where: {
          organizationId,
        },
      }),

      prisma.email.count({
        where: {
          organizationId,
          status: "NEW",
        },
      }),

      prisma.email.count({
        where: {
          organizationId,
          urgency: {
            gte: 4,
          },
        },
      }),

      prisma.email.groupBy({
        by: ["category"],
        where: {
          organizationId,
        },
        _count: {
          category: true,
        },
      }),
    ]);

  const categoryCounts = Object.fromEntries(
    categoryCountsRaw.map((item) => [item.category, item._count.category])
  );

  const hasActiveFilters = Boolean(status || category || urgent === "true");

  return (
    <main className="p-6">
      <div className="mx-auto max-w-5xl">
        <DashboardPageHeader
          title={`Emails analysés (${emails.length})`}
          description="Emails classés automatiquement par l'assistant IA."
        />

        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <DashboardStatCard
            label="Total"
            value={totalCount}
            icon={Mail}
            accent="slate"
          />

          <DashboardStatCard
            label="Non traités"
            value={newCount}
            icon={Inbox}
            accent="orange"
          />

          <DashboardStatCard
            label="Urgents"
            value={urgentCount}
            icon={AlertTriangle}
            accent="red"
          />
        </div>

        <DashboardPanel className="mb-6 space-y-4">
          <form>
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Rechercher par sujet, expéditeur ou résumé..."
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />

            {status && (
              <input type="hidden" name="status" value={status} />
            )}

            {category && (
              <input type="hidden" name="category" value={category} />
            )}

            {urgent && <input type="hidden" name="urgent" value={urgent} />}

            <input type="hidden" name="sort" value={sort} />
          </form>

          <div>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Filtres
              </p>

              {hasActiveFilters && (
                <Link
                  href="/dashboard/emails"
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-800"
                >
                  Réinitialiser
                </Link>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href="/dashboard/emails"
                className={filterPillClass(
                  !status && !category && urgent !== "true"
                )}
              >
                Tous
              </Link>

              <Link
                href={buildUrl({ q, status: "NEW", sort })}
                className={filterPillClass(status === "NEW", "orange")}
              >
                Non traités
              </Link>

              <Link
                href={buildUrl({ q, urgent: "true", sort })}
                className={filterPillClass(urgent === "true", "red")}
              >
                Urgents ({urgentCount ?? 0})
              </Link>

              {Object.entries(EMAIL_CATEGORIES).map(([key, config]) => (
                <Link
                  key={key}
                  href={buildUrl({ q, category: key, sort })}
                  className={filterPillClass(
                    category === key,
                    config.color
                  )}
                >
                  {config.label} ({categoryCounts[key] ?? 0})
                </Link>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Trier par
            </p>

            <div className="flex flex-wrap gap-2">
              <Link
                href={buildUrl({ q, category, status, urgent, sort: "recent" })}
                className={filterPillClass(sort === "recent")}
              >
                Récents
              </Link>

              <Link
                href={buildUrl({ q, category, status, urgent, sort: "urgent" })}
                className={filterPillClass(sort === "urgent", "red")}
              >
                Urgents
              </Link>

              <Link
                href={buildUrl({ q, category, status, urgent, sort: "new" })}
                className={filterPillClass(sort === "new", "orange")}
              >
                Non traités
              </Link>
            </div>
          </div>
        </DashboardPanel>

        {emails.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
            <p className="text-lg font-medium text-slate-700">
              Aucun email trouvé
            </p>

            <p className="mt-2 text-slate-500">
              Les nouveaux emails analysés apparaîtront ici.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {emails.map((email) => (
              <EmailListRow
                key={email.id}
                email={email}
                formattedReceivedAt={formatEmailDate(email.receivedAt)}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
