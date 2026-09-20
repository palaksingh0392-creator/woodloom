"use client";

import { useState } from "react";
import { Archive, MapPin, Pencil, Plus, Save, Trash2, X } from "lucide-react";

import { formatPhoneInput } from "@/lib/account-validation";

export type StoreLocationItem = {
  id: string;
  city: string;
  address: string;
  phone: string;
  hours: string;
  isActive: boolean;
  sortOrder: number;
};

type Draft = {
  id?: string;
  city: string;
  address: string;
  phone: string;
  hours: string;
  isActive: boolean;
  sortOrder: number;
};

const emptyDraft: Draft = {
  city: "",
  address: "",
  phone: "+91 ",
  hours: "11 AM - 8 PM",
  isActive: true,
  sortOrder: 0,
};

const fieldClass =
  "h-11 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 text-sm outline-none focus:border-[var(--primary)]";

export default function AdminStoreLocationsManager({
  initialLocations,
}: {
  initialLocations: StoreLocationItem[];
}) {
  const [locations, setLocations] = useState<StoreLocationItem[]>(initialLocations);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function saveLocation(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");

    const payload = {
      ...draft,
      sortOrder: Number(draft.sortOrder),
      isActive: draft.isActive,
    };

    try {
      const endpoint = draft.id
        ? `/api/admin/store-locations/${draft.id}`
        : "/api/admin/store-locations";
      const response = await fetch(endpoint, {
        method: draft.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json().catch(() => ({}))) as {
        location?: StoreLocationItem;
        message?: string;
      };

      if (!response.ok || !result.location) {
        throw new Error(result.message ?? "Could not save store location.");
      }

      const location = result.location;
      setLocations((current) =>
        draft.id
          ? current.map((item) => (item.id === draft.id ? location : item))
          : [...current, location],
      );
      setDraft(emptyDraft);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save store location.");
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteLocation(id: string) {
    if (!window.confirm("Delete this store location permanently?")) return;

    try {
      const response = await fetch(`/api/admin/store-locations/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const result = (await response.json().catch(() => ({}))) as { message?: string };
        throw new Error(result.message ?? "Could not delete store location.");
      }

      setLocations((current) => current.filter((item) => item.id !== id));
      if (draft.id === id) {
        setDraft(emptyDraft);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not delete store location.");
    }
  }

  async function deactivateLocation(id: string) {
    const location = locations.find((item) => item.id === id);
    if (!location) return;

    const response = await fetch(`/api/admin/store-locations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...location, isActive: false }),
    });

    if (!response.ok) {
      setMessage("Could not deactivate store location.");
      return;
    }

    setLocations((current) =>
      current.map((location) =>
        location.id === id ? { ...location, isActive: false } : location,
      ),
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)] xl:items-start">
      <section className="rounded-lg border bg-[var(--surface)]">
        <div className="flex items-center gap-2 border-b px-4 py-3">
          <MapPin className="h-4 w-4 text-[var(--primary)]" />
          <h2 className="font-serif text-xl font-semibold">
            {draft.id ? "Edit store location" : "Add store location"}
          </h2>
        </div>

        <form onSubmit={saveLocation} className="grid gap-4 p-4">
          <label className="block text-sm font-semibold">
            City / Studio name
            <input
              required
              value={draft.city}
              onChange={(event) => setDraft({ ...draft, city: event.target.value })}
              placeholder="Bengaluru Experience Studio"
              className={`${fieldClass} mt-2`}
            />
          </label>

          <label className="block text-sm font-semibold">
            Address
            <input
              required
              value={draft.address}
              onChange={(event) => setDraft({ ...draft, address: event.target.value })}
              placeholder="Indiranagar, 100 Feet Road"
              className={`${fieldClass} mt-2`}
            />
          </label>

          <label className="block text-sm font-semibold">
            Phone
            <input
              required
              value={draft.phone}
              type="tel"
              maxLength={16}
              onChange={(event) =>
                setDraft({ ...draft, phone: formatPhoneInput(event.target.value) })
              }
              placeholder="+91 98765 43210"
              className={`${fieldClass} mt-2`}
            />
          </label>

          <label className="block text-sm font-semibold">
            Hours
            <input
              required
              value={draft.hours}
              onChange={(event) => setDraft({ ...draft, hours: event.target.value })}
              placeholder="11 AM - 8 PM"
              className={`${fieldClass} mt-2`}
            />
          </label>

          <label className="block text-sm font-semibold">
            Sort order
            <input
              type="number"
              min={0}
              value={draft.sortOrder}
              onChange={(event) => setDraft({ ...draft, sortOrder: Number(event.target.value) })}
              className={`${fieldClass} mt-2`}
            />
          </label>

          <label className="flex items-center gap-3 text-sm font-semibold">
            <input
              type="checkbox"
              checked={draft.isActive}
              onChange={(event) => setDraft({ ...draft, isActive: event.target.checked })}
              className="h-4 w-4 accent-[var(--primary)]"
            />
            Active location
          </label>

          {message ? (
            <p className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
              {message}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex h-11 items-center gap-2 rounded-md bg-[var(--primary)] px-4 text-sm font-semibold text-white disabled:opacity-60"
            >
              {draft.id ? <Save size={16} /> : <Plus size={16} />}
              {isSaving ? "Saving..." : draft.id ? "Save changes" : "Add location"}
            </button>

            {draft.id ? (
              <button
                type="button"
                onClick={() => setDraft(emptyDraft)}
                className="inline-flex h-11 items-center gap-2 rounded-md border border-[var(--border)] px-4 text-sm font-semibold"
              >
                <X size={16} />
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      </section>

      <section className="rounded-lg border bg-[var(--surface)]">
        <div className="border-b px-4 py-3">
          <h2 className="font-serif text-xl font-semibold">Store locations</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-xs uppercase text-[var(--text-secondary)]">
              <tr className="border-b">
                <th className="px-4 py-3 font-semibold">City</th>
                <th className="px-4 py-3 font-semibold">Address</th>
                <th className="px-4 py-3 font-semibold">Phone</th>
                <th className="px-4 py-3 font-semibold">Hours</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {locations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-[var(--text-secondary)]">
                    No store locations configured yet.
                  </td>
                </tr>
              ) : (
                locations.map((location) => (
                  <tr key={location.id} className="border-b last:border-b-0 align-top">
                    <td className="px-4 py-4 font-medium">{location.city}</td>
                    <td className="px-4 py-4">{location.address}</td>
                    <td className="px-4 py-4">{location.phone}</td>
                    <td className="px-4 py-4">{location.hours}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          location.isActive
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
                        }`}
                      >
                        {location.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          title="Deactivate location"
                          disabled={!location.isActive}
                          onClick={() => deactivateLocation(location.id)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[var(--border)] text-red-600 disabled:opacity-30"
                        >
                          <Archive size={16} />
                        </button>
                        <button
                          type="button"
                          title="Edit location"
                          onClick={() =>
                            setDraft({
                              id: location.id,
                              city: location.city,
                              address: location.address,
                              phone: location.phone,
                              hours: location.hours,
                              isActive: location.isActive,
                              sortOrder: location.sortOrder,
                            })
                          }
                          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[var(--border)]"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          title="Delete location"
                          onClick={() => deleteLocation(location.id)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[var(--border)] text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
