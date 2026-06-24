import {
  PrismaClient,
  EmailCategory,
  EmailStatus,
  SenderRole,
  InterventionStatus,
} from "@prisma/client";
import {
  DEMO_ORGANIZATION_ID,
  DEMO_MAILBOX_ID,
  DEMO_MAILBOX_EMAIL,
  DEMO_EMAIL,
  DEMO_PREFIX,
} from "../lib/demo-config";

const prisma = new PrismaClient();

function daysAgo(days: number, hours = 10, minutes = 0) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(hours, minutes, 0, 0);
  return date;
}

type SeedEmail = {
  suffix: string;
  from: string;
  subject: string;
  textContent: string;
  senderRole: SenderRole;
  category: EmailCategory;
  urgency: number;
  summary: string;
  recommendedAction: string;
  suggestedReply: string;
  status: EmailStatus;
  receivedAt: Date;
};

type SeedIntervention = {
  emailSuffix: string;
  title: string;
  description: string;
  status: InterventionStatus;
  technicianName?: string;
  createdAt: Date;
};

const emails: SeedEmail[] = [
  {
    suffix: "001",
    from: "Marie Dupont <marie.dupont@email.fr>",
    subject: "Fuite sous évier cuisine — apt 4B",
    textContent:
      "Bonjour, il y a une fuite importante sous l'évier de la cuisine depuis ce matin. L'eau coule sur le sol et abîme le meuble. Pouvez-vous envoyer un plombier rapidement ?",
    senderRole: SenderRole.TENANT,
    category: EmailCategory.INCIDENT,
    urgency: 5,
    summary:
      "Locataire signale une fuite importante sous l'évier avec risque de dégâts.",
    recommendedAction:
      "Contacter un plombier en urgence et confirmer l'intervention au locataire.",
    suggestedReply:
      "Bonjour,\n\nNous prenons en charge la fuite sous l'évier et contactons un plombier rapidement.\n\nPouvez-vous couper l'arrivée d'eau sous l'évier en attendant ?\n\nCordialement,",
    status: EmailStatus.NEW,
    receivedAt: daysAgo(0, 8, 15),
  },
  {
    suffix: "002",
    from: "Thomas Le Gall <thomas.legall@email.fr>",
    subject: "Chauffage en panne — salon",
    textContent:
      "Bonjour, le chauffage du salon ne fonctionne plus depuis hier soir. Il fait très froid. Merci de me dire quoi faire.",
    senderRole: SenderRole.TENANT,
    category: EmailCategory.INCIDENT,
    urgency: 4,
    summary: "Chauffage du salon en panne depuis la veille.",
    recommendedAction:
      "Vérifier le type de chauffage et planifier une intervention.",
    suggestedReply:
      "Bonjour,\n\nNous allons traiter le problème de chauffage rapidement.\n\nPouvez-vous préciser si le radiateur affiche un voyant ou un code erreur ?\n\nCordialement,",
    status: EmailStatus.NEW,
    receivedAt: daysAgo(1, 9, 30),
  },
  {
    suffix: "003",
    from: "Camille Martin <camille.martin@gmail.com>",
    subject: "Préavis de départ — fin de bail août",
    textContent:
      "Bonjour, je vous informe de mon départ prévu fin août. Quelle est la procédure pour l'état des lieux et la restitution du dépôt de garantie ?",
    senderRole: SenderRole.TENANT,
    category: EmailCategory.DEMANDE_LOCATAIRE,
    urgency: 2,
    summary: "Locataire annonce un départ fin août et demande la procédure.",
    recommendedAction:
      "Envoyer la procédure de fin de bail et proposer une date d'état des lieux.",
    suggestedReply:
      "Bonjour,\n\nMerci pour votre préavis. Nous vous transmettons la procédure de fin de bail et reviendrons vers vous pour planifier l'état des lieux.\n\nCordialement,",
    status: EmailStatus.NEW,
    receivedAt: daysAgo(2, 11),
  },
  {
    suffix: "004",
    from: "Julien Morvan <julien.morvan@email.fr>",
    subject: "Demande quittance mai 2026",
    textContent:
      "Bonjour, pourriez-vous m'envoyer la quittance de loyer de mai ? J'en ai besoin pour mon dossier CAF.",
    senderRole: SenderRole.TENANT,
    category: EmailCategory.QUITTANCE,
    urgency: 1,
    summary: "Demande de quittance de loyer de mai pour dossier CAF.",
    recommendedAction: "Envoyer la quittance de mai au locataire.",
    suggestedReply:
      "Bonjour,\n\nVeuillez trouver ci-joint la quittance de loyer de mai.\n\nCordialement,",
    status: EmailStatus.PROCESSED,
    receivedAt: daysAgo(5, 14, 20),
  },
  {
    suffix: "005",
    from: "Élodie Robert <elodie.robert@email.fr>",
    subject: "Candidature T3 centre-ville",
    textContent:
      "Bonjour, je suis intéressée par le T3 rue Jean Jaurès. CDI depuis 3 ans, garant disponible. Puis-je envoyer mon dossier ?",
    senderRole: SenderRole.CANDIDATE,
    category: EmailCategory.CANDIDATURE,
    urgency: 2,
    summary: "Candidate pour T3 centre-ville, CDI, garant disponible.",
    recommendedAction:
      "Confirmer la disponibilité et demander le dossier complet.",
    suggestedReply:
      "Bonjour,\n\nLe T3 est disponible. Vous pouvez nous transmettre votre dossier complet.\n\nCordialement,",
    status: EmailStatus.NEW,
    receivedAt: daysAgo(1, 16, 45),
  },
  {
    suffix: "006",
    from: "Nadia Bernard <nadia.bernard@email.fr>",
    subject: "Plus d'eau chaude — ballon HS ?",
    textContent:
      "Bonjour, depuis ce matin nous n'avons plus d'eau chaude. Le ballon semble allumé mais l'eau reste froide.",
    senderRole: SenderRole.TENANT,
    category: EmailCategory.INCIDENT,
    urgency: 4,
    summary: "Absence d'eau chaude, ballon électrique suspecté.",
    recommendedAction:
      "Vérifier le disjoncteur puis planifier intervention plombier/électricien.",
    suggestedReply:
      "Bonjour,\n\nNous traitons votre demande. Pouvez-vous vérifier si le disjoncteur du ballon est enclenché ?\n\nCordialement,",
    status: EmailStatus.NEW,
    receivedAt: daysAgo(0, 7, 50),
  },
  {
    suffix: "007",
    from: "Pierre Colin <pierre.colin@email.fr>",
    subject: "Visite studio rue Voltaire",
    textContent:
      "Bonjour, je souhaite visiter le studio rue Voltaire cette semaine, idéalement jeudi en fin de journée.",
    senderRole: SenderRole.CANDIDATE,
    category: EmailCategory.DEMANDE_LOCATAIRE,
    urgency: 2,
    summary: "Demande de visite studio rue Voltaire jeudi soir.",
    recommendedAction: "Proposer un créneau de visite jeudi.",
    suggestedReply:
      "Bonjour,\n\nNous pouvons vous proposer jeudi 18h30. Ce créneau vous convient-il ?\n\nCordialement,",
    status: EmailStatus.NEW,
    receivedAt: daysAgo(3, 18),
  },
  {
    suffix: "008",
    from: "Syndic Armor Gestion <contact@armor-gestion.fr>",
    subject: "Coupure d'eau programmée — immeuble Siam",
    textContent:
      "Bonjour, coupure d'eau programmée mardi prochain de 9h à 12h pour travaux sur colonne montante. Merci de prévenir les locataires.",
    senderRole: SenderRole.SYNDIC,
    category: EmailCategory.ADMINISTRATIF,
    urgency: 3,
    summary: "Coupure d'eau mardi 9h-12h, prévenir les locataires.",
    recommendedAction: "Informer les locataires concernés par email ou affichage.",
    suggestedReply:
      "Bonjour,\n\nMerci pour l'information. Nous prévenons les occupants concernés.\n\nCordialement,",
    status: EmailStatus.NEW,
    receivedAt: daysAgo(2, 10, 15),
  },
  {
    suffix: "009",
    from: "Lucas Henry <lucas.henry@email.fr>",
    subject: "Retard paiement loyer — problème bancaire",
    textContent:
      "Bonjour, mon virement de loyer aura quelques jours de retard ce mois-ci suite à un problème bancaire. Paiement vendredi au plus tard.",
    senderRole: SenderRole.TENANT,
    category: EmailCategory.DEMANDE_LOCATAIRE,
    urgency: 3,
    summary: "Locataire prévient d'un retard de loyer jusqu'à vendredi.",
    recommendedAction: "Noter le retard et vérifier réception vendredi.",
    suggestedReply:
      "Bonjour,\n\nNous prenons note et vérifierons la réception vendredi.\n\nCordialement,",
    status: EmailStatus.NEW,
    receivedAt: daysAgo(1, 12),
  },
  {
    suffix: "010",
    from: "Mehdi Aït <mehdi.ait@email.fr>",
    subject: "Badge immeuble perdu",
    textContent:
      "Bonjour, j'ai perdu mon badge d'entrée. Est-il possible d'en commander un nouveau et connaître le coût ?",
    senderRole: SenderRole.TENANT,
    category: EmailCategory.DEMANDE_LOCATAIRE,
    urgency: 2,
    summary: "Demande de remplacement de badge d'accès immeuble.",
    recommendedAction: "Indiquer procédure et coût de remplacement.",
    suggestedReply:
      "Bonjour,\n\nNous lançons la commande d'un badge de remplacement et revenons vers vous avec le coût.\n\nCordialement,",
    status: EmailStatus.NEW,
    receivedAt: daysAgo(4, 15),
  },
  {
    suffix: "011",
    from: "Plomberie Iroise <contact@plomberie-iroise.fr>",
    subject: "Devis réparation fuite salle de bain",
    textContent:
      "Bonjour, veuillez trouver notre devis pour la réparation de la fuite au 8 rue Voltaire. Montant : 342 € TTC. Intervention possible dès jeudi.",
    senderRole: SenderRole.TECHNICIAN,
    category: EmailCategory.FACTURE,
    urgency: 3,
    summary: "Devis plombier 342 € TTC pour fuite salle de bain.",
    recommendedAction: "Valider le devis et confirmer la date d'intervention.",
    suggestedReply:
      "Bonjour,\n\nMerci pour le devis. Nous validons et confirmons jeudi.\n\nCordialement,",
    status: EmailStatus.NEW,
    receivedAt: daysAgo(3, 9),
  },
  {
    suffix: "012",
    from: "Élodie Robert <elodie.robert@email.fr>",
    subject: "Volet roulant bloqué chambre",
    textContent:
      "Bonjour, le volet de la chambre est bloqué en position fermée depuis deux jours. Impossible de le remonter.",
    senderRole: SenderRole.TENANT,
    category: EmailCategory.INCIDENT,
    urgency: 3,
    summary: "Volet roulant chambre bloqué en position fermée.",
    recommendedAction: "Demander photo et contacter réparateur volets.",
    suggestedReply:
      "Bonjour,\n\nPouvez-vous nous envoyer une photo ? Nous contactons un réparateur.\n\nCordialement,",
    status: EmailStatus.NEW,
    receivedAt: daysAgo(2, 8, 40),
  },
  {
    suffix: "013",
    from: "M. Dupont <p.dupont.pro@gmail.com>",
    subject: "Relevé de charges trimestriel — lot 2A",
    textContent:
      "Bonjour, en tant que propriétaire du lot 2A, pourriez-vous me transmettre le relevé de charges du trimestre en cours ?",
    senderRole: SenderRole.OWNER,
    category: EmailCategory.ADMINISTRATIF,
    urgency: 2,
    summary: "Propriétaire demande relevé de charges trimestriel lot 2A.",
    recommendedAction: "Transmettre le relevé de charges au propriétaire.",
    suggestedReply:
      "Bonjour,\n\nNous vous transmettons le relevé de charges du trimestre.\n\nCordialement,",
    status: EmailStatus.NEW,
    receivedAt: daysAgo(6, 11),
  },
  {
    suffix: "014",
    from: "Sarah Benali <sarah.benali@email.fr>",
    subject: "Candidature colocation — T2 Liberté",
    textContent:
      "Bonjour, je candidate pour la colocation T2 rue Liberté avec ma colocataire. Dossiers disponibles sur demande.",
    senderRole: SenderRole.CANDIDATE,
    category: EmailCategory.CANDIDATURE,
    urgency: 2,
    summary: "Candidature colocation T2 Liberté, dossiers disponibles.",
    recommendedAction: "Accusé réception envoyé — dossiers reçus et en étude.",
    suggestedReply:
      "Bonjour,\n\nNous avons bien reçu votre candidature et l'étudions.\n\nCordialement,",
    status: EmailStatus.PROCESSED,
    receivedAt: daysAgo(7, 14),
  },
  {
    suffix: "015",
    from: "Lucas Henry <lucas.henry@email.fr>",
    subject: "Taches d'humidité mur chambre",
    textContent:
      "Bonjour, des taches d'humidité apparaissent sur le mur de la chambre depuis deux semaines. L'odeur s'intensifie. Pouvez-vous faire diagnostiquer ?",
    senderRole: SenderRole.TENANT,
    category: EmailCategory.INCIDENT,
    urgency: 4,
    summary: "Humidité et odeur persistante sur mur chambre depuis 2 semaines.",
    recommendedAction: "Organiser diagnostic humidité et intervention si fuite.",
    suggestedReply:
      "Bonjour,\n\nNous programmons un diagnostic humidité rapidement.\n\nCordialement,",
    status: EmailStatus.NEW,
    receivedAt: daysAgo(1, 17, 10),
  },
  {
    suffix: "016",
    from: "Électricité Finistère <devis@elec-finistere.fr>",
    subject: "Facture remplacement disjoncteur",
    textContent:
      "Bonjour, veuillez trouver la facture pour le remplacement du disjoncteur au 14 rue de Lyon. Montant : 156 € TTC.",
    senderRole: SenderRole.TECHNICIAN,
    category: EmailCategory.FACTURE,
    urgency: 2,
    summary: "Facture électricien 156 € TTC remplacement disjoncteur.",
    recommendedAction: "Vérifier la facture et procéder au paiement.",
    suggestedReply:
      "Bonjour,\n\nFacture reçue, nous la traitons.\n\nCordialement,",
    status: EmailStatus.NEW,
    receivedAt: daysAgo(5, 10),
  },
  {
    suffix: "017",
    from: "Marie Dupont <marie.dupont@email.fr>",
    subject: "Attestation assurance habitation",
    textContent:
      "Bonjour, voici mon attestation d'assurance habitation renouvelée pour l'année. Merci de l'enregistrer dans mon dossier.",
    senderRole: SenderRole.TENANT,
    category: EmailCategory.ADMINISTRATIF,
    urgency: 2,
    summary: "Locataire transmet attestation assurance habitation renouvelée.",
    recommendedAction: "Attestation enregistrée dans le dossier locataire.",
    suggestedReply:
      "Bonjour,\n\nAttestation bien reçue et enregistrée.\n\nCordialement,",
    status: EmailStatus.PROCESSED,
    receivedAt: daysAgo(8, 9),
  },
  {
    suffix: "018",
    from: "Nadia Bernard <nadia.bernard@email.fr>",
    subject: "Demande autorisation animal de compagnie",
    textContent:
      "Bonjour, je souhaiterais adopter un chat. Puis-je avoir votre accord écrit conformément au bail ?",
    senderRole: SenderRole.TENANT,
    category: EmailCategory.DEMANDE_LOCATAIRE,
    urgency: 2,
    summary: "Demande d'autorisation pour adoption d'un chat.",
    recommendedAction: "Vérifier clause bail et répondre avec accord ou conditions.",
    suggestedReply:
      "Bonjour,\n\nNous vérifions les clauses du bail et revenons vers vous.\n\nCordialement,",
    status: EmailStatus.NEW,
    receivedAt: daysAgo(3, 13),
  },
  {
    suffix: "019",
    from: "M. Dupont <p.dupont.pro@gmail.com>",
    subject: "Porte garage bloquée — autorisation travaux",
    textContent:
      "Bonjour, la porte du garage est bloquée chez mon locataire au 5 rue Amiral. Puis-je mandater directement un serrurier ou préférez-vous intervenir ?",
    senderRole: SenderRole.OWNER,
    category: EmailCategory.INCIDENT,
    urgency: 3,
    summary: "Propriétaire signale porte garage bloquée, demande procédure.",
    recommendedAction: "Confirmer la procédure et organiser intervention serrurier.",
    suggestedReply:
      "Bonjour,\n\nNous prenons en charge et mandatons le serrurier partenaire.\n\nCordialement,",
    status: EmailStatus.NEW,
    receivedAt: daysAgo(0, 6, 30),
  },
  {
    suffix: "020",
    from: "Promo Casino <newsletter@spam-promo.net>",
    subject: "🎰 Offre exclusive — 500€ de bonus !!!",
    textContent:
      "Félicitations ! Vous avez gagné un bonus exceptionnel. Cliquez ici pour récupérer vos 500 euros maintenant !!!",
    senderRole: SenderRole.UNKNOWN,
    category: EmailCategory.SPAM,
    urgency: 1,
    summary: "Email promotionnel non sollicité, probable spam.",
    recommendedAction: "Ignorer ou supprimer, aucune action requise.",
    suggestedReply: "",
    status: EmailStatus.NEW,
    receivedAt: daysAgo(0, 5, 10),
  },
];

