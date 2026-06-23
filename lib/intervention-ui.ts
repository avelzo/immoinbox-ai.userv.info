export function getInterventionStatusLabel(status: string) {
  const labels: Record<string, string> = {
    PENDING: "En attente",
    SCHEDULED: "Planifiée",
    IN_PROGRESS: "En cours",
    COMPLETED: "Terminée",
  };

  return labels[status] ?? status;
}

export function formatInterventionForApi<T extends { status: string }>(
  intervention: T
) {
  return {
    ...intervention,
    statusLabel: getInterventionStatusLabel(intervention.status),
  };
}

export function getInterventionStatusClass(status: string) {
  const classes: Record<string, string> = {
    PENDING: "bg-orange-100 text-orange-700",
    SCHEDULED: "bg-blue-100 text-blue-700",
    IN_PROGRESS: "bg-cyan-100 text-cyan-700",
    COMPLETED: "bg-emerald-100 text-emerald-700",
  };

  return classes[status] ?? "bg-slate-100 text-slate-700";
}