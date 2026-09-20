import { NextResponse } from "next/server";

import { canAccessAdmin, hasDatabaseUrl } from "@/lib/auth";
import { parseStoreLocationInput } from "@/lib/store-locations";
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
    const data = parseStoreLocationInput(body);
    const location = await prisma.storeLocation.upsert({
      where: { id },
      update: data,
      create: { id, ...data },
    });

    return NextResponse.json({
      location: {
        ...location,
        isActive: location.isActive,
        sortOrder: location.sortOrder,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unable to update store location.",
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

  await prisma.storeLocation.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
