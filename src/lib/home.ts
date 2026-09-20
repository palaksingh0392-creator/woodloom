import "server-only";

import { hasDatabaseUrl } from "@/lib/auth";
import { prisma, withDatabaseTimeout } from "@/lib/prisma";
import { HOME_HERO_WORD_LIMITS } from "@/constants/home";

export type HomeHeroSlide = {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  isActive: boolean;
  sortOrder: number;
};

function countWords(value: string) {
  return value ? value.split(/\s+/).filter(Boolean).length : 0;
}

export function normalizeHomeHeroSlideInput(input: Record<string, unknown>) {
  const rawText = (value: unknown) => {
    const text = typeof value === "string" ? value.trim() : "";
    return text;
  };

  const eyebrow = rawText(input.eyebrow);
  const title = rawText(input.title);
  const subtitle = rawText(input.subtitle);
  const imageUrl = rawText(input.imageUrl);
  const primaryCtaLabel = rawText(input.primaryCtaLabel) || "Explore Collection";
  const primaryCtaHref = rawText(input.primaryCtaHref) || "/furniture";
  const secondaryCtaLabel = rawText(input.secondaryCtaLabel) || "Book Consultation";
  const secondaryCtaHref = rawText(input.secondaryCtaHref) || "/contact";
  const sortOrder = Number(input.sortOrder ?? 0);

  if (!imageUrl) {
    throw new Error("Hero image is required.");
  }

  const wordCounts = {
    eyebrow: countWords(eyebrow),
    title: countWords(title),
    subtitle: countWords(subtitle),
  };

  const overLimit = (field: keyof typeof HOME_HERO_WORD_LIMITS) =>
    wordCounts[field] > HOME_HERO_WORD_LIMITS[field];

  if (overLimit("eyebrow") || overLimit("title") || overLimit("subtitle")) {
    throw new Error(
      `Hero copy limits: eyebrow ${HOME_HERO_WORD_LIMITS.eyebrow} words, title ${HOME_HERO_WORD_LIMITS.title} words, subtitle ${HOME_HERO_WORD_LIMITS.subtitle} words.`,
    );
  }

  if (!Number.isInteger(sortOrder) || sortOrder < 0) {
    throw new Error("Sort order must be a positive whole number.");
  }

  return {
    eyebrow,
    title,
    subtitle,
    imageUrl,
    primaryCtaLabel,
    primaryCtaHref,
    secondaryCtaLabel,
    secondaryCtaHref,
    isActive: input.isActive !== false,
    sortOrder,
  };
}

