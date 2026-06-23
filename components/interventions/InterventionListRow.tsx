"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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
    <tr
      onClick={() =>
        router.push(`/dashboard/interventions/${intervention.id}`)
      }
      className="cursor-pointer transition-colors hover:bg-slate-50"
    >
      <td className="whitespace-nowrap px-4 py-3 text-slate-500">
        {formattedCreatedAt}
      </td>

      <td className="px-4 py-3">
        <div>
          <span className="font-medium text-slate-900">
            {intervention.title}
          </span>

          {intervention.description && (
            <p className="mt-1 text-slate-500">{intervention.description}</p>
          )}
        </div>
      </td>

      <td className="px-4 py-3 text-slate-700">
        {intervention.technicianName ?? "Non assigné"}
      </td>

      <td className="px-4 py-3">
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${getInterventionStatusClass(
            intervention.status
          )}`}
        >
          {getInterventionStatusLabel(intervention.status)}
        </span>
      </td>

      <td className="px-4 py-3" onClick={stopRowNavigation}>
        {intervention.incidentEmail ? (
          <Link
            href={`/dashboard/emails/${intervention.incidentEmail.id}`}
            className="text-sm font-medium text-slate-900 hover:underline"
          >
            {intervention.incidentEmail.subject}
          </Link>
        ) : (
          <span className="text-slate-400">Aucun incident lié</span>
        )}
      </td>

      <td className="px-4 py-3" onClick={stopRowNavigation}>
        <InterventionStatusButton
          interventionId={intervention.id}
          initialStatus={intervention.status as InterventionStatus}
        />
      </td>
    </tr>
  );
}
