import AdminSectionCard from "@/features/admin/components/admin-section-card";
import { getSystemHealth } from "@/lib/system-health";

export default async function AdminSystemPage() {
  const health = await getSystemHealth();

  return (
    <AdminSectionCard title="System Health">
      <div className="mb-5 flex flex-col gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] p-4 text-sm text-[var(--text-secondary)] md:flex-row md:items-center md:justify-between">
        <span>
          Overall status:{" "}
          <strong className="uppercase text-[var(--text-primary)]">
            {health.status}
          </strong>
        </span>
        <span>{new Date(health.checkedAt).toLocaleString("en-IN")}</span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {health.checks.map((check) => (
          <article
            key={check.key}
            className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5"
          >
            <div className="mb-3 flex items-center justify-between gap-4">
              <h2 className="font-serif text-2xl">{check.label}</h2>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold uppercase ${
                  check.status === "ok"
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                    : check.status === "warning"
                      ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                      : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
                }`}
              >
                {check.status}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
              {check.message}
            </p>
          </article>
        ))}
      </div>
    </AdminSectionCard>
  );
}
