import type { ReactNode } from "react";

type StaticPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export default function StaticPage({
  eyebrow,
  title,
  description,
  children,
}: StaticPageProps) {
  return (
    <section className="mx-auto max-w-[1120px] px-5 py-14 sm:px-6 lg:px-10 lg:py-20">
      <div className="mb-12">
        <p className="mb-4 text-sm uppercase tracking-[4px] text-[var(--primary)]">
          {eyebrow}
        </p>

        <h1 className="mb-6 max-w-[900px] text-4xl leading-[0.95] sm:text-5xl lg:text-7xl">
          {title}
        </h1>

        <p className="max-w-[720px] text-[17px] leading-relaxed text-[var(--text-secondary)]">
          {description}
        </p>
      </div>

      <div className="grid gap-6">{children}</div>
    </section>
  );
}
