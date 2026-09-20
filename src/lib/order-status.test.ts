import test from "node:test";
import assert from "node:assert/strict";

import {
  getDepartmentForOrderStatus,
  orderStatusDepartments,
  trackingStatusLabels,
} from "@/lib/order-status";

test("status tracking is mapped to a department", () => {
  assert.equal(getDepartmentForOrderStatus("CONFIRMED"), "Sales");
  assert.equal(getDepartmentForOrderStatus("PROCESSING"), "Production");
  assert.equal(getDepartmentForOrderStatus("PACKED"), "Warehouse");
  assert.equal(getDepartmentForOrderStatus("SHIPPED"), "Logistics");
  assert.equal(getDepartmentForOrderStatus("DELIVERED"), "Delivery");
});

test("department labels describe the workflow clearly", () => {
  assert.match(trackingStatusLabels.CONFIRMED, /Sales/i);
  assert.match(trackingStatusLabels.PROCESSING, /Production/i);
  assert.match(trackingStatusLabels.PACKED, /Warehouse/i);
  assert.equal(orderStatusDepartments.SHIPPED, "Logistics");
});
