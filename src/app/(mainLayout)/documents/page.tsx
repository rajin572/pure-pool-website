import React from "react";
import { Metadata } from "next";
import { DocumentsClient } from "@/components/documents";
import { getDocuments, MOCK_DOCUMENTS } from "@/service/DocumentsService/DocumentsServiceApi";

export const metadata: Metadata = {
  title: "Documents | Pure Pool",
  description:
    "Warranties, manuals and certificates for everything installed at your pool. Download anything, any time.",
};

export default async function DocumentsPage() {
  /**
   * ==============================================================================
   * NEXT.JS SERVER-SIDE RENDERING (SSR) API CALL:
   *
   * const res = await getDocuments({ category: "All", page: 1, limit: 10 });
   * const initialDocuments = res.data;
   * const total = res.total;
   * ==============================================================================
   */
  const res = await getDocuments();
  const initialDocuments = res.data.length ? res.data : MOCK_DOCUMENTS;

  return (
    <DocumentsClient
      initialDocuments={initialDocuments}
      total={initialDocuments.length}
    />
  );
}

