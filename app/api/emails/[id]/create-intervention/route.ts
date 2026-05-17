import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(_request: Request, { params }: RouteProps) {
  try {
    const { id } = await params;

    const email = await prisma.email.findUnique({
      where: { id },
    });

    if (!email) {
      return NextResponse.json(
        { error: "Email not found" },
        { status: 404 }
      );
    }

    const existingIntervention = await prisma.intervention.findFirst({
      where: {
        incidentEmailId: email.id,
      },
    });

    if (existingIntervention) {
      return NextResponse.json({
        success: true,
        duplicated: true,
        intervention: existingIntervention,
      });
    }

    const intervention = await prisma.intervention.create({
      data: {
        organizationId: email.organizationId,
        title: email.subject,
        description: email.summary ?? email.textContent,
        status: "PENDING",
        technicianName: null,
        incidentEmailId: email.id,
      },
    });

    return NextResponse.json({
      success: true,
      duplicated: false,
      intervention,
    });
  } catch (error) {
    console.error("Create intervention from email error:", error);

    return NextResponse.json(
      { error: "Unable to create intervention" },
      { status: 500 }
    );
  }
}