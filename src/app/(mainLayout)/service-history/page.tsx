import React from "react";
import { Metadata } from "next";
import { ServiceHistoryClient } from "@/components/service-history";

export const metadata: Metadata = {
  title: "Service History | Pure Pool",
  description:
    "View detailed records of your pool service visits, water diagnostic readings, and technician notes.",
};

export default function ServiceHistoryPage() {
  return <ServiceHistoryClient />;
}
