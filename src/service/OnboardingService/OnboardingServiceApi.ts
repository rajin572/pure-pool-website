/**
 * Pool registration wizard (Postman folder "User": `GET /onboarding`, `POST /onboarding/pool`).
 *
 * The wizard keeps a friendly form model (`FullOnboardingData`); `toApiBody` turns it into the
 * strict body the backend accepts and `fromApiOnboarding` rebuilds it from `GET /onboarding`
 * so a customer can resume. This file is safe to import from Client Components; the
 * server-side read of the saved state is in `onboardingServer.ts`.
 *
 * The backend has fields for: location, specifications, shape, photos and one free
 * `equipmentNotes` text. The access notes and the equipment checklist are therefore stored
 * inside `accessInstructions` / `equipmentNotes` (see the two helpers below).
 */
import { post } from "@/lib/apiRequest";

// ---------- Form model ----------

export interface OnboardingLocationData {
  poolAddress: string;
  postalCode: string;
  city: string;
  gateCode?: string;
  accessNotes?: string;
}

export interface OnboardingSpecificationsData {
  poolType: "residential" | "commercial" | "unknown";
  /** Litres, as typed. */
  approximateVolume?: string;
  lengthMeters?: string;
  widthMeters?: string;
  depthMeters?: string;
  waterTreatment: "saltwater" | "chlorine" | "unknown" | "other";
  surfaceFinish: "tile" | "liner" | "polyester" | "unknown" | "other";
}

export type OnboardingShape =
  | "rectangular"
  | "square"
  | "circular"
  | "oval"
  | "kidney"
  | "l_shaped"
  | "infinity_1"
  | "infinity_2"
  | "infinity_3"
  | "lagoon";

export interface OnboardingShapeData {
  shape: OnboardingShape;
}

export interface OnboardingPhotosData {
  /** Uploaded files (`/uploads/…` or absolute), at most `MAX_PHOTOS`. */
  urls: string[];
}

export interface OnboardingEquipmentData {
  notes: string;
  hasSaltChlorinator: boolean;
  hasHeatPump: boolean;
  hasAutoCover: boolean;
  hasCleanerRobot: boolean;
}

export interface FullOnboardingData {
  location: OnboardingLocationData;
  specifications: OnboardingSpecificationsData;
  shape: OnboardingShapeData;
  photos: OnboardingPhotosData;
  equipment: OnboardingEquipmentData;
}

export const MAX_PHOTOS = 4;

/**
 * A brand-new onboarding starts blank: text fields are empty (the screens show placeholders),
 * and choices start on "not sure" so nothing a customer didn't say is submitted.
 * Only the pool outline needs a value to render the picker; it starts on "rectangular".
 */
export const initialOnboardingData: FullOnboardingData = {
  location: { poolAddress: "", postalCode: "", city: "", gateCode: "", accessNotes: "" },
  specifications: {
    poolType: "unknown",
    approximateVolume: "",
    lengthMeters: "",
    widthMeters: "",
    depthMeters: "",
    waterTreatment: "unknown",
    surfaceFinish: "unknown",
  },
  shape: { shape: "rectangular" },
  photos: { urls: [] },
  equipment: {
    notes: "",
    hasSaltChlorinator: false,
    hasHeatPump: false,
    hasAutoCover: false,
    hasCleanerRobot: false,
  },
};

// ---------- Backend shapes (from the Postman example responses) ----------

export type OnboardingNextStep =
  | "VERIFY_EMAIL"
  | "POOL_DETAILS"
  | "SUBMIT_FOR_REVIEW"
  | "WAITING_FOR_APPROVAL"
  | "DONE"
  | "REVIEWED";

export interface IApiPool {
  _id: string;
  name?: string;
  propertyId?: { address?: string; city?: string; postalCode?: string } | string;
  poolType?: string;
  shape?: string;
  length?: number;
  width?: number;
  depth?: number;
  volumeM3?: number;
  waterType?: string;
  surfaceType?: string;
  equipmentNotes?: string;
  accessInstructions?: string;
  photos?: string[];
  status?: string;
  onboardingStatus?: string;
  missingFields?: string[];
}

