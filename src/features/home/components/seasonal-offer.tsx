import Image from "next/image";
import Link from "next/link";

import { ArrowRight, BadgePercent } from "lucide-react";

export default function SeasonalOffer() {
  return (
    <section className="border-t border-[var(--border)] py-16 lg:py-20">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-6 lg:px-10">
        <div
          className="
            grid
            overflow-hidden
            rounded-[24px]
            border
            border-[var(--border)]
            bg-[var(--surface)]
            lg:grid-cols-[0.95fr_1.05fr]
          "
        >
          <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-14">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface-muted)] text-[var(--primary)]">
              <BadgePercent size={22} />
            </div>

            <p className="mb-4 text-sm uppercase tracking-[4px] text-[var(--primary)]">
              Limited Season Edit
            </p>

            <h2 className="mb-6 max-w-[620px] text-4xl leading-[1] sm:text-5xl lg:text-6xl">
              Crafted Comfort For New Homes
            </h2>

            <p className="mb-8 max-w-[560px] text-[17px] leading-relaxed text-[var(--text-secondary)]">
              Curated living, dining, and bedroom essentials with launch-week
              consultation support and selected-city delivery benefits.
            </p>

            <Link
              href="/products"
              className="
                inline-flex
                h-14
                w-fit
                items-center
                gap-2
                rounded-full
                bg-[var(--primary)]
                px-7
                text-sm
                uppercase
                tracking-[2px]
                text-white
              "
            >
              Shop The Edit
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="relative min-h-[320px] lg:min-h-[520px]">
            <Image
              src="https://images.unsplash.com/photo-1517705008128-361805f42e86?q=80&w=1600&auto=format&fit=crop"
              alt="Warm wooden dining room offer"
              fill
              sizes="(min-width: 1024px) 52vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
