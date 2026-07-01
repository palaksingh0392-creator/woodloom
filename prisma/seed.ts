import { PrismaMssql } from "@prisma/adapter-mssql";
import { PrismaClient } from "@prisma/client";

import { categories } from "../src/data/categories";
import { products } from "../src/data/products";
import { parsePriceAmount } from "../src/lib/price";

const databaseUrl =
  process.env.DATABASE_URL ??
  "sqlserver://localhost:1433;database=woodloom;user=sa;password=YOUR_PASSWORD;encrypt=true;trustServerCertificate=true";

const prisma = new PrismaClient({
  adapter: new PrismaMssql(databaseUrl),
});

async function main() {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.title,
        description: category.description,
        imageUrl: category.image,
        isActive: true,
      },
      create: {
        slug: category.slug,
        name: category.title,
        description: category.description,
        imageUrl: category.image,
        isActive: true,
      },
    });
  }

  for (const product of products) {
    const category = categories.find(
      (item) => item.productCategory === product.category,
    );

    if (!category) {
      throw new Error(`Missing category for ${product.title}`);
    }

    const dbCategory = await prisma.category.findUniqueOrThrow({
      where: { slug: category.slug },
    });

    const collectionSlug = product.collection
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const collection = await prisma.collection.upsert({
      where: { slug: collectionSlug },
      update: {
        name: product.collection,
        isActive: true,
      },
      create: {
        slug: collectionSlug,
        name: product.collection,
        isActive: true,
      },
    });

    const dbProduct = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        categoryId: dbCategory.id,
        collectionId: collection.id,
        name: product.title,
        shortDescription: product.shortDescription,
        description: product.description,
        material: product.material,
        dimensions: product.dimensions,
        careInstructions: product.careInstructions,
        warranty: product.warranty,
        price: parsePriceAmount(product.price),
        compareAtPrice: product.compareAtPrice
          ? parsePriceAmount(product.compareAtPrice)
          : null,
        status: "ACTIVE",
        isFeatured: true,
        badge: product.badge ?? null,
      },
      create: {
        slug: product.slug,
        sku: `WL-${product.slug.toUpperCase().replace(/[^A-Z0-9]+/g, "-")}`,
        categoryId: dbCategory.id,
        collectionId: collection.id,
        name: product.title,
        shortDescription: product.shortDescription,
        description: product.description,
        material: product.material,
        dimensions: product.dimensions,
        careInstructions: product.careInstructions,
        warranty: product.warranty,
        price: parsePriceAmount(product.price),
        compareAtPrice: product.compareAtPrice
          ? parsePriceAmount(product.compareAtPrice)
          : null,
        status: "ACTIVE",
        isFeatured: true,
        badge: product.badge ?? null,
      },
    });

    await prisma.productImage.deleteMany({
      where: { productId: dbProduct.id },
    });

    await prisma.productImage.createMany({
      data: product.images.map((url, index) => ({
        productId: dbProduct.id,
        url,
        alt: product.title,
        sortOrder: index,
      })),
    });

    for (const [index, finish] of product.finishes.entries()) {
      await prisma.productVariant.upsert({
        where: {
          sku: `${dbProduct.sku}-${String(index + 1).padStart(2, "0")}`,
        },
        update: {
          finish,
          stock: 12 + index * 4,
          reserved: index,
          reorderAt: 5,
        },
        create: {
          productId: dbProduct.id,
          finish,
          sku: `${dbProduct.sku}-${String(index + 1).padStart(2, "0")}`,
          stock: 12 + index * 4,
          reserved: index,
          reorderAt: 5,
        },
      });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
