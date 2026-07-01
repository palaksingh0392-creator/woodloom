"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

import { Star } from "lucide-react";

import type { ProductReview } from "@/lib/reviews";

const fallbackReviews: ProductReview[] = [
  {
    id: "fallback-sophia",
    customerName: "Sophia Bennett",
    rating: 5,
    title: "Interior Designer",
    content:
      "The craftsmanship is exceptional. The wood texture, finish, and comfort feel incredibly premium and timeless.",
    createdAt: new Date("2024-05-15").toISOString(),
  },
  {
    id: "fallback-daniel",
    customerName: "Daniel Carter",
    rating: 5,
    title: "Architect",
    content:
      "Beautiful Scandinavian aesthetic. It instantly elevated the atmosphere of our living room.",
    createdAt: new Date("2024-05-18").toISOString(),
  },
  {
    id: "fallback-emma",
    customerName: "Emma Wilson",
    rating: 5,
    title: "Home Stylist",
    content:
      "Luxury quality with minimalist elegance. The delivery and packaging experience was also excellent.",
    createdAt: new Date("2024-05-22").toISOString(),
  },
];

type ReviewsSectionProps = {
  productSlug: string;
  initialReviews: ProductReview[];
  isLoggedIn: boolean;
};

export default function ReviewsSection({
  productSlug,
  initialReviews,
  isLoggedIn,
}: ReviewsSectionProps) {
  const [reviews, setReviews] = useState(initialReviews);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const visibleReviews = reviews.length > 0 ? reviews : fallbackReviews;
  const averageRating = useMemo(() => {
    const total = visibleReviews.reduce((sum, review) => sum + review.rating, 0);

    return total / visibleReviews.length;
  }, [visibleReviews]);

  async function submitReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    const response = await fetch(`/api/products/${productSlug}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, title, content }),
    });
    const data = (await response.json()) as {
      message?: string;
      reviews?: ProductReview[];
    };

    setIsSubmitting(false);

    if (!response.ok || !data.reviews) {
      setMessage(data.message ?? "Unable to save review.");
      return;
    }

    setReviews(data.reviews);
    setTitle("");
    setContent("");
    setRating(5);
    setMessage("Thanks. Your review has been saved.");
  }

  return (
    <section className="pt-20 pb-10 sm:pt-24 lg:pt-28">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-6 lg:px-10">
        <div className="mb-14 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-4 text-sm uppercase tracking-[3px] text-[var(--primary)]">
              Customer Experience
            </p>

            <h2 className="mb-5 text-4xl leading-[1.1] lg:text-5xl">
              Loved By Modern Interiors
            </h2>

            <p className="max-w-[620px] text-[17px] leading-relaxed text-[var(--text-secondary)]">
              Read verified impressions from customers styling WOODLOOM pieces
              into warm, timeless living spaces.
            </p>
          </div>

          <div className="flex items-center gap-5 lg:justify-end">
            <RatingStars rating={Math.round(averageRating)} />

            <div>
              <h3 className="text-3xl font-semibold">
                {averageRating.toFixed(1)}/5
              </h3>

              <p className="text-sm text-[var(--text-secondary)]">
                Based on {visibleReviews.length} review
                {visibleReviews.length === 1 ? "" : "s"}
              </p>
            </div>
          </div>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_390px] lg:gap-8">
          <div className="grid gap-5 md:grid-cols-2 lg:gap-6">
            {visibleReviews.map((review) => (
              <article
                key={review.id}
                className="flex max-w-full flex-col rounded-[22px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_18px_50px_var(--shadow-soft)] transition-all duration-500 hover:-translate-y-1 sm:rounded-[24px] sm:p-6 lg:min-h-[260px] lg:p-6"
              >
                <div className="mb-5">
                  <RatingStars rating={review.rating} />
                </div>

                <p className="mb-6 break-words text-[15px] leading-relaxed text-[var(--text-secondary)] sm:text-[16px]">
                  &ldquo;{review.content}&rdquo;
                </p>

                <div className="mt-auto border-t border-[var(--border)] pt-5">
                  <h4 className="mb-1 text-lg font-medium">
                    {review.customerName}
                  </h4>

                  <p className="text-sm text-[var(--text-secondary)]">
                    {review.title}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <aside className="w-full max-w-full rounded-[22px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_18px_50px_var(--shadow-soft)] sm:rounded-[28px] sm:p-7 lg:sticky lg:top-28 lg:p-7">
            <h3 className="mb-3 text-2xl leading-tight sm:text-3xl">Share Your Review</h3>
            <p className="mb-6 text-sm leading-relaxed text-[var(--text-secondary)]">
              Tell other customers how this piece fits your home.
            </p>

            {isLoggedIn ? (
              <form className="grid gap-4" onSubmit={submitReview}>
                <label className="grid gap-2 text-sm font-medium">
                  Rating
                  <select
                    value={rating}
                    onChange={(event) => setRating(Number(event.target.value))}
                    className="h-12 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 text-[var(--text-primary)] outline-none focus:border-[var(--primary)]"
                  >
                    {[5, 4, 3, 2, 1].map((value) => (
                      <option
                        key={value}
                        value={value}
                        className="bg-[var(--surface)] text-[var(--text-primary)]"
                      >
                        {value} star{value === 1 ? "" : "s"}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-2 text-sm font-medium">
                  Short title
                  <input
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Beautiful finish"
                    className="h-12 rounded-full border border-[var(--border)] bg-transparent px-4 outline-none focus:border-[var(--primary)]"
                  />
                </label>

                <label className="grid gap-2 text-sm font-medium">
                  Review
                  <textarea
                    required
                    rows={5}
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                    placeholder="Write your experience"
                    className="rounded-[18px] border border-[var(--border)] bg-transparent px-4 py-3 outline-none focus:border-[var(--primary)]"
                  />
                </label>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-12 rounded-full bg-[var(--primary)] px-6 text-sm font-semibold uppercase tracking-[2px] text-white disabled:opacity-60"
                >
                  {isSubmitting ? "Saving Review" : "Submit Review"}
                </button>
              </form>
            ) : (
              <Link
                href={`/login?next=/products/${productSlug}`}
                className="flex h-12 items-center justify-center rounded-full bg-[var(--primary)] px-6 text-sm font-semibold uppercase tracking-[2px] text-white"
              >
                Login To Review
              </Link>
            )}

            {message ? (
              <p className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3 text-sm text-[var(--text-secondary)]">
                {message}
              </p>
            ) : null}
          </aside>
        </div>
      </div>
    </section>
  );
}

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((value) => (
        <Star
          key={value}
          size={18}
          className={
            value <= rating
              ? "fill-[#c8a27a] text-[#c8a27a]"
              : "text-[var(--border)]"
          }
        />
      ))}
    </div>
  );
}
