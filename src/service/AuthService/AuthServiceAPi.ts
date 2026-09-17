/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { fetchWithAuth } from "@/lib/fetchWraper";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

// Secure cookies only in production — dev runs over http, where a Secure cookie
// would be rejected by the browser.
const isProduction = process.env.NODE_ENV === "production";

// Shared cookie options. Not httpOnly because the client reads the access token
// via js-cookie (useGetUserData / SocketProvider).
const cookieOptions = (expires: Date) => ({
  path: "/",
  expires,
  secure: isProduction,
  sameSite: "lax" as const,
});

type ResendOtpBody = {
  purpose?: string;
  [key: string]: any;
};


export const registerUser = async (
  req = {
    body: {},
    params: {},
  }
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/users/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body),
      }
    );
    const result = await res.json();

    if (result.success) {
      (await cookies()).set(
        "bsw_signup_token",
        result.data,
        cookieOptions(new Date(Date.now() + 1000 * 60 * 60)) // 1 hour
      );
    }

    return result;
  } catch (error: any) {
    return Error(error);
  }
};

export const registerUserOtp = async (
  req = {
    body: {},
    params: {},
  }
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/users/create-user-verify-otp`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: (await cookies()).get("bsw_signup_token")!.value,
        },
        body: JSON.stringify(req.body),
      }
    );
    const result = await res.json();

    if (result.success) {
      (await cookies()).delete("bsw_signup_token");
    }

    return result;
  } catch (error: any) {
    return Error(error);
  }
};

export const resendOtp = async (
  req: {
    body: ResendOtpBody;
    params?: any;
  } = {
      body: {},
      params: {},
    }
) => {
  try {
    const queryString = new URLSearchParams(req.body as Record<string, string>).toString();
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/otp/resend-email-otp?${queryString}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          token:
            req?.body?.purpose === "create"
              ? (await cookies()).get("bsw_signup_token")!.value
              : (await cookies()).get("bsw_forget_token")!.value,
        },
      }
    );
    const result = await res.json();
    // if (result.success) {
    //   (await cookies()).set("bsw_signup_token", result.data, {
    //     path: "/",
    //     expires: new Date(Date.now() + 1000 * 60 * 60), // 1 hour
    //   });
    // }

    return result;
  } catch (error: any) {
    return Error(error);
  }
};

export const loginUser = async (
  req = {
    body: {},
    params: {},
  }
) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    const result = await res.json();

    if (result?.success) {
      // Only customers (role === "user") may sign in on this app. Any other
      // role is rejected before any token is stored.
      let role: string | undefined;
      try {
        const decoded: any = jwtDecode(result?.data?.accessToken);
        role = decoded?.role;
      } catch {
        role = undefined;
      }

      if (role !== "user") {
        return { success: false, message: "Permission denied" };
      }

      const threeMonths = 1000 * 60 * 60 * 24 * 30 * 3; // 3 months in milliseconds

      (await cookies()).set(
        "bsw_access_token",
        result?.data?.accessToken,
        cookieOptions(new Date(Date.now() + threeMonths))
      );

      (await cookies()).set(
        "bsw_refresh_token",
        result?.data?.refreshToken,
        cookieOptions(new Date(Date.now() + threeMonths))
      );
    }

    return result;
  } catch (error: any) {
    return Error(error);
  }
};

export const forgetPassword = async (
  req = {
    body: {},
    params: {},
  }
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/auth/forgot-password-otpByEmail`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body),
      }
    );
    const result = await res.json();

    if (result.success) {
      (await cookies()).set(
        "bsw_forget_token",
        result.data?.forgetToken,
        cookieOptions(new Date(Date.now() + 1000 * 60 * 60)) // 1 hour
      );
    }

    return result;
  } catch (error: any) {
    return Error(error);
  }
};

export const forgetPasswordOtp = async (
  req = {
    body: {},
    params: {},
  }
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/auth/forgot-password-otp-match`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          token: (await cookies()).get("bsw_forget_token")!.value,
        },
        body: JSON.stringify(req.body),
      }
    );
    const result = await res.json();

    if (result.success) {
      (await cookies()).delete("bsw_forget_token");
      (await cookies()).set(
        "bsw_forgot_otp_match_token",
        result.data,
        cookieOptions(new Date(Date.now() + 1000 * 60 * 60)) // 1 hour
      );
    }

    return result;
  } catch (error: any) {
    return Error(error);
  }
};
export const changePassword = async (
  req = {
    body: {},
    params: {},
  }
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/auth/forgot-password-reset`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          token: (await cookies()).get("bsw_forgot_otp_match_token")!.value,
        },
        body: JSON.stringify(req.body),
      }
    );
    const result = await res.json();

    if (result.success) {
      (await cookies()).delete("bsw_forgot_otp_match_token");
    }

    return result;
  } catch (error: any) {
    return Error(error);
  }
};

export const getCurrentUser = async () => {
  const accessToken = (await cookies()).get("bsw_access_token")?.value;
  let decodedData = null;

  if (accessToken) {
    decodedData = await jwtDecode(accessToken);
    return decodedData;
  } else {
    return null;
  }
};

export const logout = async () => {
  (await cookies()).delete("bsw_access_token");
  (await cookies()).delete("bsw_refresh_token");
};

export const getNewToken = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/auth/refresh-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: (await cookies()).get("bsw_refresh_token")!.value,
        },
      }
    );

    return res.json();
  } catch (error: any) {
    return Error(error);
  }
};

export const changeUserPassword = async (
  req = {
    body: {},
    params: {},
  }
) => {
  try {
    const res = await fetchWithAuth(`/auth/change-password`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });
    const result = await res.json();

    console.log(result)

    if (result.success) {
      (await cookies()).delete("bsw_access_token");
      (await cookies()).delete("bsw_refresh_token");
    }

    return result;
  } catch (error: any) {
    return Error(error);
  }
};

export const switchRole = async () => {
  try {
    const res = await fetchWithAuth(`/users/switch-role`, {
      method: "PATCH",
    });
    const result = await res.json();

    // if (result.success) {
    //   (await cookies()).delete("bsw_access_token");
    //   (await cookies()).delete("bsw_refresh_token");
    // }

    return result;
  } catch (error: any) {
    return Error(error);
  }
};
