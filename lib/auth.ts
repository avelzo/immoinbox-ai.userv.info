import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";
import { DEMO_ORGANIZATION_ID } from "@/lib/demo-config";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "mongodb",
  }),

  emailAndPassword: {
    enabled: true,
  },

  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await prisma.organization.upsert({
            where: { id: DEMO_ORGANIZATION_ID },
            update: {},
            create: {
              id: DEMO_ORGANIZATION_ID,
              name: "Agence Démo",
            },
          });

          await prisma.user.update({
            where: { id: user.id },
            data: { organizationId: DEMO_ORGANIZATION_ID },
          });
        },
      },
    },
  },
});