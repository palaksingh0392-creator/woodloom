import { NextResponse } from "next/server";

import { canAccessAdmin, hasDatabaseUrl } from "@/lib/auth";
import {
  ensureDefaultNavigationLinks,
  listNavigationLinks,
  parseNavigationLinkInput,
} from "@/lib/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";

export const dynamic = "force-dynamic";

async function authorized() {
  const session = await getCurrentSession();
  return session && canAccessAdmin(session.role);
}

export async function GET() {
  if (!(await authorized())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ links: await listNavigationLinks({ activeOnly: false }) });
}

export async function POST(request: Request) {
  if (!(await authorized())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  if (!hasDatabaseUrl()) return NextResponse.json({ message: "Database connection is not configured yet." }, { status: 503 });

  try {
    await ensureDefaultNavigationLinks();
    const link = await prisma.navigationLink.create({ data: parseNavigationLinkInput(await request.json()) });
    return NextResponse.json({ link }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Could not save navigation link." }, { status: 400 });
  }
}
