"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";

import { CheckCircle2, CreditCard, MapPin, ShieldCheck, X } from "lucide-react";

import type { Product } from "@/data/products";
import type { AccountAddress } from "@/lib/account";
import { formatPhoneInput } from "@/lib/account-validation";
import { calculateOrderPaymentBreakdown } from "@/lib/payment-breakdown";
import { parsePriceAmount } from "@/lib/price";
import {
  calculateCartTotals,
  commerceActions,
  formatPrice,
  type CheckoutAddress,
  type PaymentMethod,
  type PaymentPlan,
  useCommerceSelector,
} from "@/store/commerce-store";

const emptyAddress: CheckoutAddress = {
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  pincode: "",
};

type RazorpayCheckoutResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type DeliveryArea = { state: string; city: string; pincode: string };

type RazorpayCheckout = {
  open: () => void;
  on: (
    event: "payment.failed",
    handler: (response: { error?: { description?: string } }) => void,
  ) => void;
};

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => RazorpayCheckout;
  }
}

function loadRazorpayScript() {
  return new Promise<boolean>((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CheckoutPageContent({
  products,
  savedAddresses,
  razorpayConfigured,
}: {
  products: Product[];
  savedAddresses: AccountAddress[];
  razorpayConfigured: boolean;
}) {
  const router = useRouter();
  const cartItems = useCommerceSelector((state) => state.cartItems);
  const pricedCartItems = useMemo(() => {
    const productBySlug = new Map(
      products.map((product) => [product.slug, product]),
    );

    return cartItems.map((item) => ({
      ...item,
      price: (() => {
        const product = productBySlug.get(item.productSlug);
        if (!product) return item.price;

        const variantKey = `${item.finish.trim().toLowerCase()}::${item.grade?.trim().toLowerCase() ?? ""}`;
        const adjustment =
          product.variantPriceAdjustments?.[variantKey] ??
          (item.grade ? product.gradePriceAdjustments?.[item.grade] ?? 0 : 0);

        return `Rs. ${(parsePriceAmount(product.price) + adjustment).toLocaleString("en-IN")}`;
      })(),
    }));
  }, [cartItems, products]);
  const totals = calculateCartTotals(pricedCartItems);
  const [visibleAddresses, setVisibleAddresses] = useState(savedAddresses);
  const defaultAddressId = visibleAddresses[0]?.id ?? "new";
  const [selectedAddressId, setSelectedAddressId] = useState(defaultAddressId);
  const [address, setAddress] = useState(emptyAddress);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [paymentPlan, setPaymentPlan] = useState<PaymentPlan>("full");
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
  const paymentBreakdown = calculateOrderPaymentBreakdown(
    totals.total,
    paymentPlan,
    paymentMethod === "cod" ? 0 : paymentPlan === "partial" ? Math.ceil(totals.total * 0.3) : totals.total,
  );
  const advanceAmount = paymentBreakdown.advanceAmount;
  const payableNow = paymentMethod === "cod" ? 0 : advanceAmount;
  const dueAmount = paymentBreakdown.dueAmount;

  const updateAddress = (field: keyof CheckoutAddress, value: string) => {
    setAddress((currentAddress) => ({
      ...currentAddress,
      [field]: value,
    }));
  };

  async function removeSavedAddress(id: string) {
    setMessage("");

    try {
      const response = await fetch(`/api/account/addresses/${id}`, {
        method: "DELETE",
      });
      const data = (await response.json().catch(() => ({}))) as {
        message?: string;
      };

      if (!response.ok) {
        throw new Error(data.message ?? "Unable to delete this address.");
      }

      setVisibleAddresses((current) => current.filter((item) => item.id !== id));
      if (selectedAddressId === id) {
        setSelectedAddressId("new");
      }
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to delete this address.",
      );
    }
  }

  async function placeLocalOrder(
    localOrder: {
      items: typeof pricedCartItems;
      address: CheckoutAddress;
      paymentMethod: PaymentMethod;
      paymentPlan: PaymentPlan;
      subtotal: number;
      deliveryCharge: number;
      total: number;
      paidAmount: number;
      dueAmount: number;
    },
    selectedSavedAddress?: AccountAddress,
  ) {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...localOrder,
        addressId: selectedSavedAddress?.id,
        address: selectedSavedAddress ? undefined : address,
      }),
    });
    const data = (await response.json().catch(() => ({}))) as {
      message?: string;
      order?: {
        orderNumber?: string;
        subtotal?: number;
        deliveryCharge?: number;
        total?: number;
        amount?: number;
        paidAmount?: number;
        dueAmount?: number;
        paymentPlan?: string;
      };
    };

    if (!response.ok || !data.order) {
      throw new Error(data.message ?? "Unable to place this order.");
    }

    return data.order;
  }

  async function placeManualPaymentOrder(
    localOrder: {
      items: typeof pricedCartItems;
      address: CheckoutAddress;
      paymentMethod: PaymentMethod;
      paymentPlan: PaymentPlan;
      subtotal: number;
      deliveryCharge: number;
      total: number;
      paidAmount: number;
      dueAmount: number;
    },
    selectedSavedAddress?: AccountAddress,
  ) {
    const response = await fetch("/api/payments/manual/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...localOrder,
        addressId: selectedSavedAddress?.id,
        address: selectedSavedAddress ? undefined : address,
      }),
    });
    const data = (await response.json().catch(() => ({}))) as {
      message?: string;
      order?: {
        orderNumber?: string;
        subtotal?: number;
        deliveryCharge?: number;
        total?: number;
        amount?: number;
        paidAmount?: number;
        dueAmount?: number;
        paymentPlan?: string;
      };
    };

    if (!response.ok || !data.order) {
      throw new Error(data.message ?? "Unable to create this payment order.");
    }

    return data.order;
  }

  async function placeRazorpayOrder(
    localOrder: {
      items: typeof pricedCartItems;
      address: CheckoutAddress;
      paymentMethod: PaymentMethod;
      paymentPlan: PaymentPlan;
      subtotal: number;
      deliveryCharge: number;
      total: number;
      paidAmount: number;
      dueAmount: number;
    },
    selectedSavedAddress?: AccountAddress,
  ) {
    const isLoaded = await loadRazorpayScript();

    const Razorpay = window.Razorpay;

    if (!isLoaded || !Razorpay) {
      throw new Error("Razorpay checkout could not be loaded.");
    }

    const orderResponse = await fetch("/api/payments/razorpay/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...localOrder,
        addressId: selectedSavedAddress?.id,
        address: selectedSavedAddress ? undefined : address,
      }),
    });
    const orderData = (await orderResponse.json().catch(() => ({}))) as {
      message?: string;
      keyId?: string;
      orderNumber?: string;
      razorpayOrderId?: string;
      amount?: number;
      currency?: string;
    };

    if (
      !orderResponse.ok ||
      !orderData.keyId ||
      !orderData.orderNumber ||
      !orderData.razorpayOrderId
    ) {
      throw new Error(orderData.message ?? "Razorpay order could not be created.");
    }

    return new Promise<{
      orderNumber?: string;
      subtotal?: number;
      deliveryCharge?: number;
      total?: number;
      amount?: number;
      paidAmount?: number;
      dueAmount?: number;
      paymentPlan?: string;
    }>((resolve, reject) => {
      const checkout = new Razorpay({
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency ?? "INR",
        name: "Shissoo",
        description:
          paymentPlan === "partial" ? "30% advance payment" : "Furniture order payment",
        order_id: orderData.razorpayOrderId,
        prefill: {
          name: localOrder.address.fullName,
          contact: localOrder.address.phone,
        },
        theme: {
          color: "#c99b64",
        },
        modal: {
          ondismiss: () => reject(new Error("Razorpay payment was cancelled.")),
        },
        handler: async (response: RazorpayCheckoutResponse) => {
          try {
            const verifyResponse = await fetch("/api/payments/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderNumber: orderData.orderNumber,
                ...response,
              }),
            });
            const verifyData = (await verifyResponse.json().catch(() => ({}))) as {
              message?: string;
              order?: {
                orderNumber?: string;
                subtotal?: number;
                deliveryCharge?: number;
                total?: number;
                amount?: number;
                paidAmount?: number;
                dueAmount?: number;
                paymentPlan?: string;
              };
            };

            if (!verifyResponse.ok || !verifyData.order) {
              reject(new Error(verifyData.message ?? "Payment could not be verified."));
              return;
            }

            resolve(verifyData.order);
          } catch {
            reject(new Error("Payment verification server is unavailable."));
          }
        },
      });

      checkout.on("payment.failed", (response) => {
        reject(
          new Error(
            response.error?.description ?? "Razorpay payment failed. Please try again.",
          ),
        );
      });
      checkout.open();
    });
  }

  const placeOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (cartItems.length === 0) {
      return;
    }

    setMessage("");
    setIsSubmitting(true);

    if (selectedAddressId === "new" && (!selectedState || !selectedCity || !selectedPincode)) {
      setMessage("Select a supported delivery location. Need special delivery? Visit our contact page.");
      setIsSubmitting(false);
      return;
    }

      const selectedSavedAddress = visibleAddresses.find(
      (savedAddress) => savedAddress.id === selectedAddressId,
    );
    const orderAddress = selectedSavedAddress
      ? {
          fullName: selectedSavedAddress.fullName,
          phone: selectedSavedAddress.phone,
          addressLine1: selectedSavedAddress.line1,
          addressLine2: selectedSavedAddress.line2,
          city: selectedSavedAddress.city,
          state: selectedSavedAddress.state,
          pincode: selectedSavedAddress.postalCode,
        }
      : address;
    const localOrder = {
      items: pricedCartItems,
      address: orderAddress,
      paymentMethod,
      paymentPlan,
      subtotal: totals.subtotal,
      deliveryCharge: totals.deliveryCharge,
      total: totals.total,
      paidAmount: payableNow,
      dueAmount,
    };

    try {
      const isManualPayment = paymentMethod === "razorpay" && !razorpayConfigured;
      const order =
        isManualPayment
          ? await placeManualPaymentOrder(localOrder, selectedSavedAddress)
          : paymentMethod === "razorpay"
          ? await placeRazorpayOrder(localOrder, selectedSavedAddress)
          : await placeLocalOrder(localOrder, selectedSavedAddress);

      commerceActions.placeOrder({
        ...localOrder,
        subtotal: order.subtotal ?? totals.subtotal,
        deliveryCharge:
          order.deliveryCharge ?? totals.deliveryCharge,
        total: order.total ?? totals.total,
        paidAmount: order.paidAmount ?? payableNow,
        dueAmount: order.dueAmount ?? dueAmount,
        orderNumber: order.orderNumber,
      });
      router.push(
        isManualPayment
          ? `/checkout/temporary-payment?orderNumber=${encodeURIComponent(order.orderNumber ?? "")}&amount=${encodeURIComponent(String(order.amount ?? order.total ?? totals.total))}`
          : "/checkout/success",
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "The order server is unavailable. Please check the database update and try again.",
      );
      setIsSubmitting(false);
    }

  };

  if (cartItems.length === 0) {
    if (isSubmitting) {
      return (
        <div className="mx-auto max-w-3xl px-5 py-24 text-center">
          <p className="text-sm uppercase tracking-[3px] text-[var(--primary)]">Order received</p>
          <h1 className="mt-4 font-serif text-4xl">Preparing your payment details...</h1>
        </div>
      );
    }

    return (
      <div className="max-w-[1440px] mx-auto px-5 sm:px-6 lg:px-10 py-20 lg:py-24">
        <p className="uppercase tracking-[4px] text-sm text-[var(--primary)] mb-4">
          Checkout
        </p>

        <h1 className="text-4xl sm:text-5xl lg:text-7xl leading-[0.95] font-serif mb-8">
          Your Cart Needs A Piece First
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
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={placeOrder}
      className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-10 lg:py-20"
    >
      <div className="mb-8 sm:mb-12">
        <p className="mb-4 text-sm uppercase tracking-[4px] text-[var(--primary)]">
          Secure Checkout
        </p>

        <h1 className="text-4xl leading-[0.95] font-serif sm:text-5xl lg:text-7xl">
          Complete Your Order
        </h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,380px)] lg:items-start lg:gap-8 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="grid gap-6 sm:gap-8">
          <section
            className="
              rounded-[22px]
              sm:rounded-[28px]
              border
              border-[var(--border)]
              bg-[var(--surface)]
              p-4
              sm:p-8
            "
          >
            <div className="flex items-center gap-3 mb-8">
              <MapPin size={22} />
              <h2 className="font-serif text-2xl sm:text-3xl">Delivery Address</h2>
            </div>

            {visibleAddresses.length > 0 ? (
              <div className="mb-6 grid gap-4 md:grid-cols-2">
                {visibleAddresses.map((savedAddress) => (
                  <label
                    key={savedAddress.id}
                    className={`
                      cursor-pointer
                      rounded-[22px]
                      border
                      p-5
                      transition
                      ${
                        selectedAddressId === savedAddress.id
                          ? "border-[var(--primary)] bg-[var(--surface-muted)]"
                          : "border-[var(--border)]"
                      }
                    `}
                  >
                    <div className="mb-3 flex items-start justify-between gap-4">
                      <span>
                        <span className="block font-semibold">
                          {savedAddress.fullName}
                        </span>
                        <span className="text-sm text-[var(--text-secondary)]">
                          {savedAddress.phone}
                        </span>
                      </span>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="savedAddress"
                          checked={selectedAddressId === savedAddress.id}
                          onChange={() => setSelectedAddressId(savedAddress.id)}
                          className="mt-1 accent-[var(--primary)]"
                        />
                        <button
                          type="button"
                          aria-label={`Remove ${savedAddress.fullName}'s address from checkout`}
                          title="Remove from checkout"
                          onClick={(event) => {
                            event.preventDefault();
                            void removeSavedAddress(savedAddress.id);
                          }}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--danger)] hover:text-[var(--danger)]"
                        >
                          <X size={15} />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                      {savedAddress.line1}
                      {savedAddress.line2 ? `, ${savedAddress.line2}` : ""}
                      <br />
                      {savedAddress.city}, {savedAddress.state}{" "}
                      {savedAddress.postalCode}
                    </p>
                    {savedAddress.isDefault ? (
                      <span className="mt-4 inline-flex rounded-full bg-[var(--primary)] px-3 py-1 text-xs uppercase tracking-[2px] text-white">
                        Default
                      </span>
                    ) : null}
                  </label>
                ))}

                <label
                  className={`
                    cursor-pointer
                    rounded-[22px]
                    border
                    p-5
                    transition
                    ${
                      selectedAddressId === "new"
                        ? "border-[var(--primary)] bg-[var(--surface-muted)]"
                        : "border-[var(--border)]"
                    }
                  `}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span>
                      <span className="block font-semibold">Use a new address</span>
                      <span className="text-sm text-[var(--text-secondary)]">
                        This will be saved for next time.
                      </span>
                    </span>
                    <input
                      type="radio"
                      name="savedAddress"
                      checked={selectedAddressId === "new"}
                      onChange={() => setSelectedAddressId("new")}
                      className="accent-[var(--primary)]"
                    />
                  </div>
                </label>
              </div>
            ) : null}

            {selectedAddressId === "new" ? (
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  required
                  value={address.fullName}
                  onChange={(event) =>
                    updateAddress("fullName", event.target.value)
                  }
                  placeholder="Full name"
                  className="h-14 rounded-full border border-[var(--border)] bg-transparent px-5 outline-none focus:border-[var(--primary)]"
                />

                <input
                  required
                  value={address.phone}
                  type="tel"
                  maxLength={16}
                  onChange={(event) =>
                    updateAddress("phone", formatPhoneInput(event.target.value))
                  }
                  placeholder="Phone number"
                  className="h-14 rounded-full border border-[var(--border)] bg-transparent px-5 outline-none focus:border-[var(--primary)]"
                />

                <input
                  required
                  value={address.addressLine1}
                  onChange={(event) =>
                    updateAddress("addressLine1", event.target.value)
                  }
                  placeholder="Address line 1"
                  className="h-14 rounded-full border border-[var(--border)] bg-transparent px-5 outline-none focus:border-[var(--primary)] md:col-span-2"
                />

                <input
                  value={address.addressLine2}
                  onChange={(event) =>
                    updateAddress("addressLine2", event.target.value)
                  }
                  placeholder="Apartment, landmark, optional"
                  className="h-14 rounded-full border border-[var(--border)] bg-transparent px-5 outline-none focus:border-[var(--primary)] md:col-span-2"
                />

                <select
                  required
                  value={address.state}
                  onChange={(event) => { setSelectedState(event.target.value); setSelectedCity(""); setSelectedPincode(""); updateAddress("state", event.target.value); updateAddress("city", ""); updateAddress("pincode", ""); }}
                  className="h-14 rounded-full border border-[var(--border)] bg-transparent px-5 outline-none focus:border-[var(--primary)]"
                ><option value="">Select state</option>{states.map((state) => <option key={state} value={state}>{state}</option>)}</select>

                <select
                  required
                  value={address.city}
                  disabled={!address.state}
                  onChange={(event) => { setSelectedCity(event.target.value); setSelectedPincode(""); updateAddress("city", event.target.value); updateAddress("pincode", ""); }}
                  className="h-14 rounded-full border border-[var(--border)] bg-transparent px-5 outline-none focus:border-[var(--primary)]"
                ><option value="">Select city</option>{cities.map((city) => <option key={city} value={city}>{city}</option>)}</select>

                <select
                  required
                  value={address.pincode}
                  onChange={(event) => { setSelectedPincode(event.target.value); updateAddress("pincode", event.target.value); }}
                  className="h-14 rounded-full border border-[var(--border)] bg-transparent px-5 outline-none focus:border-[var(--primary)] md:col-span-2"
                ><option value="">Select pincode</option>{pincodes.map((area) => <option key={area.pincode} value={area.pincode}>{area.pincode}</option>)}</select>
                <p className="text-sm text-[var(--text-secondary)] md:col-span-2">Location not listed? <Link href="/contact" className="font-semibold text-[var(--primary)]">Contact us for special delivery.</Link></p>
              </div>
            ) : null}
          </section>

          <section
            className="
              rounded-[22px]
              sm:rounded-[28px]
              border
              border-[var(--border)]
              bg-[var(--surface)]
              p-5
              sm:p-8
            "
          >
            <div className="flex items-center gap-3 mb-8">
              <CreditCard size={22} />
              <h2 className="font-serif text-2xl sm:text-3xl">Payment Method</h2>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label
                  className={`
                    flex cursor-pointer items-start gap-4 rounded-[22px] border p-4 sm:p-5
                    ${
                      paymentPlan === "full"
                        ? "border-[var(--primary)] bg-[var(--surface-muted)]"
                        : "border-[var(--border)]"
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="paymentPlan"
                    checked={paymentPlan === "full"}
                    onChange={() => setPaymentPlan("full")}
                    className="mt-1 accent-[var(--primary)]"
                  />
                  <span>
                    <span className="block font-medium">Full payment</span>
                    <span className="text-sm text-[var(--text-secondary)]">
                      Pay the complete order value.
                    </span>
                  </span>
                </label>

                <label
                  className={`
                    flex cursor-pointer items-start gap-4 rounded-[22px] border p-4 sm:p-5
                    ${
                      paymentPlan === "partial"
                        ? "border-[var(--primary)] bg-[var(--surface-muted)]"
                        : "border-[var(--border)]"
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="paymentPlan"
                    checked={paymentPlan === "partial"}
                    onChange={() => setPaymentPlan("partial")}
                    className="mt-1 accent-[var(--primary)]"
                  />
                  <span>
                    <span className="block font-medium">30% advance</span>
                    <span className="text-sm text-[var(--text-secondary)]">
                      Reserve now, settle balance before delivery.
                    </span>
                  </span>
                </label>
              </div>

              <label
                className={`
                  flex
                  cursor-pointer
                  items-center
                  justify-between
                  gap-4
                  rounded-[22px]
                  border
                  p-5
                  ${
                    paymentMethod === "cod"
                      ? "border-[var(--primary)]"
                      : "border-[var(--border)]"
                  }
                `}
              >
              <span>
                  <span className="block font-medium">Cash On Delivery</span>
                  <span className="text-sm text-[var(--text-secondary)]">
                    Payable amount will be collected manually by the team.
                  </span>
                </span>

                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                />
              </label>

              <label
                className={`
                  flex
                  cursor-pointer
                  items-center
                  justify-between
                  gap-4
                  rounded-[22px]
                  border
                  border-[var(--border)]
                  p-5
                  ${
                    paymentMethod === "razorpay"
                      ? "border-[var(--primary)]"
                      : "border-[var(--border)]"
                  }
                `}
              >
                <span>
                  <span className="block font-medium">Razorpay</span>
                  <span className="text-sm text-[var(--text-secondary)]">
                    UPI, cards, and net banking.
                  </span>
                </span>

                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "razorpay"}
                  onChange={() => setPaymentMethod("razorpay")}
                />
              </label>
            </div>
          </section>
        </div>

        <aside
          className="
            rounded-[22px]
            border
            border-[var(--border)]
            bg-[var(--surface)]
            p-4
            sm:p-6
            lg:sticky
            lg:top-32
            sm:rounded-[28px]
          "
        >
          <div className="flex items-center gap-3 mb-8">
            <ShieldCheck size={22} />
            <h2 className="font-serif text-2xl sm:text-3xl">Order Summary</h2>
          </div>

          <div className="grid gap-5 mb-8">
            {pricedCartItems.map((item) => (
              <div
                key={`${item.productSlug}-${item.finish}`}
                className="grid grid-cols-[72px_1fr] gap-4"
              >
                <div className="relative aspect-square overflow-hidden rounded-[16px] bg-[var(--surface-muted)]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="72px"
                    className="object-cover"
                  />
                </div>

                <div>
                  <p className="font-medium leading-tight">{item.title}</p>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">
                    {item.finish} x {item.quantity}
                  </p>
                  <p className="mt-2 text-sm font-semibold">{item.price}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-5 border-y border-[var(--border)] py-6 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-secondary)]">Subtotal</span>
              <strong>{formatPrice(totals.subtotal)}</strong>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[var(--text-secondary)]">Delivery</span>
              <strong>
                {totals.deliveryCharge === 0
                  ? "Free"
                  : formatPrice(totals.deliveryCharge)}
              </strong>
            </div>
          </div>

          <div className="flex items-center justify-between text-xl mb-8">
            <span>Total</span>
            <strong>{formatPrice(totals.total)}</strong>
          </div>

          <div className="mb-8 grid gap-3 rounded-[18px] bg-[var(--surface-muted)] p-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-secondary)]">Payment plan</span>
              <strong>{paymentPlan === "partial" ? "30% advance" : "Full payment"}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-secondary)]">Payable now</span>
              <strong>{payableNow === 0 ? "Manual collection" : formatPrice(payableNow)}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-secondary)]">Balance due</span>
              <strong>{formatPrice(dueAmount)}</strong>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="
              flex
              h-14
              w-full
              items-center
              justify-center
              gap-2
              rounded-full
              bg-[var(--primary)]
              text-sm
              uppercase
              tracking-[2px]
              text-white
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            <CheckCircle2 size={18} />
            {isSubmitting ? "Placing Order" : "Place Order"}
          </button>

          {message && (
            <p className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3 text-sm text-[var(--text-secondary)]">
              {message}
            </p>
          )}
        </aside>
      </div>
    </form>
  );
}
