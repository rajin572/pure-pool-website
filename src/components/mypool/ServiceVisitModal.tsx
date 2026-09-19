"use client";

import React, { useState } from "react";
import Image from "next/image";
import ReusableModal from "@/components/ui/CustomUi/ReuseableModal";
import { CheckCircle2, Download, ArrowRight } from "lucide-react";
import ParameterGauge from "./ParameterGauge";
import { AllImages } from "../../../public/images/AllImages";

interface ServiceVisitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRequestServiceClick?: () => void;
}

const WORK_PERFORMED_ITEMS = [
  "Skimmed surface debris and brushed wall tiles",
  "Polished metal fixtures and cleaned glass surfaces",
  "Wiped down countertops and sanitized workstations",
  "Reorganized storage shelves and labeled containers",
  "Refreshed air vents and replaced filters",
  "Checked and restocked cleaning supplies",
  "Cleared clutter and disposed of waste materials",
  "Disinfected high-touch areas and ensured safety protocols",
];

const CHEMICALS_ADDED = [
  {
    name: "Liquid pH Reducer",
    note: "Lower pH from 7.4 to optimal 7.3",
    amount: "450 ml",
  },
  {
    name: "High-purity Salt (NaCl)",
    note: "Maintain cell salinity at 3,500 ppm",
    amount: "5 kg",
  },
];

export const ServiceVisitModal: React.FC<ServiceVisitModalProps> = ({
  open,
  onOpenChange,
  onRequestServiceClick,
}) => {
  const [sliderPos, setSliderPos] = useState<number>(50);

  const handleSliderMove = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
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
      title="Visit on 17 May 2026"
      description="Weekly maintenance · Conducted by Carlos Martínez"
      maxWidth="sm:max-w-4xl lg:max-w-5xl"
    >
      <div className="flex flex-col gap-6 text-gray-900 pb-2">
        {/* Section 1: Technician On-Site Photography (Before / After) */}
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-mono font-bold text-gray-500 tracking-wider uppercase">
            TECHNICIAN ON-SITE PHOTOGRAPHY (BEFORE / AFTER)
          </h3>

          {/* Interactive Before / After Split Slider */}
          <div
            className="relative w-full h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden select-none cursor-ew-resize bg-gray-100 shadow-sm"
            onMouseMove={handleSliderMove}
            onTouchMove={handleSliderMove}
          >
            {/* After Image (Background) */}
            <div className="absolute inset-0">
              <Image
                src={AllImages.pool2}
                alt="After pool maintenance"
                fill
                className="object-cover"
              />
              <span className="absolute top-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-sm text-white text-xs font-bold rounded-md uppercase tracking-wider">
                AFTER
              </span>
            </div>

            {/* Before Image (Clipped Overlay) */}
            <div
              className="absolute inset-y-0 left-0 overflow-hidden"
              style={{ width: `${sliderPos}%` }}
            >
              <div className="relative w-full h-full min-w-[700px] md:min-w-[900px]">
                <Image
                  src={AllImages.pool1}
                  alt="Before pool maintenance"
                  fill
                  className="object-cover filter contrast-125 saturate-50 brightness-90"
                />
              </div>
              <span className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-sm text-white text-xs font-bold rounded-md uppercase tracking-wider">
                BEFORE
              </span>
            </div>

            {/* Split Handle Divider Line */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white shadow pointer-events-none"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-gray-800 flex items-center justify-center shadow-lg font-bold text-xs">
                &lt;&gt;
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Water Chemistry Readings */}
        <div className="pt-4 border-t border-gray-100 flex flex-col gap-4">
          <h3 className="text-base sm:text-lg font-bold text-sky-600">
            Water Chemistry Readings
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ParameterGauge
              label="pH"
              value="7.3"
              status="optimal"
              statusText="optimal"
              min={6.6}
              max={8.0}
              idealMin={7.2}
              idealMax={7.6}
              currentNumeric={7.3}
            />
            <ParameterGauge
              label="Chlorine"
              value="1.8"
              unit="mg/L"
              status="optimal"
              statusText="optimal"
              min={0}
              max={5.0}
              idealMin={1.0}
              idealMax={3.0}
              currentNumeric={1.8}
            />
            <ParameterGauge
              label="Alkalinity"
              value="145"
              unit="ppm"
              status="high"
              statusText="High"
              min={0}
              max={5.0}
              idealMin={1.0}
              idealMax={3.0}
              currentNumeric={4.2}
            />
            <ParameterGauge
              label="Temperature"
              value="24.5"
              unit="°C"
              status="below_ideal"
              statusText="Below ideal"
              min={15}
              max={35}
              idealMin={26}
              idealMax={28}
              currentNumeric={24.5}
            />
          </div>
        </div>

        {/* Section 3: Work Performed */}
        <div className="pt-4 border-t border-gray-100 flex flex-col gap-4">
          <h3 className="text-base sm:text-lg font-bold text-sky-600">
            Work Performed
          </h3>

          <div className="flex flex-col divide-y divide-gray-50 border border-gray-100 rounded-xl overflow-hidden">
            {WORK_PERFORMED_ITEMS.map((item) => (
              <div
                key={item}
                className="py-3 px-4 flex items-center gap-3 bg-white"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className="text-sm font-medium text-gray-800">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Chemicals Added */}
        <div className="pt-4 border-t border-gray-100 flex flex-col gap-4">
          <h3 className="text-base sm:text-lg font-bold text-sky-600">
            Chemicals Added
          </h3>

          <div className="flex flex-col divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
            {CHEMICALS_ADDED.map((chem) => (
              <div
                key={chem.name}
                className="py-3.5 px-4 flex items-center justify-between gap-4 bg-white"
              >
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-gray-900">
                    {chem.name}
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">{chem.note}</p>
                </div>
                <span className="text-sm sm:text-base font-bold text-gray-900 shrink-0">
                  {chem.amount}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Technician Observations */}
        <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
          <h3 className="text-base sm:text-lg font-bold text-sky-600">
            Technician Observations
          </h3>

          <div className="p-4 bg-gray-50/70 border border-gray-100 rounded-xl">
            <p className="text-sm text-gray-700 italic leading-relaxed">
              &ldquo;Pool water is crystal clear and perfectly balanced. Salt cell
              operating at peak output. Filter pressure holding steady at 1.2
              bar&rdquo;
            </p>
          </div>
        </div>

        {/* Section 6: Recommend Actions */}
        <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
          <h3 className="text-base sm:text-lg font-bold text-sky-600">
            Recommend Actions
          </h3>

          <div className="p-5 border border-gray-100 rounded-xl bg-white shadow-xs flex flex-col gap-3">
            <p className="text-sm text-gray-800 font-medium leading-relaxed">
              Heat pump inspection recommended before summer peak season.
              Efficiency check advised.
            </p>
            <button
              type="button"
              onClick={() => {
                if (onRequestServiceClick) {
                  onRequestServiceClick();
                } else {
                  alert("Opening Service Request Form");
                }
              }}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-sky-600 hover:text-sky-700 transition-colors cursor-pointer w-fit"
            >
              Request this service <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Footer Action: Download Report Button */}
        <div className="pt-4 flex justify-start">
          <button
            type="button"
            onClick={() => alert("Downloading Visit PDF Report...")}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-base flex items-center justify-center gap-2 shadow-sm transition-all duration-200 cursor-pointer"
          >
            <Download className="w-5 h-5" />
            Download Report
          </button>
        </div>
      </div>
    </ReusableModal>
  );
};

export default ServiceVisitModal;
