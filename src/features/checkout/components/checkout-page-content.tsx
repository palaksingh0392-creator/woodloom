"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";

import { CheckCircle2, CreditCard, MapPin, ShieldCheck } from "lucide-react";

import type { Product } from "@/data/products";
import type { AccountAddress } from "@/lib/account";
import {
  calculateCartTotals,
  commerceActions,
  formatPrice,
  type CheckoutAddress,
  type PaymentMethod,
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

export default function CheckoutPageContent({
  products,
  savedAddresses,
}: {
  products: Product[];
  savedAddresses: AccountAddress[];
}) {
  const router = useRouter();
  const cartItems = useCommerceSelector((state) => state.cartItems);
  const pricedCartItems = useMemo(() => {
    const productBySlug = new Map(
      products.map((product) => [product.slug, product]),
    );

    return cartItems.map((item) => ({
      ...item,
      price: productBySlug.get(item.productSlug)?.price ?? item.price,
    }));
  }, [cartItems, products]);
  const totals = calculateCartTotals(pricedCartItems);
  const defaultAddressId = savedAddresses[0]?.id ?? "new";
  const [selectedAddressId, setSelectedAddressId] = useState(defaultAddressId);
  const [address, setAddress] = useState(emptyAddress);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateAddress = (field: keyof CheckoutAddress, value: string) => {
    setAddress((currentAddress) => ({
      ...currentAddress,
      [field]: value,
    }));
  };

  const placeOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (cartItems.length === 0) {
      return;
    }

    setMessage("");
    setIsSubmitting(true);

    const selectedSavedAddress = savedAddresses.find(
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
      subtotal: totals.subtotal,
      deliveryCharge: totals.deliveryCharge,
      total: totals.total,
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...localOrder,
          addressId: selectedSavedAddress?.id,
          address: selectedSavedAddress ? undefined : address,
        }),
      });

      const data = (await response.json()) as {
        message?: string;
        order?: {
          orderNumber?: string;
          subtotal?: number;
          deliveryCharge?: number;
          total?: number;
        };
      };

      if (!response.ok || !data.order) {
        setMessage(data.message ?? "Unable to place this order.");
        setIsSubmitting(false);
        return;
      }

      commerceActions.placeOrder({
        ...localOrder,
        subtotal: data.order.subtotal ?? totals.subtotal,
        deliveryCharge:
          data.order.deliveryCharge ?? totals.deliveryCharge,
        total: data.order.total ?? totals.total,
        orderNumber: data.order.orderNumber,
      });
      router.push("/checkout/success");
    } catch {
      setMessage("The order server is unavailable. Please try again.");
      setIsSubmitting(false);
    }

  };

  if (cartItems.length === 0) {
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
      className="max-w-[1440px] mx-auto px-5 sm:px-6 lg:px-10 py-14 lg:py-20"
    >
      <div className="mb-12">
        <p className="uppercase tracking-[4px] text-sm text-[var(--primary)] mb-4">
          Secure Checkout
        </p>

        <h1 className="text-4xl sm:text-5xl lg:text-7xl leading-[0.95] font-serif">
          Complete Your Order
        </h1>
      </div>

      <div className="grid lg:grid-cols-[1fr_420px] gap-12 items-start">
        <div className="grid gap-8">
          <section
            className="
              rounded-[28px]
              border
              border-[var(--border)]
              bg-[var(--surface)]
              p-8
            "
          >
            <div className="flex items-center gap-3 mb-8">
              <MapPin size={22} />
              <h2 className="text-3xl font-serif">Delivery Address</h2>
            </div>

            {savedAddresses.length > 0 ? (
              <div className="mb-6 grid gap-4 md:grid-cols-2">
                {savedAddresses.map((savedAddress) => (
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
                      <input
                        type="radio"
                        name="savedAddress"
                        checked={selectedAddressId === savedAddress.id}
                        onChange={() => setSelectedAddressId(savedAddress.id)}
                        className="mt-1 accent-[var(--primary)]"
                      />
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
              <div className="grid md:grid-cols-2 gap-5">
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
                onChange={(event) => updateAddress("phone", event.target.value)}
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

              <input
                required
                value={address.city}
                onChange={(event) => updateAddress("city", event.target.value)}
                placeholder="City"
                className="h-14 rounded-full border border-[var(--border)] bg-transparent px-5 outline-none focus:border-[var(--primary)]"
              />

              <input
                required
                value={address.state}
                onChange={(event) => updateAddress("state", event.target.value)}
                placeholder="State"
                className="h-14 rounded-full border border-[var(--border)] bg-transparent px-5 outline-none focus:border-[var(--primary)]"
              />

              <input
                required
                value={address.pincode}
                onChange={(event) =>
                  updateAddress("pincode", event.target.value)
                }
                placeholder="Pincode"
                className="h-14 rounded-full border border-[var(--border)] bg-transparent px-5 outline-none focus:border-[var(--primary)]"
              />
            </div>
            ) : null}
          </section>

          <section
            className="
              rounded-[28px]
              border
              border-[var(--border)]
              bg-[var(--surface)]
              p-8
            "
          >
            <div className="flex items-center gap-3 mb-8">
              <CreditCard size={22} />
              <h2 className="text-3xl font-serif">Payment Method</h2>
            </div>

            <div className="grid gap-4">
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
                    Pay after delivery confirmation.
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
                className="
                  flex
                  items-center
                  justify-between
                  gap-4
                  rounded-[22px]
                  border
                  border-[var(--border)]
                  p-5
                  opacity-60
                "
              >
                <span>
                  <span className="block font-medium">Razorpay</span>
                  <span className="text-sm text-[var(--text-secondary)]">
                    UPI, cards, and net banking integration comes next.
                  </span>
                </span>

                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "razorpay"}
                  onChange={() => setPaymentMethod("razorpay")}
                  disabled
                />
              </label>
            </div>
          </section>
        </div>

        <aside
          className="
            sticky
            top-32
            rounded-[28px]
            border
            border-[var(--border)]
            bg-[var(--surface)]
            p-8
          "
        >
          <div className="flex items-center gap-3 mb-8">
            <ShieldCheck size={22} />
            <h2 className="text-3xl font-serif">Order Summary</h2>
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
