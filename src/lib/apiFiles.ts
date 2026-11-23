import { clientFetch } from "./clientFetch";
import type { IApiErrorBody, IApiResponse, IUploadedFile } from "@/types";

const errorMessageOf = async (res: Response, fallback: string) => {
  try {
    const body = (await res.json()) as IApiErrorBody;
    return body?.error?.message || fallback;
  } catch {
    return fallback;
  }
};

/**
 * Open or save a backend PDF (`/quotes/:id/pdf`, `/contracts/:id/pdf`, `/invoices/:id/pdf`)
 * from the browser. They need the Bearer header, so a plain <a href> can't be used.
 */
export const downloadPdf = async (path: string, { inline = false, fileName = "document.pdf" } = {}) => {
  const res = await clientFetch(inline ? `${path}${path.includes("?") ? "&" : "?"}inline=true` : path);
  if (!res.ok) throw new Error(await errorMessageOf(res, "Could not download the PDF"));
  const url = URL.createObjectURL(await res.blob());
  if (inline) {
    window.open(url, "_blank", "noopener");
  } else {
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
  }
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
};

/** `POST /uploads` from the browser (multipart field `files`, max 4 per call). */
export const uploadFiles = async (files: File[], poolId?: string): Promise<IUploadedFile[]> => {
  if (files.length > 4) throw new Error("You can upload at most 4 files at a time");
  const form = new FormData();
  files.forEach((file) => form.append("files", file));
  if (poolId) form.append("poolId", poolId);
  const res = await clientFetch("/uploads", { method: "POST", body: form });
  if (!res.ok) throw new Error(await errorMessageOf(res, "Upload failed"));
  return ((await res.json()) as IApiResponse<IUploadedFile[]>).data;
};
