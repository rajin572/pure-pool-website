import { get, patch } from "@/lib/apiRequest";

/** Form shape the Pool Settings page edits. `id` = poolId, `propertyId` identifies the address record. */
export interface IPoolSettings {
  id: string;
  propertyId: string;
  poolName: string;
  address: string;
  city: string;
  postalCode: string;
  accessInstructions: string;
  poolType: string;
  volumeM3: string;
  dimensions: { length: string; width: string; depth: string };
  waterTreatment: string;
  surfaceType: string;
  equipmentNotes: string;
  photos: string[];
}

export interface IPoolSettingsPool {
  _id: string;
  name: string;
  poolType?: string;
  volumeM3?: number;
  length?: number;
  width?: number;
  depth?: number;
  waterType?: string;
  surfaceType?: string;
  equipmentNotes?: string;
  accessInstructions?: string;
  photos?: string[];
  propertyId: string;
}

export interface IPoolSettingsProperty {
  _id: string;
  address: string;
  city?: string;
  postalCode?: string;
}

export const getPoolSettings = (poolId: string) =>
  get<{ pool: IPoolSettingsPool; property: IPoolSettingsProperty | null }>(`/pools/${poolId}`);

export const toFormValues = (
  pool: IPoolSettingsPool,
  property: IPoolSettingsProperty | null
): IPoolSettings => ({
  id: pool._id,
  propertyId: property?._id || "",
  poolName: pool.name,
  address: property?.address || "",
  city: property?.city || "",
  postalCode: property?.postalCode || "",
  accessInstructions: pool.accessInstructions || "",
  poolType: pool.poolType || "",
  volumeM3: pool.volumeM3 != null ? String(pool.volumeM3) : "",
  dimensions: {
    length: pool.length != null ? String(pool.length) : "",
    width: pool.width != null ? String(pool.width) : "",
    depth: pool.depth != null ? String(pool.depth) : "",
  },
  waterTreatment: pool.waterType || "",
  surfaceType: pool.surfaceType || "",
  equipmentNotes: pool.equipmentNotes || "",
  photos: pool.photos || [],
});

export interface IPoolUpdateResult {
  pool: IPoolSettingsPool;
  applied: string[];
  reviewRequired: string[];
}

/** `PATCH /pools/:id`. On an approved pool, changes to reviewable fields go through office verification. */
export const updatePoolSettings = (poolId: string, body: Record<string, unknown>) =>
  patch<IPoolUpdateResult>(`/pools/${poolId}`, body);

export interface IPropertyUpdateResult {
  property: IPoolSettingsProperty;
  applied: string[];
  reviewRequired: string[];
}

/** `PATCH /properties/:id`. */
export const updatePropertyAddress = (propertyId: string, body: Record<string, unknown>) =>
  patch<IPropertyUpdateResult>(`/properties/${propertyId}`, body);
