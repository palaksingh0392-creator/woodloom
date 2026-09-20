import { NextResponse } from "next/server";

import { canAccessAdmin } from "@/lib/auth";
import {
  listAdminNotifications,
  markAdminNotificationRead,
  markAllAdminNotificationsRead,
} from "@/lib/admin-notifications";
import { getCurrentSession } from "@/lib/session";

export const dynamic = "force-dynamic";

async function authorize() {
  const session = await getCurrentSession();
  return Boolean(session && canAccessAdmin(session.role));
}

export async function GET() {
  if (!(await authorize())) {
    return NextResponse.json({ message: "Admin access required." }, { status: 401 });
  }

  const notifications = await listAdminNotifications();
  return NextResponse.json({
    notifications,
    unreadCount: notifications.filter((notification) => !notification.isRead).length,
  });
}

export async function PATCH(request: Request) {
  if (!(await authorize())) {
    return NextResponse.json({ message: "Admin access required." }, { status: 401 });
  }

  const body = (await request.json()) as { id?: string; all?: boolean };
  if (body.all) {
    await markAllAdminNotificationsRead();
  } else if (body.id) {
    await markAdminNotificationRead(body.id);
  } else {
    return NextResponse.json({ message: "Notification id is required." }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}