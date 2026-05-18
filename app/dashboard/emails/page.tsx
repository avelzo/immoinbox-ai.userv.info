import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Prisma } from "@prisma/client";
import { EmailStatusButton } from "@/components/EmailStatusButton";
import { CreateInterventionButton } from "@/components/CreateInterventionButton";
import { EMAIL_CATEGORIES } from "@/lib/email-categories";
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

  return query
    ? `/dashboard/emails?${query}`
    : "/dashboard/emails";
}

function filterClass(isActive: boolean, variant = "slate") {
  if (isActive) {
    return "rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white";
  }

  const variants: Record<string, string> = {
    slate:
      "rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200",
    orange:
      "rounded-full bg-orange-100 px-4 py-2 text-sm font-medium text-orange-700 hover:bg-orange-200",
    red:
      "rounded-full bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200",
    blue:
      "rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200",
    emerald:
      "rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-200",
    cyan:
      "rounded-full bg-cyan-100 px-4 py-2 text-sm font-medium text-cyan-700 hover:bg-cyan-200",
    violet:
      "rounded-full bg-violet-100 px-4 py-2 text-sm font-medium text-violet-700 hover:bg-violet-200",
    amber:
      "rounded-full bg-amber-100 px-4 py-2 text-sm font-medium text-amber-700 hover:bg-amber-200",
    zinc:
      "rounded-full bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-200",
  };

  return variants[variant] ?? variants.slate;
}

function StatsCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm transition-all hover:border-slate-300 hover:shadow-md">
      <p className="text-sm text-slate-500">{label}</p>

      <p className={`mt-2 text-4xl font-bold ${color}`}>
        {value}
      </p>
    </div>
  );
}

export default async function EmailsPage({searchParams}: EmailsPageProps) {
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
  
  const [
    emails,
    totalCount,
    newCount,
    urgentCount,
    categoryCountsRaw,
  ] = await Promise.all([
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
    categoryCountsRaw.map((item) => [
      item.category,
      item._count.category,
    ])
  );

  return (
    <main className="p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Emails analysés ({emails.length})
            </h1>

            <p className="mt-2 text-slate-600">
              Emails classés automatiquement par l’assistant IA.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <StatsCard
              label="Emails"
              value={totalCount}
              color="text-slate-900"
            />

            <StatsCard
              label="Non traités"
              value={newCount}
              color="text-orange-600"
            />

            <StatsCard
              label="Urgents"
              value={urgentCount}
              color="text-red-600"
            />
          </div>
        </div>

        <div className="mb-6 rounded-2xl border bg-white p-4 shadow-sm">
          <form className="mb-4">
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Rechercher par sujet, expéditeur ou résumé..."
              className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-slate-900"
            />

            {status && (
              <input
                type="hidden"
                name="status"
                value={status}
              />
            )}

            {category && (
              <input
                type="hidden"
                name="category"
                value={category}
              />
            )}

            {urgent && (
              <input
                type="hidden"
                name="urgent"
                value={urgent}
              />
            )}

            <input
              type="hidden"
              name="sort"
              value={sort}
            />
          </form>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Filtres
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/dashboard/emails"
                className={filterClass(
                  !status &&
                    !category &&
                    urgent !== "true"
                )}
              >
                Tous
              </Link>

              <Link
                href={buildUrl({
                  q,
                  status: "NEW",
                  sort,
                })}
                className={filterClass(
                  status === "NEW"
                )}
              >
                Non traités
              </Link>

              <Link
                href={buildUrl({
                  q,
                  urgent: "true",
                  sort,
                })}
                className={filterClass(
                  urgent === "true",
                  "orange"
                )}
              >
                Urgents ({urgentCount ?? 0})
              </Link>

              {Object.entries(EMAIL_CATEGORIES).map(
                ([key, config]) => (
                  <Link
                    key={key}
                    href={buildUrl({
                      q,
                      category: key,
                      sort,
                    })}
                    className={filterClass(
                      category === key,
                      config.color
                    )}
                  >
                    {config.label} ({categoryCounts[key] ?? 0})
                  </Link>
                )
              )}

              <Link
                href="/dashboard/emails"
                className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                Réinitialiser
              </Link>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Trier par
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              href={buildUrl({
                q,
                category,
                status,
                urgent,
                sort: "recent",
              })}
              className={filterClass(
                sort === "recent"
              )}
            >
              Récents
            </Link>

            <Link
              href={buildUrl({
                q,
                category,
                status,
                urgent,
                sort: "urgent",
              })}
              className={filterClass(
                sort === "urgent",
                "red"
              )}
            >
              Urgents
            </Link>

            <Link
              href={buildUrl({
                q,
                category,
                status,
                urgent,
                sort: "new",
              })}
              className={filterClass(
                sort === "new",
                "orange"
              )}
            >
              Non traités
            </Link>
          </div>
        </div>

        {emails.length === 0 ? (
          <div className="rounded-2xl border border-dashed bg-white p-12 text-center">
            <p className="text-lg font-medium text-slate-700">
              Aucun email trouvé
            </p>

            <p className="mt-2 text-slate-500">
              Les nouveaux emails analysés apparaîtront ici.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full border-collapse text-left">
              <thead className="bg-slate-100 text-sm text-slate-600">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Expéditeur</th>
                  <th className="px-4 py-3">Sujet</th>
                  <th className="px-4 py-3">Catégorie</th>
                  <th className="px-4 py-3">Urgence</th>
                  <th className="px-4 py-3">Résumé</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="px-4 py-3">Intervention</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-sm">
                {emails.map((email) => (
                  <tr
                    key={email.id}
                    className={`transition-colors hover:bg-slate-50 ${
                      email.status === "PROCESSED"
                        ? "bg-slate-50 opacity-70"
                        : ""
                    }`}
                  >
                    <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                      {new Intl.DateTimeFormat(
                        "fr-FR",
                        {
                          dateStyle: "short",
                          timeStyle: "short",
                        }
                      ).format(email.receivedAt)}
                    </td>

                    <td className="px-4 py-3 text-slate-700">
                      {email.from}
                    </td>

                    <td className="px-4 py-3">
                      <Link
                        href={`/dashboard/emails/${email.id}`}
                        className="font-medium text-slate-900 hover:underline"
                      >
                        {email.subject}
                      </Link>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getCategoryClass(
                          email.category
                        )}`}
                      >
                        {getCategoryLabel(
                          email.category
                        )}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getUrgencyClass(
                          email.urgency
                        )}`}
                      >
                        {getUrgencyLabel(
                          email.urgency
                        )}
                      </span>
                    </td>

                    <td className="max-w-md px-4 py-3 text-slate-600">
                      {email.summary ??
                        "Aucun résumé"}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                          email.status
                        )}`}
                      >
                        {getStatusLabel(
                          email.status
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {email.interventions.length > 0 ? (
                        <Link
                          href={`/dashboard/interventions/${email.interventions[0].id}`}
                          className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-medium text-cyan-700 hover:bg-cyan-200"
                        >
                          Voir intervention
                        </Link>
                      ) : email.category === "INCIDENT" ? (
                        <CreateInterventionButton emailId={email.id} size="sm" />
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <EmailStatusButton
                        emailId={email.id}
                        initialStatus={email.status}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}