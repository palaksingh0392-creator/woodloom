import "dotenv/config";

import { PrismaMssql } from "@prisma/adapter-mssql";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaMssql(process.env.DATABASE_URL),
});

const activeOrderStatuses = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "PACKED",
  "SHIPPED",
];

async function main() {
  const variants = await prisma.productVariant.findMany({
    select: { id: true },
  });
  const activeOrderItems = await prisma.orderItem.findMany({
    where: {
      variantId: { not: null },
      order: {
        status: { in: activeOrderStatuses },
      },
    },
    select: {
      variantId: true,
      quantity: true,
    },
  });
  const reservedByVariant = new Map<string, number>();

  for (const item of activeOrderItems) {
    if (!item.variantId) continue;
    reservedByVariant.set(
      item.variantId,
      (reservedByVariant.get(item.variantId) ?? 0) + item.quantity,
    );
  }

  for (const variant of variants) {
    await prisma.productVariant.update({
      where: { id: variant.id },
      data: { reserved: reservedByVariant.get(variant.id) ?? 0 },
    });
  }

  console.log(
    `Inventory reconciled for ${variants.length} variants and ${activeOrderItems.length} active order items.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
