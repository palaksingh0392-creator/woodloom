import { NextResponse } from "next/server";

import { canAccessAdmin } from "@/lib/auth";
import { getCurrentSession } from "@/lib/session";
import {
  normalizeHomeHeroSlideInput,
  upsertAdminHomeHeroSlide,
} from "@/lib/home";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

async function authorize() {
  const session = await getCurrentSession();
  return Boolean(session && canAccessAdmin(session.role));
}

export async function PATCH(request: Request, context: RouteContext) {
  if (!(await authorize())) {
    return NextResponse.json({ message: "Admin access required." }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const slide = await upsertAdminHomeHeroSlide(
      normalizeHomeHeroSlideInput(await request.json()),
      id,
    );

    return NextResponse.json({ slide });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Could not update slide.",
      },
      { status: 400 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  if (!(await authorize())) {
    return NextResponse.json({ message: "Admin access required." }, { status: 401 });
  }

  const { id } = await context.params;
  const hardDelete = new URL(_request.url).searchParams.get("hard") === "true";

  if (hardDelete) {
    await prisma.homeHeroSlide.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  }

  const slide = await prisma.homeHeroSlide.update({
    where: { id },
    data: { isActive: false },
  });

  return NextResponse.json({ slide });
}
