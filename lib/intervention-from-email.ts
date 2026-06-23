import type { Email, Intervention } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { formatInterventionForApi } from "@/lib/intervention-ui";

const AUTO_INTERVENTION_CATEGORIES = new Set([
  "INCIDENT",
  "INTERVENTION",
  "URGENT",
]);

type EnsureInterventionParams = {
  organizationId: string;
  email: Email;
  category: string;
  summary: string | null;
  recommendedAction: string | null;
  subject: string;
  from: string;
  senderRole: string;
};

export async function findInterventionForEmail(emailId: string) {
  return prisma.intervention.findFirst({
    where: {
      incidentEmailId: emailId,
    },
  });
}

export async function ensureInterventionForEmail(
  params: EnsureInterventionParams
): Promise<Intervention | null> {
  if (!AUTO_INTERVENTION_CATEGORIES.has(params.category)) {
    return null;
  }

  const existing = await findInterventionForEmail(params.email.id);
  if (existing) {
    return existing;
  }

  try {
    return await prisma.intervention.create({
      data: {
        organizationId: params.organizationId,
        title: params.summary || params.subject,
        description:
          params.recommendedAction ||
          params.summary ||
          params.subject,
        status: "PENDING",
        technicianName:
          params.senderRole === "TECHNICIAN" ? params.from : null,
        incidentEmailId: params.email.id,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return findInterventionForEmail(params.email.id);
    }

    throw error;
  }
}

export async function buildAnalyzeEmailDuplicateResponse(email: Email) {
  const intervention = await findInterventionForEmail(email.id);

  return {
    success: true,
    duplicated: true,
    email,
    intervention: intervention
      ? formatInterventionForApi(intervention)
      : null,
  };
}
