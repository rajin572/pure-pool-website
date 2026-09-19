import React from "react";
import { Metadata } from "next";
import { ServiceHistoryClient } from "@/components/service-history";
import {
  getServiceHistory,
  MOCK_SERVICE_HISTORY_RECORDS,
} from "@/service/ServiceHistoryService/ServiceHistoryServiceApi";

export const metadata: Metadata = {
  title: "Service History | Pure Pool",
  description:
    "View detailed records of your pool service visits, water diagnostic readings, and technician notes.",
};

export default async function ServiceHistoryPage() {
  /**
   * ==============================================================================
   * NEXT.JS SERVER-SIDE RENDERING (SSR) API CALL
   * ==============================================================================
   * Pre-fetches service history data on the server before client hydration.
   * When the backend REST API is live, uncomment this direct SSR service call:
   *
   * const historyResponse = await getServiceHistory("pool-main-01", { page: 1, limit: 10 });
   * const initialRecords = historyResponse.data;
   * const total = historyResponse.total;
   * ==============================================================================
   */

  const historyResponse = await getServiceHistory("pool-main-01");
  const initialRecords = historyResponse.data.length
    ? historyResponse.data
    : MOCK_SERVICE_HISTORY_RECORDS;

  return (
    <ServiceHistoryClient
      initialRecords={initialRecords}
      total={initialRecords.length}
    />
  );
}

