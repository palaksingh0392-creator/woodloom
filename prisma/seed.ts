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

const deliveryAreas = [
  { state: "Delhi", city: "New Delhi", pincode: "110001", deliveryCharge: 999, estimatedDays: 7 },
  { state: "Delhi", city: "Rohini", pincode: "110011", deliveryCharge: 999, estimatedDays: 7 },
  { state: "Delhi", city: "Dwarka", pincode: "110076", deliveryCharge: 999, estimatedDays: 7 },
  { state: "Rajasthan", city: "Jaipur", pincode: "302001", deliveryCharge: 999, estimatedDays: 7 },
  { state: "Rajasthan", city: "Jodhpur", pincode: "342001", deliveryCharge: 999, estimatedDays: 7 },
  { state: "Rajasthan", city: "Udaipur", pincode: "313001", deliveryCharge: 999, estimatedDays: 7 },
  { state: "Rajasthan", city: "Kota", pincode: "324005", deliveryCharge: 999, estimatedDays: 7 },
  { state: "Uttar Pradesh", city: "Noida", pincode: "201301", deliveryCharge: 999, estimatedDays: 7 },
  { state: "Uttar Pradesh", city: "Ghaziabad", pincode: "201309", deliveryCharge: 999, estimatedDays: 7 },
  { state: "Uttar Pradesh", city: "Lucknow", pincode: "226010", deliveryCharge: 999, estimatedDays: 7 },
  { state: "Uttar Pradesh", city: "Kanpur", pincode: "282001", deliveryCharge: 999, estimatedDays: 7 },
  { state: "Uttar Pradesh", city: "Varanasi", pincode: "221001", deliveryCharge: 999, estimatedDays: 7 },
] as const;

async function main() {
  for (const area of deliveryAreas) {
    await prisma.deliveryArea.upsert({
      where: {
        state_city_pincode: {
          state: area.state,
          city: area.city,
          pincode: area.pincode,
        },
      },
      update: {
        deliveryCharge: area.deliveryCharge,
        estimatedDays: area.estimatedDays,
        isActive: true,
      },
      create: {
        state: area.state,
        city: area.city,
        pincode: area.pincode,
        deliveryCharge: area.deliveryCharge,
        estimatedDays: area.estimatedDays,
        isActive: true,
      },
    });
  }

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
