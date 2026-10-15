"use client";

import React, { useState } from "react";
import Image, { StaticImageData } from "next/image";
import { X, Plus } from "lucide-react";
import { AllImages } from "../../../public/images/AllImages";

export interface PhotosCardProps {
  initialPhotos?: (string | StaticImageData)[];
  onPhotosChange?: (photos: (string | StaticImageData)[]) => void;
}

export const PhotosCard: React.FC<PhotosCardProps> = ({
  initialPhotos,
  onPhotosChange,
}) => {
  const defaultPhotos: (string | StaticImageData)[] = [
    AllImages.poolSetting,
    AllImages.pool1,
    AllImages.pool2,
    AllImages.pool3,
  ];

  const [photos, setPhotos] = useState<(string | StaticImageData)[]>(
    initialPhotos && initialPhotos.length > 0 ? initialPhotos : defaultPhotos
  );

  const handleRemovePhoto = (indexToRemove: number) => {
    // In production API integration:
    // await deletePoolPhotoApi({ poolId, photoId });
    const updated = photos.filter((_, idx) => idx !== indexToRemove);
    setPhotos(updated);
    if (onPhotosChange) {
      onPhotosChange(updated);
    }
  };

  const handleAddPhoto = () => {
    // In production API integration:
    // const file = event.target.files[0];
    // await uploadPoolPhotoApi({ poolId, file });
    // Mock cycling through pool photos
    const alternates = [
      AllImages.pool5,
      AllImages.pool6,
      AllImages.pool1,
      AllImages.pool2,
    ];
    const nextPhoto = alternates[photos.length % alternates.length];
    const updated = [...photos, nextPhoto];
    setPhotos(updated);
    if (onPhotosChange) {
      onPhotosChange(updated);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200/90 shadow-xs space-y-5">
      <h3 className="text-lg font-bold text-zinc-900 font-['Onest'] leading-6">
        Photos
      </h3>

      <div className="space-y-4">
        {/* Photo Grid */}
        <div className="grid grid-cols-2 gap-3">
          {photos.map((photo, index) => (
            <div
              key={index}
              className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 group border border-gray-100"
            >
              <Image
                src={photo}
                alt={`Pool photo ${index + 1}`}
                fill
                unoptimized
                sizes="(max-width: 768px) 50vw, 200px"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {/* Delete button */}
              <button
                type="button"
                onClick={() => handleRemovePhoto(index)}
                aria-label={`Remove photo ${index + 1}`}
                className="absolute top-2 right-2 size-6 rounded-full bg-white/95 hover:bg-white text-zinc-700 hover:text-red-600 shadow-sm flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Add Photo Button */}
        <button
          type="button"
          onClick={handleAddPhoto}
          className="w-full py-3.5 sm:py-4 bg-[#F0F9FF] hover:bg-sky-100/70 border border-dashed border-[#0284C7] rounded-xl inline-flex justify-center items-center gap-2 text-[#0284C7] font-semibold text-sm sm:text-base font-['Onest'] transition-colors cursor-pointer"
        >
          <Plus className="size-4 stroke-[2.2]" />
          <span>Add photo</span>
        </button>
      </div>
    </div>
  );
};

export default PhotosCard;
