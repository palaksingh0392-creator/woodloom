import Link from "next/link";
import type { ReactNode } from "react";

type AuthCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  footerText: string;
  footerHref: string;
  footerLabel: string;
};

export default function AuthCard({
  eyebrow,
  title,
  description,
  children,
  footerText,
  footerHref,
  footerLabel,
}: AuthCardProps) {
  return (
    <section className="mx-auto grid min-h-[calc(100vh-96px)] max-w-[1440px] px-5 py-14 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:py-20">
      <div className="flex flex-col justify-center">
        <p className="mb-4 text-sm uppercase tracking-[4px] text-[var(--primary)]">
          {eyebrow}
        </p>

        <h1 className="mb-6 max-w-[620px] text-4xl leading-[0.95] sm:text-5xl lg:text-7xl">
          {title}
        </h1>

        <p className="max-w-[520px] text-[17px] leading-relaxed text-[var(--text-secondary)]">
          {description}
        </p>
      </div>

      <div className="mt-10 flex items-center lg:mt-0 lg:justify-end">
        <div
          className="
            w-full
            max-w-[520px]
            rounded-[28px]
            border
            border-[var(--border)]
            bg-[var(--surface)]
            p-6
            shadow-[0_24px_70px_var(--shadow-soft)]
            sm:p-8
          "
        >
          {children}

          <p className="mt-8 text-center text-sm text-[var(--text-secondary)]">
            {footerText}{" "}
            <Link href={footerHref} className="text-[var(--primary)]">
              {footerLabel}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
