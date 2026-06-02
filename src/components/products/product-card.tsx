"use client";

import Image from "next/image";

import { Heart } from "lucide-react";

type Props = {
  title: string;
  category: string;
  price: string;
  image: string;
};

export default function ProductCard({ title, category, price, image }: Props) {
  return (
    <article
      className="
        group
        card-surface
        card-hover
        overflow-hidden
      "
    >
      {/* IMAGE */}
      <div
        className="
          relative
          overflow-hidden
          aspect-[4/4.8]
          bg-[var(--surface-muted)]
        "
      >
        <button
          className="
            absolute
            top-4
            right-4
            z-10

            w-11
            h-11

            rounded-full

            bg-[var(--surface-overlay)]
            text-[var(--text-primary)]
            backdrop-blur-md

            flex
            items-center
            justify-center

            opacity-0
            group-hover:opacity-100

            transition-all
            duration-300
          "
        >
          <Heart size={18} />
        </button>

        <Image
          src={image}
          alt={title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="
            object-cover
            transition-transform
            duration-700
            group-hover:scale-105
          "
        />
      </div>

      {/* CONTENT */}
      <div className="p-6">
        <p
          className="
            text-sm
            uppercase
            tracking-[2px]
            text-muted
            mb-3
          "
        >
          {category}
        </p>

        <h3
          className="
            text-2xl
            font-medium
            leading-snug
            mb-4
          "
        >
          {title}
        </h3>

        <div
          className="
            flex
            items-center
            justify-between
          "
        >
          <p
            className="
              text-xl
              font-semibold
            "
          >
            {price}
          </p>

          <button
            className="
              text-sm
              tracking-wide
              uppercase

              hover:text-[var(--primary)]

              transition-colors
            "
          >
            View
          </button>
        </div>
      </div>
    </article>
  );
}
