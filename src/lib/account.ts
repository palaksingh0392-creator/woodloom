import "server-only";

import { hasDatabaseUrl, type AuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type AccountProfile = AuthUser & {
  phone: string;
};

export type AccountAddress = {
  id: string;
  type: string;
  fullName: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
};

export async function getAccountProfile(user: AuthUser): Promise<AccountProfile> {
  if (!hasDatabaseUrl()) {
    return { ...user, phone: "" };
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
    },
  });

  if (!dbUser) {
    return { ...user, phone: "" };
  }

  return {
    id: dbUser.id,
    name: dbUser.name,
    email: dbUser.email,
    phone: dbUser.phone ?? "",
    role: user.role,
  };
}

export async function listAccountAddresses(userId: string) {
  if (!hasDatabaseUrl()) {
    return [];
  }

  const addresses = await prisma.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });

  return addresses.map((address) => ({
    id: address.id,
    type: address.type,
    fullName: address.fullName,
    phone: address.phone,
    line1: address.line1,
    line2: address.line2 ?? "",
    city: address.city,
    state: address.state,
    postalCode: address.postalCode,
    country: address.country,
    isDefault: address.isDefault,
  }));
}