export async function listHomeHeroSlides(): Promise<HomeHeroSlide[]> {
  const hasDatabaseUrl = Boolean(
    process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("YOUR_PASSWORD"),
  );

  if (!hasDatabaseUrl) {
    return [
      {
        id: "fallback-1",
        eyebrow: "Scandinavian Luxury Furniture",
        title: "Timeless Furniture For Beautiful Living",
        subtitle:
          "Crafted wooden interiors inspired by warmth, simplicity, and modern luxury.",
        imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
        primaryCtaLabel: "Explore Collection",
        primaryCtaHref: "/furniture",
        secondaryCtaLabel: "Book Consultation",
        secondaryCtaHref: "/contact",
        isActive: true,
        sortOrder: 0,
      },
      {
        id: "fallback-2",
        eyebrow: "Scandinavian Luxury Furniture",
        title: "Timeless Furniture For Beautiful Living",
        subtitle:
          "Crafted wooden interiors inspired by warmth, simplicity, and modern luxury.",
        imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
        primaryCtaLabel: "Explore Collection",
        primaryCtaHref: "/furniture",
        secondaryCtaLabel: "Book Consultation",
        secondaryCtaHref: "/contact",
        isActive: true,
        sortOrder: 1,
      },
      {
        id: "fallback-3",
        eyebrow: "Scandinavian Luxury Furniture",
        title: "Timeless Furniture For Beautiful Living",
        subtitle:
          "Crafted wooden interiors inspired by warmth, simplicity, and modern luxury.",
        imageUrl:
          "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1600&auto=format&fit=crop&utm_source=chatgpt.com",
        primaryCtaLabel: "Explore Collection",
        primaryCtaHref: "/furniture",
        secondaryCtaLabel: "Book Consultation",
        secondaryCtaHref: "/contact",
        isActive: true,
        sortOrder: 2,
      },
    ];
  }

  try {
    const slides = await withDatabaseTimeout("Hero slide query", () =>
      prisma.homeHeroSlide.findMany({
        where: { isActive: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      }),
    );

    return slides.map((slide) => ({
      id: slide.id,
      eyebrow: slide.eyebrow,
      title: slide.title,
      subtitle: slide.subtitle,
      imageUrl: slide.imageUrl,
      primaryCtaLabel: slide.primaryCtaLabel,
      primaryCtaHref: slide.primaryCtaHref,
      secondaryCtaLabel: slide.secondaryCtaLabel,
      secondaryCtaHref: slide.secondaryCtaHref,
      isActive: slide.isActive,
      sortOrder: slide.sortOrder,
    }));
  } catch (error) {
    console.warn("Falling back to static hero slides:", error);
    return [
      {
        id: "fallback-1",
        eyebrow: "Scandinavian Luxury Furniture",
        title: "Timeless Furniture For Beautiful Living",
        subtitle:
          "Crafted wooden interiors inspired by warmth, simplicity, and modern luxury.",
        imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
        primaryCtaLabel: "Explore Collection",
        primaryCtaHref: "/furniture",
        secondaryCtaLabel: "Book Consultation",
        secondaryCtaHref: "/contact",
        isActive: true,
        sortOrder: 0,
      },
      {
        id: "fallback-2",
        eyebrow: "Scandinavian Luxury Furniture",
        title: "Timeless Furniture For Beautiful Living",
        subtitle:
          "Crafted wooden interiors inspired by warmth, simplicity, and modern luxury.",
        imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
        primaryCtaLabel: "Explore Collection",
        primaryCtaHref: "/furniture",
        secondaryCtaLabel: "Book Consultation",
        secondaryCtaHref: "/contact",
        isActive: true,
        sortOrder: 1,
      },
      {
        id: "fallback-3",
        eyebrow: "Scandinavian Luxury Furniture",
        title: "Timeless Furniture For Beautiful Living",
        subtitle:
          "Crafted wooden interiors inspired by warmth, simplicity, and modern luxury.",
        imageUrl:
          "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1600&auto=format&fit=crop&utm_source=chatgpt.com",
        primaryCtaLabel: "Explore Collection",
        primaryCtaHref: "/furniture",
        secondaryCtaLabel: "Book Consultation",
        secondaryCtaHref: "/contact",
        isActive: true,
        sortOrder: 2,
      },
    ];
  }
}

export async function listAdminHomeHeroSlides() {
  if (!hasDatabaseUrl()) return [];

  try {
    return await withDatabaseTimeout("Admin hero slide query", () =>
      prisma.homeHeroSlide.findMany({
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      }),
    );
  } catch (error) {
    console.warn("Falling back to an empty admin hero slide list:", error);
    return [];
  }
}

export async function upsertAdminHomeHeroSlide(
  input: ReturnType<typeof normalizeHomeHeroSlideInput>,
  id?: string,
) {
  const data = {
    eyebrow: input.eyebrow,
    title: input.title,
    subtitle: input.subtitle,
    imageUrl: input.imageUrl,
    primaryCtaLabel: input.primaryCtaLabel,
    primaryCtaHref: input.primaryCtaHref,
    secondaryCtaLabel: input.secondaryCtaLabel,
    secondaryCtaHref: input.secondaryCtaHref,
    isActive: input.isActive,
    sortOrder: input.sortOrder,
  };

  if (id) {
    return prisma.homeHeroSlide.update({ where: { id }, data });
  }

  return prisma.homeHeroSlide.create({ data });
}
