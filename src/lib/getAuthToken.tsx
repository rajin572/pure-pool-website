import { cookies } from "next/headers";

// Helper function to get the Authorization token from cookies
export const getAuthToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("purepool_website_access_token")?.value;
};
