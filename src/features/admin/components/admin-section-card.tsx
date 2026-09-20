type Props = {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
};

export default function AdminSectionCard({ title, action, children }: Props) {
  return (
    <section className="min-w-0 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-[0_8px_30px_rgba(42,36,31,0.04)]">
      <div className="flex items-center justify-between gap-4 border-b border-[var(--border)] px-5 py-4">
        <h2 className="font-serif text-xl font-semibold">{title}</h2>
        {action}
      </div>

      <div className="min-w-0 p-5">{children}</div>
    </section>
  );
}
