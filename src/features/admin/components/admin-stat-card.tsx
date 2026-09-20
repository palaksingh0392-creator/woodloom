type Props = {
  label: string;
  value: string;
  change: string;
};

const metricLinks: Record<string, string> = {
  "Open orders": "/admin/orders",
  "Low stock": "/admin/inventory?filter=low-stock",
  Customers: "/admin/customers",
  Revenue: "/admin/orders",
};

export default function AdminStatCard({ label, value, change }: Props) {
  const href = metricLinks[label];
  const content = (
    <>
      <p className="text-sm text-[var(--text-secondary)]">{label}</p>
      <div className="mt-4 flex items-end justify-between gap-3">
        <strong className="text-2xl font-semibold">{value}</strong>
        <span className="text-xs font-semibold text-[var(--success)]">
          {change}
        </span>
      </div>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className="block rounded-lg border bg-[var(--surface)] p-4 transition-colors hover:border-[var(--primary)]"
      >
        {content}
      </a>
    );
  }

  return (
    <article className="rounded-lg border bg-[var(--surface)] p-4">
      {content}
    </article>
  );
}
