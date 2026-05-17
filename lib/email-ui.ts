import { EMAIL_CATEGORIES } from "@/lib/email-categories";

export function getCategoryLabel(category?: string | null) {
  if (!category) return "Non classé";

  return (
    EMAIL_CATEGORIES[category as keyof typeof EMAIL_CATEGORIES]?.badgeLabel ??
    category
  );
}

export function getCategoryClass(category?: string | null) {
  const classes: Record<string, string> = {
    INCIDENT: "bg-red-100 text-red-700",
    INTERVENTION: "bg-cyan-100 text-cyan-700",
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

export function getUrgencyLabel(urgency?: number | null) {
  if (!urgency) return "Non défini";
  if (urgency >= 5) return "Très urgent";
  if (urgency === 4) return "Urgent";
  if (urgency === 3) return "Moyen";
  if (urgency === 2) return "Faible";
  return "Très faible";
}

export function getUrgencyClass(urgency?: number | null) {
  if (!urgency) return "bg-slate-100 text-slate-700";
  if (urgency >= 5) return "bg-red-100 text-red-700";
  if (urgency === 4) return "bg-orange-100 text-orange-700";
  if (urgency === 3) return "bg-amber-100 text-amber-700";
  return "bg-slate-100 text-slate-700";
}

export function getStatusLabel(status: string) {
  return status === "PROCESSED" ? "Traité" : "Non traité";
}

export function getStatusClass(status: string) {
  return status === "PROCESSED"
    ? "bg-emerald-100 text-emerald-700"
    : "bg-slate-100 text-slate-700";
}