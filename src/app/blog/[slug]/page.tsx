import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import MainLayout from "@/components/layout/main-layout";
import { blogPosts } from "@/data/blogs";
import {
  getPublishedBlogPostBySlug,
  listPublishedBlogPosts,
} from "@/lib/blogs";

type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPublishedBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Article Not Found | WOODLOOM",
    };
  }

  return {
    title: `${post.title} | WOODLOOM Journal`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const [post, posts] = await Promise.all([
    getPublishedBlogPostBySlug(slug),
    listPublishedBlogPosts(),
  ]);

  if (!post) {
    notFound();
  }

  const relatedPosts = posts
    .filter((relatedPost) => relatedPost.slug !== post.slug)
    .slice(0, 3);

  return (
    <MainLayout>
      <article>
        <section className="mx-auto max-w-[1200px] px-5 py-14 sm:px-6 lg:px-10 lg:py-20">
          <div className="mb-8 flex flex-wrap items-center gap-2 text-sm text-[var(--text-secondary)]">
            <Link href="/" className="hover:text-[var(--primary)]">
              Home
            </Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-[var(--primary)]">
              Journal
            </Link>
            <span>/</span>
            <span className="text-[var(--text-primary)]">{post.category}</span>
          </div>

          <p className="mb-4 text-sm uppercase tracking-[4px] text-[var(--primary)]">
            {post.category}
          </p>

          <h1 className="mb-6 max-w-[900px] text-4xl leading-[0.95] sm:text-5xl lg:text-7xl">
            {post.title}
          </h1>

          <p className="mb-8 max-w-[760px] text-xl leading-relaxed text-[var(--text-secondary)]">
            {post.excerpt}
          </p>

          <div className="mb-10 flex flex-wrap gap-3 text-sm text-[var(--text-secondary)]">
            <span>{post.date}</span>
            <span>/</span>
            <span>{post.readTime}</span>
          </div>

          <div className="relative aspect-[16/9] overflow-hidden rounded-[24px] bg-[var(--surface-muted)]">
            <Image
              src={post.image}
              alt={post.title}
              fill
              priority
              sizes="(min-width: 1200px) 1200px, 100vw"
              className="object-cover"
            />
          </div>
        </section>

        <section className="mx-auto max-w-[820px] px-5 pb-16 sm:px-6 lg:pb-24">
          <div className="grid gap-7 text-[18px] leading-[1.9] text-[var(--text-secondary)]">
            {post.content.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>
      </article>

      <section className="border-t border-[var(--border)] py-16">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-6 lg:px-10">
          <div className="mb-10">
            <p className="mb-4 text-sm uppercase tracking-[4px] text-[var(--primary)]">
              Related Reading
            </p>
            <h2 className="text-4xl leading-[1] sm:text-5xl">
              More From The Journal
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {relatedPosts.map((relatedPost) => (
              <Link
                key={relatedPost.slug}
                href={`/blog/${relatedPost.slug}`}
                className="group"
              >
                <div className="relative mb-5 aspect-[4/3] overflow-hidden rounded-[22px] bg-[var(--surface-muted)]">
                  <Image
                    src={relatedPost.image}
                    alt={relatedPost.title}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                <p className="mb-3 text-xs uppercase tracking-[2px] text-[var(--text-secondary)]">
                  {relatedPost.category}
                </p>

                <h3 className="text-3xl leading-tight">{relatedPost.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
