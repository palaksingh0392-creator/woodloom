import "server-only";

import { hasDatabaseUrl } from "@/lib/auth";
import { normalizePhone } from "@/lib/account-validation";
import { prisma, withDatabaseTimeout } from "@/lib/prisma";

export type StoreLocation = {
  id: string;
  city: string;
  address: string;
  phone: string;
  hours: string;
  isActive: boolean;
  sortOrder: number;
};

const fallbackStoreLocations: StoreLocation[] = [
  {
    id: "fallback-bengaluru",
    city: "Bengaluru Experience Studio",
    address: "Indiranagar, 100 Feet Road",
    phone: "+91 98765 43210",
    hours: "11 AM - 8 PM",
    isActive: true,
    sortOrder: 0,
  },
  {
    id: "fallback-delhi",
    city: "Delhi NCR Consultation Lounge",
    address: "Saket, South Delhi",
    phone: "+91 98765 43211",
    hours: "11 AM - 7 PM",
    isActive: true,
    sortOrder: 1,
  },
];

function cleanText(value?: string) {
  return value?.trim().replace(/\s+/g, " ") ?? "";
}

export async function listStoreLocations(options?: { activeOnly?: boolean }) {
  if (!hasDatabaseUrl()) {
    return fallbackStoreLocations.filter((store) =>
      options?.activeOnly ? store.isActive : true,
    );
  }

  try {
    const stores = await withDatabaseTimeout("Store location query", () =>
      prisma.storeLocation.findMany({
        where: options?.activeOnly ? { isActive: true } : undefined,
        orderBy: [{ sortOrder: "asc" }, { city: "asc" }],
      }),
    );

    const mapped = stores.map((store) => ({
      id: store.id,
      city: store.city,
      address: store.address,
      phone: store.phone,
      hours: store.hours,
      isActive: store.isActive,
      sortOrder: store.sortOrder,
    }));

    if (mapped.length > 0) {
      return mapped;
    }
  } catch (error) {
    console.warn("Using fallback store locations because DB lookup failed:", error);
  }

  return fallbackStoreLocations.filter((store) =>
    options?.activeOnly ? store.isActive : true,
  );
}

export function parseStoreLocationInput(input: Partial<StoreLocation>) {
  const city = cleanText(input.city);
  const address = cleanText(input.address);
  const phone = normalizePhone(input.phone ?? "");
  const hours = cleanText(input.hours);
  const sortOrder = Number(input.sortOrder ?? 0);

  if (!city || !address || !phone || !hours) {
    throw new Error("City, address, hours, and a valid 10-digit phone number are required.");
  }

  if (!Number.isInteger(sortOrder) || sortOrder < 0) {
    throw new Error("Sort order must be a positive whole number.");
  }

  return {
    city,
    address,
    phone,
    hours,
    isActive: input.isActive ?? true,
    sortOrder,
  };
}
