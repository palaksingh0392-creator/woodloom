"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  BadgeCheck,
  Leaf,
} from "lucide-react";

import { blogPosts } from "@/data/blogs";

const heroSlides = [
  {
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1600&auto=format&fit=crop",
    title: "Need Help Designing Your Space?",
    description:
      "Our interior experts can help you create a space that's beautiful and uniquely yours.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1600&auto=format&fit=crop",
    title: "Luxury Interiors Crafted For Living",
    description:
      "Discover timeless Scandinavian furniture designed for comfort and elegance.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1600&auto=format&fit=crop",
    title: "Minimal Spaces. Maximum Warmth.",
    description:
      "Curated furniture pieces made to elevate your modern lifestyle.",
  },
];

export default function JournalSection() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-[var(--background)]">
      <div className="max-w-[1440px] mx-auto">
        {/* TOP BANNER */}
        <div className="relative h-[420px] overflow-hidden rounded-[20px] lg:rounded-[28px]">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                activeSlide === index ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                sizes="(min-width: 1440px) 1440px, 100vw"
                className="object-cover"
              />

              <div className="absolute inset-0 bg-black/45" />

              <div className="relative z-20 h-full flex items-center px-12">
                <div className="max-w-105 text-white">
                  <p className="uppercase tracking-[6px] text-xs mb-4 text-white/70">
                    Interior Consultation
                  </p>

                  <h2 className="text-5xl leading-[1.1] font-serif mb-5">
                    {slide.title}
                  </h2>

                  <p className="text-white/80 text-lg leading-relaxed mb-8">
                    {slide.description}
                  </p>

                  <button
                    className="
                      h-14
                      px-8
                      rounded-full
                      border
                      border-white/40
                      text-sm
                      uppercase
                      tracking-[2px]
                      hover:bg-white
                      hover:text-black
                      transition-all
                    "
                  >
                    Talk To A Designer
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* INDICATORS */}
          <div className="absolute bottom-8 right-8 z-30 flex gap-3">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveSlide(index)}
                className={`h-2 rounded-full transition-all duration-500 ${
                  activeSlide === index ? "w-10 bg-white" : "w-2 bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* FEATURES */}
        <div
          className="
            mt-10
            grid
            grid-cols-2
            md:grid-cols-3
            lg:grid-cols-6
            border
            border-[var(--border)]
            rounded-[24px]
            overflow-hidden
            bg-[var(--surface)]
          "
        >
          {[
            {
              icon: BadgeCheck,
              title: "Premium Craftsmanship",
              text: "Handcrafted with care",
            },
            {
              icon: Leaf,
              title: "Sustainable Wood",
              text: "Responsibly sourced",
            },
            {
              icon: ShieldCheck,
              title: "5 Year Warranty",
              text: "Built to last",
            },
            {
              icon: ShieldCheck,
              title: "Secure Payments",
              text: "100% safe & secure",
            },
            {
              icon: RotateCcw,
              title: "Easy Returns",
              text: "7-day return policy",
            },
            {
              icon: Truck,
              title: "Free Delivery",
              text: "Across India",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="
                flex
                items-center
                gap-4
                px-5
                py-6
                border-r
                border-b
                lg:border-b-0
                border-[var(--border)]
                last:border-r-0
              "
            >
              <item.icon className="w-6 h-6 text-[var(--text-primary)]" />

              <div>
                <h4 className="text-sm font-medium text-[var(--text-primary)]">
                  {item.title}
                </h4>

                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* JOURNAL */}
        <div className="mt-20">
          {/* HEADER */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="uppercase tracking-[4px] text-xs text-[var(--primary)] mb-3">
                From The Journal
              </p>

              <h2 className="text-4xl lg:text-5xl font-serif text-[var(--text-primary)]">
                Stories & Inspiration
              </h2>
            </div>

            <Link
              href="/blog"
              className="
                flex
                items-center
                gap-2
                uppercase
                tracking-[2px]
                text-sm
                text-[var(--text-primary)]
              "
            >
              View All Articles
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* SWIPER STYLE SCROLL */}
          <div
            className="
              flex
              gap-6
              overflow-x-auto
              snap-x
              snap-mandatory
              scrollbar-hide
              pb-2
            "
          >
            {blogPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="
                  min-w-85
                  max-w-85
                  bg-[var(--surface)]
                  rounded-[14px]
                  overflow-hidden
                  border
                  border-[var(--border)]
                  snap-start
                  shrink-0
                  group
                "
              >
                <div className="relative h-75 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="340px"
                    className="
                      object-cover
                      group-hover:scale-105
                      transition-transform
                      duration-700
                    "
                  />

                  <div className="absolute inset-0 bg-black/15" />
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[2px] text-[var(--text-secondary)] mb-4">
                    <span>{post.date}</span>
                    <span>/</span>
                    <span>{post.category}</span>
                  </div>

                  <h3
                    className="
                      text-[28px]
                      leading-[1.2]
                      font-serif
                      text-[var(--text-primary)]
                      mb-6
                    "
                  >
                    {post.title}
                  </h3>

                  <div
                    className="
                      flex
                      items-center
                      gap-2
                      uppercase
                      tracking-[2px]
                      text-sm
                      text-[var(--text-primary)]
                    "
                  >
                    Read Article
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
