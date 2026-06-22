import type { AdminCustomer } from "@/lib/admin";

export default function AdminCustomersTable({
  customers,
}: {
  customers: AdminCustomer[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="text-xs uppercase tracking-[0.12em] text-[var(--text-secondary)]">
          <tr className="border-b">
            <th className="py-3 pr-4 font-semibold">Customer</th>
            <th className="px-4 py-3 font-semibold">Email</th>
            <th className="px-4 py-3 font-semibold">Phone</th>
            <th className="px-4 py-3 font-semibold">Orders</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="py-3 pl-4 text-right font-semibold">Joined</th>
          </tr>
        </thead>

        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id} className="border-b last:border-b-0">
              <td className="py-4 pr-4 font-semibold">{customer.name}</td>
              <td className="px-4 py-4">{customer.email}</td>
              <td className="px-4 py-4 text-[var(--text-secondary)]">
                {customer.phone}
              </td>
              <td className="px-4 py-4">{customer.orders}</td>
              <td className="px-4 py-4">
                <span className="rounded-full bg-[var(--surface-muted)] px-2.5 py-1 text-xs font-semibold">
                  {customer.status}
                </span>
              </td>
              <td className="py-4 pl-4 text-right">{customer.joined}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
