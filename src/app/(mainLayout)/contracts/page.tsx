import React from "react";
import { Metadata } from "next";
import { ContractsClient } from "@/components/contracts/ContractsClient";

export const metadata: Metadata = {
  title: "My Contracts | Pure Pool",
  description: "Your maintenance plan agreements and renewals.",
};

export default function ContractsPage() {
  return <ContractsClient />;
}
