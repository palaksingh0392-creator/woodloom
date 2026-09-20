import { PrismaMssql } from "@prisma/adapter-mssql";
import { PrismaClient } from "@prisma/client";

process.loadEnvFile?.(".env");

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required.");

const prisma = new PrismaClient({ adapter: new PrismaMssql(databaseUrl) });

async function main() {
  const products = await prisma.product.findMany({
    select: { id: true, sku: true, productCode: true },
  });

  const usedCodes = new Set<string>();

  for (const product of products) {
    const baseCode = (product.productCode ?? product.sku).trim().toUpperCase();
    let productCode = baseCode;
    let suffix = 2;

    while (usedCodes.has(productCode)) {
      productCode = `${baseCode}-${suffix}`;
      suffix += 1;
    }

    usedCodes.add(productCode);

    if (product.productCode === productCode) continue;

    await prisma.product.update({
      where: { id: product.id },
      data: { productCode },
    });
  }

  console.log(`Normalized ${products.length} product codes.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
