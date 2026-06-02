import { products } from "./products";

export type Category = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  seoDescription: string;
  image: string;
  productCategory: string;
  filters: string[];
};

export const categories: Category[] = [
  {
    slug: "living-room",
    title: "Living Room Furniture",
    shortTitle: "Living Room",
    description:
      "Warm lounge pieces, sofas, coffee tables, and accent seating designed for calm everyday living.",
    seoDescription:
      "Shop premium wooden living room furniture from WOODLOOM, including sofas, lounge chairs, and coffee tables.",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1600&auto=format&fit=crop",
    productCategory: "Living Room",
    filters: ["Solid Wood", "Linen", "Oak", "Sofa", "Lounge"],
  },
  {
    slug: "bedroom",
    title: "Bedroom Furniture",
    shortTitle: "Bedroom",
    description:
      "Quiet bedroom foundations with warm finishes, soft forms, and storage-ready details.",
    seoDescription:
      "Explore premium wooden bedroom furniture, beds, bedside tables, and warm minimal bedroom pieces.",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1600&auto=format&fit=crop",
    productCategory: "Bedroom",
    filters: ["Wood", "Storage", "Soft Finish", "Bedside", "Minimal"],
  },
  {
    slug: "dining-room",
    title: "Dining Room Furniture",
    shortTitle: "Dining",
    description:
      "Solid wood dining pieces built for hosting, everyday meals, and elegant family gatherings.",
    seoDescription:
      "Shop premium wooden dining room furniture, including walnut dining tables and modern dining essentials.",
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1600&auto=format&fit=crop",
    productCategory: "Dining Room",
    filters: ["Walnut", "Dining Table", "Solid Wood", "Hosting", "Family"],
  },
  {
    slug: "office",
    title: "Office Furniture",
    shortTitle: "Office",
    description:
      "Focused workspaces with clean silhouettes, natural materials, and durable everyday comfort.",
    seoDescription:
      "Discover modern wooden office furniture and workspace pieces for warm, productive home offices.",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1600&auto=format&fit=crop",
    productCategory: "Office",
    filters: ["Desk", "Workspace", "Walnut", "Ergonomic", "Storage"],
  },
  {
    slug: "decor",
    title: "Decor & Accent Furniture",
    shortTitle: "Decor",
    description:
      "Accent tables, sculptural pieces, and finishing touches that bring texture to quiet interiors.",
    seoDescription:
      "Browse luxury decor and accent furniture from WOODLOOM, including side tables and natural finishes.",
    image:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1600&auto=format&fit=crop",
    productCategory: "Decor",
    filters: ["Stone", "Accent", "Side Table", "Texture", "Sculptural"],
  },
];

export function getCategoryBySlug(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export function getProductsByCategorySlug(slug: string) {
  const category = getCategoryBySlug(slug);

  if (!category) {
    return [];
  }

  return products.filter(
    (product) => product.category === category.productCategory,
  );
}

export function getCategoryProductCount(slug: string) {
  return getProductsByCategorySlug(slug).length;
}
