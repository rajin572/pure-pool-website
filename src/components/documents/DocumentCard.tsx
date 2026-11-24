"use client";

import React from "react";
import { FileText, Download, Eye } from "lucide-react";
import { DocumentRecord } from "@/service/DocumentsService/DocumentsServiceApi";
import { resolveImageUrl } from "@/helpers/config/envConfig";

const KIND_LABEL: Record<string, string> = {
  WARRANTY: "Warranty",
  MANUAL: "Manual",
  CERTIFICATE: "Certificate",
  REPORT: "Report",
  CONTRACT: "Contract",
  INVOICE: "Invoice",
  OTHER: "Other",
};

interface DocumentCardProps {
  document: DocumentRecord;
  onPreview: (doc: DocumentRecord) => void;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({ document: doc, onPreview }) => {
  return (
    <div className="w-full p-4 sm:px-6 sm:py-4.5 bg-white rounded-2xl border border-gray-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-blue-200 hover:shadow-xs">
      <div className="flex items-center gap-4 min-w-0">
        <div className="size-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-blue-600 shrink-0">
          <FileText className="w-6 h-6 stroke-[1.8]" />
        </div>

        <div className="flex flex-col min-w-0">
          <h3 className="text-zinc-900 font-semibold text-base sm:text-lg leading-snug truncate">{doc.title}</h3>
          <p className="text-zinc-500 text-xs sm:text-sm font-medium mt-0.5">
            {KIND_LABEL[doc.kind] || doc.kind} · {new Date(doc.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
        <button
          type="button"
          onClick={() => onPreview(doc)}
          className="px-5 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 active:scale-[0.99] text-zinc-900 text-sm font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-2"
        >
          <Eye className="w-4 h-4 text-zinc-600" />
          <span>Preview</span>
        </button>

        <a
          href={resolveImageUrl(doc.url)}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="size-10.5 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-100/80 active:scale-[0.98] text-blue-600 flex items-center justify-center transition-all cursor-pointer"
          title={`Download ${doc.title}`}
          aria-label={`Download ${doc.title}`}
        >
          <Download className="w-5 h-5 stroke-[2]" />
        </a>
      </div>
    </div>
  );
};

export default DocumentCard;
