"use client";

import Image from "next/image";
import Link from "next/link";

import { ArrowRight, Heart } from "lucide-react";

import type { Product } from "@/data/products";
import {
  commerceActions,
  useCommerceSelector,
} from "@/store/commerce-store";

export default function EditorsPicks({ products }: { products: Product[] }) {
  const editorProducts = products.slice().reverse();
  const wishlistSlugs = useCommerceSelector(
    (currentState) => currentState.wishlistSlugs,
  );

  return (
    <section className="pb-24 overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[14px] tracking-[3px] uppercase font-medium text-[var(--text-primary)]">
            Editor&apos;s Picks
          </h2>

          <Link
            href="/products"
            className="flex items-center gap-2 text-[13px] uppercase tracking-[2px] hover:opacity-70 transition"
          >
            View All Picks
            <ArrowRight size={16} />
          </Link>
        </div>

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
          {editorProducts.map((product) => {
            const liked = wishlistSlugs.includes(product.slug);

            return (
              <div
                key={product.slug}
                className="
                  min-w-[250px]
                  md:min-w-[270px]
                  flex-shrink-0
                  snap-start
                "
              >
                <div className="group">
                  <div className="relative">
                    <Link
                      href={`/products/${product.slug}`}
                      className="
                        relative
                        block
                        h-[300px]
                        rounded-[14px]
                        overflow-hidden
                        bg-[var(--surface-muted)]
                      "
                    >
                      <Image
                        src={product.images[0]}
                        alt={product.title}
                        fill
                        sizes="(min-width: 768px) 270px, 250px"
                        className="
                          object-cover
                          group-hover:scale-105
                          transition-transform
                          duration-700
                        "
                      />
                    </Link>

                    <button
                      onClick={() =>
                        commerceActions.toggleWishlist(product.slug)
                      }
                      className="
                        absolute
                        top-4
                        right-4
                        w-11
                        h-11
                        rounded-full
                        bg-[var(--surface-overlay)]
                        text-[var(--text-primary)]
                        flex
                        items-center
                        justify-center
                        shadow-sm
                        z-20
                      "
                    >
                      <Heart
                        size={18}
                        className={
                          liked ? "fill-current" : ""
                        }
                      />
                    </button>
                  </div>

                  <div className="pt-5">
                    <Link href={`/products/${product.slug}`}>
                      <h3 className="text-[30px] leading-none mb-3 font-serif hover:opacity-70 transition">
                        {product.title}
                      </h3>
                    </Link>

                    <p className="text-[16px] text-[var(--text-secondary)] mb-4">
                      {product.material}
                    </p>

                    <p className="text-[20px] font-medium">{product.price}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center gap-2 mt-10">
          <div className="w-2 h-2 rounded-full bg-[var(--text-primary)]" />
          <div className="w-2 h-2 rounded-full bg-[var(--border)]" />
          <div className="w-2 h-2 rounded-full bg-[var(--border)]" />
        </div>
      </div>
    </section>
  );
}
