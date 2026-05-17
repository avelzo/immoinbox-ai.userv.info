export const EMAIL_CATEGORIES = {
  INCIDENT: {
    label: "Incidents",
    badgeLabel: "Incident",
    color: "red",
  },
  INTERVENTION: {
    label: "Interventions",
    badgeLabel: "Intervention",
    color: "cyan",
  },
  DEMANDE_LOCATAIRE: {
    label: "Demandes locataires",
    badgeLabel: "Demande locataire",
    color: "blue",
  },
  CANDIDATURE: {
    label: "Candidatures",
    badgeLabel: "Candidature",
    color: "violet",
  },
  QUITTANCE: {
    label: "Quittances",
    badgeLabel: "Quittance",
    color: "emerald",
  },
  FACTURE: {
    label: "Factures",
    badgeLabel: "Facture",
    color: "amber",
  },
  ADMINISTRATIF: {
    label: "Administratif",
    badgeLabel: "Administratif",
    color: "slate",
  },
  SPAM: {
    label: "Spam",
    badgeLabel: "Spam",
    color: "zinc",
  },
} as const;

export type EmailCategoryKey = keyof typeof EMAIL_CATEGORIES;