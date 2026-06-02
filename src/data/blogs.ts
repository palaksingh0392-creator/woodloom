export type BlogPost = {
  slug: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  image: string;
  readTime: string;
  content: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "scandinavian-living-room-design",
    title: "How to Design a Scandinavian Living Room",
    category: "Interior Tips",
    date: "May 15, 2024",
    readTime: "5 min read",
    excerpt:
      "A calm guide to balancing wood, light, texture, and negative space in a warm modern living room.",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1400&auto=format&fit=crop",
    content: [
      "A Scandinavian living room should feel calm before it feels decorated. Start with a quiet base: warm walls, natural light, and furniture that leaves enough breathing room around every object.",
      "Wood is the anchor. Oak, walnut, and ash finishes add warmth without visual heaviness. Pair them with soft textiles so the room feels lived in rather than staged.",
      "Keep the main seating generous but simple. A sofa, lounge chair, and low coffee table are usually enough for the core layout. Add contrast through one sculptural side table or a textured rug.",
      "The final layer is light. Use floor lamps, table lamps, and indirect lighting to create evening depth. This is what makes minimal rooms feel welcoming rather than empty.",
    ],
  },
  {
    slug: "choosing-perfect-wooden-bed",
    title: "Choosing the Perfect Wooden Bed",
    category: "Guide",
    date: "May 16, 2024",
    readTime: "4 min read",
    excerpt:
      "How to think about wood type, proportions, storage, finish, and long-term comfort before choosing a bed.",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1400&auto=format&fit=crop",
    content: [
      "A wooden bed should be judged by proportion first. The frame should feel grounded, but not so heavy that it dominates the room.",
      "Choose finishes based on light. Natural oak keeps small rooms airy, while walnut adds richness to larger bedrooms with soft lighting.",
      "Storage is useful, but it should not make the bed feel bulky. For premium interiors, hidden storage and clean edges matter more than visible compartments.",
      "A good bed is a long-term piece. Look for sturdy joinery, a reliable warranty, and a finish that can age gracefully with daily use.",
    ],
  },
  {
    slug: "warm-minimalism-furniture-trend",
    title: "Warm Minimalism: A Timeless Trend",
    category: "Trends",
    date: "May 21, 2024",
    readTime: "6 min read",
    excerpt:
      "Why warm minimal interiors are replacing cold minimalism in modern Indian homes.",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1400&auto=format&fit=crop",
    content: [
      "Warm minimalism keeps the discipline of minimal design but replaces coldness with texture, craft, and natural materials.",
      "The palette is restrained: cream, ivory, warm grey, walnut, oak, and muted stone. The goal is not to remove personality, but to make every detail count.",
      "Furniture should be simple in silhouette and rich in material. Rounded corners, visible grain, and tactile fabric can make a sparse room feel emotionally complete.",
      "This approach works especially well in Indian homes because it supports both daily practicality and a polished, aspirational look.",
    ],
  },
  {
    slug: "modern-workspace-styling-ideas",
    title: "Modern Workspace Styling Ideas",
    category: "Workspace",
    date: "May 23, 2024",
    readTime: "4 min read",
    excerpt:
      "Create a focused home office with better layout, calmer materials, and furniture that supports repeated use.",
    image:
      "https://images.unsplash.com/photo-1484101403633-562f891dc89a?q=80&w=1400&auto=format&fit=crop",
    content: [
      "A good workspace should reduce friction. Keep the desk clear, place storage within reach, and avoid furniture that makes the room feel temporary.",
      "Wood adds calm to work areas because it softens screens, cables, and hard edges. Walnut and oak both pair well with black or warm metal accents.",
      "Lighting is essential. Place task lighting on the desk and use softer ambient lighting behind or beside the workspace to reduce contrast.",
      "The best home offices feel intentional even when they are compact. Choose fewer pieces, but make each one useful and visually quiet.",
    ],
  },
];

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
