import React from "react";
import { Metadata } from "next";
import { ContractSignView } from "@/components/contracts/ContractSignView";

interface ContractPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const metadata: Metadata = {
  title: "Contract | Pure Pool",
};

export default async function ContractPage({ params }: ContractPageProps) {
  const { id } = await params;
  return <ContractSignView contractId={id} />;
}
