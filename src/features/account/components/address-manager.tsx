"use client";

import { FormEvent, useState } from "react";

import { MapPin, Trash2 } from "lucide-react";

import type { AccountAddress } from "@/lib/account";
import AuthField from "@/features/auth/components/auth-field";

export default function AddressManager({
  initialAddresses,
}: {
  initialAddresses: AccountAddress[];
}) {
  const [addresses, setAddresses] = useState(initialAddresses);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function refreshAddresses() {
    const response = await fetch("/api/account/addresses");

    if (response.ok) {
      const data = (await response.json()) as { addresses: AccountAddress[] };
      setAddresses(data.addresses);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const response = await fetch("/api/account/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: formData.get("fullName"),
        phone: formData.get("phone"),
        line1: formData.get("line1"),
        line2: formData.get("line2"),
        city: formData.get("city"),
        state: formData.get("state"),
        postalCode: formData.get("postalCode"),
        type: formData.get("type"),
        isDefault: formData.get("isDefault") === "on",
      }),
    });
    const data = (await response.json()) as { message?: string };

    setIsSubmitting(false);

    if (!response.ok) {
      setMessage(data.message ?? "Unable to save address.");
      return;
    }

    form.reset();
    setMessage("Address saved successfully.");
    await refreshAddresses();
  }

  async function removeAddress(id: string) {
    await fetch(`/api/account/addresses/${id}`, { method: "DELETE" });
    await refreshAddresses();
  }

  async function setDefaultAddress(id: string) {
    await fetch(`/api/account/addresses/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isDefault: true }),
    });
    await refreshAddresses();
  }

  return (
    <div className="grid gap-6">
      <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-7">
        <div className="mb-6 flex items-center gap-3">
          <MapPin size={22} />
          <h2 className="text-4xl leading-tight">Saved Addresses</h2>
        </div>

        {addresses.length === 0 ? (
          <p className="text-[var(--text-secondary)]">
            No saved addresses yet. Add one below to reuse it during checkout.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {addresses.map((address) => (
              <article
                key={address.id}
                className="rounded-[20px] border border-[var(--border)] p-5"
              >
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl">{address.fullName}</h3>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {address.phone}
                    </p>
                  </div>

                  {address.isDefault && (
                    <span className="rounded-full bg-[var(--primary)] px-3 py-1 text-xs uppercase tracking-[2px] text-white">
                      Default
                    </span>
                  )}
                </div>

                <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                  {address.line1}
                  {address.line2 ? `, ${address.line2}` : ""}
                  <br />
                  {address.city}, {address.state} {address.postalCode}
                  <br />
                  {address.country}
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  {!address.isDefault && (
                    <button
                      type="button"
                      onClick={() => setDefaultAddress(address.id)}
                      className="rounded-full border border-[var(--border)] px-4 py-2 text-sm"
                    >
                      Make Default
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => removeAddress(address.id)}
                    className="flex items-center gap-2 rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--danger)]"
                  >
                    <Trash2 size={15} />
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-7">
        <p className="mb-6 text-sm uppercase tracking-[3px] text-[var(--primary)]">
          Add New Address
        </p>

        <form className="grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
          <AuthField
            id="fullName"
            name="fullName"
            label="Full name"
            placeholder="Your name"
            required
          />
          <AuthField
            id="phone"
            name="phone"
            label="Phone"
            placeholder="+91 98765 43210"
            required
          />
          <div className="md:col-span-2">
            <AuthField
              id="line1"
              name="line1"
              label="Address line 1"
              placeholder="House, street, area"
              required
            />
          </div>
          <div className="md:col-span-2">
            <AuthField
              id="line2"
              name="line2"
              label="Address line 2"
              placeholder="Apartment, landmark"
            />
          </div>
          <AuthField id="city" name="city" label="City" placeholder="Bengaluru" required />
          <AuthField id="state" name="state" label="State" placeholder="Karnataka" required />
          <AuthField
            id="postalCode"
            name="postalCode"
            label="Pincode"
            placeholder="560001"
            required
          />
          <AuthField id="type" name="type" label="Type" defaultValue="HOME" />

          <label className="flex items-center gap-3 text-sm text-[var(--text-secondary)] md:col-span-2">
            <input name="isDefault" type="checkbox" className="accent-[var(--primary)]" />
            Use as default delivery address
          </label>

          {message && (
            <p className="rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3 text-sm text-[var(--text-secondary)] md:col-span-2">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="h-14 rounded-full bg-[var(--primary)] px-8 text-sm uppercase tracking-[2px] text-white disabled:cursor-not-allowed disabled:opacity-60 md:col-span-2 md:w-fit"
          >
            {isSubmitting ? "Saving" : "Save Address"}
          </button>
        </form>
      </div>
    </div>
  );
}
