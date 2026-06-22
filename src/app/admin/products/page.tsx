import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";

import AdminProductActions from "@/features/admin/components/admin-product-actions";
import AdminSectionCard from "@/features/admin/components/admin-section-card";
import { listAdminProducts } from "@/lib/admin-products";

function formatPrice(value: unknown) {
  return `Rs. ${Number(value).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })}`;
}

export default async function AdminProductsPage() {
  const products = await listAdminProducts();

  return (
    <AdminSectionCard
      title="Product Management"
      action={
        <Link
          href="/admin/products/new"
          className="inline-flex min-h-10 items-center gap-2 rounded-md bg-[var(--primary)] px-3 text-sm font-semibold text-white"
        >
          <Plus size={17} />
          Add product
        </Link>
      }
    >
      {products.length === 0 ? (
        <div className="py-14 text-center">
          <p className="text-[var(--text-secondary)]">No products created yet.</p>
          <Link
            href="/admin/products/new"
            className="mt-4 inline-flex text-sm font-semibold text-[var(--primary)]"
          >
            Create the first product
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b text-xs uppercase text-[var(--text-secondary)]">
                <th className="px-2 py-3 font-semibold">Product</th>
                <th className="px-2 py-3 font-semibold">Status</th>
                <th className="px-2 py-3 font-semibold">Price</th>
                <th className="px-2 py-3 font-semibold">Stock</th>
                <th className="px-2 py-3 font-semibold">Updated</th>
                <th className="px-2 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const stock = product.variants.reduce(
                  (sum, variant) => sum + variant.stock,
                  0,
                );

                return (
                  <tr key={product.id} className="border-b last:border-b-0">
                    <td className="px-2 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-14 w-16 shrink-0 overflow-hidden rounded-md bg-[var(--surface-muted)]">
                          {product.images[0] ? (
                            <Image
                              src={product.images[0].url}
                              alt={product.name}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          ) : null}
                        </div>
                        <div>
                          <strong className="block">{product.name}</strong>
                          <span className="text-xs text-[var(--text-secondary)]">
                            {product.sku} · {product.category.name}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          product.status === "ACTIVE"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : product.status === "ARCHIVED"
                              ? "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
                              : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                        }`}
                      >
                        {product.status === "ACTIVE"
                          ? "Published"
                          : product.status === "ARCHIVED"
                            ? "Archived"
                            : "Draft"}
                      </span>
                    </td>
                    <td className="px-2 py-3 font-semibold">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-2 py-3">
                      <span className={stock <= 5 ? "font-semibold text-red-600" : ""}>
                        {stock}
                      </span>
                    </td>
                    <td className="px-2 py-3 text-[var(--text-secondary)]">
                      {product.updatedAt.toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-2 py-3">
                      <div className="flex justify-end">
                        <AdminProductActions
                          id={product.id}
                          slug={product.slug}
                          status={product.status}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </AdminSectionCard>
  );
}
