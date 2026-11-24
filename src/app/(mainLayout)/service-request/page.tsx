import React from "react";
import { Metadata } from "next";
import { ServiceRequestClient } from "@/components/service-request";

export const metadata: Metadata = {
  title: "Service Requests | Pure Pool",
  description:
    "File maintenance tickets, review active dispatches, and schedule specialist inspections for your pool.",
};

export default function ServiceRequestPage() {
  return <ServiceRequestClient />;
}
