import { Metadata } from "next";
import PoolSettingsView from "@/components/pool-settings/PoolSettingsView";

export const metadata: Metadata = {
  title: "Pool Settings | Pure Pool Backoffice",
  description:
    "Manage your pool dimensions, equipment, location and access instructions.",
};

export default function PoolSettingsPage() {
  return <PoolSettingsView />;
}

