import "server-only";

import { prisma } from "@/lib/prisma";
import { slugifyProductName } from "@/lib/admin-products";

export type CategoryInput = {
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
  sortOrder: number;
};

export type CollectionInput = {
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
};

function optionalText(value: unknown) {
  const text = typeof value === "string" ? value.trim() : "";
  return text || undefined;
}

function parseBase(body: unknown) {
  if (!body || typeof body !== "object") {
    throw new Error("Details are required.");
  }

  const input = body as Record<string, unknown>;
  const name = optionalText(input.name);

  if (!name) {
    throw new Error("Name is required.");
  }

  return {
    name,
    slug: slugifyProductName(optionalText(input.slug) ?? name),
    description: optionalText(input.description),
    imageUrl: optionalText(input.imageUrl),
    isActive: input.isActive !== false,
  };
}

export function parseCategoryInput(body: unknown): CategoryInput {
  const base = parseBase(body);
  const input = body as Record<string, unknown>;
  const sortOrder = Number(input.sortOrder ?? 0);

  if (!Number.isInteger(sortOrder) || sortOrder < 0) {
    throw new Error("Sort order must be a positive whole number.");
  }

  return { ...base, sortOrder };
}

export function parseCollectionInput(body: unknown): CollectionInput {
  return parseBase(body);
}

export async function listAdminCategories() {
  return prisma.category.findMany({
    include: {
      _count: {
        select: { products: true },
      },
    },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
}

export async function listAdminCollections() {
  return prisma.collection.findMany({
    include: {
      _count: {
        select: { products: true },
      },
    },
    orderBy: { name: "asc" },
  });
}

export async function upsertAdminCategory(input: CategoryInput, id?: string) {
  const data = {
    name: input.name,
    slug: input.slug,
    description: input.description,
    imageUrl: input.imageUrl,
    isActive: input.isActive,
    sortOrder: input.sortOrder,
  };

  if (id) {
    return prisma.category.update({ where: { id }, data });
  }

  return prisma.category.create({ data });
}

export async function upsertAdminCollection(input: CollectionInput, id?: string) {
  const data = {
    name: input.name,
    slug: input.slug,
    description: input.description,
    imageUrl: input.imageUrl,
    isActive: input.isActive,
  };

  if (id) {
    return prisma.collection.update({ where: { id }, data });
  }

  return prisma.collection.create({ data });
}
