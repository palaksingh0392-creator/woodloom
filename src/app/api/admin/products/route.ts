import { NextResponse } from "next/server";

import {
  createAdminProduct,
  listAdminProducts,
  parseAdminProductInput,
} from "@/lib/admin-products";
import { canAccessAdmin } from "@/lib/auth";
import { getCurrentSession } from "@/lib/session";

export const dynamic = "force-dynamic";

async function isAuthorized() {
  const session = await getCurrentSession();
  return Boolean(session && canAccessAdmin(session.role));
}

export async function GET() {
  if (!(await isAuthorized())) {
    return NextResponse.json({ message: "Admin access required." }, { status: 401 });
  }

  return NextResponse.json({ products: await listAdminProducts() });
}

export async function POST(request: Request) {
  if (!(await isAuthorized())) {
    return NextResponse.json({ message: "Admin access required." }, { status: 401 });
  }

  try {
    const product = await createAdminProduct(
      parseAdminProductInput(await request.json()),
    );
    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not create product.";
    const conflict =
      message.includes("Unique constraint") || message.includes("duplicate");

    return NextResponse.json(
      {
        message: conflict
          ? "The product slug, product SKU, or variant SKU already exists."
          : message,
      },
      { status: conflict ? 409 : 400 },
    );
  }
}
