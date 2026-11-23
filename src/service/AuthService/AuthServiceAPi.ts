/**
 * Authentication (Postman folder "Authentication" + GET /auth/me as the session check).
 *
 * Called from Client Components, so this module uses `clientFetch` only and must not
 * import anything server-only (`next/headers`, `fetchWithAuth`).
 */
import Cookies from "js-cookie";
import { clearClientAuthTokens } from "@/lib/clientFetch";
import { post, request } from "@/lib/apiRequest";
import type { IAuthTokens } from "@/types";

// ---------- Types (from the Postman example responses) ----------

export type TUserRole = "ADMIN" | "MANAGER" | "BACK_OFFICE" | "TECHNICIAN" | "CUSTOMER";
export type TAccountStatus = "PENDING_REVIEW" | "APPROVED" | "SUSPENDED" | "REJECTED" | string;

export interface ISessionUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: TUserRole;
  accountStatus: TAccountStatus;
  emailVerified: boolean;
  preferredLocale?: string;
  avatarUrl?: string;
  notificationPreferences?: Record<string, boolean>;
  deletionRequestedAt?: string;
  lastLoginAt?: string;
}

export interface IAuthSession extends IAuthTokens {
  user: ISessionUser;
}

export interface IRegisterResult extends IAuthSession {
  nextStep?: "VERIFY_EMAIL" | string;
  message?: string;
}

/** Form shapes used by the auth screens. */
export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  newPassword: string;
  confirmPassword: string;
}

/** Backend rule for passwords on register / reset / change: 10–72 characters. */
export const PASSWORD_MIN = 10;
export const PASSWORD_MAX = 72;

// ---------- Calls ----------

type TMessage = { message: string };

export const loginUser = ({ email, password }: LoginPayload) =>
  post<IAuthSession>("/auth/login", { email: email.trim(), password });

export const registerUser = (data: RegisterPayload) =>
  post<IRegisterResult>("/auth/register", {
    name: data.fullName.trim(),
    email: data.email.trim(),
    password: data.password,
    ...(data.phoneNumber?.trim() ? { phone: data.phoneNumber.trim() } : {}),
  });

export const verifyEmail = (email: string, code: string) =>
  post<{ verified: boolean }>("/auth/verify-email", { email, code });

export const resendVerification = (email: string) => post<TMessage>("/auth/resend-verification", { email });

export const forgotPassword = (email: string) => post<TMessage>("/auth/forgot-password", { email: email.trim() });

export const verifyResetCode = (email: string, code: string) =>
  post<{ resetToken: string; expiresInMinutes: number }>("/auth/verify-reset-code", { email, code });

export const resetPassword = (resetToken: string, newPassword: string) =>
  post<TMessage>("/auth/reset-password", { resetToken, newPassword });

export const getSessionUser = () => request<ISessionUser>("/auth/me");

/**
 * POST /auth/logout revokes this user's tokens on every device, then the local cookies
 * are cleared even if the call failed (offline).
 */
export const logoutUser = async () => {
  const res = await post<TMessage>("/auth/logout");
  clearClientAuthTokens();
  return res;
};

// ---------- Flow helpers ----------

/** Only same-origin relative paths are accepted as a post-login destination. */
export const safeNextPath = (next: string | null | undefined, fallback = "/my-pool") =>
  next && next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\") ? next : fallback;

/** Where a signed-in customer belongs next. */
export const nextStepFor = (user: ISessionUser, next?: string | null) => {
  if (!user.emailVerified) return `/register/verify?email=${encodeURIComponent(user.email)}`;
  if (user.accountStatus === "PENDING_REVIEW") return "/onboarding";
  return safeNextPath(next);
};

// The reset token from the emailed code lives in a short-lived cookie (15 min = backend
// expiresInMinutes), never in localStorage/sessionStorage or the URL. A reload keeps the step.
const RESET_TOKEN_COOKIE = "purepool_website_reset_token";
export const resetTokenStore = {
  get: () => (typeof window === "undefined" ? null : Cookies.get(RESET_TOKEN_COOKIE) ?? null),
  set: (token: string) =>
    Cookies.set(RESET_TOKEN_COOKIE, token, {
      path: "/",
      sameSite: "strict",
      secure: window.location.protocol === "https:",
      expires: 15 / (24 * 60),
    }),
  clear: () => Cookies.remove(RESET_TOKEN_COOKIE, { path: "/" }),
};
