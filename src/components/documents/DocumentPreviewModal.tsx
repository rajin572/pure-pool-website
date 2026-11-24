"use client";

import React from "react";
import ReusableModal from "@/components/ui/CustomUi/ReuseableModal";
import { DocumentRecord } from "@/service/DocumentsService/DocumentsServiceApi";
import { Download, FileText, Calendar, ExternalLink } from "lucide-react";
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

interface DocumentPreviewModalProps {
  document: DocumentRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({ document: doc, open, onOpenChange }) => {
  if (!doc) return null;
  const url = resolveImageUrl(doc.url);
  const isImage = /\.(png|jpe?g|webp|gif)$/i.test(doc.url);

  return (
    <ReusableModal
      open={open}
      onOpenChange={onOpenChange}
      maxWidth="sm:max-w-[680px]"
      contentClassName="p-6 sm:p-8 rounded-3xl"
      showCloseButton={false}
      showXCloseButton={true}
    >
      <div className="w-full flex flex-col gap-6">
        <div className="flex items-start gap-4 pr-6">
          <div className="size-12 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-blue-600 shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-zinc-900 text-xl sm:text-2xl font-bold font-['Onest']">{doc.title}</h2>
            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs sm:text-sm text-zinc-500 font-medium">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200/60">
                {KIND_LABEL[doc.kind] || doc.kind}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                {new Date(doc.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="w-full bg-gray-50 border border-gray-200/90 rounded-2xl overflow-hidden flex flex-col items-center justify-center min-h-[300px]">
          {isImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt={doc.title} className="w-full h-full max-h-[420px] object-contain" />
          ) : (
            <iframe src={url} title={doc.title} className="w-full h-[420px] bg-white" />
          )}
        </div>

        <div className="w-full flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="px-5 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-zinc-900 text-sm font-bold rounded-2xl transition-all cursor-pointer"
          >
            Close
          </button>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-zinc-900 text-sm font-bold rounded-2xl transition-all cursor-pointer flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Open in new tab</span>
          </a>
          <a
            href={url}
            download
            className="px-6 py-3 bg-gradient-to-br from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white text-sm font-bold rounded-2xl shadow-sm transition-all cursor-pointer flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </a>
        </div>
      </div>
    </ReusableModal>
  );
};

export default DocumentPreviewModal;
