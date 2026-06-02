"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import { ArrowRight, Search } from "lucide-react";

import type { Category } from "@/data/categories";
import type { Product } from "@/data/products";

const trendingSearches = [
  "wooden sofa",
  "walnut dining table",
  "oak coffee table",
  "living room",
  "side table",
];

function normalize(value: string) {
  return value.toLowerCase().trim();
}

type SearchPageContentProps = {
  categories: Category[];
  products: Product[];
};

function productText(product: Product) {
  return [
    product.title,
    product.category,
    product.collection,
    product.material,
    product.description,
    product.finishes.join(" "),
  ]
    .join(" ")
    .toLowerCase();
}

export default function SearchPageContent({
  categories,
  products,
}: SearchPageContentProps) {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const normalizedQuery = normalize(query);

  const matchingProducts = useMemo(() => {
    if (!normalizedQuery) {
      return products;
    }

    return products.filter((product) =>
      productText(product).includes(normalizedQuery),
    );
  }, [normalizedQuery, products]);

  const matchingCategories = useMemo(() => {
    if (!normalizedQuery) {
      return categories;
    }

    return categories.filter((category) =>
      [category.title, category.shortTitle, category.description]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [categories, normalizedQuery]);

  return (
    <section className="mx-auto max-w-[1440px] px-5 py-14 sm:px-6 lg:px-10 lg:py-20">
      <div className="mb-10">
        <p className="mb-4 text-sm uppercase tracking-[4px] text-[var(--primary)]">
          Search WOODLOOM
        </p>

        <h1 className="mb-6 max-w-[760px] text-4xl leading-[0.95] sm:text-5xl lg:text-7xl">
          Find The Right Piece For Your Space
        </h1>

        <p className="max-w-[640px] text-[17px] leading-relaxed text-[var(--text-secondary)]">
          Search by room, material, finish, product type, or collection. This is
          the MVP search layer before instant API suggestions and typo
          correction are added.
        </p>
      </div>

      <div
        className="
          mb-8
          flex
          items-center
          gap-4
          rounded-full
          border
          border-[var(--border)]
          bg-[var(--surface)]
          px-5
          py-3
          shadow-[0_18px_60px_var(--shadow-soft)]
        "
      >
        <Search size={22} className="shrink-0 text-[var(--text-secondary)]" />

        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search sofas, walnut, decor, living room..."
          className="
            h-12
            min-w-0
            flex-1
            bg-transparent
            text-base
            outline-none
            placeholder:text-[var(--text-secondary)]
          "
        />
      </div>

      <div className="mb-12 flex flex-wrap gap-3">
        {trendingSearches.map((search) => (
          <button
            key={search}
            onClick={() => setQuery(search)}
            className="
              rounded-full
              border
              border-[var(--border)]
              bg-[var(--surface)]
              px-4
              py-2
              text-sm
              text-[var(--text-secondary)]
              transition-colors
              hover:border-[var(--primary)]
              hover:text-[var(--text-primary)]
            "
          >
            {search}
          </button>
        ))}
      </div>

      <div className="grid gap-10 lg:grid-cols-[360px_1fr]">
        <aside>
          <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-6">
            <h2 className="mb-5 text-2xl">Category Suggestions</h2>

            <div className="grid gap-4">
              {matchingCategories.length === 0 ? (
                <p className="text-sm text-[var(--text-secondary)]">
                  No matching categories yet.
                </p>
              ) : (
                matchingCategories.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/furniture/${category.slug}`}
                    className="
                      group
                      grid
                      grid-cols-[72px_1fr_auto]
                      items-center
                      gap-4
                    "
                  >
                    <div className="relative aspect-square overflow-hidden rounded-[16px] bg-[var(--surface-muted)]">
                      <Image
                        src={category.image}
                        alt={category.title}
                        fill
                        sizes="72px"
                        className="object-cover"
                      />
                    </div>

                    <div>
                      <h3 className="font-medium leading-tight">
                        {category.shortTitle}
                      </h3>
                      <p className="mt-1 text-sm text-[var(--text-secondary)]">
                        {category.description}
                      </p>
                    </div>

                    <ArrowRight
                      size={16}
                      className="text-[var(--text-secondary)] transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                ))
              )}
            </div>
          </div>
        </aside>

        <div>
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="text-3xl">Product Results</h2>
            <p className="text-sm text-[var(--text-secondary)]">
              {matchingProducts.length} found
            </p>
          </div>

          {matchingProducts.length === 0 ? (
            <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-10">
              <h3 className="mb-3 text-3xl">No Products Found</h3>
              <p className="text-[var(--text-secondary)]">
                Try searching by room, wood type, finish, or product name.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {matchingProducts.map((product) => (
                <Link
                  key={product.slug}
                  href={`/products/${product.slug}`}
                  className="group"
                >
                  <div className="relative mb-5 aspect-[4/5] overflow-hidden rounded-[24px] bg-[var(--surface-muted)]">
                    <Image
                      src={product.images[0]}
                      alt={product.title}
                      fill
                      sizes="(min-width: 1280px) 24vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  <p className="mb-2 text-xs uppercase tracking-[2px] text-[var(--text-secondary)]">
                    {product.category}
                  </p>

                  <h3 className="mb-2 text-2xl leading-tight">
                    {product.title}
                  </h3>

                  <p className="mb-3 text-sm text-[var(--text-secondary)]">
                    {product.material}
                  </p>

                  <p className="text-xl font-semibold">{product.price}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
