/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { fetchWithAuth } from "@/lib/fetchWraper";
import { revalidatePath } from "next/cache";

/**
 * ==============================================================================
 * MY POOL API SERVICES & TYPE DEFINITIONS
 * ==============================================================================
 * Follows Next.js Server Side Rendering (SSR) & Server Actions best practices.
 * When the backend REST endpoints are deployed, these functions handle:
 * - GET: Pre-fetching pool specifications, chemistry, equipment, and visit history on the server
 * - POST: Creating special service requests
 * - PATCH: Updating pool technical parameters
 * - DELETE: Removing or archiving equipment records
 * ==============================================================================
 */

export interface PoolSpecificationItem {
  label: string;
  value: string;
}

export interface PoolOverviewData {
  id: string;
  name: string;
  address: string;
  poolType: string;
  waterVolume: string;
  dimensions: string;
  waterType: string;
  surfaceFinish: string;
  status: "verified" | "pending" | "maintenance_due";
  nextScheduledVisit: {
    date: string;
    technicianName: string;
    serviceType: string;
  };
}

export interface ParameterGaugeReading {
  label: string;
  value: string | number;
  unit?: string;
  status: "optimal" | "high" | "low" | "below_ideal" | "critical";
  statusText: string;
  min: number;
  max: number;
  idealMin: number;
  idealMax: number;
  currentNumeric: number;
}

export interface WaterConditionData {
  gauges: ParameterGaugeReading[];
  history: {
    metric: "ph" | "chlorine" | "alkalinity" | "temperature";
    records: { date: string; value: number }[];
  }[];
}

export interface EquipmentRecord {
  id: string;
  name: string;
  serialNumber: string;
  brandAndModel: string;
  installedDate: string;
  warrantyStatus: string;
  condition?: string;
  manualUrl?: string;
}

export interface ServiceVisitChemical {
  name: string;
  note: string;
  amount: string;
}

export interface ServiceVisitRecord {
  id: string;
  date: string;
  type: string;
  technicianName: string;
  ph: string;
  chlorine?: string;
  choline?: string;
  alkalinity: string;
  temperature: string;
  status: string;
  workPerformed?: string[];
  chemicalsAdded?: ServiceVisitChemical[];
  observations?: string;
  beforePhotoUrl?: string;
  afterPhotoUrl?: string;
}

