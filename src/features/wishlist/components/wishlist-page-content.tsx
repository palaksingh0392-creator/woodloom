"use client";

import Image from "next/image";
import Link from "next/link";

import { Heart, ShoppingBag } from "lucide-react";

import type { Product } from "@/data/products";
import {
  commerceActions,
  useCommerceSelector,
} from "@/store/commerce-store";

export default function WishlistPageContent({
  products,
}: {
  products: Product[];
}) {
  const wishlistSlugs = useCommerceSelector((state) => state.wishlistSlugs);
  const wishlistProducts = products.filter((product) =>
    wishlistSlugs.includes(product.slug),
  );

  if (wishlistProducts.length === 0) {
    return (
      <div className="max-w-[1440px] mx-auto px-5 sm:px-6 lg:px-10 py-20 lg:py-24">
        <p className="uppercase tracking-[4px] text-sm text-[var(--primary)] mb-4">
          Wishlist
        </p>

        <h1 className="text-4xl sm:text-5xl lg:text-7xl leading-[0.95] font-serif mb-8">
          Save Pieces You Love
        </h1>

        <Link
          href="/products"
          className="
            inline-flex
            h-14
            items-center
            rounded-full
            bg-[var(--primary)]
            px-8
            text-sm
            uppercase
            tracking-[2px]
            text-white
          "
        >
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-5 sm:px-6 lg:px-10 py-14 lg:py-20">
      <div className="mb-12">
        <p className="uppercase tracking-[4px] text-sm text-[var(--primary)] mb-4">
          Wishlist
        </p>

        <h1 className="text-4xl sm:text-5xl lg:text-7xl leading-[0.95] font-serif">
          Saved For Later
        </h1>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {wishlistProducts.map((product) => (
          <article key={product.slug} className="group">
            <Link
              href={`/products/${product.slug}`}
              className="
                relative
                block
                aspect-[4/5]
                overflow-hidden
                rounded-[28px]
                bg-[var(--surface-muted)]
                mb-5
              "
            >
              <Image
                src={product.images[0]}
                alt={product.title}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="
                  object-cover
                  transition-transform
                  duration-700
                  group-hover:scale-105
                "
              />
            </Link>

            <p className="uppercase tracking-[2px] text-xs text-[var(--text-secondary)] mb-2">
              {product.category}
            </p>

            <Link href={`/products/${product.slug}`}>
              <h2 className="text-3xl font-serif mb-2">{product.title}</h2>
            </Link>

            <p className="text-[var(--text-secondary)] mb-4">
              {product.material}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-xl font-semibold">{product.price}</p>

              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    commerceActions.addToCart({
                      productSlug: product.slug,
                      title: product.title,
                      price: product.price,
                      image: product.images[0],
                      finish: product.finishes[0],
                    })
                  }
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-full
                    bg-[var(--primary)]
                    text-white
                  "
                  aria-label="Add to cart"
                >
                  <ShoppingBag size={18} />
                </button>

                <button
                  onClick={() => commerceActions.toggleWishlist(product.slug)}
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[var(--border)]
                  "
                  aria-label="Remove from wishlist"
                >
                  <Heart size={18} className="fill-current" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
