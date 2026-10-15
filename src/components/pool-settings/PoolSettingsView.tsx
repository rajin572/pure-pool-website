"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Container from "@/components/ui/CustomUi/Container";
import ReuseableForm from "@/components/ui/CustomUi/ReuseForm/ReuseableForm";
import {
  MOCK_POOL_SETTINGS,
  IPoolSettings,
  // updatePoolSettingsApi,
} from "@/service/PoolSettingsService/PoolSettingsServiceApi";
import PoolSettingsHeader from "./PoolSettingsHeader";
import LocationAccessCard from "./LocationAccessCard";
import SpecificationsCard from "./SpecificationsCard";
import EquipmentCard from "./EquipmentCard";
import PhotosCard from "./PhotosCard";
import NeedAHandCard from "./NeedAHandCard";
import SaveBar from "./SaveBar";

export const PoolSettingsView: React.FC = () => {
  const [activePoolId, setActivePoolId] = useState<string>("main");

  const currentPoolData =
    MOCK_POOL_SETTINGS[activePoolId] || MOCK_POOL_SETTINGS.main;

  const form = useForm<IPoolSettings>({
    defaultValues: currentPoolData,
    mode: "onChange",
  });

  const handlePoolChange = (poolId: string) => {
    setActivePoolId(poolId);
    const targetData = MOCK_POOL_SETTINGS[poolId] || MOCK_POOL_SETTINGS.main;
    form.reset(targetData);
  };

  const handleCancel = () => {
    form.reset(currentPoolData);
  };

  const onSubmit = async (data: IPoolSettings) => {
    // API INTEGRATION POINT (PATCH / PUT)
    // =========================================================================
    // try {
    //   const response = await updatePoolSettingsApi(activePoolId, data);
    //   if (response.success) {
    //     // Update local cache / revalidate tags
    //     form.reset(data);
    //   }
    // } catch (error) {
    //   console.error("Failed to update pool settings", error);
    // }
    // =========================================================================
    console.log("Saving Pool Settings:", data);
    form.reset(data); // Marks form as pristine after save
  };

  return (
    <div className="bg-[#FAFBFD] min-h-screen relative pb-28 sm:pb-32">
      {/* Top Navbar Header Bar for Fixed Navbar Contrast */}
      <div className="w-full bg-[#041D37] h-20 sm:h-24 shadow-sm" />

      <Container className="py-6 sm:py-8 lg:py-10 space-y-6 sm:space-y-8">
        {/* Header & Pool Switcher */}
        <PoolSettingsHeader
          activePoolId={activePoolId}
          onPoolChange={handlePoolChange}
        />

        {/* Main Content Form */}
        <ReuseableForm form={form} onSubmit={onSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column (Location & Access, Specs, Equipment) */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-6">
              <LocationAccessCard control={form.control} />
              <SpecificationsCard control={form.control} />
              <EquipmentCard control={form.control} />
            </div>

            {/* Right Column (Photos, Support Help Card) */}
            <div className="lg:col-span-5 xl:col-span-4 space-y-6">
              <PhotosCard />
              <NeedAHandCard />
            </div>
          </div>

          {/* Sticky Bottom Save / Cancel Bar */}
          <SaveBar
            isDirty={form.formState.isDirty}
            isSubmitting={form.formState.isSubmitting}
            onCancel={handleCancel}
          />
        </ReuseableForm>
      </Container>
    </div>
  );
};

export default PoolSettingsView;
