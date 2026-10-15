"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, ZoomIn } from "lucide-react";
import { AllImages } from "../../../../public/images/AllImages";

interface QuotePhotosCardProps {
  photos?: string[];
}

export const QuotePhotosCard: React.FC<QuotePhotosCardProps> = () => {
  const [activePhoto, setActivePhoto] = useState<string | null>(null);

  return (
    <>
      <div className="w-full p-5 sm:p-6 bg-white rounded-2xl border border-gray-200 flex flex-col justify-start items-start gap-4 shadow-2xs">
        <div className="w-full flex items-center justify-between">
          <h2 className="text-zinc-900 text-lg font-bold leading-6">Photos</h2>
          <span className="text-xs font-semibold text-zinc-400">
            3 attached photos
          </span>
        </div>

        {/* 3 Photos Grid matching Figma */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {/* Photo 1 */}
          <button
            type="button"
            onClick={() => setActivePhoto(AllImages.pool1.src)}
            className="group relative h-40 sm:h-44 w-full rounded-xl overflow-hidden border border-gray-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Image
              src={AllImages.pool1}
              alt="Pool equipment inspection photo 1"
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </button>

          {/* Photo 2 */}
          <button
            type="button"
            onClick={() => setActivePhoto(AllImages.pool2.src)}
            className="group relative h-40 sm:h-44 w-full rounded-xl overflow-hidden border border-gray-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Image
              src={AllImages.pool2}
              alt="Pool equipment inspection photo 2"
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </button>

          {/* Photo 3 with '+2 more' Overlay */}
          <button
            type="button"
            onClick={() => setActivePhoto(AllImages.pool3.src)}
            className="group relative h-40 sm:h-44 w-full rounded-xl overflow-hidden border border-gray-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Image
              src={AllImages.pool3}
              alt="Pool equipment inspection photo 3"
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, 33vw"
            />
            {/* Dark overlay with '+2 more' text matching Figma */}
            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-colors flex flex-col items-center justify-center">
              <span className="text-white text-lg font-bold tracking-tight">
                +2 more
              </span>
              <span className="text-white/80 text-xs font-medium mt-1">
                Click to view
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setActivePhoto(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActivePhoto(null)}
              className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white transition-colors cursor-pointer"
              aria-label="Close photo preview"
            >
              <X className="w-7 h-7" />
            </button>
            <div className="relative w-full h-[65vh] rounded-2xl overflow-hidden shadow-2xl bg-black">
              <Image
                src={activePhoto}
                alt="Enlarged pool inspection photo"
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QuotePhotosCard;
