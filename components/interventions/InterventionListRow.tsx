"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import type { Email, Intervention, InterventionStatus } from "@prisma/client";
import { InterventionStatusButton } from "@/components/InterventionStatusButton";
import {
  getInterventionStatusLabel,
  getInterventionStatusClass,
} from "@/lib/intervention-ui";

type InterventionListRowProps = {
  intervention: Intervention & {
    incidentEmail: Email | null;
  };
  formattedCreatedAt: string;
};

function stopRowNavigation(event: React.MouseEvent) {
  event.stopPropagation();
}

export function InterventionListRow({
  intervention,
  formattedCreatedAt,
}: InterventionListRowProps) {
  const router = useRouter();

  return (
    <article
      onClick={() =>
        router.push(`/dashboard/interventions/${intervention.id}`)
      }
      className="group cursor-pointer border-b border-slate-100 px-4 py-4 transition last:border-b-0 hover:bg-indigo-50/30 sm:px-5"
    >
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <time className="text-xs text-slate-500">{formattedCreatedAt}</time>

            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getInterventionStatusClass(
                intervention.status
              )}`}
            >
              {getInterventionStatusLabel(intervention.status)}
            </span>
          </div>

          <h3 className="mt-1.5 font-semibold leading-snug text-slate-900">
            {intervention.title}
          </h3>

          {intervention.description && (
            <p className="mt-1 line-clamp-2 text-sm text-slate-600">
              {intervention.description}
            </p>
          )}

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            <p className="text-slate-600">
              <span className="text-slate-400">Technicien · </span>
              {intervention.technicianName ?? "Non assigné"}
            </p>

            {intervention.incidentEmail ? (
              <p
                className="min-w-0 text-slate-600"
                onClick={stopRowNavigation}
              >
                <span className="text-slate-400">Incident · </span>
                <Link
                  href={`/dashboard/emails/${intervention.incidentEmail.id}`}
                  className="font-medium text-indigo-700 hover:text-indigo-900"
                >
                  {intervention.incidentEmail.subject}
                </Link>
              </p>
            ) : (
              <p className="text-slate-400">Aucun incident lié</p>
            )}
          </div>
        </div>

        <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-slate-300 transition group-hover:text-indigo-400" />
      </div>

      <div
        className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100/80 pt-3"
        onClick={stopRowNavigation}
      >
        <InterventionStatusButton
          interventionId={intervention.id}
          initialStatus={intervention.status as InterventionStatus}
        />
      </div>
    </article>
  );
}
