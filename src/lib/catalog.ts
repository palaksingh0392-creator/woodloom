import "server-only";

import { prisma } from "@/lib/prisma";
import { categories, getCategoryBySlug } from "@/data/categories";
import { products, type Product } from "@/data/products";

type DbProduct = Awaited<ReturnType<typeof getDbProducts>>[number];

export function hasDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL?.trim();

  return Boolean(
    databaseUrl &&
      !databaseUrl.includes("YOUR_PASSWORD") &&
      !databaseUrl.includes("database=woodloom;user=sa;password=YOUR_PASSWORD"),
  );
}

function withDatabaseTimeout<T>(label: string, query: () => Promise<T>) {
  return Promise.race([
    query(),
    new Promise<T>((_, reject) => {
      setTimeout(() => {
        reject(new Error(`${label} timed out after 10 seconds.`));
      }, 10000);
    }),
  ]);
}

function formatCurrency(value: unknown) {
  const amount = Number(value);

  return `Rs. ${amount.toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })}`;
}

async function getDbProducts() {
  return withDatabaseTimeout("Product catalog query", () =>
    prisma.product.findMany({
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
    }),
  );
}

function mapDbProduct(product: DbProduct): Product {
  const catalogCategory = categories.find(
    (category) => category.slug === product.category.slug,
  );

  return {
    slug: product.slug,
    title: product.name,
    category: catalogCategory?.productCategory ?? product.category.name,
    collection: product.collection?.name ?? "Shissoo Collection",
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
    grades: Array.from(
      new Set(
        product.variants
          .map((variant) => variant.grade?.trim())
          .filter((grade): grade is string => Boolean(grade)),
      ),
    ),
    gradePriceAdjustments: Object.fromEntries(
      product.variants
        .filter((variant) => variant.grade?.trim())
        .map((variant) => [variant.grade!.trim(), Number(variant.priceAdjustment)]),
    ),
    variantPriceAdjustments: Object.fromEntries(
      product.variants.map((variant) => [
        `${variant.finish.trim().toLowerCase()}::${variant.grade?.trim().toLowerCase() ?? ""}`,
        Number(variant.priceAdjustment),
      ]),
    ),
    inventoryByFinish: Object.fromEntries(
      product.variants.map((variant) => [
        variant.finish,
        Math.max(variant.stock - variant.reserved, 0),
      ]),
    ),
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
  const category = await getStorefrontCategoryBySlug(slug);

  if (!category) {
    return [];
  }

  if (hasDatabaseUrl()) {
    try {
      const dbProducts = await withDatabaseTimeout(
        `Category product query for ${slug}`,
        () =>
          prisma.product.findMany({
            where: {
              status: "ACTIVE",
              category: { slug },
            },
            include: {
              category: true,
              collection: true,
              images: { orderBy: { sortOrder: "asc" } },
              variants: { orderBy: { finish: "asc" } },
            },
            orderBy: { createdAt: "asc" },
          }),
      );

      return dbProducts.map(mapDbProduct);
    } catch (error) {
      console.warn("Falling back to catalog category filtering:", error);
    }
  }

  const catalogProducts = await listCatalogProducts();

  return catalogProducts.filter(
    (product) => product.category.toLowerCase() === category.productCategory.toLowerCase(),
  );
}

export async function listCatalogProductsBySubcategorySlug(
  categorySlug: string,
  subcategorySlug: string,
) {
  if (hasDatabaseUrl()) {
    try {
      const dbProducts = await withDatabaseTimeout(
        `Subcategory product query for ${subcategorySlug}`,
        () =>
          prisma.product.findMany({
            where: {
              status: "ACTIVE",
              category: { slug: categorySlug },
              subcategory: { slug: subcategorySlug },
            },
            include: {
              category: true,
              collection: true,
              images: { orderBy: { sortOrder: "asc" } },
              variants: { orderBy: { finish: "asc" } },
            },
            orderBy: { createdAt: "asc" },
          }),
      );

      return dbProducts.map(mapDbProduct);
    } catch (error) {
      console.warn("Falling back to category products for subcategory filtering:", error);
    }
  }

  return listCatalogProductsByCategorySlug(categorySlug);
}

export async function getCatalogCategoryProductCount(slug: string) {
  const categoryProducts = await listCatalogProductsByCategorySlug(slug);

  return categoryProducts.length;
}

export function listCatalogCategories() {
  return categories;
}

export async function listStorefrontCategories() {
  if (!hasDatabaseUrl()) {
    return categories;
  }

  try {
    const databaseCategories = await withDatabaseTimeout(
      "Category catalog query",
      () =>
        prisma.category.findMany({
          where: { isActive: true },
          orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        }),
    );

    if (databaseCategories.length > 0) {
      return databaseCategories.map((category) => {
        const fallback = getCategoryBySlug(category.slug);

        return {
          slug: category.slug,
          title: category.name,
          shortTitle: fallback?.shortTitle ?? category.name,
          description: category.description ?? fallback?.description ?? `Explore ${category.name} furniture from Shissoo.`,
          seoDescription: fallback?.seoDescription ?? `Shop premium ${category.name} furniture from Shissoo.`,
          image: category.imageUrl ?? fallback?.image ?? products[0]?.images[0] ?? "",
          productCategory: category.name,
          filters: category.filters
            ? category.filters.split(",").map((filter) => filter.trim()).filter(Boolean)
            : fallback?.filters ?? [],
        };
      });
    }
  } catch (error) {
    console.warn("Falling back to static categories:", error);
  }

  return categories;
}

export async function getStorefrontCategoryBySlug(slug: string) {
  const storefrontCategories = await listStorefrontCategories();
  return storefrontCategories.find((category) => category.slug === slug);
}

export type CatalogCollectionCard = {
  title: string;
  products: string;
  href: string;
  image: string;
};

export function buildCatalogCollectionCard(input: {
  slug: string;
  name: string;
  image: string;
  productCount: number;
}): CatalogCollectionCard {
  return {
    title: input.name,
    products: `${input.productCount} Products`,
    href: `/furniture/${input.slug}`,
    image: input.image,
  };
}

export async function listCatalogCollectionCards() {
  const catalogCategories = await listStorefrontCategories();

  const cards = await Promise.all(
    catalogCategories.map(async (category) => ({
      slug: category.slug,
      name: category.shortTitle,
      image: category.image,
      productCount: await getCatalogCategoryProductCount(category.slug),
    })),
  );

  return cards.map((card) => buildCatalogCollectionCard(card));
}
