import "server-only";

import { prisma } from "@/lib/prisma";

export type AdminNotificationType =
  | "ORDER"
  | "CUSTOMER"
  | "MESSAGE"
  | "REVIEW"
  | "INVENTORY";

export async function createAdminNotification(input: {
  type: AdminNotificationType;
  title: string;
  message: string;
  href: string;
  productName?: string;
  productImageUrl?: string;
}) {
  return prisma.adminNotification.create({ data: input });
}

export async function listAdminNotifications() {
  return prisma.adminNotification.findMany({
    orderBy: { createdAt: "desc" },
    take: 30,
  });
}

export async function markAdminNotificationRead(id: string) {
  return prisma.adminNotification.update({
    where: { id },
    data: { isRead: true, readAt: new Date() },
  });
}

export async function markAllAdminNotificationsRead() {
  return prisma.adminNotification.updateMany({
    where: { isRead: false },
    data: { isRead: true, readAt: new Date() },
  });
}