const interventions: SeedIntervention[] = [
  {
    emailSuffix: "001",
    title: "Fuite sous évier — apt 4B",
    description: "Plombier à mandater en urgence. Risque dégât des eaux.",
    status: InterventionStatus.PENDING,
    createdAt: daysAgo(0, 8, 20),
  },
  {
    emailSuffix: "002",
    title: "Chauffage salon en panne",
    description: "Intervention chauffagiste à planifier cette semaine.",
    status: InterventionStatus.SCHEDULED,
    technicianName: "Chauffage Bretagne",
    createdAt: daysAgo(1, 10),
  },
  {
    emailSuffix: "006",
    title: "Ballon eau chaude — diagnostic",
    description: "Technicien sur place — vérification résistance et thermostat.",
    status: InterventionStatus.IN_PROGRESS,
    technicianName: "Plomberie Iroise",
    createdAt: daysAgo(0, 9),
  },
  {
    emailSuffix: "012",
    title: "Volet roulant bloqué chambre",
    description: "Réparateur volets à contacter, devis en attente.",
    status: InterventionStatus.PENDING,
    createdAt: daysAgo(2, 9),
  },
  {
    emailSuffix: "015",
    title: "Diagnostic humidité chambre",
    description: "Rendez-vous diagnostiqueur prévu jeudi 14h.",
    status: InterventionStatus.SCHEDULED,
    technicianName: "Diag Humidité 29",
    createdAt: daysAgo(1, 18),
  },
  {
    emailSuffix: "004",
    title: "Remplacement cylindre serrure — rue de Lyon",
    description: "Intervention terminée le mois dernier.",
    status: InterventionStatus.COMPLETED,
    technicianName: "Serrurerie Brestoise",
    createdAt: daysAgo(12, 11),
  },
  {
    emailSuffix: "016",
    title: "Remplacement disjoncteur — rue de Lyon",
    description: "Travaux électriques clôturés, facture reçue.",
    status: InterventionStatus.COMPLETED,
    technicianName: "Électricité Finistère",
    createdAt: daysAgo(6, 15),
  },
];

