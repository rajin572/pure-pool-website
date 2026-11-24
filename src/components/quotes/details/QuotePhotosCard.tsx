"use client";

import React, { useState } from "react";
import { X, ZoomIn } from "lucide-react";
import { resolveImageUrl } from "@/helpers/config/envConfig";

interface QuotePhotosCardProps {
  photos?: string[];
}

export const QuotePhotosCard: React.FC<QuotePhotosCardProps> = ({ photos = [] }) => {
  const [activePhoto, setActivePhoto] = useState<string | null>(null);

  if (photos.length === 0) return null;

  return (
    <>
      <div className="w-full p-5 sm:p-6 bg-white rounded-2xl border border-gray-200 flex flex-col justify-start items-start gap-4 shadow-2xs">
        <div className="w-full flex items-center justify-between">
          <h2 className="text-zinc-900 text-lg font-bold leading-6">Photos</h2>
          <span className="text-xs font-semibold text-zinc-400">{photos.length} attached photo{photos.length === 1 ? "" : "s"}</span>
        </div>

        <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {photos.map((url, i) => (
            <button
              key={url}
              type="button"
              onClick={() => setActivePhoto(url)}
              className="group relative h-40 sm:h-44 w-full rounded-xl overflow-hidden border border-gray-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={resolveImageUrl(url)} alt={`Quote photo ${i + 1}`} className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {activePhoto && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setActivePhoto(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setActivePhoto(null)}
              className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white transition-colors cursor-pointer"
              aria-label="Close photo preview"
            >
              <X className="w-7 h-7" />
            </button>
            <div className="relative w-full h-[65vh] rounded-2xl overflow-hidden shadow-2xl bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={resolveImageUrl(activePhoto)} alt="Enlarged quote photo" className="absolute inset-0 w-full h-full object-contain" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QuotePhotosCard;
