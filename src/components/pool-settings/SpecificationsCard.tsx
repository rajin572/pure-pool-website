"use client";

import React from "react";
import { Control, Controller } from "react-hook-form";
import { FormInput } from "@/components/ui/CustomUi/ReuseForm/Form";
import {
  IPoolSettings,
  PoolType,
  WaterTreatment,
  SurfaceFinish,
} from "@/service/PoolSettingsService/PoolSettingsServiceApi";

export interface SpecificationsCardProps {
  control: Control<IPoolSettings>;
}

const POOL_TYPES: PoolType[] = ["Residential", "Commercial", "I don't know"];

const WATER_TREATMENTS: WaterTreatment[] = [
  "Saltwater",
  "Chlorine",
  "I don't know",
];

const SURFACE_FINISHES: SurfaceFinish[] = [
  "Tile (Gresite)",
  "Liner / Vinyl",
  "Polyester / Fibreglass",
  "I don't know",
];

export const SpecificationsCard: React.FC<SpecificationsCardProps> = ({
  control,
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200/90 shadow-xs space-y-5">
      <h3 className="text-lg font-bold text-zinc-900 font-['Onest'] leading-6">
        Specifications
      </h3>

      <div className="space-y-5">
        {/* Pool Type Chips */}
        <div className="space-y-2">
          <label className="text-sm sm:text-base font-semibold text-zinc-900 font-['Onest'] leading-5 block">
            Pool Type
          </label>
          <Controller
            control={control}
            name="poolType"
            render={({ field }) => (
              <div className="flex items-center gap-2.5 flex-wrap">
                {POOL_TYPES.map((type) => {
                  const isSelected = field.value === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => field.onChange(type)}
                      className={`px-5 py-3 rounded-xl font-semibold font-['Onest'] text-sm sm:text-base transition-all cursor-pointer ${
                        isSelected
                          ? "bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-xs"
                          : "bg-white border border-gray-200 text-zinc-900 hover:bg-gray-50"
                      }`}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            )}
          />
        </div>

        {/* Volume & Dimensions Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Approximate Volume */}
          <div>
            <FormInput
              control={control}
              name="approximateVolume"
              label="Approximate Volume"
              placeholder="e.g. 48,000 L"
              inputClassName="bg-white! border-gray-200! focus:border-[#0284C7]! text-zinc-900! text-sm sm:text-base! font-medium! font-['Onest']! py-3.5! rounded-2xl!"
            />
          </div>

          {/* Dimensions (metres) */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-800 font-['Onest'] leading-5 block">
              Dimensions (metres)
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <FormInput
                control={control}
                name="dimensions.length"
                placeholder="10 m"
                inputClassName="bg-white! border-gray-200! focus:border-[#0284C7]! text-zinc-900! text-sm sm:text-base! font-medium! font-['Onest']! p-3.5! rounded-2xl! text-center"
              />
              <FormInput
                control={control}
                name="dimensions.width"
                placeholder="5 m"
                inputClassName="bg-white! border-gray-200! focus:border-[#0284C7]! text-zinc-900! text-sm sm:text-base! font-medium! font-['Onest']! p-3.5! rounded-2xl! text-center"
              />
              <FormInput
                control={control}
                name="dimensions.depth"
                placeholder="1.6 m"
                inputClassName="bg-white! border-gray-200! focus:border-[#0284C7]! text-zinc-900! text-sm sm:text-base! font-medium! font-['Onest']! p-3.5! rounded-2xl! text-center"
              />
            </div>
          </div>
        </div>

        {/* Water Treatment Chips */}
        <div className="space-y-2">
          <label className="text-sm sm:text-base font-semibold text-zinc-900 font-['Onest'] leading-5 block">
            Water Treatment
          </label>
          <Controller
            control={control}
            name="waterTreatment"
            render={({ field }) => (
              <div className="flex items-center gap-2.5 flex-wrap">
                {WATER_TREATMENTS.map((treatment) => {
                  const isSelected = field.value === treatment;
                  return (
                    <button
                      key={treatment}
                      type="button"
                      onClick={() => field.onChange(treatment)}
                      className={`px-5 py-3 rounded-xl font-semibold font-['Onest'] text-sm sm:text-base transition-all cursor-pointer ${
                        isSelected
                          ? "bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-xs"
                          : "bg-white border border-gray-200 text-zinc-900 hover:bg-gray-50"
                      }`}
                    >
                      {treatment}
                    </button>
                  );
                })}
              </div>
            )}
          />
        </div>

        {/* Surface Finish Chips */}
        <div className="space-y-2">
          <label className="text-sm sm:text-base font-semibold text-zinc-900 font-['Onest'] leading-5 block">
            Surface Finish
          </label>
          <Controller
            control={control}
            name="surfaceFinish"
            render={({ field }) => (
              <div className="flex items-center gap-2.5 flex-wrap">
                {SURFACE_FINISHES.map((finish) => {
                  const isSelected = field.value === finish;
                  return (
                    <button
                      key={finish}
                      type="button"
                      onClick={() => field.onChange(finish)}
                      className={`px-5 py-3 rounded-xl font-semibold font-['Onest'] text-sm sm:text-base transition-all cursor-pointer ${
                        isSelected
                          ? "bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-xs"
                          : "bg-white border border-gray-200 text-zinc-900 hover:bg-gray-50"
                      }`}
                    >
                      {finish}
                    </button>
                  );
                })}
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default SpecificationsCard;
