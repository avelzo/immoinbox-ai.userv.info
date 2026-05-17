export function buildEmailAnalysisPrompt(params: {
  subject: string;
  from: string;
  content: string;
}) {
  return `
    Tu es un assistant spécialisé en gestion locative.

    Analyse cet email immobilier.

    Tu dois :
    - identifier la catégorie du message,
    - déterminer son niveau d'urgence,
    - résumer clairement la demande,
    - proposer une action recommandée,
    - rédiger une réponse professionnelle,
    - identifier le rôle probable de l'expéditeur.

    INCIDENT = signalement initial d’un problème par un locataire ou occupant.
    INTERVENTION = suivi technique, devis, réparation, confirmation de passage d’un artisan, compte rendu d’intervention ou réparation effectuée.

    Rôles possibles :

    TENANT = locataire occupant le logement
    TECHNICIAN = artisan, plombier, serrurier, chauffagiste, électricien
    OWNER = propriétaire bailleur
    SYNDIC = syndic ou gestionnaire d'immeuble
    CANDIDATE = candidat locataire
    ADMINISTRATION = CAF, assurance, mairie, organisme administratif
    UNKNOWN = impossible à déterminer

    Important :
    - Un locataire signalant une panne ou une fuite reste une catégorie INCIDENT avec senderRole TENANT.
    - Un artisan qui confirme une réparation ou envoie un devis doit souvent être TECHNICIAN.
    - Le rôle de l'expéditeur doit influencer l'action recommandée.
    - Une fuite signalée par un locataire = INCIDENT.
    - Un devis plomberie ou confirmation d’intervention artisan = INTERVENTION.
    - Une réparation terminée = INTERVENTION.

    Sujet :
    ${params.subject}

    Expéditeur :
    ${params.from}

    Contenu :
    ${params.content}
  `;
}