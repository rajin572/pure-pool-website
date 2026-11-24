"use client";

import React, { useRef, useState } from "react";
import { toast } from "sonner";
import { X, Plus, Loader2 } from "lucide-react";
import { resolveImageUrl } from "@/helpers/config/envConfig";
import { errorMessage } from "@/lib/apiRequest";
import { uploadFiles, validateImages } from "@/service/UploadService/UploadServiceApi";

export interface PhotosCardProps {
  photos: string[];
  poolId?: string;
  onPhotosChange: (photos: string[]) => void;
}

const MAX_PHOTOS = 8;

export const PhotosCard: React.FC<PhotosCardProps> = ({ photos, poolId, onPhotosChange }) => {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = async (picked: File[]) => {
    if (uploading || picked.length === 0) return;
    const room = MAX_PHOTOS - photos.length;
    if (room <= 0) {
      toast.error(`You can add up to ${MAX_PHOTOS} photos.`);
      return;
    }
    const files = picked.slice(0, room);
    const problem = validateImages(files);
    if (problem) {
      toast.error(problem);
      return;
    }
    setUploading(true);
    const res = await uploadFiles(files, poolId);
    setUploading(false);
    if (!res.success) {
      toast.error(errorMessage(res, "The photos could not be uploaded."));
      return;
    }
    onPhotosChange([...photos, ...res.data.map((f) => f.url)].slice(0, MAX_PHOTOS));
  };

  const handleRemovePhoto = (indexToRemove: number) => {
    onPhotosChange(photos.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200/90 shadow-xs space-y-5">
      <h3 className="text-lg font-bold text-zinc-900 font-['Onest'] leading-6">Photos</h3>

      <div className="space-y-4">
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            e.target.value = "";
            void addFiles(files);
          }}
        />

        {photos.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {photos.map((photo, index) => (
              <div key={photo} className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 group border border-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={resolveImageUrl(photo)}
                  alt={`Pool photo ${index + 1}`}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
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
        )}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full py-3.5 sm:py-4 bg-[#F0F9FF] hover:bg-sky-100/70 border border-dashed border-[#0284C7] rounded-xl inline-flex justify-center items-center gap-2 text-[#0284C7] font-semibold text-sm sm:text-base font-['Onest'] transition-colors cursor-pointer disabled:opacity-60"
        >
          {uploading ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4 stroke-[2.2]" />}
          <span>{uploading ? "Uploading..." : "Add photo"}</span>
        </button>
      </div>
    </div>
  );
};

export default PhotosCard;
