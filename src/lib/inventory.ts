import "server-only";

import type { Prisma } from "@prisma/client";

import type { OrderStatus } from "@/lib/order-status";

type InventoryOrderItem = {
  variantId: string | null;
  quantity: number;
};

type InventoryBucket = "reserved" | "deducted" | "released";

function getInventoryBucket(status: string): InventoryBucket {
  if (status === "DELIVERED" || status === "RETURN_REQUESTED") {
    return "deducted";
  }

  if (status === "CANCELLED" || status === "RETURNED") {
    return "released";
  }

  return "reserved";
}

async function reserveVariant(
  transaction: Prisma.TransactionClient,
  variantId: string,
  quantity: number,
) {
  const changedRows = await transaction.$executeRaw`
    UPDATE [ProductVariant]
    SET [reserved] = [reserved] + ${quantity}
    WHERE [id] = ${variantId}
      AND ([stock] - [reserved]) >= ${quantity}
  `;

  if (changedRows !== 1) {
    throw new Error("Selected stock is no longer available.");
  }
}

async function releaseReservedVariant(
  transaction: Prisma.TransactionClient,
  variantId: string,
  quantity: number,
) {
  await transaction.$executeRaw`
    UPDATE [ProductVariant]
    SET [reserved] =
      CASE
        WHEN [reserved] >= ${quantity} THEN [reserved] - ${quantity}
        ELSE 0
      END
    WHERE [id] = ${variantId}
  `;
}

async function deductVariant(
  transaction: Prisma.TransactionClient,
  variantId: string,
  quantity: number,
) {
  const changedRows = await transaction.$executeRaw`
    UPDATE [ProductVariant]
    SET
      [stock] = [stock] - ${quantity},
      [reserved] =
        CASE
          WHEN [reserved] >= ${quantity} THEN [reserved] - ${quantity}
          ELSE [reserved]
        END
    WHERE [id] = ${variantId}
      AND [stock] >= ${quantity}
  `;

  if (changedRows !== 1) {
    throw new Error("Not enough stock to mark this order as delivered.");
  }
}

async function restockVariant(
  transaction: Prisma.TransactionClient,
  variantId: string,
  quantity: number,
) {
  await transaction.$executeRaw`
    UPDATE [ProductVariant]
    SET [stock] = [stock] + ${quantity}
    WHERE [id] = ${variantId}
  `;
}

export async function reserveOrderInventory(
  transaction: Prisma.TransactionClient,
  items: InventoryOrderItem[],
) {
  for (const item of items) {
    if (!item.variantId) continue;
    await reserveVariant(transaction, item.variantId, item.quantity);
  }
}

export async function applyOrderInventoryTransition(
  transaction: Prisma.TransactionClient,
  items: InventoryOrderItem[],
  previousStatus: OrderStatus | string,
  nextStatus: OrderStatus | string,
) {
  const previousBucket = getInventoryBucket(previousStatus);
  const nextBucket = getInventoryBucket(nextStatus);

  if (previousBucket === nextBucket) {
    return;
  }

  for (const item of items) {
    if (!item.variantId) continue;

    if (previousBucket === "reserved" && nextBucket === "deducted") {
      await deductVariant(transaction, item.variantId, item.quantity);
      continue;
    }

    if (previousBucket === "reserved" && nextBucket === "released") {
      await releaseReservedVariant(transaction, item.variantId, item.quantity);
      continue;
    }

    if (previousBucket === "deducted" && nextBucket === "released") {
      await restockVariant(transaction, item.variantId, item.quantity);
      continue;
    }

    if (previousBucket === "released" && nextBucket === "reserved") {
      await reserveVariant(transaction, item.variantId, item.quantity);
      continue;
    }

    if (previousBucket === "released" && nextBucket === "deducted") {
      await deductVariant(transaction, item.variantId, item.quantity);
      continue;
    }

    if (previousBucket === "deducted" && nextBucket === "reserved") {
      await restockVariant(transaction, item.variantId, item.quantity);
      await reserveVariant(transaction, item.variantId, item.quantity);
    }
  }
}
