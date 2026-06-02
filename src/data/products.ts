export type Product = {
  slug: string;
  title: string;
  category: string;
  collection: string;
  material: string;
  dimensions: string;
  warranty: string;
  careInstructions: string;
  shortDescription: string;
  description: string;
  price: string;
  compareAtPrice?: string;
  badge?: string;
  images: string[];
  finishes: string[];
};

export const products: Product[] = [
  {
    slug: "nordic-lounge-chair",
    title: "Nordic Lounge Chair",
    category: "Living Room",
    collection: "Scandinavian Lounge Collection",
    material: "Solid Wood, Linen Fabric",
    dimensions: "32 W x 34 D x 35 H inches",
    warranty: "5-year craftsmanship warranty",
    careInstructions:
      "Vacuum upholstery regularly and wipe wooden surfaces with a soft dry cloth.",
    shortDescription:
      "A warm Scandinavian lounge chair crafted for quiet reading corners and modern living rooms.",
    description:
      "Crafted with premium solid wood and soft linen upholstery, this lounge chair combines Scandinavian minimalism with timeless comfort for elegant interiors.",
    price: "Rs. 24,999",
    compareAtPrice: "Rs. 29,999",
    badge: "Best Seller",
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1484101403633-562f891dc89a?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1400&auto=format&fit=crop",
    ],
    finishes: ["Natural Oak", "Walnut", "Dark Ash"],
  },
  {
    slug: "walnut-dining-table",
    title: "Walnut Dining Table",
    category: "Dining Room",
    collection: "Modern Dining Collection",
    material: "Solid Walnut Wood",
    dimensions: "72 W x 36 D x 30 H inches",
    warranty: "7-year craftsmanship warranty",
    careInstructions:
      "Use coasters and placemats. Clean with a dry microfiber cloth after use.",
    shortDescription:
      "A refined walnut dining table designed for warm gatherings and everyday luxury.",
    description:
      "Built from solid walnut wood with a smooth natural finish, this dining table brings architectural simplicity and lasting strength to modern homes.",
    price: "Rs. 48,999",
    compareAtPrice: "Rs. 56,999",
    badge: "Premium Pick",
    images: [
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517705008128-361805f42e86?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1400&auto=format&fit=crop",
    ],
    finishes: ["Natural Walnut", "Smoked Walnut", "Matte Brown"],
  },
  {
    slug: "linen-sofa-3-seater",
    title: "Linen Sofa 3 Seater",
    category: "Living Room",
    collection: "Soft Living Collection",
    material: "Premium Fabric, Solid Wood",
    dimensions: "84 W x 36 D x 34 H inches",
    warranty: "5-year frame warranty",
    careInstructions:
      "Vacuum weekly. Blot spills immediately with a clean absorbent cloth.",
    shortDescription:
      "A generous linen sofa with relaxed proportions and a grounded wooden base.",
    description:
      "Designed for slow evenings and refined lounging, this three-seater sofa pairs premium linen fabric with a sturdy solid wood frame.",
    price: "Rs. 69,999",
    compareAtPrice: "Rs. 79,999",
    badge: "New Arrival",
    images: [
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1400&auto=format&fit=crop",
    ],
    finishes: ["Ivory Linen", "Warm Grey", "Sand Beige"],
  },
  {
    slug: "oak-coffee-table",
    title: "Oak Coffee Table",
    category: "Living Room",
    collection: "Everyday Oak Collection",
    material: "Solid Oak Wood",
    dimensions: "42 W x 24 D x 16 H inches",
    warranty: "5-year craftsmanship warranty",
    careInstructions:
      "Dust regularly and avoid placing hot objects directly on the surface.",
    shortDescription:
      "A low, clean-lined oak coffee table for calm living spaces.",
    description:
      "With solid oak construction and a minimal silhouette, this coffee table adds practical warmth to lounge areas without visual clutter.",
    price: "Rs. 18,999",
    compareAtPrice: "Rs. 22,999",
    badge: "Limited Stock",
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1484101403633-562f891dc89a?q=80&w=1400&auto=format&fit=crop",
    ],
    finishes: ["Natural Oak", "Honey Oak", "Charcoal Oak"],
  },
  {
    slug: "minimal-side-table",
    title: "Minimal Side Table",
    category: "Decor",
    collection: "Accent Essentials",
    material: "Natural Stone Finish",
    dimensions: "18 W x 18 D x 22 H inches",
    warranty: "3-year craftsmanship warranty",
    careInstructions:
      "Clean with a damp cloth and dry immediately. Avoid abrasive cleaners.",
    shortDescription:
      "A sculptural side table with a compact profile and natural stone character.",
    description:
      "This minimal side table is built for bedside corners, lounge accents, and quiet styling moments where texture matters.",
    price: "Rs. 12,999",
    compareAtPrice: "Rs. 15,999",
    badge: "Editor's Pick",
    images: [
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1484101403633-562f891dc89a?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1400&auto=format&fit=crop",
    ],
    finishes: ["Travertine", "Warm Stone", "Graphite"],
  },
];

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}
