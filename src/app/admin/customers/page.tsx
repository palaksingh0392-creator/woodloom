import { customerMessages } from "@/data/admin";
import AdminSectionCard from "@/features/admin/components/admin-section-card";

export default function AdminCustomersPage() {
  return (
    <AdminSectionCard title="Customer Support">
      <div className="grid gap-4 lg:grid-cols-3">
        {customerMessages.map((message) => (
          <article
            key={`${message.name}-${message.topic}`}
            className="rounded-lg border p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-semibold">{message.name}</h2>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  {message.topic}
                </p>
              </div>

              <span className="rounded-full bg-[var(--surface-muted)] px-2.5 py-1 text-xs font-semibold">
                {message.priority}
              </span>
            </div>

            <p className="mt-6 border-t pt-3 text-xs text-[var(--text-secondary)]">
              Received {message.received}
            </p>
          </article>
        ))}
      </div>
    </AdminSectionCard>
  );
}
