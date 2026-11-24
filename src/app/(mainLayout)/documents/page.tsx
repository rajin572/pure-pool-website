import React from "react";
import { Metadata } from "next";
import { DocumentsClient } from "@/components/documents";

export const metadata: Metadata = {
  title: "Documents | Pure Pool",
  description:
    "Warranties, manuals and certificates for everything installed at your pool. Download anything, any time.",
};

export default function DocumentsPage() {
  return <DocumentsClient />;
}

