import Image from "next/image";
import Link from "next/link";

import MainLayout from "@/components/layout/main-layout";

const inspirations = [
  {
    title: "Scandinavian Living",
    description:
      "Layer soft textures, pale wood, and low-profile seating for a calm living room.",
    products: "12 Products",
    href: "/furniture/living-room",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1600&auto=format&fit=crop",
  },
  {
    title: "Warm Minimal Bedroom",
    description:
      "Use quiet silhouettes, storage-led pieces, and warm timber for a restful bedroom.",
    products: "10 Products",
    href: "/furniture/bedroom",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1600&auto=format&fit=crop",
  },
  {
    title: "Modern Walnut Workspace",
    description:
      "Build a focused workspace with walnut finishes, compact shelving, and ergonomic comfort.",
    products: "8 Products",
    href: "/furniture/office",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1600&auto=format&fit=crop",
  },
  {
    title: "Earthy Luxury Interiors",
    description:
      "Balance statement furniture with grounded neutrals, layered rugs, and tactile surfaces.",
    products: "14 Products",
    href: "/furniture/living-room",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1600&auto=format&fit=crop",
  },
  {
    title: "Calm Neutral Lounge",
    description:
      "Create an easy lounge mood with rounded forms, linen upholstery, and natural oak.",
    products: "9 Products",
    href: "/furniture/living-room",
    image:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1600&auto=format&fit=crop",
  },
];

export const metadata = {
  title: "Room Inspiration | WOODLOOM",
  description:
    "Explore room styling ideas and curated furniture edits from WOODLOOM.",
};

export default function InspirationPage() {
  return (
    <MainLayout>
      <section className="mx-auto max-w-[1440px] px-5 py-14 sm:px-6 lg:px-10 lg:py-20">
        <div className="mb-12 max-w-[760px]">
          <p className="mb-4 text-sm uppercase tracking-[4px] text-[var(--primary)]">
            Room Inspiration
          </p>

          <h1 className="mb-6 text-4xl leading-[0.95] sm:text-5xl lg:text-7xl">
            Furniture Ideas For Every Room
          </h1>

          <p className="text-[17px] leading-relaxed text-[var(--text-secondary)]">
            Browse curated room edits, material pairings, and practical
            furniture combinations for warm modern homes.
          </p>
        </div>

        <div className="grid gap-7 md:grid-cols-2">
          {inspirations.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group overflow-hidden rounded-[24px] border border-[var(--border)] bg-[var(--surface)]"
            >
              <div className="relative aspect-[16/10] bg-[var(--surface-muted)]">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <div className="p-6">
                <p className="mb-3 text-xs uppercase tracking-[3px] text-[var(--primary)]">
                  {item.products}
                </p>
                <h2 className="mb-3 text-3xl leading-tight">{item.title}</h2>
                <p className="leading-relaxed text-[var(--text-secondary)]">
                  {item.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </MainLayout>
  );
}
