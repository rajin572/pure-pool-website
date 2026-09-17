export const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_BASE_API;
};

export const getServerUrl = () => {
  return process.env.NEXT_PUBLIC_SERVER_API;
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
