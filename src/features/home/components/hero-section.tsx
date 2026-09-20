"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import type { HomeHeroSlide } from "@/lib/home";

const fallbackSlides: HomeHeroSlide[] = [
  {
    id: "fallback-1",
    eyebrow: "Scandinavian Luxury Furniture",
    title: "Timeless Furniture For Beautiful Living",
    subtitle:
      "Crafted wooden interiors inspired by warmth, simplicity, and modern luxury.",
    imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
    primaryCtaLabel: "Explore Collection",
    primaryCtaHref: "/furniture",
    secondaryCtaLabel: "Book Consultation",
    secondaryCtaHref: "/contact",
    isActive: true,
    sortOrder: 0,
  },
  {
    id: "fallback-2",
    eyebrow: "Scandinavian Luxury Furniture",
    title: "Timeless Furniture For Beautiful Living",
    subtitle:
      "Crafted wooden interiors inspired by warmth, simplicity, and modern luxury.",
    imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
    primaryCtaLabel: "Explore Collection",
    primaryCtaHref: "/furniture",
    secondaryCtaLabel: "Book Consultation",
    secondaryCtaHref: "/contact",
    isActive: true,
    sortOrder: 1,
  },
  {
    id: "fallback-3",
    eyebrow: "Scandinavian Luxury Furniture",
    title: "Timeless Furniture For Beautiful Living",
    subtitle:
      "Crafted wooden interiors inspired by warmth, simplicity, and modern luxury.",
    imageUrl:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1600&auto=format&fit=crop&utm_source=chatgpt.com",
    primaryCtaLabel: "Explore Collection",
    primaryCtaHref: "/furniture",
    secondaryCtaLabel: "Book Consultation",
    secondaryCtaHref: "/contact",
    isActive: true,
    sortOrder: 2,
  },
];

export default function HeroSection({ slides = fallbackSlides }: { slides?: HomeHeroSlide[] }) {
  const safeSlides = useMemo(
    () => (slides && slides.length > 0 ? slides : fallbackSlides),
    [slides],
  );
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (safeSlides.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === safeSlides.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [safeSlides.length]);

  const activeSlide = safeSlides[currentSlide] ?? safeSlides[0];

  return (
    <section
      className="
        relative
        overflow-hidden
      "
    >
      {/* HERO CANVAS */}
      <div
        className="
          relative

          min-h-[560px]
          sm:min-h-[620px]
          lg:h-[720px]

          overflow-hidden
   

          border
          border-[var(--border)]

          bg-[var(--surface)]
        "
      >
        {/* IMAGE CAROUSEL */}
        <div className="absolute inset-0">
          {safeSlides.map((slide, index) => (
            <div
              key={slide.id ?? `${slide.title}-${index}`}
              className={`
                absolute
                inset-0

                transition-opacity
                duration-2000
                ease-in-out

                ${currentSlide === index ? "opacity-100" : "opacity-0"}
              `}
            >
              <Image
                src={slide.imageUrl}
                alt={slide.title}
                fill
                sizes="100vw"
                priority
                className="object-cover object-center brightness-[0.96] contrast-[1.08] saturate-[1.03]"
              />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-[var(--hero-scrim)] via-[var(--hero-scrim)]/28 to-transparent" />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/20 via-transparent to-black/10" />
        {/* LEFT OVERLAY */}

        {/* SOFT SHADOW DEPTH */}
        <div
          className="
            absolute
            inset-0
            z-10

            shadow-[inset_0_0_120px_rgba(0,0,0,0.08)]
          "
        />

        {/* CONTENT */}
        <div
          className="
            absolute
            z-20

            left-4
            right-4
            sm:left-6
            sm:right-6
            lg:left-16
            lg:right-auto
            top-1/2
            -translate-y-1/2

            max-w-[560px]
          "
        >
          {/* LABEL */}
          <span
            className="
              inline-block

              mb-4
              sm:mb-5
              lg:mb-8

              text-[14px]
              sm:text-[16px]
              tracking-[0.18em]
              sm:tracking-[0.26em]
              uppercase

              text-[var(--primary)]
            "
          >
            {activeSlide.eyebrow}
          </span>

          {/* TITLE */}
          <h1
            className="
              max-w-[11ch]

              text-[38px]
              max-[360px]:text-[34px]
              min-[390px]:text-[42px]
              sm:text-[56px]
              lg:text-[72px]
              leading-[0.96]
              tracking-normal

              text-[var(--text-primary)]

              mb-6
              lg:mb-8
            "
            style={{
              fontFamily: "var(--font-heading)",
            }}
          >
            {activeSlide.title}
          </h1>

          {/* DESCRIPTION */}
          <p
            className="
              max-w-[32rem]

              text-[15px]
              sm:text-[19px]
              lg:text-[21px]
              leading-[1.7]
              lg:leading-[1.9]

              text-[var(--text-secondary)]

              mb-8
              lg:mb-12
            "
          >
            {activeSlide.subtitle}
          </p>

          {/* BUTTONS */}
          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-5">
            <Link
              href={activeSlide.primaryCtaHref}
              className="
                inline-flex
                min-h-12
                w-full
                sm:w-auto
                lg:h-16
                px-5
                sm:px-6
                lg:px-10
                items-center
                justify-center

                rounded-full

                bg-[var(--text-primary)]
                text-[var(--background)]

                text-[11px]
                sm:text-[12px]
                lg:text-[13px]
                tracking-[0.12em]
                sm:tracking-[0.18em]
                uppercase

                transition-all
                duration-300

                hover:scale-[1.02]
              "
            >
              {activeSlide.primaryCtaLabel}
            </Link>

            <Link
              href={activeSlide.secondaryCtaHref}
              className="
                inline-flex
                min-h-12
                w-full
                sm:w-auto
                lg:h-16
                px-5
                sm:px-6
                lg:px-10
                items-center
                justify-center

                rounded-full

                border
                border-[var(--text-primary)]/15

                bg-[var(--surface-overlay)]/72
                backdrop-blur-md

                text-[11px]
                sm:text-[12px]
                lg:text-[13px]
                tracking-[0.12em]
                sm:tracking-[0.18em]
                uppercase

                transition-all
                duration-300

                hover:bg-[var(--surface)]
              "
            >
              {activeSlide.secondaryCtaLabel}
            </Link>
          </div>

          {/* CAROUSEL INDICATORS */}
          <div
            className="
              flex
              items-center
              gap-8

              mt-10
              lg:mt-16
            "
          >
            {safeSlides.map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`View slide ${index + 1}`}
                onClick={() => setCurrentSlide(index)}
                className="
                  flex
                  items-center
                  gap-3

                  group
                "
              >
                <span
                  className={`
                    text-sm
                    transition-all
                    duration-300

                    ${
                      currentSlide === index
                        ? "text-[var(--text-primary)]"
                        : "text-[var(--text-secondary)]"
                    }
                  `}
                >
                  0{index + 1}
                </span>

                {currentSlide === index && (
                  <div
                    className="
                      w-12
                      h-px

                      bg-[var(--text-primary)]
                    "
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* BOTTOM AMBIENT SHADOW */}
        <div
          className="
            absolute
            inset-x-0
            bottom-0

            h-40

            bg-linear-to-t
            from-black/10
            to-transparent

            z-10
          "
        />
      </div>

      {/* AMBIENT GLOW */}
      <div
        className="
          absolute

          -top-24
          -right-20
          hidden
          sm:block

          w-80
          h-80
          lg:w-[500px]
          lg:h-[500px]

          rounded-full

          bg-[var(--primary)]/10

          blur-[120px]

          pointer-events-none
        "
      />
    </section>
  );
}
