import { get } from "@/lib/apiRequest";

export type DocumentKind = "WARRANTY" | "MANUAL" | "CERTIFICATE";

/** `Document` model, as returned by `GET /documents`. */
export interface DocumentRecord {
  _id: string;
  kind: DocumentKind | "REPORT" | "CONTRACT" | "INVOICE" | "OTHER";
  title: string;
  url: string;
  mimeType?: string;
  createdAt: string;
}

export interface DocumentsFilterParams {
  kind?: DocumentKind;
  sort?: "newest" | "oldest" | "name";
  page?: number;
  limit?: number;
}

export const getDocuments = (params?: DocumentsFilterParams) =>
  get<DocumentRecord[]>("/documents", { ...params, limit: params?.limit || 10, page: params?.page || 1 });
