"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1600&auto=format&fit=crop&utm_source=chatgpt.com",
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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

          min-h-[620px]
          lg:h-[720px]

          overflow-hidden
   

          border
          border-[var(--border)]

          bg-[var(--surface)]
        "
      >
        {/* IMAGE CAROUSEL */}
        <div className="absolute inset-0">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
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
                src={slide.image}
                alt="Luxury Furniture"
                fill
                sizes="100vw"
                priority
                className="object-cover object-center brightness-[0.88] contrast-[1.05]"
              />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--hero-scrim)] via-[var(--hero-scrim)]/55 to-transparent z-10" />
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

            left-6
            right-6
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

              mb-5
              lg:mb-8

              text-[13px]
              tracking-[0.35em]
              uppercase

              text-[var(--primary)]
            "
          >
            Scandinavian Luxury Furniture
          </span>

          {/* TITLE */}
          <h1
            className="
              max-w-[11ch]

              text-[46px]
              sm:text-[64px]
              lg:text-[85px]
              leading-[0.92]
              tracking-normal

              text-[var(--text-primary)]

              mb-6
              lg:mb-8
            "
            style={{
              fontFamily: "var(--font-heading)",
            }}
          >
            Timeless Furniture For Beautiful Living
          </h1>

          {/* DESCRIPTION */}
          <p
            className="
              max-w-130

              text-[17px]
              sm:text-[21px]
              leading-[1.7]
              lg:leading-[1.9]

              text-[var(--text-secondary)]

              mb-8
              lg:mb-12
            "
          >
            Crafted wooden interiors inspired by warmth, simplicity, and modern
            luxury.
          </p>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-5">
            <Link
              href="/furniture"
              className="
                inline-flex
                h-14
                lg:h-16
                px-7
                lg:px-10
                items-center
                justify-center

                rounded-full

                bg-[var(--text-primary)]
                text-[var(--background)]

                text-[13px]
                tracking-[0.18em]
                uppercase

                transition-all
                duration-300

                hover:scale-[1.02]
              "
            >
              Explore Collection
            </Link>

            <button
              className="
                h-14
                lg:h-16
                px-7
                lg:px-10

                rounded-full

                border
                border-[var(--border)]

                bg-[var(--surface-overlay)]
                backdrop-blur-md

                text-[13px]
                tracking-[0.18em]
                uppercase

                transition-all
                duration-300

                hover:bg-[var(--surface)]
              "
            >
              Book Consultation
            </button>
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
            {slides.map((_, index) => (
              <button
                key={index}
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
