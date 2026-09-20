import { NextResponse } from "next/server";

import { canAccessAdmin } from "@/lib/auth";
import { getCurrentSession } from "@/lib/session";
import {
  listAdminHomeHeroSlides,
  normalizeHomeHeroSlideInput,
  upsertAdminHomeHeroSlide,
} from "@/lib/home";

export async function GET() {
  const session = await getCurrentSession();

  if (!session || !canAccessAdmin(session.role)) {
    return NextResponse.json({ message: "Admin access required." }, { status: 401 });
  }

  return NextResponse.json({ slides: await listAdminHomeHeroSlides() });
}

export async function POST(request: Request) {
  const session = await getCurrentSession();

  if (!session || !canAccessAdmin(session.role)) {
    return NextResponse.json({ message: "Admin access required." }, { status: 401 });
  }

  try {
    const slide = await upsertAdminHomeHeroSlide(
      normalizeHomeHeroSlideInput(await request.json()),
    );

    return NextResponse.json({ slide }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Could not save hero slide.",
      },
      { status: 400 },
    );
  }
}
