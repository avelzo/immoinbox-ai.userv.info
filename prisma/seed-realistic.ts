import { PrismaClient, EmailCategory, EmailStatus } from "@prisma/client";

const prisma = new PrismaClient();

const ORGANIZATION_ID = "6a02026cc7614ba0caf62450";
const MAILBOX_ID = "6a02026cc7614ba0caf62451";

async function main() {
  await prisma.email.deleteMany({
    where: {
      organizationId: ORGANIZATION_ID,
      externalMessageId: {
        startsWith: "demo-realistic-",
      },
    },
  });

  const emails = [
    {
      externalMessageId: "demo-realistic-001",
      from: "Marie Dupont <marie.dupont@email.fr>",
      subject: "Fuite sous évier cuisine",
      textContent:
        "Bonjour, il y a une fuite importante sous l’évier de la cuisine depuis ce matin. L’eau coule sur le sol et commence à abîmer le meuble. Pouvez-vous envoyer quelqu’un rapidement ?",
      category: EmailCategory.INCIDENT,
      urgency: 5,
      summary:
        "Le locataire signale une fuite importante sous l’évier de la cuisine avec risque de dégâts.",
      recommendedAction:
        "Contacter rapidement un plombier et confirmer au locataire qu’une intervention est organisée.",
      suggestedReply:
        "Bonjour,\n\nMerci pour votre message. Nous prenons en compte la fuite sous l’évier et allons contacter un plombier rapidement afin d’organiser une intervention.\n\nPouvez-vous, si possible, nous envoyer une photo de la fuite et couper l’arrivée d’eau concernée en attendant ?\n\nCordialement,",
    },
    {
      externalMessageId: "demo-realistic-002",
      from: "Thomas Le Gall <thomas.legall@email.fr>",
      subject: "Chauffage en panne",
      textContent:
        "Bonjour, le chauffage du salon ne fonctionne plus depuis hier soir. Il fait très froid dans l’appartement. Merci de me dire quoi faire.",
      category: EmailCategory.INCIDENT,
      urgency: 4,
      summary:
        "Le locataire indique que le chauffage du salon est en panne depuis la veille.",
      recommendedAction:
        "Vérifier le type de chauffage et organiser une intervention si nécessaire.",
      suggestedReply:
        "Bonjour,\n\nMerci pour votre message. Nous allons regarder rapidement la situation concernant le chauffage du salon.\n\nPouvez-vous nous préciser si le radiateur affiche un voyant, un code erreur, ou s’il ne s’allume plus du tout ?\n\nCordialement,",
    },
    {
      externalMessageId: "demo-realistic-003",
      from: "Camille Martin <camille.martin@gmail.com>",
      subject: "Candidature appartement T2 Siam",
      textContent:
        "Bonjour, je vous contacte au sujet de l’annonce pour le T2 situé quartier Siam à Brest. Je suis en CDI et mon garant est mon père. Je peux vous transmettre mon dossier complet si le logement est toujours disponible.",
      category: EmailCategory.CANDIDATURE,
      urgency: 2,
      summary:
        "Une candidate souhaite postuler pour le T2 quartier Siam et propose d’envoyer son dossier.",
      recommendedAction:
        "Répondre à la candidate pour confirmer la disponibilité du bien et demander le dossier complet.",
      suggestedReply:
        "Bonjour,\n\nMerci pour votre intérêt concernant le T2 quartier Siam. Le logement est actuellement disponible.\n\nVous pouvez nous transmettre votre dossier complet afin que nous puissions l’étudier.\n\nCordialement,",
    },
    {
      externalMessageId: "demo-realistic-004",
      from: "Julien Morvan <julien.morvan@email.fr>",
      subject: "Demande quittance avril",
      textContent:
        "Bonjour, pourriez-vous m’envoyer la quittance de loyer du mois d’avril s’il vous plaît ? J’en ai besoin pour mon dossier administratif.",
      category: EmailCategory.QUITTANCE,
      urgency: 1,
      summary:
        "Le locataire demande la quittance de loyer du mois d’avril.",
      recommendedAction:
        "Envoyer la quittance d’avril au locataire.",
      suggestedReply:
        "Bonjour,\n\nNous vous envoyons la quittance de loyer du mois d’avril.\n\nCordialement,",
    },
    {
      externalMessageId: "demo-realistic-005",
      from: "Serrurerie Brestoise <contact@serrurerie-brestoise.fr>",
      subject: "Facture intervention serrure",
      textContent:
        "Bonjour, veuillez trouver ci-joint la facture concernant l’intervention réalisée le 8 mai pour le remplacement du cylindre de serrure au 14 rue de Lyon. Montant total : 186,40 € TTC.",
      category: EmailCategory.FACTURE,
      urgency: 2,
      summary:
        "Un artisan envoie une facture de 186,40 € TTC pour remplacement de cylindre de serrure.",
      recommendedAction:
        "Vérifier la facture, l’associer au logement concerné et prévoir le paiement.",
      suggestedReply:
        "Bonjour,\n\nMerci pour l’envoi de la facture. Nous allons la vérifier et la traiter.\n\nCordialement,",
    },
    {
      externalMessageId: "demo-realistic-006",
      from: "Nadia Bernard <nadia.bernard@email.fr>",
      subject: "Ballon d’eau chaude ne chauffe plus",
      textContent:
        "Bonjour, depuis ce matin nous n’avons plus d’eau chaude dans l’appartement. Le ballon semble allumé mais l’eau reste froide. Pouvez-vous faire intervenir quelqu’un rapidement ?",
      category: EmailCategory.INCIDENT,
      urgency: 4,
      summary:
        "Le locataire signale une absence d’eau chaude probablement liée au ballon.",
      recommendedAction:
        "Demander quelques vérifications simples puis contacter un électricien ou plombier si nécessaire.",
      suggestedReply:
        "Bonjour,\n\nMerci pour votre message. Nous allons regarder rapidement le problème d’eau chaude.\n\nPouvez-vous vérifier si le disjoncteur lié au ballon est bien enclenché et nous confirmer depuis quand le problème a commencé ?\n\nCordialement,",
    },
    {
      externalMessageId: "demo-realistic-007",
      from: "Pierre Colin <pierre.colin@email.fr>",
      subject: "Demande de visite studio",
      textContent:
        "Bonjour, je suis intéressé par le studio rue Jean Jaurès. Est-il possible de prévoir une visite cette semaine, idéalement mercredi ou jeudi en fin de journée ?",
      category: EmailCategory.DEMANDE_LOCATAIRE,
      urgency: 2,
      summary:
        "Une personne souhaite visiter le studio rue Jean Jaurès cette semaine.",
      recommendedAction:
        "Proposer un créneau de visite et confirmer la disponibilité du bien.",
      suggestedReply:
        "Bonjour,\n\nMerci pour votre intérêt. Nous pouvons vous proposer une visite cette semaine selon les disponibilités.\n\nPouvez-vous nous confirmer vos créneaux précis mercredi ou jeudi en fin de journée ?\n\nCordialement,",
    },
    {
      externalMessageId: "demo-realistic-008",
      from: "Syndic Armor Gestion <contact@armor-gestion.fr>",
      subject: "Coupure d’eau programmée immeuble",
      textContent:
        "Bonjour, nous vous informons qu’une coupure d’eau est programmée dans l’immeuble le mardi 21 mai de 9h à 12h pour travaux sur colonne montante.",
      category: EmailCategory.ADMINISTRATIF,
      urgency: 3,
      summary:
        "Le syndic annonce une coupure d’eau programmée le 21 mai de 9h à 12h.",
      recommendedAction:
        "Informer les locataires concernés de la coupure d’eau programmée.",
      suggestedReply:
        "Bonjour,\n\nMerci pour l’information. Nous allons prévenir les occupants concernés de la coupure d’eau prévue.\n\nCordialement,",
    },
    {
      externalMessageId: "demo-realistic-009",
      from: "Lucas Henry <lucas.henry@email.fr>",
      subject: "Retard paiement loyer",
      textContent:
        "Bonjour, je vous informe que mon virement de loyer aura quelques jours de retard ce mois-ci suite à un problème bancaire. Le paiement sera effectué vendredi au plus tard.",
      category: EmailCategory.DEMANDE_LOCATAIRE,
      urgency: 3,
      summary:
        "Le locataire prévient d’un retard temporaire de paiement du loyer.",
      recommendedAction:
        "Noter l’information et vérifier la réception du paiement vendredi.",
      suggestedReply:
        "Bonjour,\n\nMerci pour votre message. Nous prenons note du retard exceptionnel et vérifierons la réception du règlement vendredi.\n\nCordialement,",
    },
    {
      externalMessageId: "demo-realistic-010",
      from: "Élodie Robert <elodie.robert@email.fr>",
      subject: "Badge immeuble perdu",
      textContent:
        "Bonjour, j’ai perdu mon badge d’entrée de l’immeuble. Est-ce possible d’en commander un nouveau ? Merci.",
      category: EmailCategory.DEMANDE_LOCATAIRE,
      urgency: 2,
      summary:
        "La locataire demande un nouveau badge d’entrée suite à une perte.",
      recommendedAction:
        "Indiquer la procédure et le coût éventuel de remplacement du badge.",
      suggestedReply:
        "Bonjour,\n\nNous pouvons demander un nouveau badge d’entrée pour l’immeuble. Nous revenons vers vous rapidement avec la procédure et le coût éventuel.\n\nCordialement,",
    },
    {
      externalMessageId: "demo-realistic-011",
      from: "Plomberie Iroise <contact@plomberie-iroise.fr>",
      subject: "Devis réparation fuite salle de bain",
      textContent:
        "Bonjour, suite à notre passage dans l’appartement du 8 rue Voltaire, veuillez trouver notre devis pour la réparation de la fuite dans la salle de bain. Montant : 342 € TTC.",
      category: EmailCategory.FACTURE,
      urgency: 3,
      summary:
        "Un plombier envoie un devis de 342 € TTC pour une fuite en salle de bain.",
      recommendedAction:
        "Valider le devis si l’intervention est conforme et planifier les travaux.",
      suggestedReply:
        "Bonjour,\n\nMerci pour l’envoi du devis. Nous allons l’étudier et revenir vers vous rapidement pour validation.\n\nCordialement,",
    },
    {
      externalMessageId: "demo-realistic-012",
      from: "Mehdi Aït <mehdi.ait@email.fr>",
      subject: "Volet bloqué chambre",
      textContent:
        "Bonjour, le volet de la chambre est bloqué en position fermée depuis deux jours. Impossible de le remonter. Pouvez-vous voir avec un réparateur ?",
      category: EmailCategory.INCIDENT,
      urgency: 3,
      summary:
        "Le locataire signale un volet de chambre bloqué en position fermée.",
      recommendedAction:
        "Demander une photo ou des précisions puis contacter un réparateur si nécessaire.",
      suggestedReply:
        "Bonjour,\n\nMerci pour votre message. Nous allons regarder le problème de volet bloqué.\n\nPouvez-vous nous envoyer une photo et nous préciser s’il s’agit d’un volet roulant manuel ou électrique ?\n\nCordialement,",
    },
  ];

  for (const email of emails) {
    await prisma.email.create({
      data: {
        organizationId: ORGANIZATION_ID,
        mailboxId: MAILBOX_ID,
        externalMessageId: email.externalMessageId,
        from: email.from,
        to: ["admin@userv.info"],
        subject: email.subject,
        textContent: email.textContent,
        category: email.category,
        urgency: email.urgency,
        summary: email.summary,
        recommendedAction: email.recommendedAction,
        suggestedReply: email.suggestedReply,
        status: EmailStatus.NEW,
        receivedAt: new Date(),
      },
    });
  }

  console.log(`${emails.length} emails réalistes ajoutés.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });