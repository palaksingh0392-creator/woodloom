export const orderStatuses = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "PACKED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "RETURN_REQUESTED",
  "RETURNED",
] as const;

export const paymentStatuses = [
  "PENDING",
  "MANUAL_PENDING",
  "AUTHORIZED",
  "PARTIALLY_PAID",
  "PAID",
  "FAILED",
  "REFUNDED",
] as const;

export const orderStatusDepartments = {
  PENDING: "Sales",
  CONFIRMED: "Sales",
  PROCESSING: "Production",
  PACKED: "Warehouse",
  SHIPPED: "Logistics",
  DELIVERED: "Delivery",
  CANCELLED: "Operations",
  RETURN_REQUESTED: "Support",
  RETURNED: "Support",
} as const;

export const trackingStatusLabels: Record<string, string> = {
  PENDING: "Sales: Order request received",
  CONFIRMED: "Sales: Order confirmed",
  PROCESSING: "Production: Crafting and preparation started",
  PACKED: "Warehouse: Packed for dispatch",
  SHIPPED: "Logistics: Shipped from warehouse",
  DELIVERED: "Delivery: Delivered to customer",
  CANCELLED: "Operations: Cancelled",
  RETURN_REQUESTED: "Support: Return requested",
  RETURNED: "Support: Returned",
};

export type OrderStatus = (typeof orderStatuses)[number];
export type PaymentStatus = (typeof paymentStatuses)[number];

export function getDepartmentForOrderStatus(status: OrderStatus | string) {
  return orderStatusDepartments[status as keyof typeof orderStatusDepartments] ?? "Sales";
}

export function isTerminalOrderStatus(status: OrderStatus) {
  return ["DELIVERED", "CANCELLED", "RETURNED"].includes(status);
}
