type Props = {
  label: string;
  value: string;
  change: string;
};

export default function AdminStatCard({ label, value, change }: Props) {
  return (
    <article className="rounded-lg border bg-[var(--surface)] p-4">
      <p className="text-sm text-[var(--text-secondary)]">{label}</p>
      <div className="mt-4 flex items-end justify-between gap-3">
        <strong className="text-2xl font-semibold">{value}</strong>
        <span className="text-xs font-semibold text-[var(--success)]">
          {change}
        </span>
      </div>
    </article>
  );
}
