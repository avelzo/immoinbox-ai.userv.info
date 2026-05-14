import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Prisma } from "@prisma/client";
import { EmailStatusButton } from "@/components/EmailStatusButton";

type EmailsPageProps = {
  searchParams: Promise<{
    q?: string;
    status?: string;
    category?: string;
    urgent?: string;
  }>;
};

function getUrgencyLabel(urgency?: number | null) {
  if (!urgency) return "Non défini";
  if (urgency >= 5) return "Très urgent";
  if (urgency === 4) return "Urgent";
  if (urgency === 3) return "Moyen";
  if (urgency === 2) return "Faible";
  return "Très faible";
}
function getCategoryLabel(category?: string | null) {
  const labels: Record<string, string> = {
    INCIDENT: "Incident",
    DEMANDE_LOCATAIRE: "Demande locataire",
    CANDIDATURE: "Candidature",
    QUITTANCE: "Quittance",
    FACTURE: "Facture",
    URGENT: "Urgent",
    ADMINISTRATIF: "Administratif",
    SPAM: "Spam",
  };

  return category ? labels[category] ?? category : "Non classé";
}

function getCategoryClass(category?: string | null) {
  const classes: Record<string, string> = {
    INCIDENT: "bg-red-100 text-red-700",
    DEMANDE_LOCATAIRE: "bg-blue-100 text-blue-700",
    CANDIDATURE: "bg-violet-100 text-violet-700",
    QUITTANCE: "bg-emerald-100 text-emerald-700",
    FACTURE: "bg-amber-100 text-amber-700",
    URGENT: "bg-orange-100 text-orange-700",
    ADMINISTRATIF: "bg-slate-100 text-slate-700",
    SPAM: "bg-zinc-200 text-zinc-700",
  };

  return classes[category ?? ""] ?? "bg-slate-100 text-slate-700";
}
function getUrgencyClass(urgency?: number | null) {
  if (!urgency) return "bg-slate-100 text-slate-700";
  if (urgency >= 5) return "bg-red-100 text-red-700";
  if (urgency === 4) return "bg-orange-100 text-orange-700";
  if (urgency === 3) return "bg-amber-100 text-amber-700";
  return "bg-slate-100 text-slate-700";
}

function getStatusLabel(status: string) {
  return status === "PROCESSED" ? "Traité" : "Non traité";
}

function getStatusClass(status: string) {
  return status === "PROCESSED"
    ? "bg-emerald-100 text-emerald-700"
    : "bg-slate-100 text-slate-700";
}
function buildUrl(params: Record<string, string | undefined>) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) searchParams.set(key, value);
  });

  const query = searchParams.toString();
  return query ? `/dashboard/emails?${query}` : "/dashboard/emails";
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
  };

  return variants[variant];
}
export default async function EmailsPage({ searchParams }: EmailsPageProps) {
  const params = await searchParams;

  const q = params.q ?? "";
  const status = params.status;
  const category = params.category;
  const urgent = params.urgent;

  const where: Prisma.EmailWhereInput = {
    ...(status ? { status: status as any } : {}),
    ...(category ? { category: category as any } : {}),
    ...(urgent === "true" ? { urgency: { gte: 4 } } : {}),
    ...(q
      ? {
          OR: [
            { subject: { contains: q, mode: "insensitive" } },
            { from: { contains: q, mode: "insensitive" } },
            { summary: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [emails, totalCount, newCount, urgentCount] = await Promise.all([
    prisma.email.findMany({
      where,
      orderBy: {
        receivedAt: "desc",
      },
      take: 50,
    }),

    prisma.email.count(),

    prisma.email.count({
      where: {
        status: "NEW",
      },
    }),

    prisma.email.count({
      where: {
        urgency: {
          gte: 4,
        },
      },
    }),
  ]);

  return (
    <main className="p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Emails analysés
            </h1>
            <p className="mt-2 text-slate-600">
              Emails classés automatiquement par l’assistant IA.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border bg-white px-4 py-3 shadow-sm">
              <p className="text-xs text-slate-500">Total</p>
              <p className="text-xl font-bold">{totalCount}</p>
            </div>

            <div className="rounded-xl border bg-white px-4 py-3 shadow-sm">
              <p className="text-xs text-slate-500">Non traités</p>
              <p className="text-xl font-bold">{newCount}</p>
            </div>

            <div className="rounded-xl border bg-white px-4 py-3 shadow-sm">
              <p className="text-xs text-slate-500">Urgents</p>
              <p className="text-xl font-bold">{urgentCount}</p>
            </div>
          </div>
        </div>

        <div className="mb-6 rounded-2xl border bg-white p-4 shadow-sm">
          <form className="mb-4">
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Rechercher par sujet, expéditeur ou résumé..."
              className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm outline-none focus:border-slate-900"
            />

            {status && <input type="hidden" name="status" value={status} />}
            {category && (
              <input type="hidden" name="category" value={category} />
            )}
            {urgent && <input type="hidden" name="urgent" value={urgent} />}
          </form>

          <div className="flex flex-wrap gap-2">
            <Link
                href="/dashboard/emails"
                className={filterClass(!status && !category && urgent !== "true")}
            >
                Tous
            </Link>

            <Link
                href={buildUrl({ q, status: "NEW" })}
                className={filterClass(status === "NEW")}
            >
                Non traités
            </Link>

            <Link
                href={buildUrl({ q, urgent: "true" })}
                className={filterClass(urgent === "true", "orange")}
            >
                Urgents
            </Link>

            <Link
                href={buildUrl({ q, category: "INCIDENT" })}
                className={filterClass(category === "INCIDENT", "red")}
            >
                Incidents
            </Link>

            <Link
                href={buildUrl({ q, category: "CANDIDATURE" })}
                className={filterClass(category === "CANDIDATURE", "blue")}
            >
                Candidatures
            </Link>

            <Link
                href={buildUrl({ q, category: "QUITTANCE" })}
                className={filterClass(category === "QUITTANCE", "emerald")}
            >
                Quittances
            </Link>
            <Link
                href="/dashboard/emails"
                className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
                >
                Réinitialiser
            </Link>
          </div>
        </div>

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
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-sm">
              {emails.map((email) => (
                <tr key={email.id} className={email.status === "PROCESSED"?"bg-slate-50 opacity-70 hover:bg-slate-100":"hover:bg-slate-50"}>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                    {new Intl.DateTimeFormat("fr-FR", {
                      dateStyle: "short",
                      timeStyle: "short",
                    }).format(email.receivedAt)}
                  </td>

                  <td className="px-4 py-3 text-slate-700">{email.from}</td>

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
                      {getCategoryLabel(email.category)}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${getUrgencyClass(
                        email.urgency
                      )}`}
                    >
                      {getUrgencyLabel(email.urgency)}
                    </span>
                  </td>

                  <td className="max-w-md px-4 py-3 text-slate-600">
                    {email.summary ?? "Aucun résumé"}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                        email.status
                      )}`}
                    >
                      {getStatusLabel(email.status)}
                    </span>
                  </td>
                    <td className="px-4 py-3">
                        <EmailStatusButton  emailId={email.id} initialStatus={email.status}/>    
                    </td>
                </tr>
              ))}

              {emails.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-slate-500"
                  >
                    Aucun email ne correspond aux filtres.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}