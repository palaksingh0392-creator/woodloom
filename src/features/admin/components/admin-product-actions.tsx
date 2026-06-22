"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Archive, ExternalLink, Pencil } from "lucide-react";

type Props = {
  id: string;
  slug: string;
  status: string;
};

export default function AdminProductActions({ id, slug, status }: Props) {
  const router = useRouter();
  const [isArchiving, setIsArchiving] = useState(false);

  async function archiveProduct() {
    if (!window.confirm("Archive this product and remove it from the storefront?")) {
      return;
    }

    setIsArchiving(true);
    const response = await fetch(`/api/admin/products/${id}`, {
      method: "DELETE",
    });
    setIsArchiving(false);

    if (response.ok) {
      router.refresh();
    }
  }

  return (
    <div className="flex items-center gap-1">
      <Link
        href={`/products/${slug}`}
        title="Preview product"
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[var(--border)]"
      >
        <ExternalLink size={16} />
      </Link>
      <Link
        href={`/admin/products/${id}/edit`}
        title="Edit product"
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[var(--border)]"
      >
        <Pencil size={16} />
      </Link>
      <button
        type="button"
        title="Archive product"
        disabled={status === "ARCHIVED" || isArchiving}
        onClick={archiveProduct}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[var(--border)] text-red-600 disabled:opacity-30"
      >
        <Archive size={16} />
      </button>
    </div>
  );
}
