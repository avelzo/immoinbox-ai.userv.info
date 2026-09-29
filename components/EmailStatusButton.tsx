import { StatusSelect } from "./StatusSelect";

type EmailStatus = "NEW" | "PROCESSED" | "ARCHIVED" | "ERROR";

export function EmailStatusButton({
  emailId,
  initialStatus,
}: {
  emailId: string;
  initialStatus: EmailStatus;
}) {
  return (
    <StatusSelect
      key={emailId + initialStatus}
      endpoint={`/api/emails/${emailId}/status`}
      initialStatus={initialStatus}
      label="Modifier le statut de l’email"
      options={[
        { value: "NEW", label: "Nouveau" },
        { value: "PROCESSED", label: "Traité" },
        { value: "ARCHIVED", label: "Archivé" },
        { value: "ERROR", label: "Erreur" },
      ]}
    />
  );
}
