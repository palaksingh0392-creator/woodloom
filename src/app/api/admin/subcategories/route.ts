import { NextResponse } from "next/server";

import { canAccessAdmin } from "@/lib/auth";
import {
  listAdminSubcategories,
  parseSubcategoryInput,
  upsertAdminSubcategory,
} from "@/lib/admin-taxonomy";
import { getCurrentSession } from "@/lib/session";

async function authorized() {
  const session = await getCurrentSession();
  return Boolean(session && canAccessAdmin(session.role));
}

export async function GET() {
  if (!(await authorized())) return NextResponse.json({ message: "Admin access required." }, { status: 401 });
  return NextResponse.json({ subcategories: await listAdminSubcategories() });
}

export async function POST(request: Request) {
  if (!(await authorized())) return NextResponse.json({ message: "Admin access required." }, { status: 401 });
  try {
    const subcategory = await upsertAdminSubcategory(parseSubcategoryInput(await request.json()));
    return NextResponse.json({ subcategory }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Could not save sub-category." }, { status: 400 });
  }
}
