/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { fetchWithAuth } from "@/lib/fetchWraper";

/**
 * ==============================================================================
 * POOL SETTINGS API SERVICES & TYPE DEFINITIONS
 * ==============================================================================
 * Production-ready Next.js SSR & Client Actions architecture.
 * Ready for REST API / Redux RTK Query wiring:
 * - GET: Fetch pool settings by pool ID
 * - PATCH: Update pool settings (Location, Specs, Equipment)
 * - POST: Upload new pool photo
 * - DELETE: Delete pool photo
 * ==============================================================================
 */

export type PoolType = "Residential" | "Commercial" | "I don't know";
export type WaterTreatment = "Saltwater" | "Chlorine" | "I don't know";
export type SurfaceFinish =
  | "Tile (Gresite)"
  | "Liner / Vinyl"
  | "Polyester / Fibreglass"
  | "I don't know";

export interface IPoolDimensions {
  length: string;
  width: string;
  depth: string;
}

export interface IPoolSettings {
  id: string;
  poolName: string;
  address: string;
  city: string;
  postalCode: string;
  accessInstructions: string;
  poolType: PoolType;
  approximateVolume: string;
  dimensions: IPoolDimensions;
  waterTreatment: WaterTreatment;
  surfaceFinish: SurfaceFinish;
  equipmentNotes: string;
  photos: string[];
}

export interface IUpdatePoolSettingsPayload {
  poolName?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  accessInstructions?: string;
  poolType?: PoolType;
  approximateVolume?: string;
  dimensions?: IPoolDimensions;
  waterTreatment?: WaterTreatment;
  surfaceFinish?: SurfaceFinish;
  equipmentNotes?: string;
}

export interface IPoolSettingsResponse<T = any> {
  success: boolean;
  statusCode?: number;
  message: string;
  data?: T;
}

/**
 * Mock data matching exact Figma design specifications
 */
export const MOCK_POOL_SETTINGS: Record<string, IPoolSettings> = {
  main: {
    id: "pool_main_01",
    poolName: "Main Pool",
    address: "Carrer de la Mar, 24",
    city: "Marbella",
    postalCode: "29602",
    accessInstructions:
      "Gate code 4821. Key is in the lockbox next to the entrance. Please keep the gate closed after entering. Dog may be on the premises.",
    poolType: "Residential",
    approximateVolume: "48,000 L",
    dimensions: {
      length: "10 m",
      width: "5 m",
      depth: "1.6 m",
    },
    waterTreatment: "Saltwater",
    surfaceFinish: "Tile (Gresite)",
    equipmentNotes:
      "Hayward salt chlorinator. Sand filter and variable-speed pump installed in the equipment room behind the pool. Last equipment service completed recently.",
    photos: [
      "/images/homepage/pool1.jpg",
      "/images/homepage/pool2.jpg",
      "/images/homepage/pool3.jpg",
      "/images/homepage/pool4.jpg",
    ],
  },
  farmhouse: {
    id: "pool_farmhouse_02",
    poolName: "Farm House Pool",
    address: "Camino de las Huertas 12",
    city: "Ronda",
    postalCode: "29400",
    accessInstructions:
      "Side wooden gate is unlocked. Equipment shed is to the left of the stone terrace. Key code is 1234.",
    poolType: "Residential",
    approximateVolume: "35,000 L",
    dimensions: {
      length: "8 m",
      width: "4 m",
      depth: "1.5 m",
    },
    waterTreatment: "Chlorine",
    surfaceFinish: "Polyester / Fibreglass",
    equipmentNotes:
      "Zodiac cartridge filter with standard dual speed pump. Serviced in spring.",
    photos: [
      "/images/homepage/pool5.jpg",
      "/images/homepage/pool6.jpg",
      "/images/homepage/pool2.jpg",
    ],
  },
};

/**
 * ==============================================================================
 * API INTEGRATION METHODS (Commented out ready for backend connection)
 * ==============================================================================
 */

/**
 * GET: Fetch Pool Settings
 */
export async function getPoolSettingsApi(
  poolId = "main"
): Promise<IPoolSettingsResponse<IPoolSettings>> {
  // try {
  //   const response = await fetchWithAuth(`/api/pool-settings/${poolId}`, {
  //     method: "GET",
  //     headers: { "Content-Type": "application/json" },
  //   });
  //   return await response.json();
  // } catch (error) {
  //   console.error("Failed to fetch pool settings:", error);
  //   throw error;
  // }

  return {
    success: true,
    statusCode: 200,
    message: "Pool settings fetched successfully",
    data: MOCK_POOL_SETTINGS[poolId] || MOCK_POOL_SETTINGS.main,
  };
}

/**
 * PATCH: Update Pool Settings
 */
export async function updatePoolSettingsApi(
  poolId: string,
  payload: IUpdatePoolSettingsPayload
): Promise<IPoolSettingsResponse<IPoolSettings>> {
  // try {
  //   const response = await fetchWithAuth(`/api/pool-settings/${poolId}`, {
  //     method: "PATCH",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(payload),
  //   });
  //   return await response.json();
  // } catch (error) {
  //   console.error("Failed to update pool settings:", error);
  //   throw error;
  // }

  return {
    success: true,
    statusCode: 200,
    message: "Pool settings updated successfully",
    data: {
      ...(MOCK_POOL_SETTINGS[poolId] || MOCK_POOL_SETTINGS.main),
      ...payload,
    },
  };
}

/**
 * POST: Upload Pool Photo
 */
export async function uploadPoolPhotoApi(
  poolId: string,
  file: File
): Promise<IPoolSettingsResponse<{ photoUrl: string }>> {
  // try {
  //   const formData = new FormData();
  //   formData.append("photo", file);
  //   const response = await fetchWithAuth(`/api/pool-settings/${poolId}/photos`, {
  //     method: "POST",
  //     body: formData,
  //   });
  //   return await response.json();
  // } catch (error) {
  //   console.error("Failed to upload pool photo:", error);
  //   throw error;
  // }

  return {
    success: true,
    statusCode: 201,
    message: "Photo uploaded successfully",
    data: { photoUrl: URL.createObjectURL(file) },
  };
}

/**
 * DELETE: Delete Pool Photo
 */
export async function deletePoolPhotoApi(
  poolId: string,
  photoUrl: string
): Promise<IPoolSettingsResponse<null>> {
  // try {
  //   const response = await fetchWithAuth(`/api/pool-settings/${poolId}/photos`, {
  //     method: "DELETE",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ photoUrl }),
  //   });
  //   return await response.json();
  // } catch (error) {
  //   console.error("Failed to delete pool photo:", error);
  //   throw error;
  // }

  return {
    success: true,
    statusCode: 200,
    message: "Photo deleted successfully",
    data: null,
  };
}

