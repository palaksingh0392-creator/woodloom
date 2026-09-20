import { NextResponse } from "next/server";

import { canAccessAdmin, hasDatabaseUrl } from "@/lib/auth";
import { parseStoreLocationInput, listStoreLocations } from "@/lib/store-locations";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getCurrentSession();

  if (!session || !canAccessAdmin(session.role)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    locations: await listStoreLocations({ activeOnly: false }),
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
    const data = parseStoreLocationInput(body);
    const location = await prisma.storeLocation.create({ data });

    return NextResponse.json(
      {
        location: {
          ...location,
          isActive: location.isActive,
          sortOrder: location.sortOrder,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Unable to save store location.",
      },
      { status: 400 },
    );
  }
}
