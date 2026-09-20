"use client";

import { FormEvent, useEffect, useState } from "react";

import { MapPin, Trash2 } from "lucide-react";

import type { AccountAddress } from "@/lib/account";
import { formatPhoneInput } from "@/lib/account-validation";
import AuthField from "@/features/auth/components/auth-field";

type DeliveryArea = { state: string; city: string; pincode: string };

export default function AddressManager({
  initialAddresses,
}: {
  initialAddresses: AccountAddress[];
}) {
  const [addresses, setAddresses] = useState(initialAddresses);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliveryAreas, setDeliveryAreas] = useState<DeliveryArea[]>([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedPincode, setSelectedPincode] = useState("");

  useEffect(() => {
    fetch("/api/delivery-areas")
      .then((response) => response.json())
      .then((data: { areas?: DeliveryArea[] }) => setDeliveryAreas(data.areas ?? []))
      .catch(() => setDeliveryAreas([]));
  }, []);

  const states = Array.from(new Set(deliveryAreas.map((area) => area.state)));
  const cities = Array.from(
    new Set(
      deliveryAreas
        .filter((area) => area.state === selectedState)
        .map((area) => area.city),
    ),
  );
  const pincodes = deliveryAreas.filter(
    (area) => area.state === selectedState && area.city === selectedCity,
  );

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
    if (!selectedState || !selectedCity || !selectedPincode) {
      setMessage("Select a supported delivery location. Need special delivery? Contact us.");
      setIsSubmitting(false);
      return;
    }
    const formData = new FormData(form);
    const response = await fetch("/api/account/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: formData.get("fullName"),
        phone: formData.get("phone"),
        line1: formData.get("line1"),
        line2: formData.get("line2"),
        city: selectedCity,
        state: selectedState,
        postalCode: selectedPincode,
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
    setSelectedState("");
    setSelectedCity("");
    setSelectedPincode("");
    setMessage("Address saved successfully.");
    await refreshAddresses();
  }

  async function removeAddress(id: string) {
    const response = await fetch(`/api/account/addresses/${id}`, { method: "DELETE" });
    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as { message?: string };
      setMessage(data.message ?? "Unable to delete address.");
      return;
    }
    setAddresses((current) => current.filter((address) => address.id !== id));
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
            type="tel"
            maxLength={16}
            required
            onChange={(event) => {
              event.currentTarget.value = formatPhoneInput(event.currentTarget.value);
            }}
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
          <label className="grid gap-2 text-sm font-medium">State<select required value={selectedState} onChange={(event) => { setSelectedState(event.target.value); setSelectedCity(""); setSelectedPincode(""); }} className="h-14 rounded-full border border-[var(--border)] bg-transparent px-5 outline-none focus:border-[var(--primary)]"><option value="">Select state</option>{states.map((state) => <option key={state} value={state}>{state}</option>)}</select></label>
          <label className="grid gap-2 text-sm font-medium">City<select required value={selectedCity} disabled={!selectedState} onChange={(event) => { setSelectedCity(event.target.value); setSelectedPincode(""); }} className="h-14 rounded-full border border-[var(--border)] bg-transparent px-5 outline-none focus:border-[var(--primary)]"><option value="">Select city</option>{cities.map((city) => <option key={city} value={city}>{city}</option>)}</select></label>
          <label className="grid gap-2 text-sm font-medium">Pincode<select required name="postalCode" value={selectedPincode} disabled={!selectedCity} onChange={(event) => setSelectedPincode(event.target.value)} className="h-14 rounded-full border border-[var(--border)] bg-transparent px-5 outline-none focus:border-[var(--primary)]"><option value="">Select pincode</option>{pincodes.map((area) => <option key={area.pincode} value={area.pincode}>{area.pincode}</option>)}</select></label>
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

          <p className="text-sm text-[var(--text-secondary)] md:col-span-2">
            Location not listed? <a href="/contact" className="font-semibold text-[var(--primary)]">Contact us for special delivery.</a>
          </p>

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
