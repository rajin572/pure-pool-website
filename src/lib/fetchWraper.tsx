import { getAuthToken } from "./getAuthToken";
import { getBaseUrl } from "@/helpers/config/envConfig";

const baseUrl = getBaseUrl();

/**
 * Server-side fetch (Server Components / Server Actions) with `Authorization: Bearer`.
 * Token refresh happens earlier, in src/proxy.ts, because Server Components can't set
 * cookies. Returns the raw Response; callers read the `{ success, data, meta }` /
 * `{ success: false, error }` envelope with `res.json()`.
 */
export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const accessToken = await getAuthToken();
  const headers = new Headers(options.headers);
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
  if (options.body && !(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  return fetch(baseUrl + url, { ...options, headers });
};
