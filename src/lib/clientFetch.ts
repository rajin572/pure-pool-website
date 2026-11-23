import Cookies from "js-cookie";
import { getBaseUrl } from "@/helpers/config/envConfig";
import {
  ACCESS_TOKEN_COOKIE,
  AUTH_COOKIE_MAX_AGE,
  REFRESH_TOKEN_COOKIE,
  REMEMBER_COOKIE,
  requestTokenRefresh,
  type RefreshOutcome,
} from "./authSession";
import { forgetSessionUser } from "./sessionUserStore";
import type { IAuthTokens } from "@/types";

const LOGIN_PATH = "/login";
const PENDING_CUSTOMER_PATH = "/onboarding";

// Full page load on purpose: ending a session or leaving onboarding must drop all
// in-memory client state, which a router push would keep.
const hardNavigate = (path: string) => {
  if (!window.location.pathname.startsWith(path)) {
    window.location.assign(new URL(path, window.location.origin));
  }
};

const cookieAttrs = (remember: boolean): Cookies.CookieAttributes => ({
  path: "/",
  sameSite: "lax",
  secure: window.location.protocol === "https:",
  ...(remember ? { expires: AUTH_COOKIE_MAX_AGE / 86400 } : {}),
});

export const getClientAccessToken = () => Cookies.get(ACCESS_TOKEN_COOKIE);

/** Store the token pair. `remember` is set at login; refreshes reuse the stored choice. */
export const setClientAuthTokens = ({ accessToken, refreshToken }: IAuthTokens, remember?: boolean) => {
  if (remember !== undefined) {
    Cookies.set(REMEMBER_COOKIE, remember ? "1" : "0", { path: "/", sameSite: "lax", expires: 365 });
    // A login or sign-up (not a token refresh): the previous user must not stay on screen.
    forgetSessionUser();
  }
  const keep = remember ?? Cookies.get(REMEMBER_COOKIE) !== "0";
  Cookies.set(ACCESS_TOKEN_COOKIE, accessToken, cookieAttrs(keep));
  Cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, cookieAttrs(keep));
};

export const clearClientAuthTokens = () => {
  Cookies.remove(ACCESS_TOKEN_COOKIE, { path: "/" });
  Cookies.remove(REFRESH_TOKEN_COOKIE, { path: "/" });
  // Logout and "session ended" both end up here: stop showing the user right away.
  forgetSessionUser();
};

// One refresh at a time per tab: the backend rejects a reused refresh token.
let refreshInFlight: Promise<RefreshOutcome["status"]> | null = null;
const refreshOnce = () => {
  refreshInFlight ??= (async () => {
    const refreshToken = Cookies.get(REFRESH_TOKEN_COOKIE);
    if (!refreshToken) return "rejected" as const;
    const outcome = await requestTokenRefresh(getBaseUrl() as string, refreshToken);
    if (outcome.status === "refreshed") {
      setClientAuthTokens(outcome.tokens);
      return "refreshed" as const;
    }
    // Rotated by another tab or by proxy.ts meanwhile: the new cookie is already there.
    if (outcome.status === "rejected" && Cookies.get(REFRESH_TOKEN_COOKIE) !== refreshToken) {
      return "refreshed" as const;
    }
    return outcome.status;
  })().finally(() => {
    refreshInFlight = null;
  });
  return refreshInFlight;
};

// A 401 on these is a real answer (wrong password, bad code), not an expired session.
const PUBLIC_AUTH_PATHS = [
  "/auth/login",
  "/auth/refresh",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/verify-email",
  "/auth/resend-verification",
  "/auth/verify-reset-code",
];

const isPendingReview = async (res: Response) => {
  if (res.status !== 403) return false;
  try {
    const body = await res.clone().json();
    return body?.error?.code === "ACCOUNT_PENDING_REVIEW";
  } catch {
    return false;
  }
};

/**
 * Browser-side fetch with `Authorization: Bearer`, one silent refresh on 401, and the
 * central redirects: session over → /login, pending customer → /onboarding.
 * Returns the raw Response (read the envelope with `res.json()`).
 */
export const clientFetch = async (url: string, options: RequestInit = {}) => {
  const send = () => {
    const headers = new Headers(options.headers);
    const token = Cookies.get(ACCESS_TOKEN_COOKIE);
    if (token) headers.set("Authorization", `Bearer ${token}`);
    if (options.body && !(options.body instanceof FormData) && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    return fetch(`${getBaseUrl()}${url}`, { ...options, headers });
  };

  let res = await send();

  if (res.status === 401 && !PUBLIC_AUTH_PATHS.some((p) => url.startsWith(p))) {
    const outcome = await refreshOnce();
    if (outcome === "refreshed") {
      res = await send();
    } else if (outcome === "rejected") {
      clearClientAuthTokens();
      hardNavigate(LOGIN_PATH);
      return res;
    }
  }

  if (await isPendingReview(res)) hardNavigate(PENDING_CUSTOMER_PATH);
  return res;
};
