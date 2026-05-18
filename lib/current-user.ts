import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth-server";

export async function getCurrentUserOrganizationId() {
  const session = await getSession();

  if (!session?.user?.email) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      organizationId: true,
    },
  });

  return user?.organizationId ?? null;
}