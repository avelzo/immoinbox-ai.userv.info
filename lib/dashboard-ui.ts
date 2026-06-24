export function filterPillClass(isActive: boolean, variant = "slate") {
  if (isActive) {
    return "rounded-full bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm";
  }

  const variants: Record<string, string> = {
    slate:
      "rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-200",
    orange:
      "rounded-full bg-orange-50 px-3 py-1.5 text-sm font-medium text-orange-700 ring-1 ring-orange-200/80 transition hover:bg-orange-100",
    red:
      "rounded-full bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 ring-1 ring-red-200/80 transition hover:bg-red-100",
    blue:
      "rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 ring-1 ring-blue-200/80 transition hover:bg-blue-100",
    emerald:
      "rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 ring-1 ring-emerald-200/80 transition hover:bg-emerald-100",
    cyan:
      "rounded-full bg-cyan-50 px-3 py-1.5 text-sm font-medium text-cyan-700 ring-1 ring-cyan-200/80 transition hover:bg-cyan-100",
    violet:
      "rounded-full bg-violet-50 px-3 py-1.5 text-sm font-medium text-violet-700 ring-1 ring-violet-200/80 transition hover:bg-violet-100",
    amber:
      "rounded-full bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-700 ring-1 ring-amber-200/80 transition hover:bg-amber-100",
    zinc:
      "rounded-full bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-200",
  };

  return variants[variant] ?? variants.slate;
}

export const categoryBarColors: Record<string, string> = {
  INCIDENT: "bg-red-500",
  INTERVENTION: "bg-cyan-500",
  DEMANDE_LOCATAIRE: "bg-blue-500",
  CANDIDATURE: "bg-violet-500",
  QUITTANCE: "bg-emerald-500",
  FACTURE: "bg-amber-500",
  ADMINISTRATIF: "bg-slate-500",
  SPAM: "bg-zinc-400",
};

export const interventionBarColors: Record<string, string> = {
  PENDING: "bg-orange-500",
  SCHEDULED: "bg-blue-500",
  IN_PROGRESS: "bg-cyan-500",
  COMPLETED: "bg-emerald-500",
};
