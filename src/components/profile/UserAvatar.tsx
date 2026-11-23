"use client";

import React from "react";
import { resolveImageUrl } from "@/helpers/config/envConfig";

const FALLBACK = "/images/userAvatar.png";

/**
 * The user's photo. Uploaded photos live on the API server (or Cloudinary), so they're
 * shown with a plain <img> instead of next/image, which would need every host whitelisted.
 */
export const UserAvatar = ({
  src,
  alt,
  className = "",
}: {
  src?: string | null;
  alt: string;
  className?: string;
}) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    src={src ? resolveImageUrl(src) : FALLBACK}
    alt={alt}
    className={`size-full object-cover ${className}`}
    onError={(e) => {
      if (!e.currentTarget.src.endsWith(FALLBACK)) e.currentTarget.src = FALLBACK;
    }}
  />
);

export default UserAvatar;
