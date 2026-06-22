import { NextResponse } from "next/server";

import { parseAdminBlogInput, upsertAdminBlogPost } from "@/lib/blogs";
import { canAccessAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/session";

type RouteContext = { params: Promise<{ id: string }> };

async function authorize() {
  const session = await getCurrentSession();
  return Boolean(session && canAccessAdmin(session.role));
}

export async function PATCH(request: Request, context: RouteContext) {
  if (!(await authorize())) {
    return NextResponse.json({ message: "Admin access required." }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const post = await upsertAdminBlogPost(
      parseAdminBlogInput(await request.json()),
      id,
    );
    return NextResponse.json({ post });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Could not update post.",
      },
      { status: 400 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  if (!(await authorize())) {
    return NextResponse.json({ message: "Admin access required." }, { status: 401 });
  }

  const { id } = await context.params;
  const post = await prisma.blogPost.update({
    where: { id },
    data: { isPublished: false, publishedAt: null },
  });

  return NextResponse.json({ post });
}
