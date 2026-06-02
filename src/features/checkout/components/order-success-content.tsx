"use client";

import Link from "next/link";

import { CheckCircle2 } from "lucide-react";

import { formatPrice, useCommerceSelector } from "@/store/commerce-store";

export default function OrderSuccessContent() {
  const lastOrder = useCommerceSelector((state) => state.lastOrder);

  if (!lastOrder) {
    return (
      <div className="max-w-[1440px] mx-auto px-5 sm:px-6 lg:px-10 py-20 lg:py-24">
        <p className="uppercase tracking-[4px] text-sm text-[var(--primary)] mb-4">
          Order Status
        </p>

        <h1 className="text-4xl sm:text-5xl lg:text-7xl leading-[0.95] font-serif mb-8">
          No Recent Order Found
        </h1>

        <Link
          href="/products"
          className="
            inline-flex
            h-14
            items-center
            rounded-full
            bg-[var(--primary)]
            px-8
            text-sm
            uppercase
            tracking-[2px]
            text-white
          "
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1000px] mx-auto px-5 sm:px-6 lg:px-10 py-20 lg:py-24 text-center">
      <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--primary)] text-white">
        <CheckCircle2 size={40} />
      </div>

      <p className="uppercase tracking-[4px] text-sm text-[var(--primary)] mb-4">
        Order Confirmed
      </p>

      <h1 className="text-4xl sm:text-5xl lg:text-7xl leading-[0.95] font-serif mb-6">
        Your Furniture Is Reserved
      </h1>

      <p className="mx-auto max-w-[620px] text-[var(--text-secondary)] leading-relaxed mb-10">
        We have captured your order request. The operations flow will later
        connect this confirmation to payment verification, inventory, and admin
        processing.
      </p>

      <div
        className="
          mx-auto
          mb-10
          grid
          max-w-[620px]
          gap-5
          rounded-[28px]
          border
          border-[var(--border)]
          bg-[var(--surface)]
          p-8
          text-left
        "
      >
        <div className="flex items-center justify-between">
          <span className="text-[var(--text-secondary)]">Order number</span>
          <strong>{lastOrder.orderNumber}</strong>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[var(--text-secondary)]">Payment method</span>
          <strong>
            {lastOrder.paymentMethod === "cod" ? "Cash On Delivery" : "Razorpay"}
          </strong>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[var(--text-secondary)]">Items</span>
          <strong>{lastOrder.items.length}</strong>
        </div>

        <div className="flex items-center justify-between border-t border-[var(--border)] pt-5 text-xl">
          <span>Total</span>
          <strong>{formatPrice(lastOrder.total)}</strong>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/products"
          className="
            inline-flex
            h-14
            items-center
            rounded-full
            bg-[var(--primary)]
            px-8
            text-sm
            uppercase
            tracking-[2px]
            text-white
          "
        >
          Continue Shopping
        </Link>

        <Link
          href="/"
          className="
            inline-flex
            h-14
            items-center
            rounded-full
            border
            border-[var(--border)]
            px-8
            text-sm
            uppercase
            tracking-[2px]
          "
        >
          Back Home
        </Link>
      </div>
    </div>
  );
}
