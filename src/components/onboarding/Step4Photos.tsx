"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Upload, X, Plus } from "lucide-react";
import { AllImages } from "@/../public/images/AllImages";
import OnboardingActionRow from "./OnboardingActionRow";
import { OnboardingPhotosData } from "@/service/OnboardingService/OnboardingServiceApi";

interface Step4PhotosProps {
  initialData: OnboardingPhotosData;
  onNext: (data: OnboardingPhotosData) => void;
  onBack: () => void;
}

export const Step4Photos: React.FC<Step4PhotosProps> = ({
  initialData,
  onNext,
  onBack,
}) => {
  const [photos, setPhotos] = useState<string[]>([
    AllImages.pool1.src,
    AllImages.pool2.src,
  ]);

  const handleAddSamplePhoto = () => {
    if (photos.length >= 4) return;
    const poolSources = [AllImages.pool3.src, AllImages.pool4.src];
    const nextPhoto = poolSources[photos.length - 2] || AllImages.myPool.src;
    setPhotos([...photos, nextPhoto]);
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({
      ...initialData,
      poolOverviewPhoto: photos[0] || "",
      equipmentPhoto: photos[1] || "",
      accessGatePhoto: photos[2] || "",
    });
  };

  return (
    <div className="w-full bg-white rounded-3xl p-6 sm:p-10 shadow-lg border border-gray-100 flex flex-col gap-8">
      {/* Step Header */}
      <div className="flex flex-col gap-1.5">
        <h2 className="text-zinc-900 text-2xl sm:text-3xl font-bold font-['Onest'] leading-tight">
          Pool photos
        </h2>
        <p className="text-zinc-600 text-base font-medium font-['Onest'] leading-relaxed">
          Add up to 4 photos of your pool and pump room (optional).
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        {/* Upload Dropzone */}
        <div
          onClick={handleAddSamplePhoto}
          className="w-full h-52 sm:h-56 bg-sky-50 rounded-2xl outline outline-[1.5px] outline-dashed outline-offset-[-1.5px] outline-blue-600 flex flex-col justify-center items-center gap-2.5 p-6 cursor-pointer hover:bg-sky-100/60 transition-colors group select-none"
        >
          <div className="p-3 bg-white rounded-2xl shadow-sm text-blue-600 group-hover:scale-110 transition-transform">
            <Upload className="w-8 h-8" />
          </div>
          <div className="text-zinc-900 text-base sm:text-lg font-semibold font-['Onest'] text-center">
            Drag &amp; drop your photos here
          </div>
          <div className="text-zinc-500 text-xs sm:text-sm font-medium font-['Onest'] text-center">
            or click to browse &mdash; PNG, JPG, WEBP up to 5MB each
          </div>
        </div>

        {/* Added Photos Grid */}
        <div className="flex flex-col gap-3">
          <div className="text-zinc-900 text-base font-semibold font-['Onest']">
            Added photos ({photos.length} of 4)
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {photos.map((src, i) => (
              <div
                key={i}
                className="relative h-28 sm:h-32 rounded-xl overflow-hidden border border-gray-200 group shadow-sm"
              >
                <Image
                  src={src}
                  alt={`Pool photo ${i + 1}`}
                  fill
                  sizes="200px"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  type="button"
                  onClick={() => handleRemovePhoto(i)}
                  className="absolute top-2 right-2 p-1 bg-white/90 hover:bg-white text-zinc-700 hover:text-red-600 rounded-lg shadow-md transition-colors cursor-pointer"
                  aria-label="Remove photo"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}

            {Array.from({ length: Math.max(0, 4 - photos.length) }).map((_, i) => (
              <button
                key={`empty-${i}`}
                type="button"
                onClick={handleAddSamplePhoto}
                className="h-28 sm:h-32 rounded-xl border border-dashed border-gray-200 bg-gray-50/50 hover:bg-gray-100 flex items-center justify-center text-zinc-400 hover:text-blue-600 transition-colors cursor-pointer"
              >
                <Plus className="w-6 h-6" />
              </button>
            ))}
          </div>
        </div>

        {/* Action Row */}
        <OnboardingActionRow onBack={onBack} />
      </form>
    </div>
  );
};

export default Step4Photos;

