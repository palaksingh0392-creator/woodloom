import { NextResponse } from "next/server";

import { getAccountProfile } from "@/lib/account";
import { hasDatabaseUrl } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getCurrentSession();

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ profile: await getAccountProfile(session) });
}

export async function PATCH(request: Request) {
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

  const body = (await request.json()) as {
    name?: string;
    phone?: string;
  };
  const name = body.name?.trim();
  const phone = body.phone?.trim() || null;

  if (!name) {
    return NextResponse.json(
      { message: "Full name is required." },
      { status: 400 },
    );
  }

  const profile = await prisma.user.update({
    where: { id: session.id },
    data: { name, phone },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
    },
  });

  return NextResponse.json({
    profile: {
      ...profile,
      phone: profile.phone ?? "",
      role: session.role,
    },
  });
}
