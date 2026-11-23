import { getBaseUrl } from "@/helpers/config/envConfig";
import type { IApiResult } from "@/types";

/** `GET /public/plans` item (Postman "List Public Plans"). Prices are per year. */
export interface IPublicPlan {
  _id: string;
  name: string;
  code: string;
  annualPrice: number;
  currency: string;
  visitFrequency: "WEEKLY" | "FORTNIGHTLY" | string;
  visitsPerYear: number;
  priorityResponse: boolean;
  inclusions: string[];
  taxRate?: number;
  description?: string;
}

/**
 * Public plans for the home page, fetched on the server.
 * - Plain fetch (no cookies) so the page stays statically renderable.
 * - Cached for 10 minutes: the backend allows only 10 requests / 15 min on /public per IP,
 *   and every visitor's render comes from this server's IP.
 * - Returns null when the backend is unreachable; the section then shows "unavailable"
 *   instead of made-up prices.
 */
export async function getPublicPlans(): Promise<IPublicPlan[] | null> {
  try {
    const res = await fetch(`${getBaseUrl()}/public/plans`, { next: { revalidate: 600 } });
    if (!res.ok) return null;
    const body = (await res.json()) as IApiResult<IPublicPlan[]>;
    return body.success ? body.data : null;
  } catch {
    return null;
  }
}
