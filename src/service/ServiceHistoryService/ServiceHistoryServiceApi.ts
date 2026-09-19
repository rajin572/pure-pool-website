/* eslint-disable @typescript-eslint/no-explicit-any */

import { fetchWithAuth } from "@/lib/fetchWraper";
// import { revalidatePath } from "next/cache";

/**
 * ==============================================================================
 * SERVICE HISTORY API SERVICES & TYPE DEFINITIONS
 * ==============================================================================
 * Next.js Server Side Rendering (SSR) & Server Actions architecture.
 * Ready for live REST API wiring:
 * - GET: Fetch service history records with pagination & search
 * - GET: Fetch single visit details
 * - POST: Request or export service history report PDF
 * - DELETE: Delete/archive service history entry (admin/authorized)
 * ==============================================================================
 */

export interface ServiceHistoryRecord {
  id: string;
  date: string;
  type: string;
  technician: {
    name: string;
    avatar?: string;
    role?: string;
  };
  ph: string | number;
  chlorine: string;
  alkalinity: string;
  temperature: string;
  status: "Completed" | "In Progress" | "Scheduled" | "Cancelled";
  notes?: string;
}

export interface ServiceHistoryFilterParams {
  search?: string;
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  status?: string;
}

export interface ServiceHistoryResponse {
  data: ServiceHistoryRecord[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * MOCK SERVICE HISTORY DATA
 * Matches Figma Node 40014296:5157
 */
export const MOCK_SERVICE_HISTORY_RECORDS: ServiceHistoryRecord[] = [
  {
    id: "visit-001",
    date: "17 May 2026",
    type: "Weekly maintenance",
    technician: {
      name: "Carlos Martínez",
      role: "Certified Pool Specialist",
    },
    ph: "7.3",
    chlorine: "1.8 mg/L",
    alkalinity: "145 ppm",
    temperature: "24.5 °C",
    status: "Completed",
    notes: "Pool water is crystal clear and perfectly balanced. Salt cell operating at peak output.",
  },
  {
    id: "visit-002",
    date: "10 May 2026",
    type: "Weekly maintenance",
    technician: {
      name: "Carlos Martínez",
      role: "Certified Pool Specialist",
    },
    ph: "7.4",
    chlorine: "2.1 mg/L",
    alkalinity: "140 ppm",
    temperature: "23.8 °C",
    status: "Completed",
    notes: "Skimmer baskets cleaned and wall tiles brushed. Filter pressure normal.",
  },
  {
    id: "visit-003",
    date: "03 May 2026",
    type: "Weekly maintenance",
    technician: {
      name: "Carlos Martínez",
      role: "Certified Pool Specialist",
    },
    ph: "7.2",
    chlorine: "1.9 mg/L",
    alkalinity: "135 ppm",
    temperature: "23.0 °C",
    status: "Completed",
    notes: "Added 450ml pH reducer and checked salt cell conductivity.",
  },
  {
    id: "visit-004",
    date: "26 Apr 2026",
    type: "Chemical balance & Shock",
    technician: {
      name: "Laura García",
      role: "Lead Water Chemist",
    },
    ph: "7.5",
    chlorine: "3.2 mg/L",
    alkalinity: "150 ppm",
    temperature: "22.5 °C",
    status: "Completed",
    notes: "Pre-season shock treatment applied. Backwashed sand filter for 3 minutes.",
  },
  {
    id: "visit-005",
    date: "19 Apr 2026",
    type: "Weekly maintenance",
    technician: {
      name: "Carlos Martínez",
      role: "Certified Pool Specialist",
    },
    ph: "7.3",
    chlorine: "1.7 mg/L",
    alkalinity: "142 ppm",
    temperature: "21.9 °C",
    status: "Completed",
    notes: "Vacuumed debris from deep end and emptied pump strainer basket.",
  },
  {
    id: "visit-006",
    date: "12 Apr 2026",
    type: "Filter inspection & Backwash",
    technician: {
      name: "Laura García",
      role: "Lead Water Chemist",
    },
    ph: "7.4",
    chlorine: "2.0 mg/L",
    alkalinity: "138 ppm",
    temperature: "21.0 °C",
    status: "Completed",
    notes: "Multiport valve inspected and lubricated O-rings. Flow rate optimal.",
  },
  {
    id: "visit-007",
    date: "05 Apr 2026",
    type: "Weekly maintenance",
    technician: {
      name: "Carlos Martínez",
      role: "Certified Pool Specialist",
    },
    ph: "7.3",
    chlorine: "1.8 mg/L",
    alkalinity: "145 ppm",
    temperature: "20.4 °C",
    status: "Completed",
    notes: "Spring opening inspection completed. All equipment operating within parameters.",
  },
];

/**
 * GET: Fetch paginated service history records
 */
export async function getServiceHistory(
  poolId?: string,
  params?: ServiceHistoryFilterParams
): Promise<{ success: boolean; data: ServiceHistoryRecord[]; total: number }> {
  try {
    /**
     * ==============================================================================
     * LIVE API REST ENDPOINT INTEGRATION:
     * When backend is live, uncomment this block to query the API server directly:
     *
     * const query = new URLSearchParams({
     *   poolId: poolId || "",
     *   page: String(params?.page || 1),
     *   limit: String(params?.limit || 10),
     *   search: params?.search || "",
     * });
     * const res = await fetchWithAuth(`/api/service-history?${query.toString()}`, {
     *   method: "GET",
     *   next: { tags: ["service-history"] },
     * });
     * return await res.json();
     * ==============================================================================
     */

    let records = [...MOCK_SERVICE_HISTORY_RECORDS];
    if (params?.search) {
      const q = params.search.toLowerCase();
      records = records.filter(
        (r) =>
          r.technician.name.toLowerCase().includes(q) ||
          r.type.toLowerCase().includes(q) ||
          r.date.toLowerCase().includes(q) ||
          (r.notes && r.notes.toLowerCase().includes(q))
      );
    }

    return {
      success: true,
      data: records,
      total: records.length,
    };
  } catch (error: any) {
    console.error("Error fetching service history:", error);
    return {
      success: false,
      data: MOCK_SERVICE_HISTORY_RECORDS,
      total: MOCK_SERVICE_HISTORY_RECORDS.length,
    };
  }
}

/**
 * GET: Fetch single service visit record
 */
export async function getServiceVisitDetail(
  visitId: string
): Promise<{ success: boolean; data: ServiceHistoryRecord | null }> {
  try {
    /**
     * const res = await fetchWithAuth(`/api/service-history/${visitId}`, {
     *   method: "GET",
     * });
     * return await res.json();
     */
    const record =
      MOCK_SERVICE_HISTORY_RECORDS.find((r) => r.id === visitId) ||
      MOCK_SERVICE_HISTORY_RECORDS[0];
    return { success: true, data: record };
  } catch (error) {
    console.error("Error fetching visit detail:", error);
    return { success: false, data: null };
  }
}

/**
 * POST: Export Service History PDF
 */
export async function exportServiceHistoryPdf(
  poolId: string,
  filters?: ServiceHistoryFilterParams
): Promise<{ success: boolean; downloadUrl?: string; message: string }> {
  try {
    /**
     * const res = await fetchWithAuth(`/api/service-history/export-pdf`, {
     *   method: "POST",
     *   body: JSON.stringify({ poolId, filters }),
     * });
     * return await res.json();
     */
    console.log("Exporting PDF for pool:", poolId, filters);
    return {
      success: true,
      downloadUrl: "/sample-report.pdf",
      message: "Service history report generated successfully.",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to export PDF",
    };
  }
}

/**
 * DELETE: Delete service history record (authorized staff/admin)
 */
export async function deleteServiceHistoryRecord(
  visitId: string
): Promise<{ success: boolean; message: string }> {
  try {
    /**
     * const res = await fetchWithAuth(`/api/service-history/${visitId}`, {
     *   method: "DELETE",
     * });
     * revalidatePath("/service-history");
     * return await res.json();
     */
    // revalidatePath("/service-history");
    return {
      success: true,
      message: `Record ${visitId} deleted successfully.`,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to delete record",
    };
  }
}
