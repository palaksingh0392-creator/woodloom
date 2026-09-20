import { PrismaMssql } from "@prisma/adapter-mssql";
import { PrismaClient } from "@prisma/client";

process.loadEnvFile?.(".env");

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required.");
}

const prisma = new PrismaClient({
  adapter: new PrismaMssql(databaseUrl),
});

type SheetProduct = {
  code: string;
  collection: "bedroom" | "living room";
  segment: string;
  category: string;
  subcategory: string;
  remark: string;
  image: string;
};

const products: SheetProduct[] = [
  {
    code: "SHIKSBSW001",
    collection: "bedroom",
    segment: "solid wood",
    category: "bed",
    subcategory: "king size bed",
    remark: "Pure solid wood with multiple finishes",
    image: "/uploads/products/1782902093891-9137d2a0-cfef-481f-beb6-0e08c571ea50.webp",
  },
  {
    code: "SHIKSBPL001",
    collection: "bedroom",
    segment: "pre laminated",
    category: "bed",
    subcategory: "king size bed",
    remark: "Engineered wood",
    image: "/uploads/products/1782902145502-9c55c1e4-d66a-450b-8868-3f17a4001b20.webp",
  },
  {
    code: "SHIKSBLBS001",
    collection: "bedroom",
    segment: "laminated by shissoo",
    category: "bed",
    subcategory: "king size bed",
    remark: "Pine block board / HDHMR / MDF / marine ply",
    image: "/uploads/products/1782902161795-b01c8942-0758-4a23-b3ea-4aba5f1d84dc.webp",
  },
  {
    code: "SHIQSBSW001",
    collection: "bedroom",
    segment: "solid wood",
    category: "bed",
    subcategory: "queen size bed",
    remark: "Pure solid wood with multiple finishes",
    image: "/uploads/products/1788263263060-90bd0586-7cd5-4c6c-ae60-96a62c3c16a2.webp",
  },
  {
    code: "SHIQSBPL001",
    collection: "bedroom",
    segment: "pre laminated",
    category: "bed",
    subcategory: "queen size bed",
    remark: "Engineered wood",
    image: "/uploads/products/1788263424140-3a782ded-e9fb-451b-aa31-3d8e972beb8c.webp",
  },
  {
    code: "SHIQSBLBS001",
    collection: "bedroom",
    segment: "laminated by shissoo",
    category: "bed",
    subcategory: "queen size bed",
    remark: "Pine block board / HDHMR / MDF / marine ply",
    image: "/uploads/products/1788263448712-f658b63b-4e61-4711-8b3c-851a833e720b.webp",
  },
  {
    code: "SHIDBSW001",
    collection: "bedroom",
    segment: "solid wood",
    category: "bed",
    subcategory: "diwan bed",
    remark: "Pure solid wood with multiple finishes",
    image: "/uploads/products/1788263536106-49dc4bc2-2d89-410d-aaf3-76e4df7e9c59.webp",
  },
  {
    code: "SHIDBPL001",
    collection: "bedroom",
    segment: "pre laminated",
    category: "bed",
    subcategory: "diwan bed",
    remark: "Engineered wood",
    image: "/uploads/products/1788362717550-4f4e468f-6422-40b0-8556-c8685200f546.webp",
  },
  {
    code: "SHIDBLBS001",
    collection: "bedroom",
    segment: "laminated by shissoo",
    category: "bed",
    subcategory: "diwan bed",
    remark: "Pine block board / HDHMR / MDF / marine ply",
    image: "/uploads/products/1788602905506-aca060b2-d768-4b74-9ca4-2fdd075f85c9.webp",
  },
  {
    code: "SHISBSW001",
    collection: "bedroom",
    segment: "solid wood",
    category: "bed",
    subcategory: "single bed",
    remark: "Pure solid wood with multiple finishes",
    image: "/uploads/products/1788797718212-99aca2dc-906e-4c6a-b4ee-317728796fbb.webp",
  },
  {
    code: "SHISBPL001",
    collection: "bedroom",
    segment: "pre laminated",
    category: "bed",
    subcategory: "single bed",
    remark: "Engineered wood",
    image: "/uploads/products/1788797778644-694f4d2c-9b03-4a37-9064-6e15b63ded02.webp",
  },
  {
    code: "SHISBLBS001",
    collection: "bedroom",
    segment: "laminated by shissoo",
    category: "bed",
    subcategory: "single bed",
    remark: "Pine block board / HDHMR / MDF / marine ply",
    image: "/uploads/products/1788797836505-c8a769e6-242f-492e-8697-c5aba448d985.webp",
  },
  {
    code: "SHIRTSW001",
    collection: "living room",
    segment: "solid wood",
    category: "bed",
    subcategory: "rajasthani takhat",
    remark: "Pure solid wood with multiple finishes",
    image: "/uploads/products/1789225953911-5cc5a208-2a1e-4e87-8546-ae94657c6712.webp",
  },
];

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function main() {
  const category = await prisma.category.upsert({
    where: { slug: "bedroom" },
    update: { name: "Bedroom Furniture", isActive: true },
    create: { name: "Bedroom Furniture", slug: "bedroom", isActive: true },
  });
  const livingCategory = await prisma.category.upsert({
    where: { slug: "living-room" },
    update: { name: "Living Room Furniture", isActive: true },
    create: { name: "Living Room Furniture", slug: "living-room", isActive: true },
  });

  const collectionIds = new Map<string, string>();
  for (const name of ["Bedroom", "Living Room"]) {
    const collection = await prisma.collection.upsert({
      where: { slug: slugify(name) },
      update: { name, isActive: true },
      create: { name, slug: slugify(name), isActive: true },
    });
    collectionIds.set(name.toLowerCase(), collection.id);
  }

  const subcategoryIds = new Map<string, string>();
  for (const product of products) {
    const parentCategory = product.collection === "bedroom" ? category : livingCategory;
    const subcategory = await prisma.subcategory.upsert({
      where: {
        categoryId_slug: {
          categoryId: parentCategory.id,
          slug: slugify(product.subcategory),
        },
      },
      update: { name: product.subcategory, isActive: true },
      create: {
        categoryId: parentCategory.id,
        name: product.subcategory,
        slug: slugify(product.subcategory),
        isActive: true,
      },
    });
    subcategoryIds.set(`${parentCategory.id}:${product.subcategory}`, subcategory.id);
  }

  for (const product of products) {
    const parentCategory = product.collection === "bedroom" ? category : livingCategory;
    const productName = `${product.subcategory.replace(/\b\w/g, (letter) => letter.toUpperCase())} - ${product.segment.replace(/\b\w/g, (letter) => letter.toUpperCase())}`;
    const slug = `${slugify(productName)}-${product.code.toLowerCase()}`;
    const subcategoryId = subcategoryIds.get(`${parentCategory.id}:${product.subcategory}`);
    const dbProduct = await prisma.product.upsert({
      where: { sku: product.code },
      update: {
        name: productName,
        slug,
        sku: product.code,
        categoryId: parentCategory.id,
        subcategoryId,
        collectionId: collectionIds.get(product.collection),
        shortDescription: `${productName} crafted for timeless interiors.`,
        description: `${product.remark}. Designed for comfortable, durable everyday use.`,
        material: product.segment,
        price: 20000,
        compareAtPrice: 25000,
        status: "ACTIVE",
        isFeatured: false,
      },
      create: {
        name: productName,
        slug,
        productCode: product.code,
        sku: product.code,
        categoryId: parentCategory.id,
        subcategoryId,
        collectionId: collectionIds.get(product.collection),
        shortDescription: `${productName} crafted for timeless interiors.`,
        description: `${product.remark}. Designed for comfortable, durable everyday use.`,
        material: product.segment,
        price: 20000,
        compareAtPrice: 25000,
        status: "ACTIVE",
        isFeatured: false,
      },
    });

    await prisma.productImage.deleteMany({ where: { productId: dbProduct.id } });
    await prisma.productImage.create({
      data: { productId: dbProduct.id, url: product.image, alt: productName },
    });
    await prisma.productVariant.deleteMany({ where: { productId: dbProduct.id } });
    await prisma.productVariant.create({
      data: {
        productId: dbProduct.id,
        finish: product.segment,
        color: "Natural finish",
        grade: product.remark,
        sku: `${product.code}-01`,
        stock: 5,
        reorderAt: 2,
      },
    });
  }

  console.log(`Imported ${products.length} sheet products.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
