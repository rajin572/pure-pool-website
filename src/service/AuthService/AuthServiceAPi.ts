/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { fetchWithAuth } from "@/lib/fetchWraper";

/**
 * ==============================================================================
 * AUTHENTICATION API SERVICES & TYPE DEFINITIONS
 * ==============================================================================
 * Next.js Server Side Rendering (SSR) & Server Actions architecture.
 * Ready for live REST API wiring:
 * - POST: Login user
 * - POST: Register user
 * - POST: Verify registration OTP code
 * - POST: Request password reset email
 * - POST: Verify password reset OTP code
 * - POST: Reset password
 * - GET: Get current session / authenticated profile
 * ==============================================================================
 */

export interface LoginPayload {
  email: string;
  password?: string;
  rememberMe?: boolean;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  phoneNumber: string;
  password?: string;
  confirmPassword?: string;
  acceptTerms: boolean;
}

export interface VerifyOtpPayload {
  email: string;
  otpCode: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  otpCode?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export interface AuthResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  token?: string;
}

/**
 * Login user service
 */
export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  try {
    /**
     * When backend API is live:
     * const res = await fetchWithAuth("/auth/login", {
     *   method: "POST",
     *   body: JSON.stringify(payload),
     * });
     * return await res.json();
     */
    return {
      success: true,
      message: "Logged in successfully",
      data: {
        userId: "USR-2026-MAD-981",
        email: payload.email,
        name: "Roberto Vidal",
        role: "pool_owner",
      },
      token: "mock-jwt-token-purepool-customer",
    };
  } catch (error) {
    return {
      success: false,
      message: "An error occurred during login",
    };
  }
}

/**
 * Register user service
 */
export async function registerUser(payload: RegisterPayload): Promise<AuthResponse> {
  try {
    /**
     * When backend API is live:
     * const res = await fetchWithAuth("/auth/register", {
     *   method: "POST",
     *   body: JSON.stringify(payload),
     * });
     * return await res.json();
     */
    return {
      success: true,
      message: "Registration initiated. Verification code sent to email",
      data: {
        email: payload.email,
        fullName: payload.fullName,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: "An error occurred during registration",
    };
  }
}

/**
 * Verify Registration OTP
 */
export async function verifyRegisterOtp(payload: VerifyOtpPayload): Promise<AuthResponse> {
  try {
    /**
     * When backend API is live:
     * const res = await fetchWithAuth("/auth/verify-registration-otp", {
     *   method: "POST",
     *   body: JSON.stringify(payload),
     * });
     * return await res.json();
     */
    return {
      success: true,
      message: "Account verified successfully",
      token: "mock-jwt-token-purepool-customer",
    };
  } catch (error) {
    return {
      success: false,
      message: "Verification failed",
    };
  }
}

/**
 * Request Password Reset Email
 */
export async function forgotPassword(payload: ForgotPasswordPayload): Promise<AuthResponse> {
  try {
    /**
     * When backend API is live:
     * const res = await fetchWithAuth("/auth/forgot-password", {
     *   method: "POST",
     *   body: JSON.stringify(payload),
     * });
     * return await res.json();
     */
    return {
      success: true,
      message: "Password reset code dispatched to email",
      data: { email: payload.email },
    };
  } catch (error) {
    return {
      success: false,
      message: "Could not dispatch password reset code",
    };
  }
}

/**
 * Verify Password Reset OTP
 */
export async function verifyResetOtp(payload: VerifyOtpPayload): Promise<AuthResponse> {
  try {
    /**
     * When backend API is live:
     * const res = await fetchWithAuth("/auth/verify-reset-otp", {
     *   method: "POST",
     *   body: JSON.stringify(payload),
     * });
     * return await res.json();
     */
    return {
      success: true,
      message: "Code verified successfully",
      data: { email: payload.email, verified: true },
    };
  } catch (error) {
    return {
      success: false,
      message: "Code verification failed",
    };
  }
}

/**
 * Create New Password (Reset)
 */
export async function resetPassword(payload: ResetPasswordPayload): Promise<AuthResponse> {
  try {
    /**
     * When backend API is live:
     * const res = await fetchWithAuth("/auth/reset-password", {
     *   method: "POST",
     *   body: JSON.stringify(payload),
     * });
     * return await res.json();
     */
    return {
      success: true,
      message: "Password successfully updated",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to reset password",
    };
  }
}
