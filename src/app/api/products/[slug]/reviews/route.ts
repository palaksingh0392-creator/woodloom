import { NextResponse } from "next/server";

import { createProductReview, listProductReviews } from "@/lib/reviews";
import { getCurrentSession } from "@/lib/session";

export const dynamic = "force-dynamic";

type ReviewRouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(_request: Request, { params }: ReviewRouteContext) {
  const { slug } = await params;

  return NextResponse.json({
    reviews: await listProductReviews(slug),
  });
}

export async function POST(request: Request, { params }: ReviewRouteContext) {
  const session = await getCurrentSession();

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const body = (await request.json()) as {
    rating?: number;
    title?: string;
    content?: string;
  };

  try {
    await createProductReview({
      userId: session.id,
      productSlug: slug,
      rating: Number(body.rating),
      title: body.title,
      content: body.content ?? "",
    });

    return NextResponse.json({
      reviews: await listProductReviews(slug),
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Unable to save review.",
      },
      { status: 400 },
    );
  }
}
