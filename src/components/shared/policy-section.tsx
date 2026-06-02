import type { ReactNode } from "react";

export default function PolicySection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <article className="rounded-[22px] border border-[var(--border)] bg-[var(--surface)] p-6">
      <h2 className="mb-4 text-2xl">{title}</h2>
      <div className="grid gap-3 leading-relaxed text-[var(--text-secondary)]">
        {children}
      </div>
    </article>
  );
}
