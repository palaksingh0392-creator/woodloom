export function calculateOrderPaymentBreakdown(
  total: number,
  paymentPlan?: string | null,
  paidAmountOverride?: number,
) {
  const normalizedPlan = paymentPlan?.toUpperCase() === "PARTIAL" ? "PARTIAL" : "FULL";
  const advanceAmount = normalizedPlan === "PARTIAL" ? Math.ceil(total * 0.3) : total;
  const rawPaidAmount = typeof paidAmountOverride === "number" ? paidAmountOverride : 0;
  const paidAmount = Math.max(0, Math.min(rawPaidAmount, total));
  const dueAmount = Math.max(total - paidAmount, 0);
  const paymentStatus =
    paidAmount <= 0 ? "PENDING" : dueAmount > 0 ? "PARTIALLY_PAID" : "PAID";

  return {
    paymentPlan: normalizedPlan,
    advanceAmount,
    paidAmount,
    dueAmount,
    paymentStatus,
  };
}