export interface IOnboardingStatus {
  accountStatus: string;
  emailVerified: boolean;
  signup?: { _id: string; status: string; submittedAt?: string } | null;
  pools: IApiPool[];
  nextStep: OnboardingNextStep;
}

export interface ISavedPool {
  pool: IApiPool;
  signup?: { _id: string; status: string; submittedAt?: string } | null;
  missingFields: string[];
  message: string;
}

// ---------- Value maps (form value <-> backend enum) ----------

const reverse = <K extends string, V extends string>(m: Record<K, V>) =>
  Object.fromEntries(Object.entries(m).map(([k, v]) => [v, k])) as Record<V, K>;

const POOL_TYPE = { residential: "RESIDENTIAL", commercial: "COMMERCIAL", unknown: "UNKNOWN" } as const;
const WATER = { saltwater: "SALTWATER", chlorine: "CHLORINE", unknown: "UNKNOWN", other: "OTHER" } as const;
const SURFACE = {
  tile: "TILE",
  liner: "LINER_VINYL",
  polyester: "POLYESTER_FIBREGLASS",
  unknown: "UNKNOWN",
  other: "OTHER",
} as const;
const SHAPE: Record<OnboardingShape, string> = {
  rectangular: "RECTANGULAR",
  square: "SQUARE",
  circular: "CIRCULAR",
  oval: "OVAL",
  kidney: "KIDNEY_CURVED",
  l_shaped: "L_SHAPED",
  infinity_1: "INFINITY_1_SIDE",
  infinity_2: "INFINITY_2_SIDE",
  infinity_3: "INFINITY_3_SIDE",
  lagoon: "SPECIAL_LAGOON",
};

// ---------- Text packed into the two free-text fields ----------

const GATE_PREFIX = "Gate code: ";
const CHECKLIST_PREFIX = "Checklist: ";
const CHECKLIST: Array<[keyof Omit<OnboardingEquipmentData, "notes">, string]> = [
  ["hasSaltChlorinator", "Saltwater chlorinator"],
  ["hasHeatPump", "Heat pump / heater"],
  ["hasAutoCover", "Automatic safety cover"],
  ["hasCleanerRobot", "Robotic vacuum"],
];

const packAccess = (l: OnboardingLocationData) =>
  [l.gateCode?.trim() ? `${GATE_PREFIX}${l.gateCode.trim()}` : "", l.accessNotes?.trim() ?? ""]
    .filter(Boolean)
    .join("\n");

const unpackAccess = (text = "") => {
  const [first = "", ...rest] = text.split("\n");
  return first.startsWith(GATE_PREFIX)
    ? { gateCode: first.slice(GATE_PREFIX.length), accessNotes: rest.join("\n") }
    : { gateCode: "", accessNotes: text };
};

const packEquipment = (e: OnboardingEquipmentData) => {
  const picked = CHECKLIST.filter(([key]) => e[key]).map(([, label]) => label);
  return [e.notes.trim(), picked.length ? `${CHECKLIST_PREFIX}${picked.join(", ")}` : ""].filter(Boolean).join("\n\n");
};

const unpackEquipment = (text = ""): OnboardingEquipmentData => {
  const lines = text.split("\n");
  const last = lines[lines.length - 1] ?? "";
  const hasList = last.startsWith(CHECKLIST_PREFIX);
  const labels = hasList ? last.slice(CHECKLIST_PREFIX.length).split(", ") : [];
  const notes = (hasList ? lines.slice(0, -1) : lines).join("\n").trim();
  const flag = (label: string) => labels.includes(label);
  return {
    notes,
    hasSaltChlorinator: flag("Saltwater chlorinator"),
    hasHeatPump: flag("Heat pump / heater"),
    hasAutoCover: flag("Automatic safety cover"),
    hasCleanerRobot: flag("Robotic vacuum"),
  };
};

// ---------- Numbers ----------

/** "8", "8.5", "8,5" -> number; blank or not a positive number -> undefined. */
export const parseMeasure = (s?: string) => {
  const n = Number((s ?? "").trim().replace(",", "."));
  return Number.isFinite(n) && n > 0 ? n : undefined;
};