async function main() {
  await prisma.organization.upsert({
    where: { id: DEMO_ORGANIZATION_ID },
    update: {
      name: "Agence Démo Brest",
      interventionNotifyEmail: DEMO_EMAIL,
    },
    create: {
      id: DEMO_ORGANIZATION_ID,
      name: "Agence Démo Brest",
      interventionNotifyEmail: DEMO_EMAIL,
    },
  });

  await prisma.mailbox.upsert({
    where: { id: DEMO_MAILBOX_ID },
    update: {
      email: DEMO_MAILBOX_EMAIL,
      provider: "imap",
      connectionStatus: "CONNECTED",
    },
    create: {
      id: DEMO_MAILBOX_ID,
      organizationId: DEMO_ORGANIZATION_ID,
      email: DEMO_MAILBOX_EMAIL,
      provider: "imap",
      connectionStatus: "CONNECTED",
    },
  });

  await prisma.intervention.deleteMany({
    where: { organizationId: DEMO_ORGANIZATION_ID },
  });

  await prisma.email.deleteMany({
    where: { organizationId: DEMO_ORGANIZATION_ID },
  });

  const emailIdBySuffix = new Map<string, string>();

  for (const email of emails) {
    const created = await prisma.email.create({
      data: {
        organizationId: DEMO_ORGANIZATION_ID,
        mailboxId: DEMO_MAILBOX_ID,
        externalMessageId: `${DEMO_PREFIX}-${email.suffix}`,
        from: email.from,
        to: [DEMO_MAILBOX_EMAIL],
        subject: email.subject,
        textContent: email.textContent,
        senderRole: email.senderRole,
        category: email.category,
        urgency: email.urgency,
        summary: email.summary,
        recommendedAction: email.recommendedAction,
        suggestedReply: email.suggestedReply || null,
        status: email.status,
        receivedAt: email.receivedAt,
      },
    });

    emailIdBySuffix.set(email.suffix, created.id);
  }

  for (const intervention of interventions) {
    const emailId = emailIdBySuffix.get(intervention.emailSuffix);

    if (!emailId) {
      throw new Error(
        `Email introuvable pour l'intervention: ${intervention.emailSuffix}`
      );
    }

    await prisma.intervention.create({
      data: {
        organizationId: DEMO_ORGANIZATION_ID,
        title: intervention.title,
        description: intervention.description,
        status: intervention.status,
        technicianName: intervention.technicianName,
        incidentEmailId: emailId,
        createdAt: intervention.createdAt,
      },
    });
  }

  const processed = emails.filter((e) => e.status === EmailStatus.PROCESSED).length;

  console.log("Démo prête :");
  console.log(`  · ${emails.length} emails (${processed} traités)`);
  console.log(`  · ${interventions.length} interventions`);
  console.log(`  · Organisation : ${DEMO_ORGANIZATION_ID}`);
  console.log(`  · Boîte mail : ${DEMO_MAILBOX_EMAIL} (${DEMO_MAILBOX_ID})`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
