export const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_BASE_API;
};

export const getServerUrl = () => {
  return process.env.NEXT_PUBLIC_SERVER_API;
};

/**
 * Turn a stored file path into a URL. Cloudinary uploads are already absolute and
 * pass through; local-storage paths (`/uploads/…`) get the server origin prepended.
 */
export const resolveImageUrl = (path?: string | null) => {
  if (!path) return "";
  if (/^(https?:|data:|blob:)/i.test(path)) return path;
  const base = (getServerUrl() || "").replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
};

// Public site origin (no trailing slash) — used for canonical URLs, sitemap,
// robots, Open Graph and JSON-LD. Set NEXT_PUBLIC_SITE_URL to the production
// domain before deploying; falls back to localhost in development.
export const getSiteUrl = () => {
  const url = process.env.NEXT_PUBLIC_SITE_URL || "https://beyondstyles.co.uk";
  return url.replace(/\/$/, "");
};

export const mapsApiKey = () => {
  return process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY;
};
