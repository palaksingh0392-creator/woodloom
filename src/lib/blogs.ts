import "server-only";

import { blogPosts, type BlogPost } from "@/data/blogs";
import { hasDatabaseUrl } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugifyProductName } from "@/lib/admin-products";

export type AdminBlogInput = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl?: string;
  author: string;
  isPublished: boolean;
};

const fallbackBlogImage =
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1400&auto=format&fit=crop";

const allowedBlogImageHosts = new Set([
  "images.unsplash.com",
  "res.cloudinary.com",
]);

function optionalText(value: unknown) {
  const text = typeof value === "string" ? value.trim() : "";
  return text || undefined;
}

function estimateReadTime(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 180))} min read`;
}

function formatDate(value: Date | null) {
  return (value ?? new Date()).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function resolveBlogImage(imageUrl?: string | null) {
  if (!imageUrl) {
    return fallbackBlogImage;
  }

  if (imageUrl.startsWith("/")) {
    return imageUrl;
  }

  try {
    const url = new URL(imageUrl);

    if (url.protocol === "https:" && allowedBlogImageHosts.has(url.hostname)) {
      return imageUrl;
    }
  } catch {
    return fallbackBlogImage;
  }

  return fallbackBlogImage;
}

function validateBlogImageUrl(imageUrl?: string) {
  if (!imageUrl) {
    return undefined;
  }

  if (imageUrl.startsWith("/")) {
    return imageUrl;
  }

  try {
    const url = new URL(imageUrl);

    if (url.protocol === "https:" && allowedBlogImageHosts.has(url.hostname)) {
      return imageUrl;
    }
  } catch {
    throw new Error("Use a valid image URL.");
  }

  throw new Error("Use an image from Unsplash or Cloudinary.");
}

function mapDbBlogPost(post: {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string | null;
  author: string;
  publishedAt: Date | null;
  createdAt: Date;
}): BlogPost {
  return {
    slug: post.slug,
    title: post.title,
    category: post.author,
    date: formatDate(post.publishedAt ?? post.createdAt),
    excerpt: post.excerpt,
    image: resolveBlogImage(post.imageUrl),
    readTime: estimateReadTime(post.content),
    content: post.content
      .split(/\n{2,}/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean),
  };
}

export function parseAdminBlogInput(body: unknown): AdminBlogInput {
  if (!body || typeof body !== "object") {
    throw new Error("Blog details are required.");
  }

  const input = body as Record<string, unknown>;
  const title = optionalText(input.title);
  const excerpt = optionalText(input.excerpt);
  const content = optionalText(input.content);
  const author = optionalText(input.author) ?? "Guide";

  if (!title || !excerpt || !content) {
    throw new Error("Title, excerpt, and content are required.");
  }

  return {
    title,
    slug: slugifyProductName(optionalText(input.slug) ?? title),
    excerpt,
    content,
    imageUrl: validateBlogImageUrl(optionalText(input.imageUrl)),
    author,
    isPublished: Boolean(input.isPublished),
  };
}

export async function listPublishedBlogPosts(): Promise<BlogPost[]> {
  if (!hasDatabaseUrl()) return blogPosts;

  try {
    const posts = await prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    });

    const dbPosts = posts.map(mapDbBlogPost);
    const dbSlugs = new Set(dbPosts.map((post) => post.slug));
    const fallbackPosts = blogPosts.filter((post) => !dbSlugs.has(post.slug));

    return [...dbPosts, ...fallbackPosts];
  } catch {
    return blogPosts;
  }
}

export async function getPublishedBlogPostBySlug(slug: string) {
  const posts = await listPublishedBlogPosts();
  return posts.find((post) => post.slug === slug);
}

export async function listAdminBlogPosts() {
  return prisma.blogPost.findMany({
    orderBy: [{ updatedAt: "desc" }],
  });
}

export async function upsertAdminBlogPost(input: AdminBlogInput, id?: string) {
  const data = {
    title: input.title,
    slug: input.slug,
    excerpt: input.excerpt,
    content: input.content,
    imageUrl: input.imageUrl,
    author: input.author,
    isPublished: input.isPublished,
    publishedAt: input.isPublished ? new Date() : null,
  };

  if (id) {
    return prisma.blogPost.update({ where: { id }, data });
  }

  return prisma.blogPost.create({ data });
}