/** Litres: "55000", "55,000", "55 000 litres" -> 55000. */
export const parseLitres = (s?: string) => {
  const digits = (s ?? "").replace(/[^\d]/g, "");
  const n = Number(digits);
  return digits && Number.isFinite(n) && n > 0 ? n : undefined;
};

// ---------- Form -> request ----------

export const toApiBody = (data: FullOnboardingData, opts: { poolId?: string; submit: boolean }) => {
  const s = data.specifications;
  const specifications = {
    poolType: POOL_TYPE[s.poolType],
    waterType: WATER[s.waterTreatment],
    surfaceType: SURFACE[s.surfaceFinish],
    ...(parseLitres(s.approximateVolume) ? { volumeLitres: parseLitres(s.approximateVolume) } : {}),
    ...(parseMeasure(s.lengthMeters) ? { length: parseMeasure(s.lengthMeters) } : {}),
    ...(parseMeasure(s.widthMeters) ? { width: parseMeasure(s.widthMeters) } : {}),
    ...(parseMeasure(s.depthMeters) ? { depth: parseMeasure(s.depthMeters) } : {}),
  };
  return {
    ...(opts.poolId ? { poolId: opts.poolId } : {}),
    location: {
      address: data.location.poolAddress.trim(),
      city: data.location.city.trim(),
      postalCode: data.location.postalCode.trim(),
      accessInstructions: packAccess(data.location),
    },
    specifications,
    shape: SHAPE[data.shape.shape],
    photos: data.photos.urls,
    equipmentNotes: packEquipment(data.equipment),
    submit: opts.submit,
  };
};

/** `POST /onboarding/pool`. Pass `poolId` after the first save so the same pool is edited. */
export const savePoolRegistration = (data: FullOnboardingData, opts: { poolId?: string; submit: boolean }) =>
  post<ISavedPool>("/onboarding/pool", toApiBody(data, opts));

// ---------- Response -> form (resume) ----------

const fromEnum = <V extends string, K extends string>(map: Record<K, V>, value: string | undefined, fallback: K) =>
  (value ? reverse(map)[value as V] : undefined) ?? fallback;

const str = (n?: number) => (n === undefined || n === null ? "" : String(n));

/** The pool the wizard is working on: the one still waiting for review (drafts included). */
export const pickWorkingPool = (pools: IApiPool[]) =>
  pools.find((p) => p.status === "DRAFT" || p.status === "PENDING_VERIFICATION") ?? null;

export const poolToFormData = (pool: IApiPool): FullOnboardingData => {
  const property = typeof pool.propertyId === "object" && pool.propertyId ? pool.propertyId : {};
  const access = unpackAccess(pool.accessInstructions);
  return {
    location: {
      poolAddress: property.address ?? "",
      postalCode: property.postalCode ?? "",
      city: property.city ?? "",
      gateCode: access.gateCode,
      accessNotes: access.accessNotes,
    },
    specifications: {
      poolType: fromEnum(POOL_TYPE, pool.poolType, "unknown"),
      approximateVolume: pool.volumeM3 ? String(Math.round(pool.volumeM3 * 1000)) : "",
      lengthMeters: str(pool.length),
      widthMeters: str(pool.width),
      depthMeters: str(pool.depth),
      waterTreatment: fromEnum(WATER, pool.waterType, "unknown"),
      surfaceFinish: fromEnum(SURFACE, pool.surfaceType, "unknown"),
    },
    shape: { shape: fromEnum(SHAPE, pool.shape, "rectangular") },
    photos: { urls: (pool.photos ?? []).slice(0, MAX_PHOTOS) },
    equipment: unpackEquipment(pool.equipmentNotes),
  };
};

/** Which wizard screen to open for what the server says (1–5 steps, 6 review, 7 under review). */
export const stepForNextStep = (next: OnboardingNextStep) =>
  next === "SUBMIT_FOR_REVIEW" ? 6 : next === "WAITING_FOR_APPROVAL" ? 7 : 1;
