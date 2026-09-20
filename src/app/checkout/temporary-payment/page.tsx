import { ArrowLeft, Mail, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import MainLayout from "@/components/layout/main-layout";
import ManualPaymentForm from "@/features/checkout/components/manual-payment-form";
import { listAccountOrders } from "@/lib/orders";
import { getCurrentSession } from "@/lib/session";

export const metadata = {
  title: "Pay by UPI | Shissoo",
  description: "Temporary UPI payment instructions for your Shissoo order.",
};

export const dynamic = "force-dynamic";

function getQrImageUrl(upiId: string) {
  const upiUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=Shissoo`;
  return (
    process.env.NEXT_PUBLIC_TEMP_PAYMENT_QR_IMAGE ||
    `https://api.qrserver.com/v1/create-qr-code/?size=360x360&data=${encodeURIComponent(upiUri)}`
  );
}

export default async function TemporaryPaymentPage({
  searchParams,
}: {
  searchParams: Promise<{ orderNumber?: string; amount?: string }>;
}) {
  const params = await searchParams;
  const upiId =
    process.env.NEXT_PUBLIC_TEMP_PAYMENT_UPI_ID || "paytm.s2ti8rd@pty";
  const phone = process.env.NEXT_PUBLIC_TEMP_PAYMENT_PHONE || "9587550110";
  const emails = [
    process.env.NEXT_PUBLIC_TEMP_PAYMENT_EMAIL || "auth@shissoo.com",
    process.env.NEXT_PUBLIC_TEMP_PAYMENT_BACKUP_EMAIL || "kevat0001@gmail.com",
  ];
  const orderNumber = params.orderNumber?.trim() || "";
  const amount = params.amount?.trim() || "";
  const session = await getCurrentSession();
  const order = session
    ? (await listAccountOrders(session.id)).find(
        (item) => item.orderNumber === orderNumber,
      )
    : null;
  const firstItem = order?.items[0];

  return (
    <MainLayout>
      <main className="mx-auto max-w-5xl px-5 py-14 sm:px-6 lg:px-10 lg:py-20">
        <Link
          href="/checkout"
          className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary)]"
        >
          <ArrowLeft size={17} />
          Back to checkout
        </Link>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
          <section className="rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-10">
            <p className="mb-4 text-sm uppercase tracking-[3px] text-[var(--primary)]">
              Temporary payment option
            </p>
            <h1 className="font-serif text-4xl leading-tight sm:text-5xl">
              Pay securely by UPI
            </h1>
            <p className="mt-5 max-w-2xl leading-relaxed text-[var(--text-secondary)]">
              Razorpay is being configured. Until it is ready, scan the QR code
              or pay using the UPI ID below, then contact our team with your
              payment confirmation and delivery details.
            </p>

            {firstItem ? (
              <div className="mt-8 flex items-center gap-4 rounded-[18px] border border-[var(--border)] p-4">
                {firstItem.imageUrl ? (
                  <Image
                    src={firstItem.imageUrl}
                    alt={firstItem.productName}
                    width={80}
                    height={80}
                    className="h-20 w-20 rounded-xl object-cover"
                  />
                ) : null}
                <div>
                  <p className="text-xs uppercase tracking-[2px] text-[var(--text-secondary)]">Product</p>
                  <p className="mt-1 text-lg font-semibold">{firstItem.productName}</p>
                  {order && order.items.length > 1 ? (
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">+ {order.items.length - 1} more item(s)</p>
                  ) : null}
                </div>
              </div>
            ) : null}

            <div className="mt-8 rounded-[18px] bg-[var(--surface-muted)] p-5">
              {orderNumber ? (
                <div className="mb-4 border-b border-[var(--border)] pb-4">
                  <p className="text-sm text-[var(--text-secondary)]">Order number</p>
                  <p className="mt-1 text-lg font-semibold">{orderNumber}</p>
                </div>
              ) : null}
              {order ? (
                <div className="mb-4 border-b border-[var(--border)] pb-4 text-sm">
                  <p className="mb-3 font-semibold">Payment breakdown</p>
                  <div className="space-y-2 text-[var(--text-secondary)]">
                    {order.items.map((item) => {
                      const baseTotal = item.baseUnitPrice * item.quantity;
                      const variantTotal = item.variantCharge * item.quantity;

                      return (
                        <div key={`${item.sku}-${item.finish ?? "finish"}`} className="space-y-1">
                          <div className="flex justify-between gap-4 text-[var(--text-primary)]">
                            <span>{item.productName} x {item.quantity}</span>
                            <span>Rs. {(baseTotal + variantTotal).toLocaleString("en-IN")}</span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span>Product cost</span>
                            <span>Rs. {baseTotal.toLocaleString("en-IN")}</span>
                          </div>
                          {variantTotal > 0 ? (
                            <div className="flex justify-between gap-4">
                              <span>{item.grade ? `${item.grade} charge` : "Finish charge"}</span>
                              <span>Rs. {variantTotal.toLocaleString("en-IN")}</span>
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                    <div className="flex justify-between gap-4 border-t border-[var(--border)] pt-2">
                      <span>Subtotal</span>
                      <span>Rs. {order.subtotal.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span>Delivery</span>
                      <span>Rs. {order.shippingFee.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between gap-4 border-t border-[var(--border)] pt-2 font-semibold text-[var(--text-primary)]">
                      <span>Total</span>
                      <span>Rs. {order.total.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between gap-4 font-semibold text-[var(--primary)]">
                      <span>Pay now</span>
                      <span>Rs. {Number(amount || order.total).toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between gap-4 font-semibold text-[var(--text-primary)]">
                      <span>Balance due at delivery</span>
                      <span>Rs. {Math.max(order.total - Number(amount || order.total), 0).toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>
              ) : amount ? (
                <div className="mb-4 border-b border-[var(--border)] pb-4">
                  <p className="text-sm text-[var(--text-secondary)]">Amount to pay</p>
                  <p className="mt-1 text-lg font-semibold">Rs. {Number(amount).toLocaleString("en-IN")}</p>
                </div>
              ) : null}
              <p className="text-sm text-[var(--text-secondary)]">UPI ID</p>
              <p className="mt-2 break-all text-xl font-semibold text-[var(--primary)]">
                {upiId}
              </p>
            </div>

            <div className="mt-8 border-t border-[var(--border)] pt-6">
              <p className="font-semibold">After payment</p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                Send the payment screenshot and your name to our team. We will
                confirm the order and share the next steps manually.
              </p>
              <Link
                href="/contact"
                className="mt-5 inline-flex h-12 items-center justify-center rounded-full bg-[var(--primary)] px-6 text-sm font-semibold uppercase tracking-[1.5px] text-white"
              >
                Contact the team
              </Link>
              {orderNumber ? <ManualPaymentForm orderNumber={orderNumber} /> : null}
            </div>
          </section>

          <aside className="rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-6 text-center sm:p-8">
            <div className="mx-auto w-fit rounded-xl bg-white p-3 shadow-sm">
              <Image
                src={getQrImageUrl(upiId)}
                alt={`UPI payment QR code for ${upiId}`}
                width={300}
                height={300}
                unoptimized
                className="h-auto w-[min(300px,70vw)]"
              />
            </div>
            <p className="mt-4 text-sm text-[var(--text-secondary)]">
              Scan with any UPI app
            </p>

            <div className="mt-8 grid gap-4 border-t border-[var(--border)] pt-6 text-left text-sm">
              <a href={`tel:${phone.replace(/\s+/g, "")}`} className="flex items-center gap-3">
                <Phone size={17} className="text-[var(--primary)]" />
                <span>{phone}</span>
              </a>
              <a href={`mailto:${emails[0]}`} className="flex items-center gap-3">
                <Mail size={17} className="text-[var(--primary)]" />
                <span className="break-all">{emails[0]}</span>
              </a>
              <a href={`mailto:${emails[1]}`} className="flex items-center gap-3">
                <Mail size={17} className="text-[var(--primary)]" />
                <span className="break-all">{emails[1]}</span>
              </a>
              <Link href="/contact" className="flex items-center gap-3">
                <MessageCircle size={17} className="text-[var(--primary)]" />
                <span>Message support</span>
              </Link>
            </div>
          </aside>
        </div>
      </main>
    </MainLayout>
  );
}