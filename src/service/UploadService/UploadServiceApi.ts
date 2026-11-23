/**
 * Files (Postman folder "User" → Upload Files): `POST /uploads`, multipart field `files`,
 * up to 4 files per call, 8 MB each, JPEG / PNG / WebP / PDF. Returns each file's URL
 * (`/uploads/…` locally, absolute when the backend uses Cloudinary).
 */
import { request } from "@/lib/apiRequest";
import type { IUploadedFile } from "@/types";

export const UPLOAD_MAX_FILES = 4;
export const UPLOAD_MAX_BYTES = 8 * 1024 * 1024;
export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

/** Checks the rules the backend enforces, so the customer hears about them before the upload. */
export const validateImages = (files: File[]): string | null => {
  for (const f of files) {
    if (!IMAGE_TYPES.includes(f.type)) return `${f.name}: only JPG, PNG or WebP images are allowed.`;
    if (f.size > UPLOAD_MAX_BYTES) return `${f.name} is larger than 8 MB.`;
  }
  return null;
};

export const uploadFiles = (files: File[], poolId?: string) => {
  const form = new FormData();
  files.forEach((f) => form.append("files", f));
  if (poolId) form.append("poolId", poolId);
  return request<IUploadedFile[]>("/uploads", { method: "POST", body: form });
};
