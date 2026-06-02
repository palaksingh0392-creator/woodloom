"use client";

import { useState } from "react";
import Image from "next/image";
import { Play, X } from "lucide-react";

export default function OurStorySection() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <section className="bg-[var(--surface-soft)] py-20 lg:py-24">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
          <div
            className="
              grid
              lg:grid-cols-[420px_1fr]
              overflow-hidden
              rounded-[20px]
              lg:rounded-[28px]
              border
              border-[var(--border)]
              bg-[var(--surface)]
            "
          >
            {/* LEFT CONTENT */}
            <div
              className="
                flex
                flex-col
                justify-center
                px-8
                py-12
                lg:px-12
              "
            >
              <p
                className="
                  mb-5
                  text-xs
                  font-medium
                  uppercase
                  tracking-[4px]
                  text-[var(--primary)]
                "
              >
                Our Story
              </p>

              <h2
                className="
                  max-w-[320px]
                  text-4xl
                  leading-[1.08]
                  tracking-normal
                  text-[var(--text-primary)]

                  lg:text-[54px]
                "
                style={{
                  fontFamily: "var(--font-heading)",
                }}
              >
                Designed for modern homes. Crafted for generations.
              </h2>

              <p
                className="
                  mt-6
                  max-w-[320px]
                  text-[16px]
                  leading-[1.9]
                  text-[var(--text-secondary)]
                "
              >
                We believe furniture is more than just function — it’s a part of
                your life. Every piece is thoughtfully designed and meticulously
                crafted using premium wood and timeless techniques.
              </p>

              <button
                onClick={() => setIsOpen(true)}
                className="
                  mt-10
                  flex
                  items-center
                  gap-3

                  text-sm
                  font-medium
                  uppercase
                  tracking-[2px]
                  text-[var(--text-primary)]

                  transition-all
                  duration-300

                  hover:gap-5
                "
              >
                Read Our Story
                <span>→</span>
              </button>
            </div>

            {/* RIGHT VIDEO */}
            <div className="relative h-[420px] lg:h-[620px]">
              <Image
                src="https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1600&auto=format&fit=crop"
                alt="Furniture craftsmanship"
                fill
                sizes="(min-width: 1024px) 70vw, 100vw"
                className="
                  object-cover
                "
              />

              {/* DARK OVERLAY */}
              <div
                className="
                  absolute
                  inset-0
                  bg-black/25
                "
              />

              {/* PLAY BUTTON */}
              <button
                onClick={() => setIsOpen(true)}
                className="
                  absolute
                  left-1/2
                  top-1/2
                  flex
                  h-24
                  w-24
                  -translate-x-1/2
                  -translate-y-1/2
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/40
                  bg-white/10
                  backdrop-blur-md

                  transition-all
                  duration-300

                  hover:scale-110
                  hover:bg-white/20
                "
              >
                <div
                  className="
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    rounded-full
                    bg-white
                    text-black
                  "
                >
                  <Play className="ml-1 h-7 w-7 fill-black" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* VIDEO MODAL */}
      {isOpen && (
        <div
          className="
            fixed
            inset-0
            z-[9999]
            flex
            items-center
            justify-center
            bg-black/80
            p-4
            backdrop-blur-sm
          "
        >
          {/* CLOSE BUTTON */}
          <button
            onClick={() => setIsOpen(false)}
            className="
              absolute
              right-6
              top-6
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-full
              bg-white
              text-black

              transition-all
              duration-300

              hover:rotate-90
            "
          >
            <X className="h-5 w-5" />
          </button>

          {/* VIDEO CONTAINER */}
          <div
            className="
              relative
              w-full
              max-w-6xl
              overflow-hidden
              rounded-[24px]
              bg-black
              shadow-2xl
            "
          >
            <div className="aspect-video">
              <iframe
                className="h-full w-full"
                src="https://www.youtube.com/embed/8Qn_spdM5Zg?autoplay=1"
                title="Woodloom Story"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
