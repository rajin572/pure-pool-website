"use client";

import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import Container from "@/components/ui/CustomUi/Container";
import ReuseableForm from "@/components/ui/CustomUi/ReuseForm/ReuseableForm";
import {
  getPoolSettings,
  updatePoolSettings,
  updatePropertyAddress,
  toFormValues,
  type IPoolSettings,
} from "@/service/PoolSettingsService/PoolSettingsServiceApi";
import { getMyPools, type IPoolSummary } from "@/service/MyPoolService/MyPoolServiceApi";
import { errorMessage } from "@/lib/apiRequest";
import PoolSettingsHeader from "./PoolSettingsHeader";
import LocationAccessCard from "./LocationAccessCard";
import SpecificationsCard from "./SpecificationsCard";
import EquipmentCard from "./EquipmentCard";
import PhotosCard from "./PhotosCard";
import NeedAHandCard from "./NeedAHandCard";
import SaveBar from "./SaveBar";

export const PoolSettingsView: React.FC = () => {
  const [pools, setPools] = useState<IPoolSummary[] | null>(null);
  const [activePoolId, setActivePoolId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<IPoolSettings>({ mode: "onChange" });
  const photos = useWatch({ control: form.control, name: "photos" }) || [];

  useEffect(() => {
    getMyPools().then((res) => {
      if (res.success) {
        setPools(res.data);
        if (res.data[0]) setActivePoolId(res.data[0]._id);
      } else {
        toast.error(errorMessage(res, "Could not load your pools."));
      }
    });
  }, []);

  useEffect(() => {
    if (!activePoolId) return;
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      const res = await getPoolSettings(activePoolId);
      if (cancelled) return;
      setIsLoading(false);
      if (res.success) {
        form.reset(toFormValues(res.data.pool, res.data.property));
      } else {
        toast.error(errorMessage(res, "Could not load pool settings."));
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePoolId]);

  const handlePoolChange = (poolId: string) => setActivePoolId(poolId);
  const handleCancel = () => {
    if (activePoolId) {
      getPoolSettings(activePoolId).then((res) => {
        if (res.success) form.reset(toFormValues(res.data.pool, res.data.property));
      });
    }
  };

  const onSubmit = async (data: IPoolSettings) => {
    const reviewRequired: string[] = [];

    if (data.propertyId) {
      const propRes = await updatePropertyAddress(data.propertyId, {
        address: data.address,
        city: data.city,
        postalCode: data.postalCode,
      });
      if (!propRes.success) {
        toast.error(errorMessage(propRes, "Could not save the address."));
        return;
      }
      if (propRes.data.reviewRequired) reviewRequired.push(...propRes.data.reviewRequired);
    }

    const poolRes = await updatePoolSettings(data.id, {
      poolType: data.poolType || undefined,
      volumeM3: data.volumeM3 ? Number(data.volumeM3) : undefined,
      length: data.dimensions.length ? Number(data.dimensions.length) : undefined,
      width: data.dimensions.width ? Number(data.dimensions.width) : undefined,
      depth: data.dimensions.depth ? Number(data.dimensions.depth) : undefined,
      waterType: data.waterTreatment || undefined,
      surfaceType: data.surfaceType || undefined,
      equipmentNotes: data.equipmentNotes,
      accessInstructions: data.accessInstructions,
      photos: data.photos,
    });
    if (!poolRes.success) {
      toast.error(errorMessage(poolRes, "Could not save the pool details."));
      return;
    }
    if (poolRes.data.reviewRequired) reviewRequired.push(...poolRes.data.reviewRequired);

    form.reset(data);
    if (reviewRequired.length > 0) {
      toast.success(`Saved. ${reviewRequired.join(", ")} will be verified by our office before they apply.`);
    } else {
      toast.success("Pool settings saved.");
    }
  };

  if (!pools || isLoading) {
    return (
      <div className="bg-[#FAFBFD] min-h-screen relative">
        <div className="w-full bg-[#041D37] h-20 sm:h-24 shadow-sm" />
        <Container className="py-10 text-center text-sm text-gray-500">Loading pool settings...</Container>
      </div>
    );
  }

  if (pools.length === 0) {
    return (
      <div className="bg-[#FAFBFD] min-h-screen relative">
        <div className="w-full bg-[#041D37] h-20 sm:h-24 shadow-sm" />
        <Container className="py-10 text-center text-sm text-gray-500">No pools are registered on your account yet.</Container>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFBFD] min-h-screen relative pb-28 sm:pb-32">
      <div className="w-full bg-[#041D37] h-20 sm:h-24 shadow-sm" />

      <Container className="py-6 sm:py-8 lg:py-10 space-y-6 sm:space-y-8">
        <PoolSettingsHeader pools={pools} activePoolId={activePoolId} onPoolChange={handlePoolChange} />

        <ReuseableForm form={form} onSubmit={onSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 xl:col-span-8 space-y-6">
              <LocationAccessCard control={form.control} />
              <SpecificationsCard control={form.control} />
              <EquipmentCard control={form.control} />
            </div>

            <div className="lg:col-span-5 xl:col-span-4 space-y-6">
              <PhotosCard
                photos={photos}
                poolId={activePoolId}
                onPhotosChange={(photos) => form.setValue("photos", photos, { shouldDirty: true })}
              />
              <NeedAHandCard />
            </div>
          </div>

          <SaveBar isDirty={form.formState.isDirty} isSubmitting={form.formState.isSubmitting} onCancel={handleCancel} />
        </ReuseableForm>
      </Container>
    </div>
  );
};

export default PoolSettingsView;
