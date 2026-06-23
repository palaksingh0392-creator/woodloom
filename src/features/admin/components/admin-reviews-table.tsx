"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Star, Trash2 } from "lucide-react";

import type { AdminProductReview } from "@/lib/reviews";

export default function AdminReviewsTable({
  reviews,
}: {
  reviews: AdminProductReview[];
}) {
  const router = useRouter();

  async function updateVisibility(id: string, isVisible: boolean) {
    await fetch(`/api/admin/reviews/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isVisible }),
    });
    router.refresh();
  }

  async function deleteReview(id: string) {
    await fetch(`/api/admin/reviews/${id}`, {
      method: "DELETE",
    });
    router.refresh();
  }

  if (reviews.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-[var(--border)] p-10 text-center text-[var(--text-secondary)]">
        No customer reviews yet. Submitted product reviews will appear here for
        moderation.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px] text-left text-sm">
        <thead className="text-xs uppercase text-[var(--text-secondary)]">
          <tr className="border-b">
            <th className="px-4 py-3 font-semibold">Review</th>
            <th className="px-4 py-3 font-semibold">Product</th>
            <th className="px-4 py-3 font-semibold">Customer</th>
            <th className="px-4 py-3 font-semibold">Rating</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review) => (
            <tr key={review.id} className="border-b last:border-b-0">
              <td className="max-w-[340px] px-4 py-4 align-top">
                <strong className="block">{review.title}</strong>
                <p className="mt-1 line-clamp-3 text-[var(--text-secondary)]">
                  {review.content}
                </p>
                <span className="mt-2 block text-xs text-[var(--text-secondary)]">
                  {new Date(review.createdAt).toLocaleDateString("en-IN")}
                </span>
              </td>
              <td className="px-4 py-4 align-top">
                <Link
                  href={`/products/${review.productSlug}`}
                  className="font-medium text-[var(--primary)]"
                >
                  {review.productName}
                </Link>
              </td>
              <td className="px-4 py-4 align-top">
                <span className="block font-medium">{review.customerName}</span>
                <span className="text-xs text-[var(--text-secondary)]">
                  {review.customerEmail}
                </span>
              </td>
              <td className="px-4 py-4 align-top">
                <span className="inline-flex items-center gap-1">
                  <Star size={15} className="fill-[#c8a27a] text-[#c8a27a]" />
                  {review.rating}/5
                </span>
              </td>
              <td className="px-4 py-4 align-top">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    review.isVisible
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                      : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                  }`}
                >
                  {review.isVisible ? "Visible" : "Hidden"}
                </span>
              </td>
              <td className="px-4 py-4 align-top">
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    title={review.isVisible ? "Hide review" : "Show review"}
                    onClick={() =>
                      updateVisibility(review.id, !review.isVisible)
                    }
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[var(--border)]"
                  >
                    {review.isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <button
                    type="button"
                    title="Delete review"
                    onClick={() => deleteReview(review.id)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[var(--border)] text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
