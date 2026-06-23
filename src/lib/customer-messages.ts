import "server-only";

import { hasDatabaseUrl } from "@/lib/auth";
import { sendAuthEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ContactMessageInput = {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
};

function clean(value?: string) {
  return typeof value === "string" ? value.trim() : "";
}

export async function createContactMessage(input: ContactMessageInput) {
  const name = clean(input.name);
  const email = clean(input.email).toLowerCase();
  const phone = clean(input.phone);
  const subject = clean(input.subject);
  const message = clean(input.message);

  if (!name) throw new Error("Name is required.");
  if (!emailPattern.test(email)) throw new Error("Valid email is required.");
  if (!subject) throw new Error("Subject is required.");
  if (message.length < 10) {
    throw new Error("Message should be at least 10 characters.");
  }

  if (!hasDatabaseUrl()) {
    await sendAuthEmail({
      to: "hello@woodloom.in",
      subject: `Contact request: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || "-"}\n\n${message}`,
    });
    return null;
  }

  return prisma.contactMessage.create({
    data: {
      name,
      email,
      phone: phone || null,
      subject,
      message,
    },
  });
}

export async function subscribeToNewsletter(input: {
  email?: string;
  source?: string;
}) {
  const email = clean(input.email).toLowerCase();
  const source = clean(input.source) || "footer";

  if (!emailPattern.test(email)) {
    throw new Error("Enter a valid email address.");
  }

  if (!hasDatabaseUrl()) {
    await sendAuthEmail({
      to: email,
      subject: "Welcome to WOODLOOM",
      text: "You are subscribed to WOODLOOM updates.",
    });
    return null;
  }

  return prisma.newsletterSubscriber.upsert({
    where: { email },
    create: {
      email,
      source,
      status: "ACTIVE",
    },
    update: {
      source,
      status: "ACTIVE",
    },
  });
}

export async function listAdminContactMessages() {
  if (!hasDatabaseUrl()) {
    return [];
  }

  try {
    return prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.warn("Could not load contact messages:", error);
    return [];
  }
}

export async function updateAdminContactMessage(
  id: string,
  input: { status?: string },
) {
  if (!hasDatabaseUrl()) {
    throw new Error("Database connection is not configured yet.");
  }

  const status = clean(input.status || "NEW").toUpperCase();
  const allowedStatuses = ["NEW", "READ", "RESOLVED"];

  if (!allowedStatuses.includes(status)) {
    throw new Error("Invalid message status.");
  }

  return prisma.contactMessage.update({
    where: { id },
    data: { status },
  });
}

export async function listAdminNewsletterSubscribers() {
  if (!hasDatabaseUrl()) {
    return [];
  }

  try {
    return prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.warn("Could not load newsletter subscribers:", error);
    return [];
  }
}

export async function updateAdminNewsletterSubscriber(
  id: string,
  input: { status?: string },
) {
  if (!hasDatabaseUrl()) {
    throw new Error("Database connection is not configured yet.");
  }

  const status = clean(input.status || "ACTIVE").toUpperCase();
  const allowedStatuses = ["ACTIVE", "UNSUBSCRIBED"];

  if (!allowedStatuses.includes(status)) {
    throw new Error("Invalid subscriber status.");
  }

  return prisma.newsletterSubscriber.update({
    where: { id },
    data: { status },
  });
}
