/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { fetchWithAuth } from "@/lib/fetchWraper";

export interface DocumentRecord {
  id: string;
  title: string;
  category: "Warranty" | "Manual" | "Certificate";
  date: string;
  fileSize: string;
  fileUrl: string;
  equipmentName?: string;
  poolName?: string;
}

export interface DocumentsFilterParams {
  category?: "All" | "Warranty" | "Manual" | "Certificate";
  search?: string;
  sort?: "newest" | "oldest" | "name";
  page?: number;
  limit?: number;
}

/**
 * MOCK DOCUMENTS DATA
 * Matches Figma Node 40014997:10089
 */
export const MOCK_DOCUMENTS: DocumentRecord[] = [
  {
    id: "doc-001",
    title: "AstralPool Pump Warranty",
    category: "Warranty",
    date: "15 Nov 2024",
    fileSize: "1.2 MB",
    fileUrl: "/documents/astralpool-pump-warranty.pdf",
    equipmentName: "AstralPool Victoria Plus pump",
    poolName: "Main Pool",
  },
  {
    id: "doc-002",
    title: "EcoWater Filtration System Warranty",
    category: "Warranty",
    date: "22 Jan 2025",
    fileSize: "950 KB",
    fileUrl: "/documents/ecowater-filtration-warranty.pdf",
    equipmentName: "EcoWater Glass Media Filter",
    poolName: "Main Pool",
  },
  {
    id: "doc-003",
    title: "PureAir Purifier Warranty",
    category: "Warranty",
    date: "30 Mar 2024",
    fileSize: "2.5 MB",
    fileUrl: "/documents/pureair-purifier-warranty.pdf",
    equipmentName: "PureAir UV Sanitizer",
    poolName: "Main Pool",
  },
  {
    id: "doc-004",
    title: "SolarMax Inverter Warranty",
    category: "Warranty",
    date: "18 May 2025",
    fileSize: "1.8 MB",
    fileUrl: "/documents/solarmax-inverter-warranty.pdf",
    equipmentName: "SolarMax Heat Pump Inverter",
    poolName: "Main Pool",
  },
  {
    id: "doc-005",
    title: "HydroTherm Heater Warranty",
    category: "Manual",
    date: "07 Feb 2024",
    fileSize: "1.9 MB",
    fileUrl: "/documents/hydrotherm-heater-manual.pdf",
    equipmentName: "HydroTherm Heat Exchanger",
    poolName: "Farm House Pool",
  },
  {
    id: "doc-006",
    title: "AquaSafe Water Softener Warranty",
    category: "Warranty",
    date: "12 Jun 2024",
    fileSize: "1.3 MB",
    fileUrl: "/documents/aquasafe-softener-warranty.pdf",
    equipmentName: "AquaSafe Automated Dosing Unit",
    poolName: "Main Pool",
  },
  {
    id: "doc-007",
    title: "SmartHome Thermostat Warranty",
    category: "Manual",
    date: "29 Apr 2025",
    fileSize: "700 KB",
    fileUrl: "/documents/smarthome-thermostat-manual.pdf",
    equipmentName: "WiFi Remote Water Sensor",
    poolName: "Main Pool",
  },
  {
    id: "doc-008",
    title: "CleanWave Humidifier Warranty",
    category: "Warranty",
    date: "15 Sep 2024",
    fileSize: "1.1 MB",
    fileUrl: "/documents/cleanwave-humidifier-warranty.pdf",
    equipmentName: "Pool Enclosure Dehumidifier",
    poolName: "Farm House Pool",
  },
  {
    id: "doc-009",
    title: "VisionTech Security System Warranty",
    category: "Certificate",
    date: "05 Oct 2025",
    fileSize: "2.0 MB",
    fileUrl: "/documents/visiontech-security-certificate.pdf",
    equipmentName: "Underwater Safety Motion Alarm",
    poolName: "Main Pool",
  },
  {
    id: "doc-010",
    title: "ComfortEdge Air Conditioner Warranty",
    category: "Warranty",
    date: "11 Dec 2024",
    fileSize: "1.4 MB",
    fileUrl: "/documents/comfortedge-ac-warranty.pdf",
    equipmentName: "Poolhouse Climate System",
    poolName: "Main Pool",
  },
];

/**
 * GET: Fetch documents with category filtering, search, and sorting
 */
export async function getDocuments(
  params?: DocumentsFilterParams
): Promise<{ success: boolean; data: DocumentRecord[]; total: number }> {
  try {
    /**
     * ==============================================================================
     * LIVE REST API ENDPOINT INTEGRATION:
     * When backend is live, uncomment this block:
     *
     * const query = new URLSearchParams({
     *   category: params?.category || "All",
     *   search: params?.search || "",
     *   sort: params?.sort || "newest",
     *   page: String(params?.page || 1),
     *   limit: String(params?.limit || 10),
     * });
     * const res = await fetchWithAuth(`/api/documents?${query.toString()}`, {
     *   method: "GET",
     *   next: { tags: ["documents"] },
     * });
     * return await res.json();
     * ==============================================================================
     */

    let filtered = [...MOCK_DOCUMENTS];

    if (params?.category && params.category !== "All") {
      filtered = filtered.filter((doc) => doc.category === params.category);
    }

    if (params?.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (doc) =>
          doc.title.toLowerCase().includes(q) ||
          doc.category.toLowerCase().includes(q) ||
          (doc.equipmentName && doc.equipmentName.toLowerCase().includes(q))
      );
    }

    return {
      success: true,
      data: filtered,
      total: filtered.length,
    };
  } catch (error: any) {
    console.error("Error fetching documents:", error);
    return {
      success: false,
      data: MOCK_DOCUMENTS,
      total: MOCK_DOCUMENTS.length,
    };
  }
}

/**
 * GET: Download document file
 */
export async function downloadDocument(
  docId: string
): Promise<{ success: boolean; downloadUrl?: string; message: string }> {
  try {
    /**
     * const res = await fetchWithAuth(`/api/documents/${docId}/download`, {
     *   method: "GET",
     * });
     * return await res.json();
     */
    return {
      success: true,
      downloadUrl: `/sample-doc-${docId}.pdf`,
      message: "Document ready for download.",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to download document.",
    };
  }
}

