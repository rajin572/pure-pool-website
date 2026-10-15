/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { fetchWithAuth } from "@/lib/fetchWraper";

/**
 * ==============================================================================
 * USER PROFILE & ACCOUNT MANAGEMENT API SERVICES & TYPES
 * ==============================================================================
 * Next.js Server & Client architecture ready for REST API & Redux RTK Query wiring.
 * Endpoints:
 * - GET: Fetch current user profile details
 * - PATCH: Update profile name and avatar
 * - POST/PATCH: Update / change account password
 * - PATCH: Update language preferences
 * - POST: Logout active session
 * ==============================================================================
 */

export interface IUserProfile {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  avatar?: string;
  plan?: string;
  language?: string;
  isSubscribed?: boolean;
}

export interface IUpdateProfilePayload {
  fullName: string;
  avatar?: File | string;
}

export interface IUpdatePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface IUpdateLanguagePayload {
  language: string;
}

export interface IProfileApiResponse<T = any> {
  success: boolean;
  statusCode?: number;
  message: string;
  data?: T;
}

/**
 * Default mock profile matching the Figma design screenshots
 */
export const MOCK_USER_PROFILE: IUserProfile = {
  id: "usr_94821",
  fullName: "Juan Pérez Martínez",
  email: "juan.perez.m92@gmail.com",
  phoneNumber: "+34 612 847 395",
  avatar: "/images/userAvatar.png",
  plan: "Pro Plan",
  language: "English",
  isSubscribed: true,
};

/**
 * Language options configured according to Figma specifications
 */
export interface ILanguageOption {
  code: string;
  name: string;
  nativeName?: string;
}

export const SUPPORTED_LANGUAGES: ILanguageOption[] = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "ca", name: "Català" },
  { code: "de", name: "Deutsch" },
  { code: "fr", name: "Français" },
  { code: "nl", name: "Nederlands" },
];

/**
 * ==============================================================================
 * API INTEGRATION METHODS (Commented out ready for backend wiring)
 * ==============================================================================
 */

/**
 * GET: Fetch User Profile
 */
export async function getProfileApi(): Promise<IProfileApiResponse<IUserProfile>> {
  // try {
  //   const response = await fetchWithAuth("/api/user/profile", {
  //     method: "GET",
  //     headers: { "Content-Type": "application/json" },
  //   });
  //   return await response.json();
  // } catch (error) {
  //   console.error("Failed to fetch user profile:", error);
  //   throw error;
  // }

  return {
    success: true,
    statusCode: 200,
    message: "Profile retrieved successfully",
    data: MOCK_USER_PROFILE,
  };
}

/**
 * PATCH: Update User Profile (Name / Avatar)
 */
export async function updateProfileApi(
  payload: IUpdateProfilePayload
): Promise<IProfileApiResponse<IUserProfile>> {
  // try {
  //   const formData = new FormData();
  //   formData.append("fullName", payload.fullName);
  //   if (payload.avatar instanceof File) {
  //     formData.append("avatar", payload.avatar);
  //   }
  //   const response = await fetchWithAuth("/api/user/profile", {
  //     method: "PATCH",
  //     body: formData,
  //   });
  //   return await response.json();
  // } catch (error) {
  //   console.error("Failed to update profile:", error);
  //   throw error;
  // }

  return {
    success: true,
    statusCode: 200,
    message: "Profile updated successfully",
    data: {
      ...MOCK_USER_PROFILE,
      fullName: payload.fullName,
    },
  };
}

/**
 * POST / PATCH: Change Password
 */
export async function updatePasswordApi(
  payload: IUpdatePasswordPayload
): Promise<IProfileApiResponse<null>> {
  // try {
  //   const response = await fetchWithAuth("/api/user/change-password", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(payload),
  //   });
  //   return await response.json();
  // } catch (error) {
  //   console.error("Failed to update password:", error);
  //   throw error;
  // }

  return {
    success: true,
    statusCode: 200,
    message: "Password updated successfully",
    data: null,
  };
}

/**
 * PATCH: Update Language
 */
export async function updateLanguageApi(
  payload: IUpdateLanguagePayload
): Promise<IProfileApiResponse<string>> {
  // try {
  //   const response = await fetchWithAuth("/api/user/language", {
  //     method: "PATCH",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(payload),
  //   });
  //   return await response.json();
  // } catch (error) {
  //   console.error("Failed to update language:", error);
  //   throw error;
  // }

  return {
    success: true,
    statusCode: 200,
    message: "Language preference updated",
    data: payload.language,
  };
}

/**
 * POST: Logout User Session
 */
export async function logoutUserApi(): Promise<IProfileApiResponse<null>> {
  // try {
  //   const response = await fetchWithAuth("/api/auth/logout", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //   });
  //   return await response.json();
  // } catch (error) {
  //   console.error("Failed to logout:", error);
  //   throw error;
  // }

  return {
    success: true,
    statusCode: 200,
    message: "Logged out successfully",
    data: null,
  };
}
