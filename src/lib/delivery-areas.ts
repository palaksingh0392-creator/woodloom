import "server-only";

import { hasDatabaseUrl } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type DeliveryAreaView = {
  id: string;
  state: string;
  city: string;
  pincode: string;
  deliveryCharge: number;
  estimatedDays: number;
  isActive: boolean;
};

export type DeliveryAreaInput = {
  state?: string;
  city?: string;
  pincode?: string;
  deliveryCharge?: number;
  estimatedDays?: number;
  isActive?: boolean;
};

const fallbackDeliveryAreas: DeliveryAreaView[] = [
  {
    id: "fallback-delhi-110001",
    state: "Delhi",
    city: "New Delhi",
    pincode: "110001",
    deliveryCharge: 999,
    estimatedDays: 7,
    isActive: true,
  },
  {
    id: "fallback-delhi-110011",
    state: "Delhi",
    city: "Rohini",
    pincode: "110011",
    deliveryCharge: 999,
    estimatedDays: 7,
    isActive: true,
  },
  {
    id: "fallback-delhi-110076",
    state: "Delhi",
    city: "Dwarka",
    pincode: "110076",
    deliveryCharge: 999,
    estimatedDays: 7,
    isActive: true,
  },
  {
    id: "fallback-rajasthan-302001",
    state: "Rajasthan",
    city: "Jaipur",
    pincode: "302001",
    deliveryCharge: 999,
    estimatedDays: 7,
    isActive: true,
  },
  {
    id: "fallback-rajasthan-342001",
    state: "Rajasthan",
    city: "Jodhpur",
    pincode: "342001",
    deliveryCharge: 999,
    estimatedDays: 7,
    isActive: true,
  },
  {
    id: "fallback-rajasthan-313001",
    state: "Rajasthan",
    city: "Udaipur",
    pincode: "313001",
    deliveryCharge: 999,
    estimatedDays: 7,
    isActive: true,
  },
  {
    id: "fallback-rajasthan-324005",
    state: "Rajasthan",
    city: "Kota",
    pincode: "324005",
    deliveryCharge: 999,
    estimatedDays: 7,
    isActive: true,
  },
  {
    id: "fallback-up-201301",
    state: "Uttar Pradesh",
    city: "Noida",
    pincode: "201301",
    deliveryCharge: 999,
    estimatedDays: 7,
    isActive: true,
  },
  {
    id: "fallback-up-201309",
    state: "Uttar Pradesh",
    city: "Ghaziabad",
    pincode: "201309",
    deliveryCharge: 999,
    estimatedDays: 7,
    isActive: true,
  },
  {
    id: "fallback-up-226010",
    state: "Uttar Pradesh",
    city: "Lucknow",
    pincode: "226010",
    deliveryCharge: 999,
    estimatedDays: 7,
    isActive: true,
  },
  {
    id: "fallback-up-282001",
    state: "Uttar Pradesh",
    city: "Kanpur",
    pincode: "282001",
    deliveryCharge: 999,
    estimatedDays: 7,
    isActive: true,
  },
  {
    id: "fallback-up-221001",
    state: "Uttar Pradesh",
    city: "Varanasi",
    pincode: "221001",
    deliveryCharge: 999,
    estimatedDays: 7,
    isActive: true,
  },
];

function cleanText(value?: string) {
  return value?.trim().replace(/\s+/g, " ") ?? "";
}

function normalizeLocationName(value?: string) {
  const cleaned = cleanText(value);

  if (!cleaned) {
    return "";
  }

  return cleaned
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function normalizePincode(value?: string) {
  return value?.replace(/\D/g, "").slice(0, 6) ?? "";
}

function matchesArea(
  area: DeliveryAreaView,
  address: { state?: string; city?: string; pincode?: string },
) {
  return (
    area.isActive &&
    area.state.toLowerCase() === cleanText(address.state).toLowerCase() &&
    area.city.toLowerCase() === cleanText(address.city).toLowerCase() &&
    area.pincode === normalizePincode(address.pincode)
  );
}

function toDeliveryAreaView(area: {
  id: string;
  state: string;
  city: string;
  pincode: string;
  deliveryCharge: unknown;
  estimatedDays: number;
  isActive: boolean;
}): DeliveryAreaView {
  return {
    id: area.id,
    state: area.state,
    city: area.city,
    pincode: area.pincode,
    deliveryCharge: Number(area.deliveryCharge),
    estimatedDays: area.estimatedDays,
    isActive: area.isActive,
  };
}

export async function listDeliveryAreas(options?: {
  activeOnly?: boolean;
}): Promise<DeliveryAreaView[]> {
  if (!hasDatabaseUrl()) {
    return fallbackDeliveryAreas;
  }

  const areas = await prisma.deliveryArea.findMany({
    where: options?.activeOnly ? { isActive: true } : undefined,
    orderBy: [{ state: "asc" }, { city: "asc" }, { pincode: "asc" }],
  });

  const mappedAreas = areas.map(toDeliveryAreaView);

  if (mappedAreas.length > 0) {
    return mappedAreas;
  }

  return fallbackDeliveryAreas;
}

export async function findServiceableArea(address: {
  state?: string;
  city?: string;
  pincode?: string;
}) {
  const state = cleanText(address.state);
  const city = cleanText(address.city);
  const pincode = normalizePincode(address.pincode);

  if (!state || !city || !pincode) {
    return null;
  }

  if (!hasDatabaseUrl()) {
    return fallbackDeliveryAreas.find((area) => matchesArea(area, address)) ?? null;
  }

  const area = await prisma.deliveryArea.findFirst({
    where: {
      state,
      city,
      pincode,
      isActive: true,
    },
  });

  if (area) {
    return toDeliveryAreaView(area);
  }

  return fallbackDeliveryAreas.find((fallbackArea) => matchesArea(fallbackArea, address)) ?? null;
}

export function parseDeliveryAreaInput(input: DeliveryAreaInput) {
  const state = normalizeLocationName(input.state);
  const city = normalizeLocationName(input.city);
  const pincode = normalizePincode(input.pincode);
  const deliveryCharge = Number(input.deliveryCharge ?? 999);
  const estimatedDays = Number(input.estimatedDays ?? 7);

  if (!state || !city || pincode.length !== 6) {
    throw new Error("State, city, and a 6-digit pincode are required.");
  }

  if (!Number.isFinite(deliveryCharge) || deliveryCharge < 0) {
    throw new Error("Delivery charge must be 0 or more.");
  }

  if (!Number.isInteger(estimatedDays) || estimatedDays < 1) {
    throw new Error("Estimated days must be at least 1.");
  }

  return {
    state,
    city,
    pincode,
    deliveryCharge,
    estimatedDays,
    isActive: input.isActive ?? true,
  };
}

