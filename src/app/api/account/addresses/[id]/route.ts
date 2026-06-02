import { NextResponse } from "next/server";

import { hasDatabaseUrl } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";

type AddressRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

export const dynamic = "force-dynamic";

export async function DELETE(_request: Request, { params }: AddressRouteProps) {
  const session = await getCurrentSession();

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!hasDatabaseUrl()) {
    return NextResponse.json(
      { message: "Database connection is not configured yet." },
      { status: 503 },
    );
  }

  const { id } = await params;

  await prisma.address.deleteMany({
    where: {
      id,
      userId: session.id,
    },
  });

  return NextResponse.json({ ok: true });
}

export async function PATCH(request: Request, { params }: AddressRouteProps) {
  const session = await getCurrentSession();

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!hasDatabaseUrl()) {
    return NextResponse.json(
      { message: "Database connection is not configured yet." },
      { status: 503 },
    );
  }

  const { id } = await params;
  const body = (await request.json()) as { isDefault?: boolean };

  if (body.isDefault) {
    await prisma.address.updateMany({
      where: { userId: session.id },
      data: { isDefault: false },
    });
  }

  await prisma.address.updateMany({
    where: {
      id,
      userId: session.id,
    },
    data: { isDefault: Boolean(body.isDefault) },
  });

  const address = await prisma.address.findFirst({
    where: {
      id,
      userId: session.id,
    },
  });

  return NextResponse.json({ address });
}
