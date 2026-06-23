import { NextResponse } from "next/server";

import { subscribeToNewsletter } from "@/lib/customer-messages";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    await subscribeToNewsletter(await request.json());

    return NextResponse.json({
      message: "You are subscribed to WOODLOOM updates.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Unable to subscribe.",
      },
      { status: 400 },
    );
  }
}
