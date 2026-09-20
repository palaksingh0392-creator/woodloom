import assert from "node:assert/strict";
import test from "node:test";

import {
  canReserveVariant,
  getAvailableVariantStock,
} from "./stock";

test("available stock subtracts reserved units", () => {
  assert.equal(getAvailableVariantStock(12, 4), 8);
  assert.equal(getAvailableVariantStock(3, 5), 0);
});

test("stock is only reservable within available units", () => {
  assert.equal(canReserveVariant(10, 3, 7), true);
  assert.equal(canReserveVariant(10, 3, 8), false);
  assert.equal(canReserveVariant(2, 2, 1), false);
});
