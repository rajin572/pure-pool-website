"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import MyPoolHeroSection from "./MyPoolHeroSection";
import ReusableTabs from "@/components/ui/CustomUi/ReusableTabs";
import MyPoolOverviewTab from "./MyPoolOverviewTab";
import MyPoolWaterConditionTab from "./MyPoolWaterConditionTab";
import MyPoolEquipmentTab from "./MyPoolEquipmentTab";
import MyPoolServiceVisitTab from "./MyPoolServiceVisitTab";
import RequestServiceModal from "./RequestServiceModal";
import {
  getMyPools,
  getPoolDetails,
  getPoolWater,
  getPoolEquipment,
  type IPoolSummary,
  type IPoolDetailsData,
  type IPoolWaterData,
  type IEquipmentItem,
} from "@/service/MyPoolService/MyPoolServiceApi";

export type MyPoolTabKey = "overview" | "water_condition" | "equipment" | "service_visit";

interface MyPoolClientWrapperProps {
  initialTab?: string;
  initialPoolId?: string;
}

export const MyPoolClientWrapper: React.FC<MyPoolClientWrapperProps> = ({ initialTab = "overview" }) => {
  const searchParams = useSearchParams();
  const urlTab = searchParams.get("tab") as MyPoolTabKey | null;
  const urlPoolId = searchParams.get("poolId");

  const [requestServiceModalOpen, setRequestServiceModalOpen] = useState(false);
  const [pools, setPools] = useState<IPoolSummary[] | null>(null);
  const [selectedPoolId, setSelectedPoolId] = useState<string>(urlPoolId || "");
  const [poolError, setPoolError] = useState<string | null>(null);

  const [details, setDetails] = useState<IPoolDetailsData | null>(null);
  const [water, setWater] = useState<IPoolWaterData | null>(null);
  const [equipment, setEquipment] = useState<IEquipmentItem[] | null>(null);
  const [isLoadingPool, setIsLoadingPool] = useState(false);

  useEffect(() => {
    getMyPools().then((res) => {
      if (res.success) {
        setPools(res.data);
        if (!selectedPoolId && res.data[0]) setSelectedPoolId(res.data[0]._id);
      } else {
        setPoolError(res.error.message);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedPoolId) return;
    let cancelled = false;
    (async () => {
      setIsLoadingPool(true);
      const [detailsRes, waterRes, equipmentRes] = await Promise.all([
        getPoolDetails(selectedPoolId),
        getPoolWater(selectedPoolId),
        getPoolEquipment(selectedPoolId),
      ]);
      if (cancelled) return;
      setDetails(detailsRes.success ? detailsRes.data : null);
      setWater(waterRes.success ? waterRes.data : null);
      setEquipment(equipmentRes.success ? equipmentRes.data : null);
      setIsLoadingPool(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedPoolId]);

  const activeTab: MyPoolTabKey =
    urlTab && ["overview", "water_condition", "equipment", "service_visit"].includes(urlTab)
      ? urlTab
      : (initialTab as MyPoolTabKey) || "overview";

  if (poolError) {
    return <div className="w-full py-24 text-center text-sm text-red-600">{poolError}</div>;
  }

  if (!pools) {
    return <div className="w-full py-24 text-center text-sm text-gray-500">Loading your pools...</div>;
  }

  if (pools.length === 0) {
    return (
      <div className="w-full py-24 text-center text-sm text-gray-500">
        No pools are registered on your account yet.
      </div>
    );
  }

  const tabs = [
    {
      label: "Overview",
      value: "overview" as const,
      content: (
        <MyPoolOverviewTab
          details={details}
          isLoading={isLoadingPool}
          onRequestServiceClick={() => setRequestServiceModalOpen(true)}
        />
      ),
    },
    {
      label: "Water Condition",
      value: "water_condition" as const,
      content: <MyPoolWaterConditionTab data={water} isLoading={isLoadingPool} />,
    },
    {
      label: "Equipment",
      value: "equipment" as const,
      content: <MyPoolEquipmentTab data={equipment} isLoading={isLoadingPool} />,
    },
    {
      label: "Service Visit",
      value: "service_visit" as const,
      content: (
        <MyPoolServiceVisitTab
          details={details}
          isLoading={isLoadingPool}
          onRequestServiceClick={() => setRequestServiceModalOpen(true)}
        />
      ),
    },
  ];

  return (
    <div className="w-full flex flex-col">
      <MyPoolHeroSection pools={pools} selectedPoolId={selectedPoolId} onSelectPool={setSelectedPoolId} />

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

      <RequestServiceModal
        open={requestServiceModalOpen}
        onOpenChange={setRequestServiceModalOpen}
        defaultPoolId={selectedPoolId}
      />
    </div>
  );
};

export default MyPoolClientWrapper;
