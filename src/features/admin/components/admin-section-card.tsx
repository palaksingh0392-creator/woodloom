type Props = {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
};

export default function AdminSectionCard({ title, action, children }: Props) {
  return (
    <section className="rounded-lg border bg-[var(--surface)]">
      <div className="flex items-center justify-between gap-4 border-b px-4 py-3">
        <h2 className="font-serif text-xl font-semibold">{title}</h2>
        {action}
      </div>

      <div className="p-4">{children}</div>
    </section>
  );
}
