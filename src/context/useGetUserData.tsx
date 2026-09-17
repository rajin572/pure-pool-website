/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSyncExternalStore } from "react";
import Cookies from "js-cookie";
import { IJwtPayload } from "../types";
import { decodedToken } from "@/utils/jwt";

export const TOKEN_UPDATED_EVENT = "website_updated";

const subscribe = (callback: () => void) => {
    window.addEventListener(TOKEN_UPDATED_EVENT, callback);
    return () => window.removeEventListener(TOKEN_UPDATED_EVENT, callback);
};

const getSnapshot = () => Cookies.get("website_accessToken") ?? null;
const getServerSnapshot = () => null;

const useUserData = (): IJwtPayload | null => {
    const token = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    if (!token) return null;
    return decodedToken(token) as any | null;
};

export default useUserData;
