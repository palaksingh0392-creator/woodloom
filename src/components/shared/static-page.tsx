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
    <section className="mx-auto max-w-[1120px] px-4 py-12 sm:px-6 lg:px-10 lg:py-20">
      <div className="mb-8 sm:mb-12">
        <p className="mb-4 text-xs uppercase tracking-[4px] text-[var(--primary)] sm:text-sm">
          {eyebrow}
        </p>

        <h1 className="mb-5 max-w-[900px] text-4xl leading-[0.95] sm:text-5xl lg:text-7xl">
          {title}
        </h1>

        <p className="max-w-[720px] text-base leading-relaxed text-[var(--text-secondary)] sm:text-[17px]">
          {description}
        </p>
      </div>

      <div className="grid gap-5 sm:gap-6">{children}</div>
    </section>
  );
}
