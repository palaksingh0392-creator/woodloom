import { NextResponse } from "next/server";

import { findServiceableArea } from "@/lib/delivery-areas";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    state?: string;
    city?: string;
    pincode?: string;
  };
  const area = await findServiceableArea(body);

  if (!area) {
    return NextResponse.json({
      serviceable: false,
      message:
        "Delivery is not available for this pincode. Please choose a supported state, city, and pincode.",
    });
  }

  return NextResponse.json({
    serviceable: true,
    area,
    message: `Delivery is available in ${area.city}.`,
  });
}

