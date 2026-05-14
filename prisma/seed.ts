import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const organization = await prisma.organization.create({
    data: {
      name: "Agence Démo",
    },
  });

  const mailbox = await prisma.mailbox.create({
    data: {
      organizationId: organization.id,
      email: "contact@agence-demo.fr",
      provider: "demo",
    },
  });

  console.log({
    organizationId: organization.id,
    mailboxId: mailbox.id,
  });
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });