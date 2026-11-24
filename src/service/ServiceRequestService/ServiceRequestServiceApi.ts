import { get, post } from "@/lib/apiRequest";

export type TRequestKind = "EQUIPMENT" | "WATER_QUALITY" | "CLEANING" | "EMERGENCY" | "INSPECTION" | "OTHER";
export type TRequestUrgency = "LOW" | "NORMAL" | "HIGH" | "URGENT" | "EMERGENCY";
export type TRequestCustomerStatus = "SUBMITTED" | "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export const KIND_LABEL: Record<TRequestKind, string> = {
  EQUIPMENT: "Equipment breakdown",
  WATER_QUALITY: "Water quality issue",
  CLEANING: "Special cleaning / pre-event",
  EMERGENCY: "Emergency leak or flood",
  INSPECTION: "General inquiry / inspection",
  OTHER: "General question",
};

export interface IRequestPoolRef {
  _id: string;
  name: string;
}

export interface IRequestVisitRef {
  _id: string;
  scheduledAt: string;
  status: string;
  technicianId?: { _id: string; name: string } | string | null;
}

/** `ServiceRequest`, customer-facing view returned by `GET /service-requests`. */
export interface ServiceRequestRecord {
  _id: string;
  number?: string;
  poolId: IRequestPoolRef | string;
  kind: TRequestKind;
  title?: string;
  urgency: TRequestUrgency;
  description: string;
  attachments: string[];
  customerStatus: TRequestCustomerStatus;
  visitId?: IRequestVisitRef | string | null;
  cancelReason?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceRequestsFilterParams {
  [key: string]: string | number | boolean | undefined;
  tab?: "open" | "scheduled" | "resolved";
}

export interface CreateServiceRequestPayload {
  poolId: string;
  kind: TRequestKind;
  urgency: TRequestUrgency;
  description: string;
  attachments?: string[];
}

export const getServiceRequests = (params?: ServiceRequestsFilterParams) => get<ServiceRequestRecord[]>("/service-requests", params);
export const getServiceRequestDetail = (requestId: string) => get<ServiceRequestRecord>(`/service-requests/${requestId}`);
export const createServiceRequest = (payload: CreateServiceRequestPayload) => post<ServiceRequestRecord>("/service-requests", payload);
export const cancelServiceRequest = (requestId: string, reason?: string) =>
  post<ServiceRequestRecord>(`/service-requests/${requestId}/cancel`, { reason });
