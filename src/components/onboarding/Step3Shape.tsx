"use client";

import React, { useState } from "react";
import OnboardingActionRow from "./OnboardingActionRow";
import { OnboardingShapeData } from "@/service/OnboardingService/OnboardingServiceApi";

interface Step3ShapeProps {
  initialData: OnboardingShapeData;
  onNext: (data: OnboardingShapeData) => void;
  onBack: () => void;
}

interface ShapeOption {
  id: OnboardingShapeData["shape"];
  name: string;
  svg: React.ReactNode;
}

const SHAPES: ShapeOption[] = [
  {
    id: "rectangular",
    name: "Rectangular",
    svg: (
      <rect
        x="6"
        y="12"
        width="68"
        height="36"
        rx="3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      />
    ),
  },
  {
    id: "square",
    name: "Square",
    svg: (
      <rect
        x="18"
        y="8"
        width="44"
        height="44"
        rx="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      />
    ),
  },
  {
    id: "circular",
    name: "Circular",
    svg: (
      <circle
        cx="40"
        cy="30"
        r="24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      />
    ),
  },
  {
    id: "oval",
    name: "Oval",
    svg: (
      <ellipse
        cx="40"
        cy="30"
        rx="32"
        ry="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      />
    ),
  },
  {
    id: "kidney",
    name: "Kidney / Curved",
    svg: (
      <path
        d="M14,30 C14,14 36,12 50,20 C64,28 66,48 48,48 C30,48 34,34 24,36 C18,37 14,36 14,30 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      />
    ),
  },
  {
    id: "l_shaped",
    name: "L-Shaped",
    svg: (
      <path
        d="M12,12 L44,12 L44,30 L68,30 L68,48 L12,48 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      />
    ),
  },
  {
    id: "infinity_1",
    name: "Infinity — 1 Side",
    svg: (
      <g>
        <rect
          x="8"
          y="14"
          width="64"
          height="32"
          rx="2"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <line
          x1="72"
          y1="14"
          x2="72"
          y2="46"
          stroke="currentColor"
          strokeWidth="6"
        />
      </g>
    ),
  },
  {
    id: "infinity_2",
    name: "Infinity — 2 Sides",
    svg: (
      <g>
        <rect
          x="8"
          y="14"
          width="64"
          height="32"
          rx="2"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <line
          x1="72"
          y1="14"
          x2="72"
          y2="46"
          stroke="currentColor"
          strokeWidth="6"
        />
        <line
          x1="8"
          y1="46"
          x2="72"
          y2="46"
          stroke="currentColor"
          strokeWidth="6"
        />
      </g>
    ),
  },
  {
    id: "infinity_3",
    name: "Infinity — 3 Sides",
    svg: (
      <g>
        <rect
          x="8"
          y="14"
          width="64"
          height="32"
          rx="2"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <line
          x1="8"
          y1="14"
          x2="8"
          y2="46"
          stroke="currentColor"
          strokeWidth="6"
        />
        <line
          x1="72"
          y1="14"
          x2="72"
          y2="46"
          stroke="currentColor"
          strokeWidth="6"
        />
        <line
          x1="8"
          y1="46"
          x2="72"
          y2="46"
          stroke="currentColor"
          strokeWidth="6"
        />
      </g>
    ),
  },
  {
    id: "lagoon",
    name: "Special / Lagoon",
    svg: (
      <path
        d="M16,24 C14,12 36,8 52,14 C68,20 72,42 58,50 C44,58 36,44 26,48 C16,52 18,36 16,24 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      />
    ),
  },
];

export const Step3Shape: React.FC<Step3ShapeProps> = ({
  initialData,
  onNext,
  onBack,
}) => {
  const [selectedShape, setSelectedShape] = useState<OnboardingShapeData["shape"]>(
    initialData.shape || "rectangular"
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({
      ...initialData,
      shape: selectedShape,
    });
  };

  return (
    <div className="w-full bg-white rounded-3xl p-6 sm:p-10 shadow-lg border border-gray-100 flex flex-col gap-8">
      {/* Step Header */}
      <div className="flex flex-col gap-1.5">
        <h2 className="text-zinc-900 text-2xl sm:text-3xl font-bold font-['Onest'] leading-tight">
          Pool shape
        </h2>
        <p className="text-zinc-600 text-base font-medium font-['Onest'] leading-relaxed">
          Pick the outline that&apos;s closest to your pool.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        {/* Shape Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {SHAPES.map((item) => {
            const isSelected = selectedShape === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedShape(item.id)}
                className={`p-4 rounded-2xl flex flex-col items-center justify-between gap-3 text-center transition-all cursor-pointer select-none min-h-[140px] ${isSelected
                  ? "bg-sky-50 text-blue-600 outline outline-2 -outline-offset-2 outline-blue-600 shadow-md ring-2 ring-sky-200"
                  : "bg-white text-zinc-900 outline outline-1 -outline-offset-1 outline-gray-200 hover:bg-gray-50/80"
                  }`}
              >
                <div className="w-20 h-14 flex items-center justify-center">
                  <svg
                    viewBox="0 0 80 60"
                    className={`w-full h-full transition-colors ${isSelected ? "text-blue-600" : "text-blue-600/70"
                      }`}
                  >
                    {item.svg}
                  </svg>
                </div>
                <span
                  className={`text-xs sm:text-sm font-semibold font-['Onest'] leading-snug line-clamp-2 ${isSelected ? "text-blue-600" : "text-zinc-900"
                    }`}
                >
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Action Row */}
        <OnboardingActionRow onBack={onBack} />
      </form>
    </div>
  );
};

export default Step3Shape;

