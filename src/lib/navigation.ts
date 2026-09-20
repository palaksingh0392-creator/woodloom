import "server-only";

import { hasDatabaseUrl } from "@/lib/auth";
import { prisma, withDatabaseTimeout } from "@/lib/prisma";

export type NavigationLink = {
  id: string;
  label: string;
  href: string;
  isActive: boolean;
  sortOrder: number;
};

export type NavigationCategory = {
  id: string;
  name: string;
  slug: string;
  subcategories: { id: string; name: string; slug: string }[];
};

export async function listNavigationCategories(): Promise<NavigationCategory[]> {
  if (!hasDatabaseUrl()) return [];

  try {
    return await withDatabaseTimeout("Navigation category query", () =>
      prisma.category.findMany({
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          slug: true,
          subcategories: {
            where: { isActive: true },
            select: { id: true, name: true, slug: true },
            orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
          },
        },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      }),
    );
  } catch (error) {
    console.warn("Navigation category menus unavailable until the database is updated:", error);
    return [];
  }
}

const fallbackNavigationLinks: NavigationLink[] = [
  { id: "fallback-living", label: "Living Room", href: "/furniture/living-room", isActive: true, sortOrder: 0 },
  { id: "fallback-bedroom", label: "Bedroom", href: "/furniture/bedroom", isActive: true, sortOrder: 1 },
  { id: "fallback-dining", label: "Dining", href: "/furniture/dining-room", isActive: true, sortOrder: 2 },
  { id: "fallback-office", label: "Office", href: "/furniture/office", isActive: true, sortOrder: 3 },
  { id: "fallback-decor", label: "Decor", href: "/furniture/decor", isActive: true, sortOrder: 4 },
  { id: "fallback-collections", label: "Collections", href: "/furniture", isActive: true, sortOrder: 5 },
  { id: "fallback-blog", label: "Blog", href: "/blog", isActive: true, sortOrder: 6 },
];

export async function ensureDefaultNavigationLinks() {
  const existingDefault = await prisma.navigationLink.findFirst({
    where: { id: { in: fallbackNavigationLinks.map((link) => link.id) } },
    select: { id: true },
  });

  if (existingDefault) return;

  await prisma.$transaction(
    fallbackNavigationLinks.map((link) =>
      prisma.navigationLink.upsert({
        where: { id: link.id },
        update: {},
        create: link,
      }),
    ),
  );
}

export async function listNavigationLinks(options?: { activeOnly?: boolean }) {
  if (!hasDatabaseUrl()) {
    return fallbackNavigationLinks.filter((link) => options?.activeOnly ? link.isActive : true);
  }

  try {
    let links = await withDatabaseTimeout("Navigation link query", () =>
      prisma.navigationLink.findMany({
        where: options?.activeOnly ? { isActive: true } : undefined,
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      }),
    );

    const hasBuiltInLinks = links.some((link) =>
      fallbackNavigationLinks.some((fallback) => fallback.id === link.id),
    );

    if (links.length > 0 && !hasBuiltInLinks) {
      await ensureDefaultNavigationLinks();
      links = await withDatabaseTimeout("Navigation link refresh", () =>
        prisma.navigationLink.findMany({
          where: options?.activeOnly ? { isActive: true } : undefined,
          orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        }),
      );
    }

    if (links.length > 0) return links;
  } catch (error) {
    console.warn("Using fallback navigation links because DB lookup failed:", error);
  }

  return fallbackNavigationLinks.filter((link) => options?.activeOnly ? link.isActive : true);
}

export function parseNavigationLinkInput(input: Partial<NavigationLink>) {
  const label = typeof input.label === "string" ? input.label.trim() : "";
  const href = typeof input.href === "string" ? input.href.trim() : "";
  const sortOrder = Number(input.sortOrder ?? 0);

  if (!label || !href) throw new Error("Link label and destination are required.");
  if (!href.startsWith("/")) throw new Error("Destination must start with /.");
  if (!Number.isInteger(sortOrder) || sortOrder < 0) throw new Error("Sort order must be 0 or greater.");

  return { label, href, isActive: input.isActive ?? true, sortOrder };
}
