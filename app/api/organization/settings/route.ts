import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUserOrganizationId } from "@/lib/current-user";

const BodySchema = z.object({
  interventionNotifyEmail: z
    .union([z.string().email(), z.literal(""), z.null()])
    .optional(),
});

export async function PATCH(request: Request) {
  try {
    const organizationId = await getCurrentUserOrganizationId();

    if (!organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
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

    const rawEmail = parsed.data.interventionNotifyEmail;
    const interventionNotifyEmail =
      rawEmail === undefined
        ? undefined
        : rawEmail === null || rawEmail === ""
          ? null
          : rawEmail;

    const organization = await prisma.organization.update({
      where: { id: organizationId },
      data: {
        ...(interventionNotifyEmail !== undefined && { interventionNotifyEmail }),
      },
      select: {
        id: true,
        interventionNotifyEmail: true,
      },
    });

    return NextResponse.json({
      success: true,
      organization,
    });
  } catch (error) {
    console.error("Update organization settings error:", error);

    return NextResponse.json(
      { error: "Unable to update settings" },
      { status: 500 }
    );
  }
}
