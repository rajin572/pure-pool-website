/**
 * Server-side read of the customer's saved registration (`GET /onboarding`), for the
 * onboarding page (a Server Component). Uses `fetchWithAuth`, so it must not be imported
 * from Client Components.
 */
import { fetchWithAuth } from "@/lib/fetchWraper";
import type { IApiResult } from "@/types";
import {
  initialOnboardingData,
  pickWorkingPool,
  poolToFormData,
  stepForNextStep,
  type FullOnboardingData,
  type IOnboardingStatus,
} from "./OnboardingServiceApi";

export type OnboardingState =
  | {
      kind: "wizard";
      data: FullOnboardingData;
      poolId?: string;
      step: number;
      nextStep: IOnboardingStatus["nextStep"];
    }
  | { kind: "verify-email"; email: string }
  | { kind: "done" }
  | { kind: "login" }
  | { kind: "not-customer" }
  | { kind: "error"; message: string };

const read = async <T>(path: string): Promise<{ status: number; body: IApiResult<T> | null }> => {
  try {
    const res = await fetchWithAuth(path, { cache: "no-store" });
    return { status: res.status, body: (await res.json().catch(() => null)) as IApiResult<T> | null };
  } catch {
    return { status: 0, body: null };
  }
};

export async function getOnboardingState(): Promise<OnboardingState> {
  const { status, body } = await read<IOnboardingStatus>("/onboarding");

  if (status === 401) return { kind: "login" };
  if (status === 403) return { kind: "not-customer" };
  if (!body || !body.success) {
    return {
      kind: "error",
      message: body && !body.success ? body.error.message : "We couldn't load your registration. Check your connection and try again.",
    };
  }

  const s = body.data;
  if (s.nextStep === "VERIFY_EMAIL") {
    const me = await read<{ email: string }>("/auth/me");
    return { kind: "verify-email", email: me.body && me.body.success ? me.body.data.email : "" };
  }
  if (s.nextStep === "DONE" || s.nextStep === "REVIEWED") return { kind: "done" };

  const pool = pickWorkingPool(s.pools);
  return {
    kind: "wizard",
    data: pool ? poolToFormData(pool) : initialOnboardingData,
    poolId: pool?._id,
    step: stepForNextStep(s.nextStep),
    nextStep: s.nextStep,
  };
}
