import AdminStoreLocationsManager, {
  type StoreLocationItem,
} from "@/features/admin/components/admin-store-locations-manager";
import { listStoreLocations } from "@/lib/store-locations";

export const dynamic = "force-dynamic";

export default async function StoreLocationsPage() {
  const locations = await listStoreLocations({ activeOnly: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface-muted)] text-[var(--primary)]">
          <span className="text-lg">📍</span>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)]">
            Storefront locations
          </p>
          <h1 className="font-serif text-3xl font-semibold">Visit A Shissoo Space</h1>
        </div>
      </div>

      <AdminStoreLocationsManager
        initialLocations={locations.map((location) => ({
          id: location.id,
          city: location.city,
          address: location.address,
          phone: location.phone,
          hours: location.hours,
          isActive: location.isActive,
          sortOrder: location.sortOrder,
        })) satisfies StoreLocationItem[]}
      />
    </div>
  );
}
