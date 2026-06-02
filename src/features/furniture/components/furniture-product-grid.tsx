"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { SlidersHorizontal } from "lucide-react";

import type { Product } from "@/data/products";

type SortOption = "featured" | "price-low" | "price-high";

type FurnitureProductGridProps = {
  products: Product[];
  filters: string[];
};

function parsePrice(price: string) {
  return Number(price.replace(/[^\d.]/g, ""));
}

function matchesFilter(product: Product, filter: string) {
  const haystack = [
    product.title,
    product.category,
    product.collection,
    product.material,
    product.description,
    product.finishes.join(" "),
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(filter.toLowerCase());
}

export default function FurnitureProductGrid({
  products,
  filters,
}: FurnitureProductGridProps) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [sort, setSort] = useState<SortOption>("featured");

  const visibleProducts = useMemo(() => {
    const filteredProducts =
      activeFilter === "All"
        ? products
        : products.filter((product) => matchesFilter(product, activeFilter));

    return filteredProducts.slice().sort((first, second) => {
      if (sort === "price-low") {
        return parsePrice(first.price) - parsePrice(second.price);
      }

      if (sort === "price-high") {
        return parsePrice(second.price) - parsePrice(first.price);
      }

      return 0;
    });
  }, [activeFilter, products, sort]);

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <aside
        className="
          rounded-[24px]
          border
          border-[var(--border)]
          bg-[var(--surface)]
          p-5
          lg:sticky
          lg:top-32
          lg:self-start
        "
      >
        <div className="mb-5 flex items-center gap-3">
          <SlidersHorizontal size={18} />
          <h2 className="text-xl">Filters</h2>
        </div>

        <div className="flex flex-wrap gap-3 lg:flex-col">
          {["All", ...filters].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`
                rounded-full
                border
                px-4
                py-2
                text-left
                text-sm
                transition-colors
                ${
                  activeFilter === filter
                    ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                    : "border-[var(--border)] hover:border-[var(--primary)]"
                }
              `}
            >
              {filter}
            </button>
          ))}
        </div>
      </aside>

      <div>
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <p className="text-sm text-[var(--text-secondary)]">
            Showing {visibleProducts.length} of {products.length} pieces
          </p>

          <label className="flex items-center gap-3 text-sm">
            <span className="text-[var(--text-secondary)]">Sort</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortOption)}
              className="
                h-11
                rounded-full
                border
                border-[var(--border)]
                bg-[var(--surface)]
                px-4
                outline-none
              "
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </label>
        </div>

        {visibleProducts.length === 0 ? (
          <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-10">
            <h3 className="mb-3 text-3xl">No Pieces Found</h3>
            <p className="text-[var(--text-secondary)]">
              Try another material or room filter.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {visibleProducts.map((product) => (
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
                    sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {product.badge && (
                    <span className="absolute left-5 top-5 rounded-full bg-[var(--surface-overlay)] px-4 py-2 text-xs uppercase tracking-[2px]">
                      {product.badge}
                    </span>
                  )}
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
  );
}
