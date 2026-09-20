"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";

import type { CatalogCollectionCard } from "@/lib/catalog";

export default function CuratedCollections({
  collections,
}: {
  collections: CatalogCollectionCard[];
}) {
  const swiperRef = useRef<SwiperType | null>(null);

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

          <div className="flex items-center gap-3">
            <Link
              href="/furniture"
              className="hidden items-center gap-2 uppercase tracking-[2px] text-[13px] md:flex"
            >
              View All Collections
              <ChevronRight size={16} />
            </Link>
            <button
              type="button"
              aria-label="View previous collections"
              onClick={() => swiperRef.current?.slidePrev()}
              className="hidden h-11 w-11 items-center justify-center rounded-full border bg-[var(--surface)] transition hover:border-[var(--primary)] md:flex"
            >
              <ChevronLeft size={19} />
            </button>
            <button
              type="button"
              aria-label="View more collections"
              onClick={() => swiperRef.current?.slideNext()}
              className="hidden h-11 w-11 items-center justify-center rounded-full border bg-[var(--surface)] transition hover:border-[var(--primary)] md:flex"
            >
              <ChevronRight size={19} />
            </button>
          </div>
        </div>

        {/* SWIPER */}
        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
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
              slidesPerView: 4.35,
            },

            1400: {
              slidesPerView: 5.25,
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
                  flex
                  flex-col
                  h-full
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
                <div className="flex h-[160px] flex-col p-5 text-center">
                  <h3
                    className="
                      line-clamp-2
                      min-h-[58px]
                      text-[24px]
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

                  <p className="mb-4 text-sm text-[var(--text-secondary)]">
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
