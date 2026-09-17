import Cookies from "js-cookie";
import { getBaseUrl } from "@/helpers/config/envConfig";

export const clientFetch = async (url: string, options: RequestInit = {}) => {
    const token = Cookies.get("bsw_access_token");

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string>),
        ...(token ? { Authorization: token } : {}),
    };

    return fetch(`${getBaseUrl()}${url}`, { ...options, headers });
};
