"use client";

import { useState } from "react";
import { Archive, MapPin, Pencil, Plus, Save, Trash2, X } from "lucide-react";

export type DeliveryAreaItem = {
  id: string;
  state: string;
  city: string;
  pincode: string;
  deliveryCharge: number;
  estimatedDays: number;
  isActive: boolean;
};

type Draft = {
  id?: string;
  state: string;
  city: string;
  pincode: string;
  deliveryCharge: number;
  estimatedDays: number;
  isActive: boolean;
};

const emptyDraft: Draft = {
  state: "",
  city: "",
  pincode: "",
  deliveryCharge: 999,
  estimatedDays: 7,
  isActive: true,
};

const fieldClass =
  "h-11 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 text-sm outline-none focus:border-[var(--primary)]";

export default function AdminDeliveryAreasManager({
  initialAreas,
}: {
  initialAreas: DeliveryAreaItem[];
}) {
  const [areas, setAreas] = useState<DeliveryAreaItem[]>(initialAreas);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function saveArea(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");

    const payload = {
      ...draft,
      pincode: draft.pincode.replace(/\D/g, "").slice(0, 6),
      deliveryCharge: Number(draft.deliveryCharge),
      estimatedDays: Number(draft.estimatedDays),
      isActive: draft.isActive,
    };

    try {
      const endpoint = draft.id
        ? `/api/admin/delivery-areas/${draft.id}`
        : "/api/admin/delivery-areas";
      const response = await fetch(endpoint, {
        method: draft.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json().catch(() => ({}))) as {
        area?: DeliveryAreaItem;
        message?: string;
      };

      if (!response.ok || !result.area) {
        throw new Error(result.message ?? "Could not save delivery area.");
      }

      const area = result.area;
      setAreas((current) =>
        draft.id
          ? current.map((item) => (item.id === draft.id ? area : item))
          : [area, ...current],
      );
      setDraft(emptyDraft);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save delivery area.");
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteArea(id: string) {
    if (!window.confirm("Delete this delivery area permanently?")) return;

    try {
      const response = await fetch(`/api/admin/delivery-areas/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const result = (await response.json().catch(() => ({}))) as { message?: string };
        throw new Error(result.message ?? "Could not delete delivery area.");
      }

      setAreas((current) => current.filter((item) => item.id !== id));
      if (draft.id === id) {
        setDraft(emptyDraft);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not delete delivery area.");
    }
  }

  async function deactivateArea(id: string) {
    const area = areas.find((item) => item.id === id);
    if (!area) return;

    const response = await fetch(`/api/admin/delivery-areas/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...area, isActive: false }),
    });

    if (!response.ok) {
      setMessage("Could not deactivate delivery area.");
      return;
    }

    setAreas((current) =>
      current.map((area) => (area.id === id ? { ...area, isActive: false } : area)),
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)] xl:items-start">
      <section className="rounded-lg border bg-[var(--surface)]">
        <div className="flex items-center gap-2 border-b px-4 py-3">
          <MapPin className="h-4 w-4 text-[var(--primary)]" />
          <h2 className="font-serif text-xl font-semibold">
            {draft.id ? "Edit delivery area" : "Add delivery area"}
          </h2>
        </div>

        <form onSubmit={saveArea} className="grid gap-4 p-4">
          <label className="block text-sm font-semibold">
            State
            <input
              required
              value={draft.state}
              onChange={(event) => setDraft({ ...draft, state: event.target.value })}
              placeholder="Delhi"
              className={`${fieldClass} mt-2`}
            />
          </label>

          <label className="block text-sm font-semibold">
            City
            <input
              required
              value={draft.city}
              onChange={(event) => setDraft({ ...draft, city: event.target.value })}
              placeholder="New Delhi"
              className={`${fieldClass} mt-2`}
            />
          </label>

          <label className="block text-sm font-semibold">
            Pincode
            <input
              required
              inputMode="numeric"
              value={draft.pincode}
              onChange={(event) =>
                setDraft({ ...draft, pincode: event.target.value.replace(/\D/g, "").slice(0, 6) })
              }
              placeholder="110001"
              className={`${fieldClass} mt-2`}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold">
              Delivery charge
              <input
                required
                type="number"
                min={0}
                step="1"
                value={draft.deliveryCharge}
                onChange={(event) =>
                  setDraft({ ...draft, deliveryCharge: Number(event.target.value) })
                }
                className={`${fieldClass} mt-2`}
              />
            </label>

            <label className="block text-sm font-semibold">
              Est. days
              <input
                required
                type="number"
                min={1}
                step="1"
                value={draft.estimatedDays}
                onChange={(event) =>
                  setDraft({ ...draft, estimatedDays: Number(event.target.value) })
                }
                className={`${fieldClass} mt-2`}
              />
            </label>
          </div>

          <label className="flex items-center gap-3 text-sm font-semibold">
            <input
              type="checkbox"
              checked={draft.isActive}
              onChange={(event) =>
                setDraft({ ...draft, isActive: event.target.checked })
              }
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
              {isSaving ? "Saving..." : draft.id ? "Save changes" : "Add area"}
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
          <h2 className="font-serif text-xl font-semibold">Serviceable locations</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-xs uppercase text-[var(--text-secondary)]">
              <tr className="border-b">
                <th className="px-4 py-3 font-semibold">State</th>
                <th className="px-4 py-3 font-semibold">City</th>
                <th className="px-4 py-3 font-semibold">Pincode</th>
                <th className="px-4 py-3 font-semibold">Charge</th>
                <th className="px-4 py-3 font-semibold">Days</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {areas.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-[var(--text-secondary)]">
                    No delivery areas configured yet.
                  </td>
                </tr>
              ) : (
                areas.map((area) => (
                  <tr key={area.id} className="border-b last:border-b-0">
                    <td className="px-4 py-4 font-medium">{area.state}</td>
                    <td className="px-4 py-4">{area.city}</td>
                    <td className="px-4 py-4">{area.pincode}</td>
                    <td className="px-4 py-4">₹{area.deliveryCharge}</td>
                    <td className="px-4 py-4">{area.estimatedDays} days</td>
                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          area.isActive
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
                        }`}
                      >
                        {area.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          title="Deactivate area"
                          disabled={!area.isActive}
                          onClick={() => deactivateArea(area.id)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[var(--border)] text-red-600 disabled:opacity-30"
                        >
                          <Archive size={16} />
                        </button>
                        <button
                          type="button"
                          title="Edit area"
                          onClick={() =>
                            setDraft({
                              id: area.id,
                              state: area.state,
                              city: area.city,
                              pincode: area.pincode,
                              deliveryCharge: area.deliveryCharge,
                              estimatedDays: area.estimatedDays,
                              isActive: area.isActive,
                            })
                          }
                          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[var(--border)]"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          title="Delete area"
                          onClick={() => deleteArea(area.id)}
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
