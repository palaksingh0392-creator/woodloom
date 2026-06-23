import { NextResponse } from "next/server";

import { createContactMessage } from "@/lib/customer-messages";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    await createContactMessage(await request.json());

    return NextResponse.json({
      message: "Thanks. Our team will get back to you soon.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unable to send your message.",
      },
      { status: 400 },
    );
  }
}
