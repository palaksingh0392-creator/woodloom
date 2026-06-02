import { NextResponse } from "next/server";

import { listAccountAddresses } from "@/lib/account";
import { hasDatabaseUrl } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getCurrentSession();

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    addresses: await listAccountAddresses(session.id),
  });
}

export async function POST(request: Request) {
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
    fullName?: string;
    phone?: string;
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    type?: string;
    isDefault?: boolean;
  };
  const fullName = body.fullName?.trim();
  const phone = body.phone?.trim();
  const line1 = body.line1?.trim();
  const line2 = body.line2?.trim() || null;
  const city = body.city?.trim();
  const state = body.state?.trim();
  const postalCode = body.postalCode?.trim();
  const isDefault = Boolean(body.isDefault);

  if (!fullName || !phone || !line1 || !city || !state || !postalCode) {
    return NextResponse.json(
      { message: "All required address fields must be completed." },
      { status: 400 },
    );
  }

  if (isDefault) {
    await prisma.address.updateMany({
      where: { userId: session.id },
      data: { isDefault: false },
    });
  }

  const address = await prisma.address.create({
    data: {
      userId: session.id,
      type: body.type ?? "HOME",
      fullName,
      phone,
      line1,
      line2,
      city,
      state,
      postalCode,
      isDefault,
    },
  });

  return NextResponse.json({ address }, { status: 201 });
}
