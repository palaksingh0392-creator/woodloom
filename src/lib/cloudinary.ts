import "server-only";

import { createHash, randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export function isCloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );
}

export function canUseLocalUploads() {
  if (process.env.CLOUDINARY_UPLOAD_MODE === "local") return true;
  if (process.env.CLOUDINARY_UPLOAD_MODE === "cloudinary") return false;
  if (process.env.VERCEL === "1") return false;

  return process.env.NODE_ENV !== "production";
}

export function getUploadMode() {
  if (isCloudinaryConfigured()) return "cloudinary";
  if (canUseLocalUploads()) return "local";
  return "unconfigured";
}

export async function uploadProductImage(file: File) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary is not configured.");
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = "woodloom/products";
  const signature = createHash("sha1")
    .update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`)
    .digest("hex");
  const formData = new FormData();

  formData.set("file", file);
  formData.set("api_key", apiKey);
  formData.set("timestamp", String(timestamp));
  formData.set("folder", folder);
  formData.set("signature", signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: formData },
  );
  const result = (await response.json()) as {
    secure_url?: string;
    error?: { message?: string };
  };

  if (!response.ok || !result.secure_url) {
    throw new Error(result.error?.message ?? "Image upload failed.");
  }

  return result.secure_url;
}

function getFileExtension(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (extension && /^[a-z0-9]+$/.test(extension)) {
    return extension;
  }

  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  if (file.type === "image/gif") return "gif";
  return "jpg";
}

export async function uploadLocalProductImage(file: File) {
  if (!canUseLocalUploads()) {
    throw new Error(
      "Cloudinary is required for this environment. Add Cloudinary keys before uploading images.",
    );
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads", "products");
  const fileName = `${Date.now()}-${randomUUID()}.${getFileExtension(file)}`;
  const filePath = path.join(uploadDir, fileName);
  const bytes = Buffer.from(await file.arrayBuffer());

  await mkdir(uploadDir, { recursive: true });
  await writeFile(filePath, bytes);

  return `/uploads/products/${fileName}`;
}
