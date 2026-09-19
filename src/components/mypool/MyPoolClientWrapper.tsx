"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import MyPoolHeroSection from "./MyPoolHeroSection";
import ReusableTabs from "@/components/ui/CustomUi/ReusableTabs";
import MyPoolOverviewTab from "./MyPoolOverviewTab";
import MyPoolWaterConditionTab from "./MyPoolWaterConditionTab";
import MyPoolEquipmentTab from "./MyPoolEquipmentTab";
import MyPoolServiceVisitTab from "./MyPoolServiceVisitTab";
import RequestServiceModal from "./RequestServiceModal";
import type {
  PoolOverviewData,
  WaterConditionData,
  EquipmentRecord,
  ServiceVisitRecord,
} from "@/service/MyPoolService/MyPoolServiceApi";

export type MyPoolTabKey =
  | "overview"
  | "water_condition"
  | "equipment"
  | "service_visit";

interface MyPoolClientWrapperProps {
  initialTab?: string;
  initialPoolId?: string;
  // Preloaded SSR data props ready for server-to-client hydration
  initialOverview?: PoolOverviewData;
  initialWater?: WaterConditionData;
  initialEquipment?: EquipmentRecord[];
  initialVisits?: ServiceVisitRecord[];
}

export const MyPoolClientWrapper: React.FC<MyPoolClientWrapperProps> = ({
  initialTab = "overview",
  initialPoolId = "main",
  initialOverview,
  initialWater,
  initialEquipment,
  initialVisits,
}) => {
  const searchParams = useSearchParams();
  const urlTab = searchParams.get("tab") as MyPoolTabKey | null;

  const [selectedPoolId, setSelectedPoolId] = useState<string>(initialPoolId);
  const [requestServiceModalOpen, setRequestServiceModalOpen] =
    useState<boolean>(false);

  // Derive activeTab directly from searchParams (or initial SSR prop) during render
  // This eliminates cascading renders and avoids unnecessary effect state synchronization
  const activeTab: MyPoolTabKey =
    urlTab &&
      ["overview", "water_condition", "equipment", "service_visit"].includes(urlTab)
      ? urlTab
      : (initialTab as MyPoolTabKey) || "overview";

  const tabs = [
    {
      label: "Overview",
      value: "overview" as const,
      content: (
        <MyPoolOverviewTab
          data={initialOverview}
          onRequestServiceClick={() => setRequestServiceModalOpen(true)}
        />
      ),
    },
    {
      label: "Water Condition",
      value: "water_condition" as const,
      content: <MyPoolWaterConditionTab data={initialWater} />,
    },
    {
      label: "Equipment",
      value: "equipment" as const,
      content: <MyPoolEquipmentTab data={initialEquipment} />,
    },
    {
      label: "Service Visit",
      value: "service_visit" as const,
      content: (
        <MyPoolServiceVisitTab
          data={initialVisits}
          onRequestServiceClick={() => setRequestServiceModalOpen(true)}
        />
      ),
    },
  ];

  return (
    <div className="w-full flex flex-col">
      {/* 1. Hero Section with Pool Selector Pills & Status */}
      <MyPoolHeroSection
        selectedPoolId={selectedPoolId}
        onSelectPool={setSelectedPoolId}
      />

      {/* 2. Reusable Tabs Navigation & Tab Content (GSAP Animated + SearchParams sync) */}
      <div className="w-full">
        <ReusableTabs<MyPoolTabKey>
          tabs={tabs}
          activeTab={activeTab}
          align="left"
          variant="bordered"
          useContainer={true}
          headerWrapperClassName="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-xs"
          tabRowClassName="w-auto"
          tabContentStyle="mt-0"
        />
      </div>

      {/* 3. Request Service Form Modal (using ReusableModal + ReuseableForm) */}
      <RequestServiceModal
        open={requestServiceModalOpen}
        onOpenChange={setRequestServiceModalOpen}
      />
    </div>
  );
};

export default MyPoolClientWrapper;
