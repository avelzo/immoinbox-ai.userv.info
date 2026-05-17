import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const BodySchema = z.object({
  status: z.enum(["PENDING", "SCHEDULED", "IN_PROGRESS", "COMPLETED"]),
});

type RouteProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: Request, { params }: RouteProps) {
  try {
    const { id } = await params;
    const body = await request.json();

    const parsed = BodySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload" },
        { status: 400 }
      );
    }

    const intervention = await prisma.intervention.update({
      where: { id },
      data: {
        status: parsed.data.status,
      },
    });

    return NextResponse.json({
      success: true,
      intervention,
    });
  } catch (error) {
    console.error("Update intervention status error:", error);

    return NextResponse.json(
      { error: "Unable to update intervention status" },
      { status: 500 }
    );
  }
}