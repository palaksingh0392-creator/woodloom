import "server-only";

import { prisma } from "@/lib/prisma";

export type ProductVariantInput = {
  id?: string;
  finish: string;
  grade?: string;
  color?: string;
  sku: string;
  stock: number;
  reorderAt: number;
  priceAdjustment: number;
};

export type AdminProductInput = {
  name: string;
  slug: string;
  productCode: string;
  sku: string;
  categoryId: string;
  subcategoryId?: string;
  collectionId?: string;
  shortDescription: string;
  description: string;
  material?: string;
  dimensions?: string;
  careInstructions?: string;
  warranty?: string;
  price: number;
  compareAtPrice?: number;
  status: "DRAFT" | "ACTIVE" | "ARCHIVED";
  isFeatured: boolean;
  badge?: string;
  imageUrls: string[];
  variants: ProductVariantInput[];
};

export function getReadableAdminProductError(message: string) {
  if (/transaction has not begun|transaction.*expired|timed out/i.test(message)) {
    return "The database took too long to save this product. Please try again.";
  }

  if (/foreign key|categoryId|subcategoryId|collectionId/i.test(message)) {
    return "One of the selected categories or collections is no longer available. Refresh the page and try again.";
  }

  if (/connection|connect|database|prisma|invocation/i.test(message)) {
    return "The product could not be saved because the database is temporarily unavailable. Please try again.";
  }

  return message;
}

export function slugifyProductName(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function optionalText(value: unknown) {
  const text = typeof value === "string" ? value.trim() : "";
  return text || undefined;
}

export function parseAdminProductInput(body: unknown): AdminProductInput {
  if (!body || typeof body !== "object") {
    throw new Error("Product information is required.");
  }

  const input = body as Record<string, unknown>;
  const name = optionalText(input.name);
  const productCode = optionalText(input.productCode)?.toUpperCase();
  const sku = optionalText(input.sku)?.toUpperCase();
  const categoryId = optionalText(input.categoryId);
  const shortDescription = optionalText(input.shortDescription);
  const description = optionalText(input.description);
  const price = Number(input.price);
  const compareAtPrice =
    input.compareAtPrice === "" || input.compareAtPrice == null
      ? undefined
      : Number(input.compareAtPrice);
  const status = input.status;

  if (!name || !productCode || !sku || !categoryId || !shortDescription || !description) {
    throw new Error("Name, product code, category, and descriptions are required.");
  }

  if (!Number.isFinite(price) || price < 0) {
    throw new Error("Enter a valid product price.");
  }

  if (
    compareAtPrice !== undefined &&
    (!Number.isFinite(compareAtPrice) || compareAtPrice < price)
  ) {
    throw new Error("Compare-at price must be equal to or higher than the price.");
  }

  if (status !== "DRAFT" && status !== "ACTIVE" && status !== "ARCHIVED") {
    throw new Error("Choose a valid product status.");
  }

  const imageUrls = Array.isArray(input.imageUrls)
    ? input.imageUrls
        .map((url) => optionalText(url))
        .filter((url): url is string => Boolean(url))
    : [];

  const invalidImage = imageUrls.find((url) => {
    if (url.startsWith("/")) return false;

    try {
      const hostname = new URL(url).hostname;
      return hostname !== "res.cloudinary.com" && hostname !== "images.unsplash.com";
    } catch {
      return true;
    }
  });

  if (invalidImage) {
    throw new Error("Use a Cloudinary or Unsplash image URL.");
  }

  if (status === "ACTIVE" && imageUrls.length === 0) {
    throw new Error("Add at least one image before publishing a product.");
  }

  const variants = Array.isArray(input.variants)
    ? input.variants.map((variant, index) => {
        const item = variant as Record<string, unknown>;
        const finish = optionalText(item.finish);
        const grade = optionalText(item.grade);
        const variantSku = optionalText(item.sku)?.toUpperCase();
        const stock = Number(item.stock);
        const reorderAt = Number(item.reorderAt);
        const priceAdjustment = Number(item.priceAdjustment ?? 0);

        if (!finish || !variantSku) {
          throw new Error(`Finish and product code are required for variant ${index + 1}.`);
        }

        if (
          !Number.isInteger(stock) ||
          stock < 0 ||
          !Number.isInteger(reorderAt) ||
          reorderAt < 0 ||
          !Number.isFinite(priceAdjustment) ||
          priceAdjustment < 0
        ) {
          throw new Error(`Enter valid stock values for variant ${index + 1}.`);
        }

        return {
          id: optionalText(item.id),
          finish,
          grade,
          color: optionalText(item.color),
          sku: variantSku,
          stock,
          reorderAt,
          priceAdjustment,
        };
      })
    : [];

  if (variants.length === 0) {
    throw new Error("Add at least one finish and stock variant.");
  }

  return {
    name,
    slug: slugifyProductName(optionalText(input.slug) ?? name),
    productCode,
    sku,
    categoryId,
    subcategoryId: optionalText(input.subcategoryId),
    collectionId: optionalText(input.collectionId),
    shortDescription,
    description,
    material: optionalText(input.material),
    dimensions: optionalText(input.dimensions),
    careInstructions: optionalText(input.careInstructions),
    warranty: optionalText(input.warranty),
    price,
    compareAtPrice,
    status,
    isFeatured: Boolean(input.isFeatured),
    badge: optionalText(input.badge),
    imageUrls,
    variants,
  };
}

const adminProductInclude = {
  category: true,
  subcategory: true,
  collection: true,
  images: { orderBy: { sortOrder: "asc" as const } },
  variants: { orderBy: { createdAt: "asc" as const } },
};

export async function listAdminProducts() {
  return prisma.product.findMany({
    include: adminProductInclude,
    orderBy: { updatedAt: "desc" },
  });
}

export async function getAdminProduct(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: adminProductInclude,
  });
}

