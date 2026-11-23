import type { ISessionUser } from "@/service/AuthService/AuthServiceApi";

// The signed-in customer, shared by every component that shows who is signed in (Navbar, …).
// It lives in memory only (nothing in browser storage) and is emptied wherever the auth
// cookies are cleared or replaced, so the UI never keeps showing a user who has signed out.
// No runtime imports: clientFetch (which clears cookies) depends on this file.

let current: ISessionUser | null = null;
// GET /auth/me counts against the backend's /auth rate limit (40 per 15 min per IP), so the
// answer is reused while the access token is unchanged.
let cached: { tokenKey: string; user: ISessionUser } | null = null;
const listeners = new Set<() => void>();

const tokenKey = (token: string) => token.slice(-24);

const emit = () => listeners.forEach((listener) => listener());

export const subscribeSessionUser = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const getSessionUserSnapshot = () => current;

export const readCachedSessionUser = (token: string) => (cached?.tokenKey === tokenKey(token) ? cached.user : null);

/** Show this user and remember the answer for the token it was fetched with. */
export const storeSessionUser = (token: string, user: ISessionUser) => {
  cached = { tokenKey: tokenKey(token), user };
  current = user;
  emit();
};

export const showSessionUser = (user: ISessionUser) => {
  if (current === user) return;
  current = user;
  emit();
};

/** Signed out, session ended or a new login: nobody is shown until /auth/me is asked again. */
export const forgetSessionUser = () => {
  cached = null;
  if (current === null) return;
  current = null;
  emit();
};
