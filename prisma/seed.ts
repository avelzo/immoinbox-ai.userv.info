import { PrismaClient } from "@prisma/client";
import {
  DEMO_ORGANIZATION_ID,
  DEMO_MAILBOX_ID,
  DEMO_EMAIL,
} from "../lib/demo-config";

const prisma = new PrismaClient();

async function main() {
  const organization = await prisma.organization.upsert({
    where: { id: DEMO_ORGANIZATION_ID },
    update: {
      name: "Agence Démo",
    },
    create: {
      id: DEMO_ORGANIZATION_ID,
      name: "Agence Démo",
    },
  });

  const mailbox = await prisma.mailbox.upsert({
    where: { id: DEMO_MAILBOX_ID },
    update: {
      email: "contact@agence-demo.fr",
      provider: "demo",
    },
    create: {
      id: DEMO_MAILBOX_ID,
      organizationId: organization.id,
      email: "contact@agence-demo.fr",
      provider: "demo",
    },
  });

  const user = await prisma.user.upsert({
    where: {
      email: DEMO_EMAIL,
    },
    update: {
      organizationId: organization.id,
    },
    create: {
      id: "admin-user",
      email: DEMO_EMAIL,
      name: "Laurent Hunaut",
      organizationId: organization.id,
    },
  });

  const usersWithoutOrg = await prisma.user.findMany({
    select: {
      id: true,
      organizationId: true,
    },
  });

  let linkedUsers = 0;

  for (const existingUser of usersWithoutOrg) {
    if (existingUser.organizationId) {
      continue;
    }

    await prisma.user.update({
      where: { id: existingUser.id },
      data: { organizationId: organization.id },
    });
    linkedUsers += 1;
  }

  console.log({
    organizationId: organization.id,
    mailboxId: mailbox.id,
    userId: user.id,
    linkedUsers,
  });
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
