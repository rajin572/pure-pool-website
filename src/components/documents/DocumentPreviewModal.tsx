"use client";

import React from "react";
import ReusableModal from "@/components/ui/CustomUi/ReuseableModal";
import { DocumentRecord } from "@/service/DocumentsService/DocumentsServiceApi";
import { Download, FileText, Calendar, HardDrive, CheckCircle2 } from "lucide-react";

interface DocumentPreviewModalProps {
  document: DocumentRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDownload: (doc: DocumentRecord) => void;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  document: doc,
  open,
  onOpenChange,
  onDownload,
}) => {
  if (!doc) return null;

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
        {/* Header */}
        <div className="flex items-start gap-4 pr-6">
          <div className="size-12 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-blue-600 shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-zinc-900 text-xl sm:text-2xl font-bold font-['Onest']">
              {doc.title}
            </h2>
            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs sm:text-sm text-zinc-500 font-medium">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200/60">
                {doc.category}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                {doc.date}
              </span>
              <span className="flex items-center gap-1">
                <HardDrive className="w-3.5 h-3.5 text-zinc-400" />
                {doc.fileSize}
              </span>
            </div>
          </div>
        </div>

        {/* Simulated Document Viewer Sheet */}
        <div className="w-full bg-gray-50 border border-gray-200/90 rounded-2xl p-6 sm:p-8 flex flex-col gap-4 text-zinc-700">
          <div className="w-full bg-white rounded-xl p-6 border border-gray-200 shadow-2xs flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Official Pure Pool Document
              </div>
              <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Certified
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-zinc-900">
                Warranty &amp; Equipment Certification Statement
              </p>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                This document certifies that the installation of <span className="font-semibold text-zinc-800">{doc.equipmentName || "certified pool hardware"}</span> at your pool location complies with European pool safety standards (RD 742/2013) and manufacturer warranty protocols.
              </p>
              <div className="p-3 bg-sky-50/60 rounded-lg text-xs text-blue-900 leading-normal border border-blue-100/60">
                Coverage includes OEM parts guarantee, hydraulic pressure certifications, and annual service warranty stamps.
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="w-full flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="px-5 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-zinc-900 text-sm font-bold rounded-2xl transition-all cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              onDownload(doc);
              onOpenChange(false);
            }}
            className="px-6 py-3 bg-gradient-to-br from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white text-sm font-bold rounded-2xl shadow-sm transition-all cursor-pointer flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>
    </ReusableModal>
  );
};

export default DocumentPreviewModal;

