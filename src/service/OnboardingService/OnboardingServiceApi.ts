/* eslint-disable @typescript-eslint/no-unused-vars */

import { fetchWithAuth } from "@/lib/fetchWraper";

/**
 * ==============================================================================
 * ONBOARDING API SERVICES & TYPE DEFINITIONS
 * ==============================================================================
 * Multi-step Pool Setup flow:
 * Step 1: Pool Location
 * Step 2: Pool Specifications
 * Step 3: Pool Shape & Features
 * Step 4: Pool Photos
 * Step 5: Pool Equipment
 * Step Review & Submit
 * ==============================================================================
 */

export interface OnboardingLocationData {
  poolAddress: string;
  postalCode: string;
  city: string;
  gateCode?: string;
  accessNotes?: string;
}

export interface OnboardingSpecificationsData {
  poolType: "residential" | "commercial" | "unknown";
  approximateVolume?: string;
  lengthMeters?: string;
  widthMeters?: string;
  depthMeters?: string;
  waterTreatment: "saltwater" | "chlorine" | "unknown" | "other";
  surfaceFinish: "tile" | "liner" | "polyester" | "unknown" | "other";
}

export interface OnboardingShapeData {
  shape:
    | "rectangular"
    | "square"
    | "circular"
    | "oval"
    | "kidney"
    | "l_shaped"
    | "infinity_1"
    | "infinity_2"
    | "infinity_3"
    | "lagoon"
    | "freeform"
    | "roman"
    | "lap"
    | "other";
  hasSpa?: boolean;
  hasInfinityEdge?: boolean;
  hasAutoCover?: boolean;
  hasLighting?: boolean;
}

export interface OnboardingPhotosData {
  poolOverviewPhoto?: string;
  equipmentPhoto?: string;
  accessGatePhoto?: string;
}

export interface OnboardingEquipmentData {
  filterType: "sand" | "glass" | "cartridge" | "de" | "unknown";
  pumpType: "variable_speed" | "single_speed" | "unknown";
  heating: "heat_pump" | "solar" | "none" | "unknown";
  hasSaltChlorinator: boolean;
  cleanerType: "robot" | "suction" | "manual" | "none";
}

export interface FullOnboardingData {
  location: OnboardingLocationData;
  specifications: OnboardingSpecificationsData;
  shape: OnboardingShapeData;
  photos: OnboardingPhotosData;
  equipment: OnboardingEquipmentData;
}

export const initialOnboardingData: FullOnboardingData = {
  location: {
    poolAddress: "Calle de las Acacias 14, Chalet B",
    postalCode: "28223",
    city: "Pozuelo de Alarcón, Madrid",
    gateCode: "4920",
    accessNotes: "Technician may enter via side gate next to garage. Water meter is on the right.",
  },
  specifications: {
    poolType: "residential",
    approximateVolume: "55000",
    lengthMeters: "10.0",
    widthMeters: "5.0",
    depthMeters: "1.8",
    waterTreatment: "saltwater",
    surfaceFinish: "tile",
  },
  shape: {
    shape: "rectangular",
    hasSpa: false,
    hasInfinityEdge: false,
    hasAutoCover: true,
    hasLighting: true,
  },
  photos: {
    poolOverviewPhoto: "",
    equipmentPhoto: "",
    accessGatePhoto: "",
  },
  equipment: {
    filterType: "glass",
    pumpType: "variable_speed",
    heating: "heat_pump",
    hasSaltChlorinator: true,
    cleanerType: "robot",
  },
};

/**
 * Fetch current onboarding state
 */
export async function getOnboardingState(userId?: string): Promise<{
  success: boolean;
  data: FullOnboardingData;
  currentStep: number;
}> {
  try {
    /**
     * When backend API is live:
     * const res = await fetchWithAuth(`/onboarding/${userId || "current"}`);
     * return await res.json();
     */
    return {
      success: true,
      data: initialOnboardingData,
      currentStep: 1,
    };
  } catch (error) {
    return {
      success: true,
      data: initialOnboardingData,
      currentStep: 1,
    };
  }
}

/**
 * Save / complete onboarding setup
 */
export async function submitCompleteOnboarding(data: FullOnboardingData): Promise<{
  success: boolean;
  message: string;
  poolId: string;
}> {
  try {
    /**
     * When backend API is live:
     * const res = await fetchWithAuth("/onboarding/complete", {
     *   method: "POST",
     *   body: JSON.stringify(data),
     * });
     * return await res.json();
     */
    return {
      success: true,
      message: "Pool onboarding profile created successfully",
      poolId: "MAD-2026-POOL",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to submit onboarding profile",
      poolId: "MAD-2026-POOL",
    };
  }
}

