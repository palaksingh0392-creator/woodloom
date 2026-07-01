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
  {
    slug: "ash-media-console",
    title: "Ash Media Console",
    category: "Living Room",
    collection: "Calm Storage Collection",
    material: "Solid Ash Wood, Cane Panels",
    dimensions: "68 W x 18 D x 24 H inches",
    warranty: "5-year craftsmanship warranty",
    careInstructions:
      "Dust with a dry cloth and keep cane panels away from excess moisture.",
    shortDescription:
      "A low media console with cane doors and warm ash grain for relaxed living rooms.",
    description:
      "Designed for entertainment walls and quiet storage, this media console pairs solid ash wood with woven cane panels for a light Scandinavian profile.",
    price: "Rs. 36,999",
    compareAtPrice: "Rs. 42,999",
    badge: "Storage Ready",
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=1400&auto=format&fit=crop",
    ],
    finishes: ["Natural Ash", "Honey Ash", "Smoked Ash"],
  },
  {
    slug: "boucle-accent-chair",
    title: "Boucle Accent Chair",
    category: "Living Room",
    collection: "Soft Accent Collection",
    material: "Boucle Fabric, Solid Wood Legs",
    dimensions: "30 W x 32 D x 33 H inches",
    warranty: "5-year frame warranty",
    careInstructions:
      "Vacuum fabric weekly and spot clean gently with mild upholstery cleaner.",
    shortDescription:
      "A rounded boucle accent chair made for reading corners and layered lounge spaces.",
    description:
      "Soft boucle upholstery, a compact footprint, and tapered wooden legs make this accent chair a natural fit for modern living rooms.",
    price: "Rs. 28,999",
    compareAtPrice: "Rs. 33,999",
    badge: "Soft Touch",
    images: [
      "https://images.unsplash.com/photo-1540574163026-643ea20ade25?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1400&auto=format&fit=crop",
    ],
    finishes: ["Ivory Boucle", "Warm Taupe", "Charcoal"],
  },
  {
    slug: "platform-storage-bed",
    title: "Platform Storage Bed",
    category: "Bedroom",
    collection: "Quiet Bedroom Collection",
    material: "Engineered Wood, Oak Veneer",
    dimensions: "78 W x 84 D x 38 H inches",
    warranty: "7-year structure warranty",
    careInstructions:
      "Wipe veneer with a dry cloth and avoid dragging the bed across the floor.",
    shortDescription:
      "A grounded platform bed with integrated storage for calm, uncluttered bedrooms.",
    description:
      "This platform bed combines a low modern silhouette with practical under-bed storage, creating a clean foundation for restful bedrooms.",
    price: "Rs. 54,999",
    compareAtPrice: "Rs. 62,999",
    badge: "Storage Bed",
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1617325710236-4a36d46427c7?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1400&auto=format&fit=crop",
    ],
    finishes: ["Natural Oak", "Walnut", "Soft White"],
  },
  {
    slug: "linen-upholstered-bed",
    title: "Linen Upholstered Bed",
    category: "Bedroom",
    collection: "Soft Sleep Collection",
    material: "Linen Fabric, Solid Wood Frame",
    dimensions: "76 W x 84 D x 44 H inches",
    warranty: "5-year frame warranty",
    careInstructions:
      "Vacuum the upholstered headboard and keep away from direct sunlight.",
    shortDescription:
      "A softly upholstered bed with a cushioned headboard for restful reading and sleep.",
    description:
      "Wrapped in textured linen, this bed brings softness to minimal bedrooms while keeping the frame sturdy and timeless.",
    price: "Rs. 49,999",
    compareAtPrice: "Rs. 58,999",
    badge: "Comfort Pick",
    images: [
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1617325710236-4a36d46427c7?q=80&w=1400&auto=format&fit=crop",
    ],
    finishes: ["Ivory Linen", "Pebble Grey", "Sand Beige"],
  },
  {
    slug: "oak-bedside-table",
    title: "Oak Bedside Table",
    category: "Bedroom",
    collection: "Quiet Bedroom Collection",
    material: "Solid Oak Wood",
    dimensions: "22 W x 18 D x 24 H inches",
    warranty: "5-year craftsmanship warranty",
    careInstructions:
      "Dust regularly and use coasters for water glasses or warm mugs.",
    shortDescription:
      "A compact bedside table with a drawer and open shelf for everyday essentials.",
    description:
      "Built from solid oak, this bedside table keeps night-time essentials close while adding gentle texture to the bedroom.",
    price: "Rs. 14,999",
    compareAtPrice: "Rs. 18,999",
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=1400&auto=format&fit=crop",
    ],
    finishes: ["Natural Oak", "Honey Oak", "Dark Oak"],
  },
  {
    slug: "slatted-wood-wardrobe",
    title: "Slatted Wood Wardrobe",
    category: "Bedroom",
    collection: "Calm Storage Collection",
    material: "Engineered Wood, Walnut Veneer",
    dimensions: "72 W x 24 D x 82 H inches",
    warranty: "7-year structure warranty",
    careInstructions:
      "Clean with a soft dry cloth and keep doors aligned by avoiding overloading.",
    shortDescription:
      "A spacious wardrobe with slatted fronts for warm bedroom storage.",
    description:
      "This wardrobe uses vertical slatted fronts and generous internal storage to keep bedrooms organized without feeling heavy.",
    price: "Rs. 74,999",
    compareAtPrice: "Rs. 86,999",
    badge: "Large Storage",
    images: [
      "https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1400&auto=format&fit=crop",
    ],
    finishes: ["Walnut", "Smoked Walnut", "Natural Oak"],
  },
  {
    slug: "low-dresser-six-drawer",
    title: "Low Six Drawer Dresser",
    category: "Bedroom",
    collection: "Calm Storage Collection",
    material: "Ash Wood, Soft Close Hardware",
    dimensions: "62 W x 20 D x 32 H inches",
    warranty: "5-year craftsmanship warranty",
    careInstructions:
      "Wipe with a soft cloth and avoid abrasive cleaners on drawer fronts.",
    shortDescription:
      "A low dresser with six drawers for folded storage and bedroom styling.",
    description:
      "Clean proportions, soft close drawers, and a broad display surface make this dresser a practical bedroom anchor.",
    price: "Rs. 42,999",
    compareAtPrice: "Rs. 49,999",
    images: [
      "https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1400&auto=format&fit=crop",
    ],
    finishes: ["Natural Ash", "Whitewashed Ash", "Charcoal Ash"],
  },
  {
    slug: "round-oak-dining-table",
    title: "Round Oak Dining Table",
    category: "Dining Room",
    collection: "Gather Dining Collection",
    material: "Solid Oak Wood",
    dimensions: "54 W x 54 D x 30 H inches",
    warranty: "7-year craftsmanship warranty",
    careInstructions:
      "Use placemats for hot serveware and wipe spills immediately.",
    shortDescription:
      "A round oak dining table designed for easy conversation and compact homes.",
    description:
      "The pedestal base and round top create comfortable seating flow while preserving the warmth of solid oak.",
    price: "Rs. 44,999",
    compareAtPrice: "Rs. 52,999",
    badge: "Family Favorite",
    images: [
      "https://images.unsplash.com/photo-1517705008128-361805f42e86?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1400&auto=format&fit=crop",
    ],
    finishes: ["Natural Oak", "Honey Oak", "Deep Oak"],
  },
  {
    slug: "woven-dining-chair-pair",
    title: "Woven Dining Chair Pair",
    category: "Dining Room",
    collection: "Gather Dining Collection",
    material: "Solid Wood, Woven Cane Seat",
    dimensions: "20 W x 22 D x 32 H inches each",
    warranty: "5-year craftsmanship warranty",
    careInstructions:
      "Dust cane gently and avoid standing on woven surfaces.",
    shortDescription:
      "A pair of light dining chairs with woven seats and sculpted wooden frames.",
    description:
      "These dining chairs balance durability and softness through solid wood frames and breathable woven cane seats.",
    price: "Rs. 21,999",
    compareAtPrice: "Rs. 26,999",
    images: [
      "https://images.unsplash.com/photo-1517705008128-361805f42e86?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1400&auto=format&fit=crop",
    ],
    finishes: ["Natural Cane", "Walnut Cane", "Black Oak"],
  },
  {
    slug: "walnut-sideboard",
    title: "Walnut Sideboard",
    category: "Dining Room",
    collection: "Hosting Storage Collection",
    material: "Solid Walnut, Brass Pulls",
    dimensions: "72 W x 18 D x 34 H inches",
    warranty: "5-year craftsmanship warranty",
    careInstructions:
      "Dust regularly and polish brass pulls with a dry microfiber cloth.",
    shortDescription:
      "A refined sideboard for dinnerware, linen storage, and dining room display.",
    description:
      "With generous concealed storage and warm walnut grain, this sideboard supports hosting without clutter.",
    price: "Rs. 58,999",
    compareAtPrice: "Rs. 68,999",
    badge: "Premium Storage",
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517705008128-361805f42e86?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=1400&auto=format&fit=crop",
    ],
    finishes: ["Natural Walnut", "Smoked Walnut", "Dark Walnut"],
  },
  {
    slug: "extendable-dining-bench",
    title: "Extendable Dining Bench",
    category: "Dining Room",
    collection: "Gather Dining Collection",
    material: "Solid Acacia Wood",
    dimensions: "58 W x 16 D x 18 H inches",
    warranty: "5-year craftsmanship warranty",
    careInstructions:
      "Clean with a soft cloth and tighten hardware every six months.",
    shortDescription:
      "A flexible dining bench for family seating, entryways, or casual hosting.",
    description:
      "Built from solid acacia, this dining bench brings relaxed seating and can tuck neatly under most dining tables.",
    price: "Rs. 19,999",
    compareAtPrice: "Rs. 23,999",
    images: [
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517705008128-361805f42e86?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=1400&auto=format&fit=crop",
    ],
    finishes: ["Natural Acacia", "Walnut Stain", "Matte Black"],
  },
  {
    slug: "walnut-writing-desk",
    title: "Walnut Writing Desk",
    category: "Office",
    collection: "Focused Workspace Collection",
    material: "Solid Walnut Wood",
    dimensions: "54 W x 24 D x 30 H inches",
    warranty: "5-year craftsmanship warranty",
    careInstructions:
      "Use a desk mat for writing tools and wipe with a dry cloth.",
    shortDescription:
      "A slim walnut writing desk for focused work and warm home offices.",
    description:
      "This writing desk keeps the profile light while offering a generous work surface and clean cable-friendly storage.",
    price: "Rs. 34,999",
    compareAtPrice: "Rs. 39,999",
    badge: "Workspace Pick",
    images: [
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1486946255434-2466348c2166?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1400&auto=format&fit=crop",
    ],
    finishes: ["Natural Walnut", "Smoked Walnut", "Matte Brown"],
  },
  {
    slug: "ergonomic-work-chair",
    title: "Ergonomic Work Chair",
    category: "Office",
    collection: "Focused Workspace Collection",
    material: "Molded Plywood, Performance Fabric",
    dimensions: "25 W x 25 D x 36 H inches",
    warranty: "5-year mechanism warranty",
    careInstructions:
      "Vacuum fabric and keep moving parts free of dust.",
    shortDescription:
      "A supportive work chair with a warm wood shell and soft upholstered seat.",
    description:
      "Made for long desk sessions, this chair blends ergonomic support with a residential look that suits home offices.",
    price: "Rs. 22,999",
    compareAtPrice: "Rs. 27,999",
    images: [
      "https://images.unsplash.com/photo-1486946255434-2466348c2166?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1540574163026-643ea20ade25?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1400&auto=format&fit=crop",
    ],
    finishes: ["Oak Shell", "Walnut Shell", "Black Shell"],
  },
  {
    slug: "modular-office-shelf",
    title: "Modular Office Shelf",
    category: "Office",
    collection: "Focused Workspace Collection",
    material: "Powder Coated Steel, Oak Shelves",
    dimensions: "36 W x 14 D x 72 H inches",
    warranty: "5-year craftsmanship warranty",
    careInstructions:
      "Dust shelves weekly and avoid overloading upper tiers.",
    shortDescription:
      "A tall modular shelf for books, files, plants, and workspace styling.",
    description:
      "Open oak shelves and a slim steel frame keep office storage organized while preserving a light visual footprint.",
    price: "Rs. 29,999",
    compareAtPrice: "Rs. 34,999",
    images: [
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1486946255434-2466348c2166?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1400&auto=format&fit=crop",
    ],
    finishes: ["Oak Black", "Walnut Black", "Oak White"],
  },
  {
    slug: "compact-study-table",
    title: "Compact Study Table",
    category: "Office",
    collection: "Small Space Workspace",
    material: "Engineered Wood, Ash Veneer",
    dimensions: "42 W x 22 D x 30 H inches",
    warranty: "3-year craftsmanship warranty",
    careInstructions:
      "Use coasters and avoid standing water on the veneer surface.",
    shortDescription:
      "A compact study table for apartments, bedrooms, and flexible work corners.",
    description:
      "Designed for smaller homes, this study table includes a tidy drawer and a simple surface for daily work.",
    price: "Rs. 18,999",
    compareAtPrice: "Rs. 22,999",
    badge: "Small Space",
    images: [
      "https://images.unsplash.com/photo-1486946255434-2466348c2166?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=1400&auto=format&fit=crop",
    ],
    finishes: ["Natural Ash", "White Ash", "Walnut Ash"],
  },
  {
    slug: "drawer-file-cabinet",
    title: "Three Drawer File Cabinet",
    category: "Office",
    collection: "Focused Workspace Collection",
    material: "Oak Veneer, Soft Close Hardware",
    dimensions: "18 W x 20 D x 25 H inches",
    warranty: "3-year hardware warranty",
    careInstructions:
      "Wipe with a dry cloth and keep drawer loads evenly distributed.",
    shortDescription:
      "A compact file cabinet that fits under desks and stores documents neatly.",
    description:
      "Soft close drawers, warm veneer, and compact proportions make this cabinet a polished office storage piece.",
    price: "Rs. 16,999",
    compareAtPrice: "Rs. 20,999",
    images: [
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1486946255434-2466348c2166?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1400&auto=format&fit=crop",
    ],
    finishes: ["Natural Oak", "Walnut", "Graphite"],
  },
  {
    slug: "marble-accent-table",
    title: "Marble Accent Table",
    category: "Decor",
    collection: "Accent Essentials",
    material: "Marble Top, Metal Base",
    dimensions: "16 W x 16 D x 21 H inches",
    warranty: "3-year craftsmanship warranty",
    careInstructions:
      "Wipe marble with a damp cloth and avoid acidic cleaners.",
    shortDescription:
      "A compact marble accent table for sofas, lounge chairs, and styled corners.",
    description:
      "Natural marble veining and a slim metal base create a sculptural accent for modern interiors.",
    price: "Rs. 15,999",
    compareAtPrice: "Rs. 19,999",
    badge: "Natural Stone",
    images: [
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1400&auto=format&fit=crop",
    ],
    finishes: ["White Marble", "Green Marble", "Black Marble"],
  },
  {
    slug: "arched-floor-mirror",
    title: "Arched Floor Mirror",
    category: "Decor",
    collection: "Reflective Accents",
    material: "Solid Wood Frame, Mirror Glass",
    dimensions: "32 W x 2 D x 72 H inches",
    warranty: "3-year frame warranty",
    careInstructions:
      "Clean mirror glass with a soft cloth and keep the frame dry.",
    shortDescription:
      "A tall arched mirror with a wooden frame for bedrooms and entryways.",
    description:
      "This arched floor mirror adds height, light, and a quiet architectural note to calm interiors.",
    price: "Rs. 24,999",
    compareAtPrice: "Rs. 29,999",
    images: [
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1400&auto=format&fit=crop",
    ],
    finishes: ["Natural Oak", "Walnut", "Matte Black"],
  },
  {
    slug: "sculpted-wood-stool",
    title: "Sculpted Wood Stool",
    category: "Decor",
    collection: "Accent Essentials",
    material: "Solid Mango Wood",
    dimensions: "15 W x 15 D x 18 H inches",
    warranty: "3-year craftsmanship warranty",
    careInstructions:
      "Dust regularly and avoid prolonged exposure to direct sunlight.",
    shortDescription:
      "A small sculpted stool for accent seating, plant styling, or bedside use.",
    description:
      "Hand-shaped from mango wood, this stool adds organic form and flexible function to styled spaces.",
    price: "Rs. 9,999",
    compareAtPrice: "Rs. 12,999",
    badge: "Hand Finished",
    images: [
      "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1400&auto=format&fit=crop",
    ],
    finishes: ["Natural Mango", "Smoked Mango", "Black Wash"],
  },
  {
    slug: "textured-console-table",
    title: "Textured Console Table",
    category: "Decor",
    collection: "Entryway Accents",
    material: "Ash Wood, Reeded Fronts",
    dimensions: "48 W x 14 D x 32 H inches",
    warranty: "5-year craftsmanship warranty",
    careInstructions:
      "Wipe with a dry cloth and avoid placing wet objects directly on the top.",
    shortDescription:
      "A slim console table with reeded fronts for entryways and hallway styling.",
    description:
      "This console table offers a narrow footprint, subtle storage, and tactile wood texture for finishing transitional spaces.",
    price: "Rs. 31,999",
    compareAtPrice: "Rs. 38,999",
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1400&auto=format&fit=crop",
    ],
    finishes: ["Natural Ash", "Warm Walnut", "Charcoal"],
  },
];

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}
