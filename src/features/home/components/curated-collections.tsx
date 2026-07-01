"use client";

import Image from "next/image";
import Link from "next/link";

import { Swiper, SwiperSlide } from "swiper/react";

import { ChevronRight } from "lucide-react";

const collections = [
  {
    title: "Living Room",
    products: "12 Products",
    href: "/furniture/living-room",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop",
  },

  {
    title: "Bedroom",
    products: "10 Products",
    href: "/furniture/bedroom",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop",
  },

  {
    title: "Dining Room",
    products: "8 Products",
    href: "/furniture/dining-room",
    image:
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=1200&auto=format&fit=crop",
  },

  {
    title: "Workspace",
    products: "14 Products",
    href: "/furniture/office",
    image:
      "https://images.unsplash.com/photo-1486946255434-2466348c2166?q=80&w=1200&auto=format&fit=crop",
  },

  {
    title: "Luxury Decor",
    products: "9 Products",
    href: "/furniture/decor",
    image:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop",
  },
];

export default function CuratedCollections() {
  return (
    <section className="overflow-hidden border-t border-[var(--border)] py-16 sm:py-20">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
        {/* HEADER */}
        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p
              className="
                uppercase
                tracking-[4px]
                text-[13px]
                text-[var(--primary)]
                mb-3
              "
            >
              Curated Collections
            </p>

            <h2
              className="
                text-4xl
                max-[360px]:text-[2rem]
                lg:text-[52px]
                leading-[0.95]
                tracking-normal
                text-[var(--text-primary)]
              "
              style={{
                fontFamily: "var(--font-heading)",
              }}
            >
              Explore By Space
            </h2>
          </div>

          <Link
            href="/furniture"
            className="
              hidden md:flex
              items-center
              gap-2
              uppercase
              tracking-[2px]
              text-[13px]
            "
          >
            View All Collections
            <ChevronRight size={16} />
          </Link>
        </div>

        {/* SWIPER */}
        <Swiper
          spaceBetween={16}
          grabCursor={true}
          slidesPerView={1.03}
          resistanceRatio={0.7}
          threshold={6}
          watchOverflow={true}
          breakpoints={{
            640: {
              slidesPerView: 2.2,
              spaceBetween: 20,
            },

            1024: {
              slidesPerView: 4.2,
            },

            1400: {
              slidesPerView: 5,
            },
          }}
          className="mobile-swiper-rail"
        >
          {collections.map((item) => (
            <SwiperSlide key={item.title}>
              <Link
                href={item.href}
                className="
                  block
                  bg-[var(--surface-tinted)]
                  rounded-[18px]
                  overflow-hidden
                  group
                "
              >
                {/* IMAGE */}
                <div className="relative h-[240px] sm:h-[300px]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(min-width: 1400px) 20vw, (min-width: 1024px) 24vw, (min-width: 640px) 45vw, 85vw"
                    className="
                      object-cover
                      transition-transform
                      duration-700
                      group-hover:scale-105
                    "
                  />
                </div>

                {/* CONTENT */}
                <div className="p-5 text-center">
                  <h3
                    className="
                      text-[26px]
                      max-[360px]:text-[22px]
                      mb-2
                      text-[var(--text-primary)]
                    "
                    style={{
                      fontFamily: "var(--font-heading)",
                    }}
                  >
                    {item.title}
                  </h3>

                  <p className="text-sm text-[var(--text-secondary)] mb-4">
                    {item.products}
                  </p>

                  <div
                    className="
                      flex
                      items-center
                      justify-center
                      gap-1

                      uppercase
                      tracking-[2px]
                      text-[11px]
                    "
                  >
                    Explore
                    <ChevronRight size={14} />
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
