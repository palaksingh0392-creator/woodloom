"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function ManualPaymentForm({ orderNumber }: { orderNumber: string }) {
  const router = useRouter();
  const [transactionReference, setTransactionReference] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submitPayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("/api/payments/manual/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber, transactionReference }),
      });
      const data = (await response.json().catch(() => ({}))) as { message?: string };

      if (!response.ok) {
        throw new Error(data.message ?? "Unable to submit payment reference.");
      }

      router.push("/checkout/success");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to submit payment reference.");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={submitPayment} className="mt-8 border-t border-[var(--border)] pt-6 text-left">
      <label className="block text-sm font-semibold" htmlFor="transactionReference">
        UPI transaction reference
      </label>
      <input
        id="transactionReference"
        required
        value={transactionReference}
        onChange={(event) => setTransactionReference(event.target.value)}
        placeholder="Enter the reference from your UPI app"
        className="mt-2 h-12 w-full rounded-full border border-[var(--border)] bg-transparent px-4 text-sm outline-none focus:border-[var(--primary)]"
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-4 h-12 w-full rounded-full bg-[var(--primary)] text-sm font-semibold uppercase tracking-[1.5px] text-white disabled:opacity-60"
      >
        {isSubmitting ? "Submitting..." : "I have completed payment"}
      </button>
      {message ? <p className="mt-3 text-sm text-red-600">{message}</p> : null}
    </form>
  );
}