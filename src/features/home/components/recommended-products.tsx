import Image from "next/image";
import Link from "next/link";

import { Sparkles } from "lucide-react";

import type { Product } from "@/data/products";

export default function RecommendedProducts({
  products,
}: {
  products: Product[];
}) {
  const recommendations = products.slice(0, 3);

  return (
    <section className="border-t border-[var(--border)] py-16 lg:py-20">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-6 lg:px-10">
        <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="mb-4 flex items-center gap-2 text-sm uppercase tracking-[4px] text-[var(--primary)]">
              <Sparkles size={16} />
              Recommended For You
            </p>

            <h2 className="max-w-[680px] text-4xl leading-[1] sm:text-5xl lg:text-6xl">
              Pieces That Complete The Room
            </h2>
          </div>

          <p className="max-w-[420px] text-[var(--text-secondary)]">
            MVP recommendation logic is currently curated by category and
            editorial priority. Later this will connect to viewed products and
            purchase behavior.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {recommendations.map((product) => (
            <Link
              key={product.slug}
              href={`/products/${product.slug}`}
              className="
                group
                grid
                grid-cols-[110px_1fr]
                gap-5
                rounded-[22px]
                border
                border-[var(--border)]
                bg-[var(--surface)]
                p-4
                transition-transform
                hover:-translate-y-1
                md:block
                md:p-5
              "
            >
              <div className="relative aspect-square overflow-hidden rounded-[18px] bg-[var(--surface-muted)] md:mb-5 md:aspect-[4/5]">
                <Image
                  src={product.images[0]}
                  alt={product.title}
                  fill
                  sizes="(min-width: 768px) 30vw, 110px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <div>
                <p className="mb-2 text-xs uppercase tracking-[2px] text-[var(--text-secondary)]">
                  {product.category}
                </p>

                <h3 className="mb-2 text-2xl leading-tight">
                  {product.title}
                </h3>

                <p className="mb-4 text-sm text-[var(--text-secondary)]">
                  {product.material}
                </p>

                <p className="font-semibold">{product.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
