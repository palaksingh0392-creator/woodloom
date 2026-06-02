import Image from "next/image";
import Link from "next/link";

import MainLayout from "@/components/layout/main-layout";
import { blogPosts } from "@/data/blogs";

export const metadata = {
  title: "Journal | WOODLOOM",
  description:
    "Read furniture buying guides, Scandinavian interior ideas, and room styling inspiration from WOODLOOM.",
};

const categories = Array.from(new Set(blogPosts.map((post) => post.category)));

export default function BlogPage() {
  const featuredPost = blogPosts[0];
  const remainingPosts = blogPosts.slice(1);

  return (
    <MainLayout>
      <section className="mx-auto max-w-[1440px] px-5 py-14 sm:px-6 lg:px-10 lg:py-20">
        <div className="mb-12">
          <p className="mb-4 text-sm uppercase tracking-[4px] text-[var(--primary)]">
            WOODLOOM Journal
          </p>

          <h1 className="mb-6 max-w-[860px] text-4xl leading-[0.95] sm:text-5xl lg:text-7xl">
            Furniture Guides For Warm Modern Living
          </h1>

          <p className="max-w-[660px] text-[17px] leading-relaxed text-[var(--text-secondary)]">
            Explore buying guides, room inspiration, material notes, and styling
            ideas built for SEO discovery and thoughtful furniture decisions.
          </p>
        </div>

        <div className="mb-10 flex flex-wrap gap-3">
          {categories.map((category) => (
            <span
              key={category}
              className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm text-[var(--text-secondary)]"
            >
              {category}
            </span>
          ))}
        </div>

        <Link
          href={`/blog/${featuredPost.slug}`}
          className="
            group
            mb-12
            grid
            overflow-hidden
            rounded-[24px]
            border
            border-[var(--border)]
            bg-[var(--surface)]
            lg:grid-cols-[1.1fr_0.9fr]
          "
        >
          <div className="relative min-h-[340px] bg-[var(--surface-muted)] lg:min-h-[560px]">
            <Image
              src={featuredPost.image}
              alt={featuredPost.title}
              fill
              priority
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>

          <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-14">
            <p className="mb-4 text-sm uppercase tracking-[3px] text-[var(--primary)]">
              Featured Article
            </p>

            <h2 className="mb-5 text-4xl leading-[1] sm:text-5xl">
              {featuredPost.title}
            </h2>

            <p className="mb-8 text-[17px] leading-relaxed text-[var(--text-secondary)]">
              {featuredPost.excerpt}
            </p>

            <div className="flex flex-wrap gap-3 text-sm text-[var(--text-secondary)]">
              <span>{featuredPost.date}</span>
              <span>/</span>
              <span>{featuredPost.category}</span>
              <span>/</span>
              <span>{featuredPost.readTime}</span>
            </div>
          </div>
        </Link>

        <div className="grid gap-8 md:grid-cols-3">
          {remainingPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
              <div className="relative mb-5 aspect-[4/3] overflow-hidden rounded-[22px] bg-[var(--surface-muted)]">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <p className="mb-3 text-xs uppercase tracking-[2px] text-[var(--text-secondary)]">
                {post.date} / {post.category}
              </p>

              <h2 className="mb-3 text-3xl leading-tight">{post.title}</h2>

              <p className="text-[var(--text-secondary)]">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
    </MainLayout>
  );
}
