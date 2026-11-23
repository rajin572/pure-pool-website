import { NextResponse, type NextRequest } from "next/server";
import { getBaseUrl } from "@/helpers/config/envConfig";
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  REMEMBER_COOKIE,
  authCookieAttributes,
  isTokenExpiring,
  requestTokenRefresh,
} from "@/lib/authSession";

// Pages that need a signed-in customer. The token carries no role, so this is a
// presence check only; pages and the backend enforce the rest.
const PROTECTED_PREFIXES = [
  "/my-pool",
  "/quotes",
  "/invoices",
  "/billing",
  "/service-request",
  "/service-history",
  "/documents",
  "/pool-settings",
  "/onboarding",
];

const isProtected = (pathname: string) =>
  PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));

/**
 * 1. Keeps the session fresh for server-rendered pages. Server Components can read
 *    cookies but not set them, so an expired access token is refreshed here: the new pair
 *    goes to the browser (Set-Cookie) and into the forwarded request for this render.
 * 2. Sends visitors without a session from protected pages to /login?next=…
 */
export async function proxy(request: NextRequest) {
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;
  const secure = request.nextUrl.protocol === "https:";
  const remember = request.cookies.get(REMEMBER_COOKIE)?.value !== "0";

  // Prefetches run in parallel with navigations; letting them refresh too would race
  // on the single-use refresh token.
  const isPrefetch =
    request.headers.get("next-router-prefetch") === "1" || request.headers.get("purpose") === "prefetch";

  let hasSession = !!accessToken;
  const setCookies: Array<[string, string, ReturnType<typeof authCookieAttributes>]> = [];

  if (refreshToken && !isPrefetch && isTokenExpiring(accessToken)) {
    const outcome = await requestTokenRefresh(getBaseUrl() as string, refreshToken);
    if (outcome.status === "refreshed") {
      const { accessToken: nextAccess, refreshToken: nextRefresh } = outcome.tokens;
      request.cookies.set(ACCESS_TOKEN_COOKIE, nextAccess);
      request.cookies.set(REFRESH_TOKEN_COOKIE, nextRefresh);
      setCookies.push([ACCESS_TOKEN_COOKIE, nextAccess, authCookieAttributes(secure, remember)]);
      setCookies.push([REFRESH_TOKEN_COOKIE, nextRefresh, authCookieAttributes(secure, remember)]);
      hasSession = true;
    } else if (outcome.status === "rejected") {
      // The session is over (logged out elsewhere, expired, or revoked).
      request.cookies.delete(ACCESS_TOKEN_COOKIE);
      request.cookies.delete(REFRESH_TOKEN_COOKIE);
      setCookies.push([ACCESS_TOKEN_COOKIE, "", { ...authCookieAttributes(secure), maxAge: 0 }]);
      setCookies.push([REFRESH_TOKEN_COOKIE, "", { ...authCookieAttributes(secure), maxAge: 0 }]);
      hasSession = false;
    }
    // "unavailable" (backend down): change nothing.
  }

  const { pathname, search } = request.nextUrl;
  const response =
    !hasSession && isProtected(pathname)
      ? NextResponse.redirect(
          Object.assign(new URL("/login", request.url), {
            search: `?next=${encodeURIComponent(pathname + search)}`,
          }),
        )
      : NextResponse.next({ request: { headers: request.headers } });

  for (const [name, value, attrs] of setCookies) response.cookies.set(name, value, attrs);
  return response;
}

export const config = {
  // Pages only: skip API routes, Next internals and static files.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images/|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|txt|xml)$).*)"],
};
