import { get, post } from "@/lib/apiRequest";

export type TContractKind = "INSTALLATION" | "RENEWAL" | "OTHER";
export type TContractStatus = "DRAFT" | "AWAITING_SIGNATURE" | "SIGNED" | "ACTIVE" | "EXPIRED" | "CANCELLED";

export interface IContractPlan {
  _id: string;
  name: string;
  annualPrice: number;
  visitsPerYear: number;
  inclusions?: string[];
}

/** `Contract`, as returned to the customer. */
export interface ContractRecord {
  _id: string;
  number?: string;
  kind: TContractKind;
  status: TContractStatus;
  displayStatus: TContractStatus | "ENDING_SOON";
  planId: IContractPlan | string | null;
  poolId: { _id: string; name: string } | string;
  lockedPrice: number;
  currency: string;
  signerName?: string;
  signerTitle?: string;
  signedAt?: string;
  startsAt?: string;
  endsAt?: string;
  visitsIncluded?: number;
  daysLeft: number | null;
  invoiceId?: { _id: string; number?: string; status: string; total: number; dueAt?: string } | string | null;
}

export const getContracts = () => get<ContractRecord[]>("/contracts");
export const getContractDetail = (contractId: string) => get<ContractRecord>(`/contracts/${contractId}`);

export interface ISignContractResult {
  contract: ContractRecord;
  invoice: { _id: string; number?: string; total: number };
}

export const signContract = (contractId: string, signerName: string, signerTitle?: string) =>
  post<ISignContractResult>(`/contracts/${contractId}/sign`, { agree: true, signerName, signerTitle });
