import { NextResponse } from "next/server";

import { hasDatabaseUrl } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";

export const dynamic = "force-dynamic";

type IncomingCartItem = {
  productSlug?: string;
  finish?: string;
  quantity?: number;
};

function formatCurrency(value: unknown) {
  const amount = Number(value);

  return `Rs. ${amount.toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })}`;
}

async function getCommerceState(userId: string) {
  const [cartItems, wishlistItems] = await Promise.all([
    prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            images: {
              orderBy: { sortOrder: "asc" },
            },
          },
        },
        variant: true,
      },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.wishlistItem.findMany({
      where: { userId },
      include: {
        product: true,
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return {
    cartItems: cartItems.map((item) => ({
      productSlug: item.product.slug,
      title: item.product.name,
      price: formatCurrency(item.product.price),
      image: item.product.images[0]?.url ?? "",
      finish: item.variant?.finish ?? "Default",
      quantity: item.quantity,
    })),
    wishlistSlugs: wishlistItems.map((item) => item.product.slug),
  };
}

export async function GET() {
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

  return NextResponse.json(await getCommerceState(session.id));
}

export async function PUT(request: Request) {
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
    cartItems?: IncomingCartItem[];
    wishlistSlugs?: string[];
  };
  const incomingCartItems = Array.isArray(body.cartItems)
    ? body.cartItems
    : [];
  const incomingWishlistSlugs = Array.isArray(body.wishlistSlugs)
    ? body.wishlistSlugs
    : [];
  const productSlugs = Array.from(
    new Set([
      ...incomingCartItems
        .map((item) => item.productSlug)
        .filter((slug): slug is string => Boolean(slug)),
      ...incomingWishlistSlugs,
    ]),
  );

  const products = await prisma.product.findMany({
    where: {
      slug: { in: productSlugs },
      status: "ACTIVE",
    },
    include: {
      variants: true,
    },
  });
  const productBySlug = new Map(products.map((product) => [product.slug, product]));

  await prisma.$transaction(async (tx) => {
    await tx.cartItem.deleteMany({ where: { userId: session.id } });
    await tx.wishlistItem.deleteMany({ where: { userId: session.id } });

    const cartRows = incomingCartItems.flatMap((item) => {
      if (!item.productSlug) return [];

      const product = productBySlug.get(item.productSlug);
      if (!product) return [];

      const quantity = Math.max(1, Math.min(Number(item.quantity) || 1, 99));
      const variant =
        product.variants.find((candidate) => candidate.finish === item.finish) ??
        product.variants[0];

      return [
        {
          userId: session.id,
          productId: product.id,
          variantId: variant?.id,
          quantity,
        },
      ];
    });

    if (cartRows.length > 0) {
      await tx.cartItem.createMany({ data: cartRows });
    }

    const wishlistRows = incomingWishlistSlugs.flatMap((slug) => {
      const product = productBySlug.get(slug);

      return product
        ? [
            {
              userId: session.id,
              productId: product.id,
            },
          ]
        : [];
    });

    if (wishlistRows.length > 0) {
      await tx.wishlistItem.createMany({ data: wishlistRows });
    }
  });

  return NextResponse.json(await getCommerceState(session.id));
}
