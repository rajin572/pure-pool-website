/* eslint-disable @typescript-eslint/no-explicit-any */

import { fetchWithAuth } from "@/lib/fetchWraper";
// import { revalidatePath } from "next/cache";

/**
 * ==============================================================================
 * SERVICE REQUESTS API SERVICES & TYPE DEFINITIONS
 * ==============================================================================
 * Next.js Server Side Rendering (SSR) & Server Actions architecture.
 * Ready for live REST API wiring:
 * - GET: Fetch service request tickets
 * - GET: Fetch single ticket detail
 * - POST: Create new service request ticket
 * - PATCH: Cancel or update service request ticket
 * ==============================================================================
 */

export type ServiceCategory =
  | "equipment_breakdown"
  | "water_quality"
  | "special_cleaning"
  | "emergency_leak"
  | "general_inquiry";

export type UrgencyLevel = "Normal" | "High" | "Urgent";

export type ServiceRequestStatus =
  | "Submitted"
  | "In progress"
  | "Scheduled"
  | "Completed"
  | "Cancelled";

export interface ServiceRequestRecord {
  id: string;
  reference: string;
  category: ServiceCategory;
  categoryTitle: string;
  description: string;
  poolName: string;
  urgency: UrgencyLevel;
  status: ServiceRequestStatus;
  createdAt: string;
  scheduledDate?: string;
  technicianName?: string;
  attachedPhotosCount?: number;
}

export interface CreateServiceRequestPayload {
  poolName: string;
  category: ServiceCategory;
  urgency: UrgencyLevel;
  description: string;
  photos?: any[];
}

/**
 * MOCK SERVICE REQUEST TICKETS
 * Matches Figma Node 40014390:7481
 */
export const MOCK_SERVICE_REQUESTS: ServiceRequestRecord[] = [
  {
    id: "sr-001",
    reference: "SR-2026-0163",
    category: "equipment_breakdown",
    categoryTitle: "Equipment breakdown",
    description:
      "Heat pump display shows Error E-04 (Low water flow protection). The compressor starts and then shuts down after 30 seconds.",
    poolName: "Main Residence Pool",
    urgency: "High",
    status: "In progress",
    createdAt: "8 May 2026",
    technicianName: "Carlos Martínez",
    attachedPhotosCount: 2,
  },
  {
    id: "sr-002",
    reference: "SR-2026-0158",
    category: "water_quality",
    categoryTitle: "Water quality issue",
    description:
      "Water is slightly cloudy since yesterday after a heavy rain shower. The pump is running but chlorine reads 0.4 on our dip strip.",
    poolName: "Main Residence Pool",
    urgency: "Normal",
    status: "Submitted",
    createdAt: "5 May 2026",
    attachedPhotosCount: 1,
  },
  {
    id: "sr-003",
    reference: "SR-2026-0144",
    category: "special_cleaning",
    categoryTitle: "Special cleaning / pre-event",
    description:
      "Requesting deep pool vacuuming and waterline tile scrubbing before our family garden gathering on Saturday.",
    poolName: "Garden Pool",
    urgency: "Normal",
    status: "Scheduled",
    createdAt: "28 Apr 2026",
    scheduledDate: "16 May 2026",
    technicianName: "Laura García",
    attachedPhotosCount: 0,
  },
  {
    id: "sr-004",
    reference: "SR-2026-0129",
    category: "general_inquiry",
    categoryTitle: "General inquiry / inspection",
    description:
      "Annual salt chlorination electrolytic cell inspection and pH sensor recalibration check.",
    poolName: "Main Residence Pool",
    urgency: "Normal",
    status: "Completed",
    createdAt: "14 Apr 2026",
    scheduledDate: "17 Apr 2026",
    technicianName: "Carlos Martínez",
    attachedPhotosCount: 1,
  },
];

/**
 * GET: Fetch Service Requests
 */
export async function getServiceRequests(
  params?: { status?: string; search?: string }
): Promise<{ success: boolean; data: ServiceRequestRecord[]; total: number }> {
  try {
    /**
     * ==============================================================================
     * LIVE API REST ENDPOINT INTEGRATION:
     * When backend is live, uncomment this block:
     *
     * const query = new URLSearchParams({
     *   status: params?.status || "all",
     *   search: params?.search || "",
     * });
     * const res = await fetchWithAuth(`/api/service-requests?${query.toString()}`, {
     *   method: "GET",
     *   next: { tags: ["service-requests"] },
     * });
     * return await res.json();
     * ==============================================================================
     */

    let tickets = [...MOCK_SERVICE_REQUESTS];

    if (params?.search) {
      const q = params.search.toLowerCase();
      tickets = tickets.filter(
        (t) =>
          t.reference.toLowerCase().includes(q) ||
          t.categoryTitle.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.poolName.toLowerCase().includes(q)
      );
    }

    return {
      success: true,
      data: tickets,
      total: tickets.length,
    };
  } catch (error: any) {
    console.error("Error fetching service requests:", error);
    return {
      success: false,
      data: MOCK_SERVICE_REQUESTS,
      total: MOCK_SERVICE_REQUESTS.length,
    };
  }
}

/**
 * GET: Fetch single ticket detail
 */
export async function getServiceRequestDetail(
  requestId: string
): Promise<{ success: boolean; data: ServiceRequestRecord | null }> {
  try {
    const record =
      MOCK_SERVICE_REQUESTS.find((r) => r.id === requestId) ||
      MOCK_SERVICE_REQUESTS[0];
    return { success: true, data: record };
  } catch (error) {
    console.error("Error fetching request detail:", error);
    return { success: false, data: null };
  }
}

/**
 * POST: Create Service Request
 */
export async function createServiceRequest(
  payload: CreateServiceRequestPayload
): Promise<{ success: boolean; data?: ServiceRequestRecord; message: string }> {
  try {
    /**
     * const res = await fetchWithAuth(`/api/service-requests`, {
     *   method: "POST",
     *   body: JSON.stringify(payload),
     * });
     * revalidatePath("/service-request");
     * return await res.json();
     */
    console.log("Creating new service request:", payload);
    const newRecord: ServiceRequestRecord = {
      id: `sr-${Date.now()}`,
      reference: `SR-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      category: payload.category,
      categoryTitle:
        payload.category === "equipment_breakdown"
          ? "Equipment breakdown"
          : payload.category === "water_quality"
            ? "Water quality issue"
            : payload.category === "special_cleaning"
              ? "Special cleaning / pre-event"
              : payload.category === "emergency_leak"
                ? "Emergency leak or flood"
                : "General inquiry / inspection",
      description: payload.description,
      poolName: payload.poolName,
      urgency: payload.urgency,
      status: "Submitted",
      createdAt: "Today",
    };

    // revalidatePath("/service-request");
    return {
      success: true,
      data: newRecord,
      message: "Ticket created! Our team will review within 2 hours.",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to create service request.",
    };
  }
}

/**
 * PATCH: Cancel Service Request
 */
export async function cancelServiceRequest(
  requestId: string
): Promise<{ success: boolean; message: string }> {
  try {
    /**
     * const res = await fetchWithAuth(`/api/service-requests/${requestId}/cancel`, {
     *   method: "PATCH",
     * });
     * revalidatePath("/service-request");
     * return await res.json();
     */
    // revalidatePath("/service-request");
    return {
      success: true,
      message: `Request ${requestId} cancelled.`,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to cancel request.",
    };
  }
}
