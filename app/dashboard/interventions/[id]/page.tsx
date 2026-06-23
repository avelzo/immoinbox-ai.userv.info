import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUserOrganizationId } from "@/lib/current-user";
import { redirect } from "next/navigation";
import { InterventionStatusButton } from "@/components/InterventionStatusButton";
import {
  getInterventionStatusLabel,
  getInterventionStatusClass,
} from "@/lib/intervention-ui";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function InterventionDetailPage({ params }: PageProps) {
  const { id } = await params;
  const organizationId = await getCurrentUserOrganizationId();
  if (!organizationId) {
    redirect("/login");
  }
  const intervention = await prisma.intervention.findFirst({
    where: {
        id,
        organizationId,
    },
    include: {
      incidentEmail: true,
    },
  });

  if (!intervention) {
    notFound();
  }

  return (
    <main className="p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <Link
            href="/dashboard/interventions"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            ← Retour aux interventions
          </Link>

          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                {intervention.title}
              </h1>

              <p className="mt-2 text-slate-600">
                Créée le{" "}
                {new Intl.DateTimeFormat("fr-FR", {
                  dateStyle: "full",
                  timeStyle: "short",
                  timeZone: "Europe/Paris",
                }).format(intervention.createdAt)}
              </p>
            </div>

            <span
              className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${getInterventionStatusClass(
                intervention.status
              )}`}
            >
              {getInterventionStatusLabel(intervention.status)}
            </span>
            <InterventionStatusButton
                interventionId={intervention.id}
                initialStatus={intervention.status}
            />
          </div>
        </div>

        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            Informations
          </h2>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-sm text-slate-500">Technicien</p>
              <p className="mt-1 font-medium text-slate-900">
                {intervention.technicianName ?? "Non assigné"}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Statut</p>
              <p className="mt-1 font-medium text-slate-900">
                {getInterventionStatusLabel(intervention.status)}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm text-slate-500">Description</p>
            <p className="mt-2 whitespace-pre-wrap text-slate-800">
              {intervention.description ?? "Aucune description."}
            </p>
          </div>
        </section>

        {intervention.incidentEmail && (
          <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              Email lié
            </h2>

            <div className="mt-4 rounded-xl bg-slate-100 p-4">
              <p className="font-medium text-slate-900">
                {intervention.incidentEmail.subject}
              </p>

              <p className="mt-1 text-sm text-slate-600">
                De : {intervention.incidentEmail.from}
              </p>

              <p className="mt-4 whitespace-pre-wrap text-slate-700">
                {intervention.incidentEmail.textContent}
              </p>

              <Link
                href={`/dashboard/emails/${intervention.incidentEmail.id}`}
                className="mt-4 inline-flex text-sm font-medium text-slate-900 hover:underline"
              >
                Voir l’email complet →
              </Link>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}