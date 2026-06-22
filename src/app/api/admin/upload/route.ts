import { NextResponse } from "next/server";

import { canAccessAdmin } from "@/lib/auth";
import {
  getUploadMode,
  uploadLocalProductImage,
  uploadProductImage,
} from "@/lib/cloudinary";
import { getCurrentSession } from "@/lib/session";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await getCurrentSession();

  if (!session || !canAccessAdmin(session.role)) {
    return NextResponse.json({ message: "Admin access required." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ message: "Choose an image to upload." }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ message: "Only image files are allowed." }, { status: 400 });
  }

  if (file.size > 8 * 1024 * 1024) {
    return NextResponse.json(
      { message: "Image must be smaller than 8 MB." },
      { status: 400 },
    );
  }

  try {
    const mode = getUploadMode();

    if (mode === "unconfigured") {
      return NextResponse.json(
        {
          message:
            "Cloudinary is required in this environment. Add Cloudinary keys before uploading images.",
        },
        { status: 503 },
      );
    }

    const url = mode === "cloudinary"
      ? await uploadProductImage(file)
      : await uploadLocalProductImage(file);

    return NextResponse.json({
      message:
        mode === "cloudinary"
          ? "Image uploaded to Cloudinary."
          : "Image saved locally for development.",
      storage: mode,
      url,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Image upload failed.",
      },
      { status: 502 },
    );
  }
}