export async function getProductFormOptions() {
  const [categories, collections] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    }),
    prisma.collection.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    }),
  ]);

  let subcategories: Awaited<ReturnType<typeof prisma.subcategory.findMany>> = [];

  try {
    if (prisma.subcategory) {
      subcategories = await prisma.subcategory.findMany({
        where: { isActive: true },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      });
    }
  } catch (error) {
    console.warn("Subcategory options unavailable until the database is updated:", error);
  }

  return { categories, subcategories, collections };
}

export async function createAdminProduct(input: AdminProductInput) {
  return prisma.product.create({
    data: {
      categoryId: input.categoryId,
      subcategoryId: input.subcategoryId,
      collectionId: input.collectionId,
      name: input.name,
      slug: input.slug,
      productCode: input.productCode,
      sku: input.sku,
      shortDescription: input.shortDescription,
      description: input.description,
      material: input.material,
      dimensions: input.dimensions,
      careInstructions: input.careInstructions,
      warranty: input.warranty,
      price: input.price,
      compareAtPrice: input.compareAtPrice,
      status: input.status,
      isFeatured: input.isFeatured,
      badge: input.badge,
      images: {
        create: input.imageUrls.map((url, sortOrder) => ({
          url,
          alt: input.name,
          sortOrder,
        })),
      },
      variants: {
        create: input.variants.map((variant) => ({
          finish: variant.finish,
          grade: variant.grade,
          color: variant.color,
          sku: variant.sku,
          stock: variant.stock,
          reorderAt: variant.reorderAt,
          priceAdjustment: variant.priceAdjustment,
        })),
      },
    },
    include: adminProductInclude,
  });
}

export async function updateAdminProduct(
  id: string,
  input: AdminProductInput,
) {
  return prisma.$transaction(async (transaction) => {
    const existing = await transaction.product.findUnique({
      where: { id },
      include: { variants: true },
    });

    if (!existing) {
      throw new Error("Product not found.");
    }

    await transaction.productImage.deleteMany({ where: { productId: id } });

    for (const variant of input.variants) {
      const data = {
        finish: variant.finish,
        grade: variant.grade,
        color: variant.color,
        sku: variant.sku,
        stock: variant.stock,
        reorderAt: variant.reorderAt,
        priceAdjustment: variant.priceAdjustment,
      };

      if (variant.id && existing.variants.some((item) => item.id === variant.id)) {
        await transaction.productVariant.update({
          where: { id: variant.id },
          data,
        });
      } else {
        await transaction.productVariant.create({
          data: { ...data, productId: id },
        });
      }
    }

    return transaction.product.update({
      where: { id },
      data: {
        categoryId: input.categoryId,
        subcategoryId: input.subcategoryId ?? null,
        collectionId: input.collectionId ?? null,
        name: input.name,
        slug: input.slug,
        productCode: input.productCode,
        sku: input.sku,
        shortDescription: input.shortDescription,
        description: input.description,
        material: input.material,
        dimensions: input.dimensions,
        careInstructions: input.careInstructions,
        warranty: input.warranty,
        price: input.price,
        compareAtPrice: input.compareAtPrice ?? null,
        status: input.status,
        isFeatured: input.isFeatured,
        badge: input.badge,
        images: {
          create: input.imageUrls.map((url, sortOrder) => ({
            url,
            alt: input.name,
            sortOrder,
          })),
        },
      },
      include: adminProductInclude,
    });
  }, {
    maxWait: 10000,
    timeout: 30000,
  });
}
