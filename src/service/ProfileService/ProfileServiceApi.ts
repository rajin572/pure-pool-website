/**
 * The signed-in user's own account (Postman folder "User"):
 * `PATCH /auth/me` (name, preferredLocale, avatarUrl), `POST /auth/change-password`,
 * `POST /auth/request-verification`, `POST /auth/me/deletion-request`.
 * Reading the profile is `getSessionUser` (GET /auth/me) in the auth service.
 *
 * Client Components only (uses `clientFetch` through `apiRequest`).
 */
import { patch, post } from "@/lib/apiRequest";
import type { ISessionUser } from "@/service/AuthService/AuthServiceApi";

export interface IUpdateProfilePayload {
  name?: string;
  preferredLocale?: string;
  avatarUrl?: string;
}

export interface IChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

/** Locales the backend accepts for `preferredLocale`. */
export interface ILanguageOption {
  code: string;
  name: string;
}

export const SUPPORTED_LANGUAGES: ILanguageOption[] = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "de", name: "Deutsch" },
  { code: "fr", name: "Français" },
  { code: "nl", name: "Nederlands" },
];

export const languageName = (code?: string) =>
  SUPPORTED_LANGUAGES.find((l) => l.code === code)?.name ?? "English";

export const updateProfile = (payload: IUpdateProfilePayload) => patch<ISessionUser>("/auth/me", payload);

/** The backend revokes every session on success: the caller must sign the user out. */
export const changePassword = (payload: IChangePasswordPayload) =>
  post<{ message: string }>("/auth/change-password", payload);

export const requestEmailVerification = () => post<{ verified?: boolean; message?: string }>("/auth/request-verification", {});

export const requestAccountDeletion = () =>
  post<{ deletionRequestedAt: string; message: string }>("/auth/me/deletion-request");
