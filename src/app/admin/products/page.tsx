import Image from "next/image";
import Link from "next/link";

import AdminSectionCard from "@/features/admin/components/admin-section-card";
import { listCatalogProducts } from "@/lib/catalog";

export default async function AdminProductsPage() {
  const products = await listCatalogProducts();

  return (
    <AdminSectionCard title="Product Management">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <article key={product.slug} className="rounded-lg border p-3">
            <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-[var(--surface-muted)]">
              <Image
                src={product.images[0]}
                alt={product.title}
                fill
                sizes="(min-width: 1280px) 28vw, (min-width: 768px) 45vw, 92vw"
                className="object-cover"
              />
            </div>

            <div className="mt-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-serif text-xl font-semibold">
                    {product.title}
                  </h2>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">
                    {product.category}
                  </p>
                </div>
                <span className="rounded-full bg-[var(--surface-muted)] px-2.5 py-1 text-xs font-semibold">
                  {product.badge ?? "Live"}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between gap-4 border-t pt-4">
                <strong>{product.price}</strong>
                <Link
                  href={`/products/${product.slug}`}
                  className="text-sm font-semibold text-[var(--primary)]"
                >
                  Preview
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </AdminSectionCard>
  );
}
