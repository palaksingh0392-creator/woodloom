import { NextResponse } from "next/server";

import { canAccessAdmin, hasDatabaseUrl } from "@/lib/auth";
import {
  listDeliveryAreas,
  parseDeliveryAreaInput,
} from "@/lib/delivery-areas";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getCurrentSession();

  if (!session || !canAccessAdmin(session.role)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    areas: await listDeliveryAreas({ activeOnly: false }),
  });
}

export async function POST(request: Request) {
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
    const body = await request.json();
    const data = parseDeliveryAreaInput(body);

    const existingArea = await prisma.deliveryArea.findFirst({
      where: {
        state: data.state,
        city: data.city,
        pincode: data.pincode,
      },
    });

    if (existingArea) {
      return NextResponse.json(
        {
          message: "This delivery area already exists for the selected city and pincode.",
        },
        { status: 409 },
      );
    }

    const area = await prisma.deliveryArea.create({ data });

    return NextResponse.json(
      {
        area: {
          ...area,
          deliveryCharge: Number(area.deliveryCharge),
        },
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Unable to save delivery area.",
      },
      { status: 400 },
    );
  }
}

