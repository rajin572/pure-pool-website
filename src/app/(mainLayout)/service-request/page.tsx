import React from "react";
import { Metadata } from "next";
import { ServiceRequestClient } from "@/components/service-request";
import {
  getServiceRequests,
  MOCK_SERVICE_REQUESTS,
} from "@/service/ServiceRequestService/ServiceRequestServiceApi";

// Next.js App Router Page - Pure Pool Service Requests
export const metadata: Metadata = {
  title: "Service Requests | Pure Pool",
  description:
    "File maintenance tickets, review active dispatches, and schedule specialist inspections for your pool.",
};

export default async function ServiceRequestPage() {
  /**
   * ==============================================================================
   * NEXT.JS SERVER-SIDE RENDERING (SSR) API CALL
   * ==============================================================================
   * Pre-fetches service request tickets on the server before client hydration.
   * When the backend REST API is live, uncomment this direct SSR service call:
   *
   * const requestsResponse = await getServiceRequests();
   * const initialRequests = requestsResponse.data;
   * const total = requestsResponse.total;
   * ==============================================================================
   */

  const requestsResponse = await getServiceRequests();
  const initialRequests = requestsResponse.data.length
    ? requestsResponse.data
    : MOCK_SERVICE_REQUESTS;

  return (
    <ServiceRequestClient
      initialRequests={initialRequests}
      total={initialRequests.length}
    />
  );
}
