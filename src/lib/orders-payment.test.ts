import test from "node:test";
import assert from "node:assert/strict";

import { calculateOrderPaymentBreakdown } from "@/lib/payment-breakdown";

test("partial-payment orders keep advance and balance aligned with 30% plan", () => {
  const result = calculateOrderPaymentBreakdown(50598, "PARTIAL", 15180);

  assert.equal(result.advanceAmount, 15180);
  assert.equal(result.paidAmount, 15180);
  assert.equal(result.dueAmount, 35418);
  assert.equal(result.paymentStatus, "PARTIALLY_PAID");
});

test("lowercase partial plans are normalized before computing the balance", () => {
  const result = calculateOrderPaymentBreakdown(50598, "partial", 15180);

  assert.equal(result.advanceAmount, 15180);
  assert.equal(result.paidAmount, 15180);
  assert.equal(result.dueAmount, 35418);
  assert.equal(result.paymentStatus, "PARTIALLY_PAID");
});

test("full-payment orders have no balance due", () => {
  const result = calculateOrderPaymentBreakdown(50598, "FULL", 50598);

  assert.equal(result.advanceAmount, 50598);
  assert.equal(result.paidAmount, 50598);
  assert.equal(result.dueAmount, 0);
  assert.equal(result.paymentStatus, "PAID");
});
