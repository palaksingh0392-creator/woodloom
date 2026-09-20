export function getAvailableVariantStock(stock: number, reserved: number) {
  return Math.max(stock - reserved, 0);
}

export function canReserveVariant(stock: number, reserved: number, quantity: number) {
  if (!Number.isInteger(quantity) || quantity < 1) {
    return false;
  }

  return getAvailableVariantStock(stock, reserved) >= quantity;
}
