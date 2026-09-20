import "server-only";

import { createHmac, timingSafeEqual } from "crypto";

export type RazorpayOrderResponse = {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
};

export function getRazorpayConfig() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error("Razorpay keys are not configured.");
  }

  return { keyId, keySecret };
}

export function isRazorpayConfigured() {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

export async function createRazorpayOrder(input: {
  amount: number;
  receipt: string;
  notes?: Record<string, string>;
}) {
  const { keyId, keySecret } = getRazorpayConfig();
  const credentials = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: input.amount,
      currency: "INR",
      receipt: input.receipt,
      notes: input.notes ?? {},
    }),
  });

  if (!response.ok) {
    throw new Error("Razorpay order could not be created.");
  }

  return (await response.json()) as RazorpayOrderResponse;
}

export function verifyRazorpaySignature(input: {
  orderId: string;
  paymentId: string;
  signature: string;
}) {
  const { keySecret } = getRazorpayConfig();
  const expected = createHmac("sha256", keySecret)
    .update(`${input.orderId}|${input.paymentId}`)
    .digest("hex");
  const received = input.signature;
  const expectedBuffer = Buffer.from(expected, "hex");
  const receivedBuffer = Buffer.from(received, "hex");

  return (
    expectedBuffer.length === receivedBuffer.length &&
    timingSafeEqual(expectedBuffer, receivedBuffer)
  );
}
