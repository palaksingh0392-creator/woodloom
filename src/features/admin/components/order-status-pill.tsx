import type { AdminOrder } from "@/data/admin";

const statusClassName: Record<AdminOrder["status"], string> = {
  Pending: "bg-slate-500/10 text-slate-700 dark:text-slate-300",
  Confirmed: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  Processing: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  Packed: "bg-purple-500/10 text-purple-700 dark:text-purple-300",
  Shipped: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300",
  Delivered: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  Cancelled: "bg-red-500/10 text-red-700 dark:text-red-300",
  "Return requested": "bg-orange-500/10 text-orange-700 dark:text-orange-300",
  Returned: "bg-zinc-500/10 text-zinc-700 dark:text-zinc-300",
};

export default function OrderStatusPill({
  status,
}: {
  status: AdminOrder["status"];
}) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusClassName[status]}`}
    >
      {status}
    </span>
  );
}
