import React from "react";
import type { Metadata } from "next";
import LoginClient from "@/components/auth/LoginClient";

export const metadata: Metadata = {
  title: "Log In | Client Portal | Pure Pool Madrid",
  description: "Sign in to access your swimming pool visits, technician reports, and maintenance invoices.",
};

export default async function LoginPage() {
  /**
   * ==============================================================================
   * NEXT.JS SSR SESSION VERIFICATION
   * ==============================================================================
   * When live API is enabled, if user already has an active session cookie:
   * const session = await getSession();
   * if (session?.isAuthenticated) {
   *   redirect("/my-pool");
   * }
   * ==============================================================================
   */

  return <LoginClient />;
}

