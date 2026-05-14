import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const BodySchema = z.object({
  status: z.enum(["NEW", "PROCESSED", "ARCHIVED", "ERROR"]),
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
    console.log("Received status update request:", { id, body });

    const parsed = BodySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid payload",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const email = await prisma.email.update({
      where: {
        id,
      },
      data: {
        status: parsed.data.status,
      },
    });

    return NextResponse.json({
      success: true,
      email,
    });
  } catch (error) {
    console.error("Update email status error:", error);

    return NextResponse.json(
      {
        error: "Unable to update email status",
      },
      { status: 500 }
    );
  }
}