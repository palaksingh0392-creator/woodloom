import { NextResponse } from "next/server";

import {
  getAdminProduct,
  parseAdminProductInput,
  updateAdminProduct,
} from "@/lib/admin-products";
import { canAccessAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

async function isAuthorized() {
  const session = await getCurrentSession();
  return Boolean(session && canAccessAdmin(session.role));
}

export async function GET(_request: Request, context: RouteContext) {
  if (!(await isAuthorized())) {
    return NextResponse.json({ message: "Admin access required." }, { status: 401 });
  }

  const { id } = await context.params;
  const product = await getAdminProduct(id);

  if (!product) {
    return NextResponse.json({ message: "Product not found." }, { status: 404 });
  }

  return NextResponse.json({ product });
}

export async function PATCH(request: Request, context: RouteContext) {
  if (!(await isAuthorized())) {
    return NextResponse.json({ message: "Admin access required." }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const product = await updateAdminProduct(
      id,
      parseAdminProductInput(await request.json()),
    );
    return NextResponse.json({ product });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not update product.";
    const conflict =
      message.includes("Unique constraint") || message.includes("duplicate");

    return NextResponse.json(
      {
        message: conflict
          ? "The product slug, product SKU, or variant SKU already exists."
          : message,
      },
      { status: message === "Product not found." ? 404 : conflict ? 409 : 400 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  if (!(await isAuthorized())) {
    return NextResponse.json({ message: "Admin access required." }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const product = await prisma.product.update({
      where: { id },
      data: { status: "ARCHIVED", isFeatured: false },
    });
    return NextResponse.json({ product });
  } catch {
    return NextResponse.json({ message: "Product not found." }, { status: 404 });
  }
}
