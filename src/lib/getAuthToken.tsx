import { cookies } from "next/headers";
import { ACCESS_TOKEN_COOKIE } from "./authSession";

// Helper function to get the access token from cookies (server side)
export const getAuthToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
};
