"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const inspirations = [
  {
    title: "Scandinavian Living",
    products: "12 Products",
    href: "/furniture/living-room",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Warm Minimal Bedroom",
    products: "10 Products",
    href: "/furniture/bedroom",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Modern Walnut Workspace",
    products: "8 Products",
    href: "/furniture/office",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Earthy Luxury Interiors",
    products: "14 Products",
    href: "/furniture/living-room",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Calm Neutral Lounge",
    products: "9 Products",
    href: "/furniture/living-room",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1200&auto=format&fit=crop",
  },
];

export default function RoomInspiration() {
  return (
    <section className="py-20 border-t border-[var(--border)] overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[14px] tracking-[3px] uppercase font-medium text-[var(--text-primary)]">
            Room Inspiration
          </h2>

          <Link
            href="/inspiration"
            className="flex items-center gap-2 text-[13px] uppercase tracking-[2px] hover:opacity-70 transition"
          >
            View All Inspiration
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* SWIPER STYLE ROW */}
        <div
          className="
            flex
            gap-5
            overflow-x-auto
            scrollbar-hide
            snap-x
            snap-mandatory
            pb-2
          "
        >
          {inspirations.map((item) => (
            <Link
              href={item.href}
              key={item.title}
              className="
                relative
                min-w-[320px]
                md:min-w-[360px]
                h-[220px]
                rounded-[12px]
                overflow-hidden
                group
                snap-start
                flex-shrink-0
              "
            >
              {/* IMAGE */}
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(min-width: 768px) 360px, 320px"
                className="
                  object-cover
                  transition-transform
                  duration-700
                  group-hover:scale-105
                "
              />

              {/* OVERLAY */}
              <div className="absolute inset-0 bg-black/35" />

              {/* CONTENT */}
              <div className="absolute bottom-5 left-5 z-10 text-white">
                <h3 className="text-[24px] font-medium mb-1 leading-none">
                  {item.title}
                </h3>

                <p className="text-sm text-white/80">{item.products}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
