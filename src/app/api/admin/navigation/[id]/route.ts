import { NextResponse } from "next/server";

import { canAccessAdmin, hasDatabaseUrl } from "@/lib/auth";
import { parseNavigationLinkInput } from "@/lib/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";

type RouteContext = { params: Promise<{ id: string }> };

async function authorized() {
  const session = await getCurrentSession();
  return session && canAccessAdmin(session.role);
}

export async function PATCH(request: Request, context: RouteContext) {
  if (!(await authorized())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  if (!hasDatabaseUrl()) return NextResponse.json({ message: "Database connection is not configured yet." }, { status: 503 });

  try {
    const { id } = await context.params;
    const data = parseNavigationLinkInput(await request.json());
    const link = await prisma.navigationLink.upsert({
      where: { id },
      update: data,
      create: { id, ...data },
    });
    return NextResponse.json({ link });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Could not update navigation link." }, { status: 400 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  if (!(await authorized())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  if (!hasDatabaseUrl()) return NextResponse.json({ message: "Database connection is not configured yet." }, { status: 503 });

  try {
    const { id } = await context.params;
    await prisma.navigationLink.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Could not delete navigation link." }, { status: 400 });
  }
}
