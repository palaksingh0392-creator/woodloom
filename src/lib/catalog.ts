import "server-only";

import { prisma } from "@/lib/prisma";
import { categories, getCategoryBySlug } from "@/data/categories";
import { products, type Product } from "@/data/products";

type DbProduct = Awaited<ReturnType<typeof getDbProducts>>[number];

function hasDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL;

  return Boolean(databaseUrl && !databaseUrl.includes("YOUR_PASSWORD"));
}

function formatCurrency(value: unknown) {
  const amount = Number(value);

  return `Rs. ${amount.toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })}`;
}

async function getDbProducts() {
  return prisma.product.findMany({
    where: { status: "ACTIVE" },
    include: {
      category: true,
      collection: true,
      images: {
        orderBy: { sortOrder: "asc" },
      },
      variants: {
        orderBy: { finish: "asc" },
      },
    },
    orderBy: { createdAt: "asc" },
  });
}

function mapDbProduct(product: DbProduct): Product {
  const catalogCategory = categories.find(
    (category) => category.slug === product.category.slug,
  );

  return {
    slug: product.slug,
    title: product.name,
    category: catalogCategory?.productCategory ?? product.category.name,
    collection: product.collection?.name ?? "WOODLOOM Collection",
    material: product.material ?? "Premium solid wood",
    dimensions: product.dimensions ?? "Made to order",
    warranty: product.warranty ?? "5-year craftsmanship warranty",
    careInstructions:
      product.careInstructions ??
      "Wipe with a soft dry cloth and avoid direct heat.",
    shortDescription: product.shortDescription,
    description: product.description,
    price: formatCurrency(product.price),
    compareAtPrice: product.compareAtPrice
      ? formatCurrency(product.compareAtPrice)
      : undefined,
    badge: product.badge ?? undefined,
    images: product.images.map((image) => image.url),
    finishes: product.variants.map((variant) => variant.finish),
  };
}

export async function listCatalogProducts() {
  if (!hasDatabaseUrl()) {
    return products;
  }

  try {
    const dbProducts = await getDbProducts();

    return dbProducts.map(mapDbProduct);
  } catch (error) {
    console.warn("Falling back to static products:", error);
    return products;
  }
}

export async function getCatalogProductBySlug(slug: string) {
  const catalogProducts = await listCatalogProducts();

  return catalogProducts.find((product) => product.slug === slug);
}

export async function listCatalogProductsByCategorySlug(slug: string) {
  const category = getCategoryBySlug(slug);

  if (!category) {
    return [];
  }

  const catalogProducts = await listCatalogProducts();

  return catalogProducts.filter(
    (product) => product.category === category.productCategory,
  );
}

export async function getCatalogCategoryProductCount(slug: string) {
  const categoryProducts = await listCatalogProductsByCategorySlug(slug);

  return categoryProducts.length;
}

export function listCatalogCategories() {
  return categories;
}
