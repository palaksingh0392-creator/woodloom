"use client";

import { useRef } from "react";

import Image from "next/image";
import Link from "next/link";

import { ChevronLeft, ChevronRight, Heart } from "lucide-react";

import type { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import type { Product } from "@/data/products";
import {
  commerceActions,
  useCommerceSelector,
} from "@/store/commerce-store";

import "swiper/css";

export default function FeaturedProducts({ products }: { products: Product[] }) {
  const swiperRef = useRef<SwiperType | null>(null);
  const wishlistSlugs = useCommerceSelector(
    (currentState) => currentState.wishlistSlugs,
  );

  return (
    <section
      className="
        border-t
        border-[var(--border)]
        py-16
        sm:py-20
        lg:py-24
        overflow-hidden
      "
    >
      <div
        className="
          max-w-[1600px]
          mx-auto
          px-4
          sm:px-6
          lg:px-10
        "
      >
        <div
          className="
            flex
            flex-col
            gap-5
            sm:flex-row
            sm:items-end
            items-center
            justify-between
            mb-12
          "
        >
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
              Featured Products
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
              Crafted For Luxury Living
            </h2>
          </div>

          <Link
            href="/products"
            className="
              hidden
              md:flex
              items-center
              gap-2
              uppercase
              tracking-[2px]
              text-[13px]
              hover:opacity-70
              transition
            "
          >
            View All Products
            <ChevronRight size={16} />
          </Link>
        </div>

        <div className="relative">
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="
              absolute
              left-[-10px]
              top-[35%]
              z-20
              hidden
              md:flex
              w-14
              h-14
              rounded-full
              bg-[var(--surface)]
              text-[var(--text-primary)]
              shadow-md
              items-center
              justify-center
              hover:scale-105
              transition
            "
          >
            <ChevronLeft size={22} />
          </button>

          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="
              absolute
              right-[-10px]
              top-[35%]
              z-20
              hidden
              md:flex
              w-14
              h-14
              rounded-full
              bg-[var(--surface)]
              text-[var(--text-primary)]
              shadow-md
              items-center
              justify-center
              hover:scale-105
              transition
            "
          >
            <ChevronRight size={22} />
          </button>

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
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 3.2,
              },
              1400: {
                slidesPerView: 4.2,
              },
            }}
            className="mobile-swiper-rail"
          >
            {products.map((product) => {
              const liked = wishlistSlugs.includes(product.slug);

              return (
                <SwiperSlide key={product.slug}>
                  <Link
                    href={`/products/${product.slug}`}
                    className="group block"
                  >
                    <div
                      className="
                        relative
                        h-[320px]
                        sm:h-[380px]
                        lg:h-[420px]
                        rounded-[18px]
                        sm:rounded-[28px]
                        overflow-hidden
                        bg-[var(--surface-muted)]
                      "
                    >
                      <Image
                        src={product.images[0]}
                        alt={product.title}
                        fill
                        sizes="(min-width: 1400px) 24vw, (min-width: 1024px) 31vw, (min-width: 640px) 45vw, 85vw"
                        className="
                          object-cover
                          transition-transform
                          duration-700
                          group-hover:scale-105
                        "
                      />

                      <div
                        className="
                          absolute
                          inset-0
                          bg-gradient-to-t
                          from-black/35
                          via-black/5
                          to-transparent
                        "
                      />

                      <button
                        onClick={(event) => {
                          event.preventDefault();
                          commerceActions.toggleWishlist(product.slug);
                        }}
                        className="
                          absolute
                          top-5
                          right-5
                          w-12
                          h-12
                          rounded-full
                          bg-[var(--surface-overlay)]
                          text-[var(--text-primary)]
                          flex
                          items-center
                          justify-center
                          shadow-md
                          hover:scale-110
                          transition
                        "
                      >
                        <Heart
                          size={20}
                          className={
                            liked ? "fill-current" : ""
                          }
                        />
                      </button>
                    </div>

                    <div className="pt-6">
                      <h3
                        className="
                          text-[24px]
                          max-[360px]:text-[21px]
                          mb-2
                          text-[var(--text-primary)]
                        "
                        style={{
                          fontFamily: "var(--font-heading)",
                        }}
                      >
                        {product.title}
                      </h3>

                      <p
                        className="
                          text-[var(--text-secondary)]
                          mb-3
                        "
                      >
                        {product.material}
                      </p>

                      <p
                        className="
                          text-[24px]
                          sm:text-[30px]
                          text-[var(--text-primary)]
                        "
                      >
                        {product.price}
                      </p>
                    </div>
                  </Link>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
