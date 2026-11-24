"use client";

import React, { useState } from "react";
import ReusableModal from "@/components/ui/CustomUi/ReuseableModal";
import { CheckCircle2, Circle, ArrowRight, MessageCircle } from "lucide-react";
import { resolveImageUrl } from "@/helpers/config/envConfig";
import type { IPoolVisit, IVisitReportSafe } from "@/service/MyPoolService/MyPoolServiceApi";
import ConversationModal from "@/components/support/ConversationModal";

interface ServiceVisitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  visit?: IPoolVisit | null;
  report?: IVisitReportSafe | null;
  onRequestServiceClick?: () => void;
}

export const ServiceVisitModal: React.FC<ServiceVisitModalProps> = ({
  open,
  onOpenChange,
  visit = null,
  report = null,
  onRequestServiceClick,
}) => {
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [messageOpen, setMessageOpen] = useState(false);

  if (!visit || !report) {
    return (
      <ReusableModal open={open} onOpenChange={onOpenChange} title="Visit details" maxWidth="sm:max-w-lg">
        <p className="text-sm text-gray-500 py-6 text-center">No visit report available.</p>
      </ReusableModal>
    );
  }

  const before = report.beforePhotos[0];
  const after = report.afterPhotos[0];

  const handleSliderMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const offset = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (offset / rect.width) * 100));
    setSliderPos(percentage);
  };

  return (
    <ReusableModal
      open={open}
      onOpenChange={onOpenChange}
      title={`Visit on ${new Date(visit.scheduledAt).toLocaleDateString()}`}
      description={`${visit.category || "Maintenance visit"}${visit.technicianId ? ` · Conducted by ${visit.technicianId.name}` : ""}`}
      maxWidth="sm:max-w-4xl lg:max-w-5xl"
    >
      <div className="flex flex-col gap-6 text-gray-900 pb-2">
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-mono font-bold text-gray-500 tracking-wider uppercase">
            TECHNICIAN ON-SITE PHOTOGRAPHY (BEFORE / AFTER)
          </h3>

          {before && after ? (
            <div
              className="relative w-full h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden select-none cursor-ew-resize bg-gray-100 shadow-sm"
              onMouseMove={handleSliderMove}
              onTouchMove={handleSliderMove}
            >
              <div className="absolute inset-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={resolveImageUrl(after.url)} alt="After pool maintenance" className="absolute inset-0 w-full h-full object-cover" />
                <span className="absolute top-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-sm text-white text-xs font-bold rounded-md uppercase tracking-wider">
                  AFTER
                </span>
              </div>

              <div className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${sliderPos}%` }}>
                <div className="relative w-full h-full min-w-[700px] md:min-w-[900px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={resolveImageUrl(before.url)} alt="Before pool maintenance" className="absolute inset-0 w-full h-full object-cover" />
                </div>
                <span className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-sm text-white text-xs font-bold rounded-md uppercase tracking-wider">
                  BEFORE
                </span>
              </div>

              <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow pointer-events-none" style={{ left: `${sliderPos}%` }}>
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-gray-800 flex items-center justify-center shadow-lg font-bold text-xs">
                  &lt;&gt;
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full py-10 rounded-2xl bg-gray-50 border border-gray-100 text-center text-sm text-gray-500">
              No before/after photos for this visit.
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-gray-100 flex flex-col gap-4">
          <h3 className="text-base sm:text-lg font-bold text-sky-600">Water Chemistry Readings</h3>

          {report.waterReadings.length === 0 ? (
            <p className="text-sm text-gray-500">No readings recorded.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {report.waterReadings.map((r) => (
                <div key={r.name} className="bg-gray-50 rounded-xl p-3.5 text-center border border-gray-100">
                  <div className="text-xs font-semibold text-gray-500">{r.name}</div>
                  <div className="text-xl font-bold text-gray-900 mt-1">
                    {r.value}
                    {r.unit ? <span className="text-sm font-semibold text-gray-600"> {r.unit}</span> : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-gray-100 flex flex-col gap-4">
          <h3 className="text-base sm:text-lg font-bold text-sky-600">Work Performed</h3>

          {report.checklist.length === 0 ? (
            <p className="text-sm text-gray-500">No checklist recorded for this visit.</p>
          ) : (
            <div className="flex flex-col divide-y divide-gray-50 border border-gray-100 rounded-xl overflow-hidden">
              {report.checklist.map((item) => (
                <div key={item.task} className="py-3 px-4 flex items-center gap-3 bg-white">
                  {item.done ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-300 shrink-0" />
                  )}
                  <span className="text-sm font-medium text-gray-800">{item.task}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-gray-100 flex flex-col gap-4">
          <h3 className="text-base sm:text-lg font-bold text-sky-600">Chemicals Added</h3>

          {report.chemicals.length === 0 ? (
            <p className="text-sm text-gray-500">No chemicals recorded for this visit.</p>
          ) : (
            <div className="flex flex-col divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
              {report.chemicals.map((chem) => (
                <div key={chem.name} className="py-3.5 px-4 flex items-center justify-between gap-4 bg-white">
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-gray-900">{chem.name}</h4>
                    {chem.reason && <p className="text-xs text-gray-500 mt-0.5">{chem.reason}</p>}
                  </div>
                  <span className="text-sm sm:text-base font-bold text-gray-900 shrink-0">
                    {chem.quantity} {chem.unit}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
          <h3 className="text-base sm:text-lg font-bold text-sky-600">Technician Observations</h3>

          <div className="p-4 bg-gray-50/70 border border-gray-100 rounded-xl">
            <p className="text-sm text-gray-700 italic leading-relaxed">
              {report.customerNotes || "No notes from the technician for this visit."}
            </p>
          </div>
        </div>

        <div className="pt-4 flex flex-wrap items-center gap-5">
          {onRequestServiceClick && (
            <button
              type="button"
              onClick={onRequestServiceClick}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-sky-600 hover:text-sky-700 transition-colors cursor-pointer w-fit"
            >
              Request a follow-up service <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {visit.technicianId && (
            <button
              type="button"
              onClick={() => setMessageOpen(true)}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-700 hover:text-gray-900 transition-colors cursor-pointer w-fit"
            >
              <MessageCircle className="w-4 h-4" /> Message {visit.technicianId.name}
            </button>
          )}
        </div>
      </div>

      {visit.technicianId && (
        <ConversationModal
          open={messageOpen}
          onOpenChange={setMessageOpen}
          kind="DIRECT"
          participants={[visit.technicianId._id]}
          title={visit.technicianId.name}
          subtitle="Your pool technician"
        />
      )}
    </ReusableModal>
  );
};

export default ServiceVisitModal;
