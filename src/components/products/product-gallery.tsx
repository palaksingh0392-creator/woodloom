"use client";

import { useState } from "react";

import Image from "next/image";

type ProductGalleryProps = {
  images: string[];
  title: string;
  badge?: string;
};

export default function ProductGallery({
  images,
  title,
  badge,
}: ProductGalleryProps) {
  const [activeImage, setActiveImage] = useState(images[0]);

  return (
    <div
      className="
        grid
        min-w-0
        lg:grid-cols-[120px_1fr]
        gap-6
        items-start
      "
    >
      {/* THUMBNAILS */}
      <div
        className="
          flex
          lg:flex-col
          gap-4
          max-w-full
          overflow-x-auto
          pb-1
          scrollbar-hide
          order-2
          lg:order-1
        "
      >
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setActiveImage(image)}
            className={`
              relative

              h-[4.25rem]
              w-[4.25rem]
              shrink-0
              sm:h-24
              sm:w-24

              rounded-[16px]
              sm:rounded-[22px]
              overflow-hidden

              border-2

              transition-all

              ${
                activeImage === image
                  ? "border-[var(--primary)]"
                  : "border-transparent"
              }
            `}
          >
            <Image
              src={image}
              alt={`${title} thumbnail ${index + 1}`}
              fill
              sizes="(min-width: 640px) 96px, 68px"
              className="
                object-cover
                hover:scale-105
                transition-transform
                duration-500
              "
            />
          </button>
        ))}
      </div>

      {/* MAIN IMAGE */}
      <div
        className="
          relative
          aspect-[4/5]

          rounded-[22px]
          sm:rounded-[32px]
          overflow-hidden

          bg-[var(--surface-muted)]

          order-1
          lg:order-2

          group
        "
      >
        <Image
          src={activeImage}
          alt={title}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          priority
          className="
            object-cover

            group-hover:scale-105

            transition-transform
            duration-700
          "
        />

        {/* OVERLAY */}
        <div
          className="
            absolute
            inset-0

            bg-gradient-to-t
            from-black/10
            to-transparent

            pointer-events-none
          "
        />

        {/* FLOATING BADGE */}
        {badge && (
          <div
            className="
              absolute
              top-6
              left-6

              px-4
              py-2

              rounded-full

              bg-[var(--surface-overlay)]
              backdrop-blur-md

              text-xs
              uppercase
              tracking-[2px]

              text-[var(--text-primary)]
            "
          >
            {badge}
          </div>
        )}
      </div>
    </div>
  );
}
