import "server-only";

import { hasDatabaseUrl } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type ProductReview = {
  id: string;
  customerName: string;
  rating: number;
  title: string;
  content: string;
  createdAt: string;
};

export type AdminProductReview = ProductReview & {
  productName: string;
  productSlug: string;
  customerEmail: string;
  isVisible: boolean;
};

export async function listProductReviews(slug: string): Promise<ProductReview[]> {
  if (!hasDatabaseUrl()) {
    return [];
  }

  try {
    const reviews = await prisma.review.findMany({
      where: {
        isVisible: true,
        product: {
          slug,
        },
      },
      include: {
        user: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return reviews.map((review) => ({
      id: review.id,
      customerName: review.user.name,
      rating: review.rating,
      title: review.title ?? "Verified customer",
      content: review.content,
      createdAt: review.createdAt.toISOString(),
    }));
  } catch (error) {
    console.warn("Falling back to static reviews:", error);
    return [];
  }
}

export async function createProductReview(input: {
  userId: string;
  productSlug: string;
  rating: number;
  title?: string;
  content: string;
}) {
  if (!hasDatabaseUrl()) {
    throw new Error("Database connection is not configured yet.");
  }

  const rating = Math.max(1, Math.min(5, Math.round(input.rating)));
  const content = input.content.trim();
  const title = input.title?.trim() || null;

  if (!content) {
    throw new Error("Review message is required.");
  }

  const product = await prisma.product.findUnique({
    where: { slug: input.productSlug },
  });

  if (!product || product.status !== "ACTIVE") {
    throw new Error("Product not found.");
  }

  return prisma.review.upsert({
    where: {
      userId_productId: {
        userId: input.userId,
        productId: product.id,
      },
    },
    create: {
      userId: input.userId,
      productId: product.id,
      rating,
      title,
      content,
      isVisible: true,
    },
    update: {
      rating,
      title,
      content,
      isVisible: true,
    },
  });
}

export async function listAdminProductReviews(): Promise<AdminProductReview[]> {
  if (!hasDatabaseUrl()) {
    return [];
  }

  try {
    const reviews = await prisma.review.findMany({
      include: {
        product: true,
        user: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return reviews.map((review) => ({
      id: review.id,
      customerName: review.user.name,
      customerEmail: review.user.email,
      productName: review.product.name,
      productSlug: review.product.slug,
      rating: review.rating,
      title: review.title ?? "Verified customer",
      content: review.content,
      isVisible: review.isVisible,
      createdAt: review.createdAt.toISOString(),
    }));
  } catch (error) {
    console.warn("Could not load admin reviews:", error);
    return [];
  }
}

export async function updateAdminProductReview(
  id: string,
  input: { isVisible?: boolean },
) {
  if (!hasDatabaseUrl()) {
    throw new Error("Database connection is not configured yet.");
  }

  return prisma.review.update({
    where: { id },
    data: {
      isVisible:
        typeof input.isVisible === "boolean" ? input.isVisible : undefined,
    },
  });
}

export async function deleteAdminProductReview(id: string) {
  if (!hasDatabaseUrl()) {
    throw new Error("Database connection is not configured yet.");
  }

  return prisma.review.delete({
    where: { id },
  });
}
