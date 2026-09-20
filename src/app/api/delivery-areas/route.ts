import { NextResponse } from "next/server";

import { listDeliveryAreas } from "@/lib/delivery-areas";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    areas: await listDeliveryAreas({ activeOnly: true }),
  });
}

