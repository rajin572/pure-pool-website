/**
 * Browser-side API helpers shared by the service modules. They return the backend envelope
 * (`{ success, data }` / `{ success: false, error }`) and never throw, so screens can show
 * `error.message` as is. Client Components only: nothing here may import server-only code.
 */
import { clientFetch } from "@/lib/clientFetch";
import type { IApiResult } from "@/types";

export const request = async <T>(path: string, init: RequestInit = {}): Promise<IApiResult<T>> => {
  try {
    const res = await clientFetch(path, init);
    try {
      return (await res.json()) as IApiResult<T>;
    } catch {
      return { success: false, error: { message: `Request failed (${res.status})` } };
    }
  } catch {
    return { success: false, error: { code: "NETWORK", message: "Can't reach the server. Check your connection." } };
  }
};

const withBody = (method: string, body?: unknown): RequestInit => ({
  method,
  ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
});

export const post = <T>(path: string, body?: unknown) => request<T>(path, withBody("POST", body));
export const patch = <T>(path: string, body?: unknown) => request<T>(path, withBody("PATCH", body));

/** Error text for a failed result, with a fallback for the unexpected. */
export const errorMessage = (res: IApiResult<unknown>, fallback = "Something went wrong. Please try again.") =>
  res.success ? fallback : res.error?.message || fallback;