export interface ServiceRequestPayload {
  poolId: string;
  serviceTitle: string;
  serviceCategory: string;
  preferredDate: string;
  preferredTime?: string;
  notes?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

// ----------------------------------------------------------------------
// 1. GET: Fetch Pool Overview & Technical Specifications (SSR)
// ----------------------------------------------------------------------
export const getMyPoolOverview = async (
  poolId: string = "main"
): Promise<ApiResponse<PoolOverviewData>> => {
  try {
    const res = await fetchWithAuth(`/pools/${poolId}/overview`, {
      method: "GET",
      next: {
        revalidate: 60, // Cache for 60 seconds
        tags: [`pool-${poolId}-overview`],
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch pool overview: ${res.statusText}`);
    }

    return await res.json();
  } catch (error: any) {
    // Return graceful fallback data during design & dev before backend deployment
    return {
      success: false,
      message: error?.message || "Using client mock data",
      data: {
        id: poolId,
        name: poolId === "main" ? "Main Residence Pool" : "Garden Pool",
        address: "Calle de Alcalá 125, 28009 Madrid",
        poolType: "Residential",
        waterVolume: "48 m³ (48,000 L)",
        dimensions: "8m × 4m (Depth 1.2m - 2.1m)",
        waterType: "Saltwater",
        surfaceFinish: "Tile",
        status: "verified",
        nextScheduledVisit: {
          date: "Thursday, 22 May 2026 · 10:00 - 12:00",
          technicianName: "Carlos Martínez (Certified)",
          serviceType: "Weekly Full Chemical & Filter Service",
        },
      },
    };
  }
};

// ----------------------------------------------------------------------
// 2. GET: Fetch Water Condition Stats & Historical Readings (SSR)
// ----------------------------------------------------------------------
export const getWaterConditionStats = async (
  poolId: string = "main"
): Promise<ApiResponse<WaterConditionData>> => {
  try {
    const res = await fetchWithAuth(`/pools/${poolId}/water-condition`, {
      method: "GET",
      next: {
        revalidate: 30, // Chemistry updates frequently
        tags: [`pool-${poolId}-water`],
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch water conditions: ${res.statusText}`);
    }

    return await res.json();
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Using client mock data",
      data: {
        gauges: [
          {
            label: "pH Level",
            value: "7.3",
            status: "optimal",
            statusText: "optimal",
            min: 6.6,
            max: 8.0,
            idealMin: 7.2,
            idealMax: 7.6,
            currentNumeric: 7.3,
          },
          {
            label: "Free Chlorine",
            value: "1.8",
            unit: "mg/L",
            status: "optimal",
            statusText: "optimal",
            min: 0,
            max: 5.0,
            idealMin: 1.0,
            idealMax: 3.0,
            currentNumeric: 1.8,
          },
          {
            label: "Total Alkalinity",
            value: "145",
            unit: "ppm",
            status: "high",
            statusText: "High",
            min: 0,
            max: 5.0,
            idealMin: 1.0,
            idealMax: 3.0,
            currentNumeric: 4.2,
          },
          {
            label: "Water Temperature",
            value: "24.5",
            unit: "°C",
            status: "below_ideal",
            statusText: "Below ideal",
            min: 15,
            max: 35,
            idealMin: 26,
            idealMax: 28,
            currentNumeric: 24.5,
          },
        ],
        history: [],
      },
    };
  }
};

// ----------------------------------------------------------------------
// 3. GET: Fetch Pool Equipment Inventory (SSR)
// ----------------------------------------------------------------------
export const getPoolEquipment = async (
  poolId: string = "main"
): Promise<ApiResponse<EquipmentRecord[]>> => {
  try {
    const res = await fetchWithAuth(`/pools/${poolId}/equipment`, {
      method: "GET",
      next: {
        revalidate: 3600, // Equipment changes infrequently
        tags: [`pool-${poolId}-equipment`],
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch equipment: ${res.statusText}`);
    }

    return await res.json();
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Using client mock data",
      data: [
        {
          id: "1",
          name: "Variable Speed Filtration Pump",
          serialNumber: "S/N: AP-2022-88192-M",
          brandAndModel: "AstralPool · Victoria Plus Silent 1.5 CV",
          installedDate: "12/04/2022",
          warrantyStatus: "Confirmed",
        },
        {
          id: "2",
          name: "Variable Speed Filtration Pump",
          serialNumber: "S/N: AP-2022-88192-M",
          brandAndModel: "AstralPool · Victoria Plus Silent 1.5 CV",
          installedDate: "12/04/2022",
          warrantyStatus: "Confirmed",
        },
        {
          id: "3",
          name: "Variable Speed Filtration Pump",
          serialNumber: "S/N: AP-2022-88192-M",
          brandAndModel: "AstralPool · Victoria Plus Silent 1.5 CV",
          installedDate: "12/04/2022",
          warrantyStatus: "Confirmed",
        },
        {
          id: "4",
          name: "Variable Speed Filtration Pump",
          serialNumber: "S/N: AP-2022-88192-M",
          brandAndModel: "AstralPool · Victoria Plus Silent 1.5 CV",
          installedDate: "12/04/2022",
          warrantyStatus: "Confirmed",
        },
      ],
    };
  }
};

// ----------------------------------------------------------------------
// 4. GET: Fetch Service Visits History (SSR)
// ----------------------------------------------------------------------
export const getServiceVisitsHistory = async (
  poolId: string = "main",
  page: number = 1,
  limit: number = 10
): Promise<ApiResponse<ServiceVisitRecord[]>> => {
  try {
    const res = await fetchWithAuth(
      `/pools/${poolId}/service-visits?page=${page}&limit=${limit}`,
      {
        method: "GET",
        next: {
          revalidate: 60,
          tags: [`pool-${poolId}-visits`],
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch visits history: ${res.statusText}`);
    }

    return await res.json();
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Using client mock data",
      data: [
        {
          id: "1",
          date: "17 May 2026",
          type: "Weekly maintenance",
          technicianName: "Carlos Martínez",
          ph: "7.3",
          chlorine: "1.8 mg/L",
          alkalinity: "145 ppm",
          temperature: "24.5 °C",
          status: "Completed",
        },
        {
          id: "2",
          date: "10 May 2026",
          type: "Weekly maintenance",
          technicianName: "Carlos Martínez",
          ph: "7.2",
          chlorine: "2.0 mg/L",
          alkalinity: "140 ppm",
          temperature: "23.8 °C",
          status: "Completed",
        },
        {
          id: "3",
          date: "03 May 2026",
          type: "Weekly maintenance",
          technicianName: "Carlos Martínez",
          ph: "7.4",
          chlorine: "1.6 mg/L",
          alkalinity: "150 ppm",
          temperature: "22.5 °C",
          status: "Completed",
        },
      ],
    };
  }
};

// ----------------------------------------------------------------------
// 5. POST: Create a Service Request (Server Action)
// ----------------------------------------------------------------------
export const createServiceRequest = async (
  payload: ServiceRequestPayload
): Promise<ApiResponse<{ requestId: string }>> => {
  try {
    const res = await fetchWithAuth(`/pools/service-request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    revalidatePath("/my-pool");
    return result;
  } catch (error: any) {
    console.error("Error submitting service request:", error);
    return {
      success: false,
      message: error?.message || "Network error",
      data: { requestId: `REQ-MOCK-${Date.now()}` },
    };
  }
};

// ----------------------------------------------------------------------
// 6. PATCH: Update Pool Specifications (Server Action)
// ----------------------------------------------------------------------
export const updatePoolSpecifications = async (
  poolId: string,
  specs: Partial<PoolOverviewData>
): Promise<ApiResponse<PoolOverviewData>> => {
  try {
    const res = await fetchWithAuth(`/pools/${poolId}/specifications`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(specs),
    });

    const result = await res.json();
    revalidatePath("/my-pool");
    return result;
  } catch (error: any) {
    console.error("Error updating pool specs:", error);
    return {
      success: false,
      message: error?.message || "Network error",
      data: {
        id: poolId,
        name: "Main Residence Pool",
        address: "Calle de Alcalá 125, 28009 Madrid",
        poolType: "Residential",
        waterVolume: "48 m³ (48,000 L)",
        dimensions: "8m × 4m (Depth 1.2m - 2.1m)",
        waterType: "Saltwater",
        surfaceFinish: "Tile",
        status: "verified",
        nextScheduledVisit: {
          date: "Thursday, 22 May 2026",
          technicianName: "Carlos Martínez",
          serviceType: "Weekly Maintenance",
        },
      },
    };
  }
};

// ----------------------------------------------------------------------
// 7. DELETE: Remove Equipment Record (Server Action)
// ----------------------------------------------------------------------
export const deleteEquipmentRecord = async (
  equipmentId: string
): Promise<ApiResponse<{ deletedId: string }>> => {
  try {
    const res = await fetchWithAuth(`/pools/equipment/${equipmentId}`, {
      method: "DELETE",
    });

    const result = await res.json();
    revalidatePath("/my-pool");
    return result;
  } catch (error: any) {
    console.error("Error deleting equipment record:", error);
    return {
      success: false,
      message: error?.message || "Network error",
      data: { deletedId: equipmentId },
    };
  }
};

