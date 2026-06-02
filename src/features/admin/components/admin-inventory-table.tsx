import type { InventoryItem } from "@/data/admin";

export default function AdminInventoryTable({
  items,
}: {
  items: InventoryItem[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[680px] text-left text-sm">
        <thead className="text-xs uppercase tracking-[0.12em] text-[var(--text-secondary)]">
          <tr className="border-b">
            <th className="py-3 pr-4 font-semibold">SKU</th>
            <th className="px-4 py-3 font-semibold">Product</th>
            <th className="px-4 py-3 font-semibold">Category</th>
            <th className="px-4 py-3 font-semibold">Reserved</th>
            <th className="py-3 pl-4 font-semibold text-right">Available</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => {
            const isLow = item.stock <= item.reorderAt;

            return (
              <tr key={item.sku} className="border-b last:border-b-0">
                <td className="py-4 pr-4 font-semibold">{item.sku}</td>
                <td className="px-4 py-4">{item.product}</td>
                <td className="px-4 py-4 text-[var(--text-secondary)]">
                  {item.category}
                </td>
                <td className="px-4 py-4">{item.reserved}</td>
                <td className="py-4 pl-4 text-right">
                  <span
                    className={
                      isLow
                        ? "font-semibold text-[var(--danger)]"
                        : "font-semibold"
                    }
                  >
                    {item.stock}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
