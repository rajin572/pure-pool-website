// Shared by proxy.ts (server) and clientFetch (browser): cookie names, cookie
// attributes and the refresh call. Keeping one definition matters: cookies set with
// a different path/sameSite would make the browser keep duplicates.
import type { IAuthTokens } from "@/types";

export const ACCESS_TOKEN_COOKIE = "purepool_website_access_token";
export const REFRESH_TOKEN_COOKIE = "purepool_website_refresh_token";

/** "Remember me" choice ("0" = session cookies), so refreshes keep the same lifetime. */
export const REMEMBER_COOKIE = "purepool_website_remember";

/** Not httpOnly: js-cookie in the browser must read them too. 30 days = backend REFRESH_TOKEN_DAYS. */
export const AUTH_COOKIE_MAX_AGE = 30 * 24 * 60 * 60;
export const authCookieAttributes = (secure: boolean, remember = true) => ({
  path: "/",
  sameSite: "lax" as const,
  secure,
  ...(remember ? { maxAge: AUTH_COOKIE_MAX_AGE } : {}),
});

/** Read a JWT's `exp` (seconds) without verifying it; the backend verifies. */
export const tokenExpiresAt = (token: string): number | null => {
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const exp = JSON.parse(atob(payload)).exp;
    return typeof exp === "number" ? exp : null;
  } catch {
    return null;
  }
};

/** True when the token is missing, unreadable or expires within `skewSeconds`. */
export const isTokenExpiring = (token: string | undefined, skewSeconds = 60) => {
  if (!token) return true;
  const exp = tokenExpiresAt(token);
  return exp === null || exp - skewSeconds <= Date.now() / 1000;
};

export type RefreshOutcome =
  | { status: "refreshed"; tokens: IAuthTokens }
  | { status: "rejected" }
  | { status: "unavailable" };

/**
 * POST /auth/refresh. The backend rotates the pair and rejects a reused refresh token
 * (401), so a rejection can also mean "someone else already rotated it"; callers check that.
 */
export const requestTokenRefresh = async (baseUrl: string, refreshToken: string): Promise<RefreshOutcome> => {
  try {
    const res = await fetch(`${baseUrl}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    });
    if (res.ok) {
      const body = await res.json();
      return { status: "refreshed", tokens: body.data as IAuthTokens };
    }
    return res.status === 401 || res.status === 403 ? { status: "rejected" } : { status: "unavailable" };
  } catch {
    return { status: "unavailable" };
  }
};
