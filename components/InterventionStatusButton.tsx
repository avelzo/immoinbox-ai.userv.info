import { StatusSelect } from "./StatusSelect";
import { getInterventionStatusLabel } from "@/lib/intervention-ui";

type InterventionStatus = "PENDING" | "SCHEDULED" | "IN_PROGRESS" | "COMPLETED";
const statuses: InterventionStatus[] = [
  "PENDING",
  "SCHEDULED",
  "IN_PROGRESS",
  "COMPLETED",
];

export function InterventionStatusButton({
  interventionId,
  initialStatus,
}: {
  interventionId: string;
  initialStatus: InterventionStatus;
}) {
  return (
    <StatusSelect
      key={interventionId + initialStatus}
      endpoint={`/api/interventions/${interventionId}/status`}
      initialStatus={initialStatus}
      label="Modifier le statut de l’intervention"
      options={statuses.map((value) => ({
        value,
        label: getInterventionStatusLabel(value),
      }))}
    />
  );
}
