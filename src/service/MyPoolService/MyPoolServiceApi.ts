import { get } from "@/lib/apiRequest";

export interface IPoolProperty {
  _id: string;
  name: string;
  address: string;
  city?: string;
  postalCode?: string;
  location?: { lat: number; lng: number };
}

/** `Pool`, as returned (with `propertyId` populated) by `GET /pools`. */
export interface IPoolSummary {
  _id: string;
  name: string;
  status: "DRAFT" | "PENDING_VERIFICATION" | "VERIFIED" | "ACTIVE" | "ARCHIVED";
  poolType?: string;
  shape?: string;
  length?: number;
  width?: number;
  depth?: number;
  maxDepth?: number;
  volumeM3?: number;
  waterType?: string;
  surfaceType?: string;
  photos?: string[];
  notes?: string;
  equipmentNotes?: string;
  accessInstructions?: string;
  locationNotes?: string;
  preferredVisitWeekDay?: number;
  preferredVisitTime?: string;
  propertyId: IPoolProperty | string;
  customerId: { _id: string; name: string; phone?: string; email: string } | string;
}

export interface IEquipmentItem {
  _id: string;
  poolId: string;
  type: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  installedAt?: string;
  warrantyEndsAt?: string;
  status: "ACTIVE" | "REPAIR_NEEDED" | "REPLACED" | "REMOVED";
  condition: "GOOD" | "AGEING" | "POOR";
  notes?: string;
  warrantyStatus?: "VALID" | "EXPIRED" | "UNKNOWN";
}

export interface IPoolVisit {
  _id: string;
  scheduledAt: string;
  status: string;
  category?: string;
  technicianId?: { _id: string; name: string; avatarUrl?: string } | null;
}

export interface IVisitReportSafe {
  id: string;
  visitId: string;
  poolId: string;
  status: "DRAFT" | "TO_CHECK" | "SENT_BACK" | "APPROVED";
  waterReadings: { name: string; value: number; unit?: string }[];
  beforePhotos: { url: string; uploadedAt: string }[];
  afterPhotos: { url: string; uploadedAt: string }[];
  checklist: { task: string; done: boolean }[];
  chemicals: { name: string; quantity: number; unit: string; reason?: string }[];
  customerNotes?: string;
  approvedAt?: string;
  updatedAt: string;
}

export interface IPendingCorrection {
  _id: string;
  changes: { field: string; oldValue: unknown; newValue: unknown }[];
  status: string;
  createdAt: string;
}

export interface IPoolDocument {
  _id: string;
  kind: "MANUAL" | "WARRANTY" | "CERTIFICATE" | "REPORT" | "CONTRACT" | "INVOICE" | "OTHER";
  title: string;
  url: string;
  mimeType?: string;
  createdAt: string;
}

export interface IPoolDetailsData {
  pool: IPoolSummary;
  property: IPoolProperty | null;
  customer?: { _id: string; name: string; phone?: string; email: string } | null;
  equipment: IEquipmentItem[];
  visits: IPoolVisit[];
  nextVisit: IPoolVisit | null;
  schedule: { _id: string; technicianId?: { name: string } | null } | null;
  readings: IVisitReportSafe[];
  latestWater: { recordedAt: string; readings: IWaterReading[] } | null;
  documents: IPoolDocument[];
  pendingCorrections: IPendingCorrection[];
}

export interface IWaterReading {
  key: string;
  name: string;
  value: number;
  unit: string;
  range: { min?: number; goodFrom: number; goodTo: number; max?: number } | null;
  status: "GOOD" | "WARNING" | "BAD" | "UNKNOWN";
  direction?: "LOW" | "HIGH";
}

export type IWaterRangesMap = Record<
  string,
  { name: string; unit: string; min?: number; goodFrom: number; goodTo: number; max?: number }
>;

export interface IPoolWaterData {
  poolId: string;
  recordedAt: string | null;
  recordedBy: string | null;
  overall: "NO_DATA" | "BALANCED" | "WATCH" | "ATTENTION";
  readings: IWaterReading[];
  ranges: IWaterRangesMap;
  history: Record<string, { date: string; value: number }[]>;
}

export const getMyPools = () => get<IPoolSummary[]>("/pools");
export const getPoolDetails = (poolId: string) => get<IPoolDetailsData>(`/pools/${poolId}`);
export const getPoolWater = (poolId: string) => get<IPoolWaterData>(`/pools/${poolId}/water`);
export const getPoolEquipment = (poolId: string) =>
  get<IEquipmentItem[]>(`/pools/${poolId}/equipment`, { limit: 100 });
