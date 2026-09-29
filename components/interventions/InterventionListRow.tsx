import Link from "next/link";
import { Calendar, User, ExternalLink, ChevronRight } from "lucide-react";
import type { Email, Intervention } from "@prisma/client";
import { InterventionStatusButton } from "@/components/InterventionStatusButton";
import {
  getInterventionStatusLabel,
  getInterventionStatusClass,
} from "@/lib/intervention-ui";

export function InterventionListRow({
  intervention,
  formattedCreatedAt,
}: {
  intervention: Intervention & { incidentEmail: Email | null };
  formattedCreatedAt: string;
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-line bg-white transition-colors hover:border-sage-dark">
      <div className="p-4">
        <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
          <Link
            href={`/dashboard/interventions/${intervention.id}`}
            className="group min-w-0 flex-1"
          >
            <h2 className="mb-1 flex items-center gap-2 text-sm font-semibold leading-snug text-anthracite group-hover:text-forest">
              {intervention.title}
              <ChevronRight size={13} className="shrink-0 text-anthracite/40" />
            </h2>
            <p className="text-sm leading-relaxed text-anthracite/70">
              {intervention.description}
            </p>
          </Link>
          <span
            className={`rounded-md px-2 py-0.5 text-[10px] font-medium ${getInterventionStatusClass(intervention.status)}`}
          >
            {getInterventionStatusLabel(intervention.status)}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-anthracite/60">
          <span className="flex items-center gap-1">
            <User size={11} />
            {intervention.technicianName ?? "Technicien non assigné"}
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={11} />
            Créée le {formattedCreatedAt}
          </span>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 border-t border-line bg-ivory px-4 py-2.5">
        <InterventionStatusButton
          interventionId={intervention.id}
          initialStatus={intervention.status}
        />
        {intervention.incidentEmail && (
          <Link
            href={`/dashboard/emails/${intervention.incidentEmail.id}`}
            className="flex items-center gap-1.5 rounded-lg bg-sage px-2.5 py-1.5 text-xs font-medium text-forest hover:bg-sage-dark"
          >
            <ExternalLink size={11} />
            Voir l’email source
          </Link>
        )}
      </div>
    </article>
  );
}
