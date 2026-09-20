import { NextResponse } from "next/server";

import { canAccessAdmin, hasDatabaseUrl } from "@/lib/auth";
import { parseDeliveryAreaInput } from "@/lib/delivery-areas";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const session = await getCurrentSession();

  if (!session || !canAccessAdmin(session.role)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!hasDatabaseUrl()) {
    return NextResponse.json(
      { message: "Database connection is not configured yet." },
      { status: 503 },
    );
  }

  try {
    const { id } = await context.params;
    const body = await request.json();
    const data = parseDeliveryAreaInput(body);

    const duplicateArea = await prisma.deliveryArea.findFirst({
      where: {
        state: data.state,
        city: data.city,
        pincode: data.pincode,
        NOT: { id },
      },
    });

    if (duplicateArea) {
      return NextResponse.json(
        {
          message: "Another delivery area with this city and pincode already exists.",
        },
        { status: 409 },
      );
    }

    const area = await prisma.deliveryArea.update({
      where: { id },
      data,
    });

    return NextResponse.json({
      area: {
        ...area,
        deliveryCharge: Number(area.deliveryCharge),
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unable to update delivery area.",
      },
      { status: 400 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await getCurrentSession();

  if (!session || !canAccessAdmin(session.role)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!hasDatabaseUrl()) {
    return NextResponse.json(
      { message: "Database connection is not configured yet." },
      { status: 503 },
    );
  }

  const { id } = await context.params;

  await prisma.deliveryArea.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}

