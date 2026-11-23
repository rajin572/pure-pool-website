"use client";

import { useEffect, useSyncExternalStore } from "react";
import { getClientAccessToken } from "./clientFetch";
import {
  forgetSessionUser,
  getSessionUserSnapshot,
  readCachedSessionUser,
  showSessionUser,
  storeSessionUser,
  subscribeSessionUser,
} from "./sessionUserStore";
import { getSessionUser } from "@/service/AuthService/AuthServiceApi";

/** Empties the shown user (call after the auth cookies are cleared). */
export const clearSessionUserCache = forgetSessionUser;

/**
 * The signed-in customer, or null when signed out (or still loading). Every component that
 * calls this sees the same user, and it empties as soon as the cookies are cleared (logout,
 * session ended, new login), without a reload.
 */
export const useSessionUser = () => {
  const user = useSyncExternalStore(subscribeSessionUser, getSessionUserSnapshot, () => null);

  useEffect(() => {
    const token = getClientAccessToken();
    if (!token) {
      forgetSessionUser();
      return;
    }
    const cached = readCachedSessionUser(token);
    if (cached) {
      showSessionUser(cached);
      return;
    }
    let alive = true;
    getSessionUser().then((res) => {
      if (!alive || !res.success) return;
      // The token may have been refreshed during the call, or the user may have signed out
      // meanwhile: in that case don't bring the user back.
      const current = getClientAccessToken();
      if (current) storeSessionUser(current, res.data);
    });
    return () => {
      alive = false;
    };
  }, []);

  return user;
};

/** Account-status label shown under the name (the plan comes from contracts, task 07). */
export const accountStatusLabel = (user: ReturnType<typeof useSessionUser>) => {
  switch (user?.accountStatus) {
    case "APPROVED":
      return "Customer";
    case "PENDING_REVIEW":
      return "Pending review";
    default:
      return "";
  }
};
