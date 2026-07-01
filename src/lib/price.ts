export function parsePriceAmount(price: string) {
  const numericPrice = price.match(/\d[\d,]*(?:\.\d+)?/);

  if (!numericPrice) {
    return 0;
  }

  return Number(numericPrice[0].replace(/,/g, ""));
}
