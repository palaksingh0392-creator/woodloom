import AdminDeliveryAreasManager, {
  type DeliveryAreaItem,
} from "@/features/admin/components/admin-delivery-areas-manager";
import { listDeliveryAreas } from "@/lib/delivery-areas";

export const dynamic = "force-dynamic";

export default async function DeliveryAreasPage() {
  const areas = await listDeliveryAreas({ activeOnly: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface-muted)] text-[var(--primary)]">
          <span className="text-lg">📍</span>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)]">
            Delivery management
          </p>
          <h1 className="font-serif text-3xl font-semibold">Serviceable locations</h1>
        </div>
      </div>

      <AdminDeliveryAreasManager
        initialAreas={areas.map((area) => ({
          id: area.id,
          state: area.state,
          city: area.city,
          pincode: area.pincode,
          deliveryCharge: area.deliveryCharge,
          estimatedDays: area.estimatedDays,
          isActive: area.isActive,
        })) satisfies DeliveryAreaItem[]}
      />
    </div>
  );
}
