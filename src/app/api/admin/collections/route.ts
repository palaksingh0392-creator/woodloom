import { NextResponse } from "next/server";

import {
  listAdminCollections,
  parseCollectionInput,
  upsertAdminCollection,
} from "@/lib/admin-taxonomy";
import { canAccessAdmin } from "@/lib/auth";
import { getCurrentSession } from "@/lib/session";

export async function GET() {
  const session = await getCurrentSession();

  if (!session || !canAccessAdmin(session.role)) {
    return NextResponse.json({ message: "Admin access required." }, { status: 401 });
  }

  return NextResponse.json({ collections: await listAdminCollections() });
}

export async function POST(request: Request) {
  const session = await getCurrentSession();

  if (!session || !canAccessAdmin(session.role)) {
    return NextResponse.json({ message: "Admin access required." }, { status: 401 });
  }

  try {
    const collection = await upsertAdminCollection(
      parseCollectionInput(await request.json()),
    );
    return NextResponse.json({ collection }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Could not save collection.",
      },
      { status: 400 },
    );
  }
}
