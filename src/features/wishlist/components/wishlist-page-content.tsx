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

        <h1 className="text-4xl sm:text-5xl lg:text-6xl leading-[1] font-serif mb-8">
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

        <h1 className="text-4xl sm:text-5xl lg:text-6xl leading-[1] font-serif">
          Saved For Later
        </h1>
      </div>

      <div className="grid max-w-[920px] gap-6">
        {wishlistProducts.map((product) => (
          <article
            key={product.slug}
            className="grid gap-6 rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-5 sm:grid-cols-[150px_1fr]"
          >
            <Link
              href={`/products/${product.slug}`}
              className="relative aspect-square overflow-hidden rounded-[22px] bg-[var(--surface-muted)]"
            >
              <Image
                src={product.images[0]}
                alt={product.title}
                fill
                sizes="150px"
                className="object-cover"
              />
            </Link>

            <div className="flex flex-col justify-between gap-6">
              <div>
                <p className="mb-2 text-sm uppercase tracking-[2px] text-[var(--text-secondary)]">
                  {product.finishes[0] ?? product.category}
                </p>

                <Link href={`/products/${product.slug}`}>
                  <h2 className="mb-3 font-serif text-2xl sm:text-3xl">
                    {product.title}
                  </h2>
                </Link>

                <p className="text-xl font-semibold">{product.price}</p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <button
                  type="button"
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
                    inline-flex h-11 items-center gap-2 rounded-full bg-[var(--primary)] px-5 text-sm uppercase tracking-[1px] text-white
                  "
                >
                  <ShoppingBag size={18} />
                  Add to cart
                </button>

                <button
                  type="button"
                  onClick={() => commerceActions.toggleWishlist(product.slug)}
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-[var(--border)] px-4 text-sm uppercase tracking-[1px]"
                  aria-label="Remove from wishlist"
                >
                  <Heart size={18} className="fill-current" />
                  Remove
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
