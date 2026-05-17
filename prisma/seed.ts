import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // const organization = await prisma.organization.create({
  //   data: {
  //     name: "Agence Démo",
  //   },
  // });

  // const mailbox = await prisma.mailbox.create({
  //   data: {
  //     organizationId: organization.id,
  //     email: "contact@agence-demo.fr",
  //     provider: "demo",
  //   },
  // });
  const user = await prisma.user.upsert({
    where: {
      email: "admin@userv.info",
    },
    update: {},
    create: {
      email: "admin@userv.info",
      name: "Laurent Hunaut",
      organizationId: "6a02026cc7614ba0caf62450",
    },
  });
  console.log({
    // organizationId: organization.id,
    // mailboxId: mailbox.id,
    userId: user.id,
  });
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });