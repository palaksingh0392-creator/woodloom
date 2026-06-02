"use client";

import Image from "next/image";
import Link from "next/link";

import { Heart } from "lucide-react";

import type { Product } from "@/data/products";
import { commerceActions, useCommerceSelector } from "@/store/commerce-store";

export default function AccountWishlistContent({
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
      <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-7">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface-muted)] text-[var(--primary)]">
          <Heart size={22} />
        </div>

        <h2 className="mb-4 text-4xl leading-tight">No Saved Pieces Yet</h2>
        <p className="mb-8 max-w-[560px] text-[var(--text-secondary)]">
          Wishlist synchronization after login is part of the SRS. This page is
          already connected to the local wishlist store.
        </p>

        <Link
          href="/furniture"
          className="inline-flex h-14 items-center rounded-full bg-[var(--primary)] px-8 text-sm uppercase tracking-[2px] text-white"
        >
          Browse Furniture
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {wishlistProducts.map((product) => (
        <article key={product.slug}>
          <Link
            href={`/products/${product.slug}`}
            className="relative mb-5 block aspect-[4/5] overflow-hidden rounded-[22px] bg-[var(--surface-muted)]"
          >
            <Image
              src={product.images[0]}
              alt={product.title}
              fill
              sizes="(min-width: 1280px) 24vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          </Link>

          <p className="mb-2 text-xs uppercase tracking-[2px] text-[var(--text-secondary)]">
            {product.category}
          </p>
          <h2 className="mb-2 text-2xl leading-tight">{product.title}</h2>
          <p className="mb-4 text-sm text-[var(--text-secondary)]">
            {product.material}
          </p>

          <button
            onClick={() => commerceActions.toggleWishlist(product.slug)}
            className="text-sm uppercase tracking-[2px] text-[var(--primary)]"
          >
            Remove
          </button>
        </article>
      ))}
    </div>
  );
}
