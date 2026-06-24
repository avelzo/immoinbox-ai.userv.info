export const DEMO_ORGANIZATION_ID = "6a02026cc7614ba0caf62450";
export const DEMO_MAILBOX_ID = "6a02026cc7614ba0caf62451";
export const DEMO_EMAIL = "admin@userv.info";
export const DEMO_MAILBOX_EMAIL = "immo@userv.info";
export const DEMO_PREFIX = "demo-showcase";

export const LIVE_DEMO_EMAILS = [
  {
    id: "live-1",
    label: "Urgent — Chauffage",
    subject: "Chauffage en panne — appartement 3B",
    body: `Bonjour,

Le radiateur du salon ne chauffe plus depuis hier soir. Il fait très froid dans l'appartement, surtout pour les enfants.

Pouvez-vous envoyer quelqu'un rapidement ?

Merci,
Sophie Mercier
12 rue de Siam, Brest`,
    expected: "INCIDENT · urgence élevée · réponse suggérée",
  },
  {
    id: "live-2",
    label: "Incident — Fuite (intervention auto)",
    subject: "Fuite d'eau sous l'évier — urgent",
    body: `Bonjour,

Il y a une fuite importante sous l'évier de la cuisine depuis ce matin. L'eau coule sur le sol.

Merci d'organiser une intervention rapidement.

Cordialement,
Marc Lefèvre`,
    expected: "INCIDENT · intervention créée si email notif configuré",
  },
  {
    id: "live-3",
    label: "Courant — Quittance",
    subject: "Demande quittance juin 2026",
    body: `Bonjour,

Pourriez-vous m'envoyer la quittance de loyer du mois de juin ? J'en ai besoin pour mon dossier CAF.

Merci,
Julien Morvan`,
    expected: "QUITTANCE · faible urgence · traitement rapide",
  },
  {
    id: "live-4",
    label: "Propriétaire — Charges",
    subject: "Relevé de charges trimestriel — apt 2A",
    body: `Bonjour,

Je suis propriétaire du lot 2A. Pouvez-vous me transmettre le relevé de charges du trimestre en cours ?

Cordialement,
M. Dupont`,
    expected: "ADMINISTRATIF ou DEMANDE · rôle propriétaire",
  },
] as const;
