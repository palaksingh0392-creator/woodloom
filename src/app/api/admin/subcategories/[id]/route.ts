import { NextResponse } from "next/server";

import { canAccessAdmin } from "@/lib/auth";
import { parseSubcategoryInput, upsertAdminSubcategory } from "@/lib/admin-taxonomy";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";

type RouteContext = { params: Promise<{ id: string }> };

async function authorized() {
  const session = await getCurrentSession();
  return Boolean(session && canAccessAdmin(session.role));
}

export async function PATCH(request: Request, context: RouteContext) {
  if (!(await authorized())) return NextResponse.json({ message: "Admin access required." }, { status: 401 });
  try {
    const { id } = await context.params;
    const subcategory = await upsertAdminSubcategory(parseSubcategoryInput(await request.json()), id);
    return NextResponse.json({ subcategory });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Could not update sub-category." }, { status: 400 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  if (!(await authorized())) return NextResponse.json({ message: "Admin access required." }, { status: 401 });
  try {
    const { id } = await context.params;
    const subcategory = await prisma.subcategory.update({ where: { id }, data: { isActive: false } });
    return NextResponse.json({ subcategory });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Could not archive sub-category." }, { status: 400 });
  }
}
