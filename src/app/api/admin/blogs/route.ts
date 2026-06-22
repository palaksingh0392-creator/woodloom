import { NextResponse } from "next/server";

import {
  listAdminBlogPosts,
  parseAdminBlogInput,
  upsertAdminBlogPost,
} from "@/lib/blogs";
import { canAccessAdmin } from "@/lib/auth";
import { getCurrentSession } from "@/lib/session";

export async function GET() {
  const session = await getCurrentSession();

  if (!session || !canAccessAdmin(session.role)) {
    return NextResponse.json({ message: "Admin access required." }, { status: 401 });
  }

  return NextResponse.json({ posts: await listAdminBlogPosts() });
}

export async function POST(request: Request) {
  const session = await getCurrentSession();

  if (!session || !canAccessAdmin(session.role)) {
    return NextResponse.json({ message: "Admin access required." }, { status: 401 });
  }

  try {
    const post = await upsertAdminBlogPost(
      parseAdminBlogInput(await request.json()),
    );
    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Could not save post." },
      { status: 400 },
    );
  }
}
