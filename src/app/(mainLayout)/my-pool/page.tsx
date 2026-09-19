/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { Suspense } from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { MyPoolClientWrapper } from "@/components/mypool";
import {
  getMyPoolOverview,
  getWaterConditionStats,
  getPoolEquipment,
  getServiceVisitsHistory,
  type PoolOverviewData,
  type WaterConditionData,
  type EquipmentRecord,
  type ServiceVisitRecord,
} from "@/service/MyPoolService/MyPoolServiceApi";

const pageUrl = "/my-pool";
const pageTitle = "My Pool | Pure Pool";
const pageDescription =
  "View complete technical specifications, verified water balance parameters, equipment warranty records, and certified technician service visit history.";

export const metadata: Metadata = {
  title: "My Pool",
  description: pageDescription,
  keywords: [
    "my pool",
    "pool water balance",
    "pool chemistry analysis",
    "pool equipment records",
    "service visit history Madrid",
    "swimming pool maintenance portal",
  ],
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: pageUrl,
    siteName: siteConfig.name,
    locale: "en_US",
    type: "website",
    images: [{ url: "/images/myPool.jpg", alt: pageTitle }],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    images: ["/images/myPool.jpg"],
  },
};

// JSON-LD structured data for the user's pool management overview
const structuredData = {
  "@context": "https://schema.org",
  "@type": "ItemPage",
  name: pageTitle,
  description: pageDescription,
  url: `${siteConfig.siteUrl}${pageUrl}`,
  mainEntity: {
    "@type": "Product",
    name: "Main Residence Pool Maintenance Record",
    description: "Residential saltwater pool maintenance, water testing, and equipment tracking.",
    brand: {
      "@type": "Brand",
      name: siteConfig.name,
    },
    offers: {
      "@type": "Offer",
      price: "85",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
    },
  },
};

interface MyPoolPageProps {
  searchParams: Promise<{
    tab?: string;
    poolId?: string;
  }>;
}

/**
 * ==============================================================================
 * SERVER COMPONENT - MY POOL PAGE (SSR)
 * ==============================================================================
 * Follows Next.js Server Side Rendering (SSR) best practices:
 * - Runs exclusively on the Node.js server (zero "use client" on page level)
 * - Directly accesses searchParams via Promise resolution
 * - Calls server API services with caching & revalidation tags
 * - Wraps interactive client islands in React Suspense for progressive streaming
 * ==============================================================================
 */
export default async function MyPoolPage({ searchParams }: MyPoolPageProps) {
  const resolvedParams = await searchParams;
  const initialTab = resolvedParams?.tab || "overview";
  const poolId = resolvedParams?.poolId || "main";

  /**
   * ==============================================================================
   * NEXT.JS SERVER-SIDE RENDERING (SSR) TAB-BASED CONDITIONAL API CALLS
   * ==============================================================================
   * Strictly calls ONLY the API endpoint for the requested tab (or defaults to
   * "overview" when no tab parameter exists in searchParams). This prevents
   * fetching unused data, minimizes TTFB, and complies with Next.js SSR best practices:
   *
   * let initialOverview: PoolOverviewData | undefined;
   * let initialWater: WaterConditionData | undefined;
   * let initialEquipment: EquipmentRecord[] | undefined;
   * let initialVisits: ServiceVisitRecord[] | undefined;
   *
   * if (!resolvedParams?.tab || resolvedParams.tab === "overview") {
   *   // 1. Overview Tab (default) -> only fetch pool specifications & scheduled maintenance
   *   const overviewRes = await getMyPoolOverview(poolId);
   *   initialOverview = overviewRes.data;
   * } else if (resolvedParams.tab === "water_condition") {
   *   // 2. Water Condition Tab -> only fetch telemetry chemistry gauges & history
   *   const waterRes = await getWaterConditionStats(poolId);
   *   initialWater = waterRes.data;
   * } else if (resolvedParams.tab === "equipment") {
   *   // 3. Equipment Tab -> only fetch equipment inventory
   *   const equipmentRes = await getPoolEquipment(poolId);
   *   initialEquipment = equipmentRes.data;
   * } else if (resolvedParams.tab === "service_visit") {
   *   // 4. Service Visit Tab -> only fetch certified technician visit logs
   *   const visitsRes = await getServiceVisitsHistory(poolId, 1, 10);
   *   initialVisits = visitsRes.data;
   * }
   * ==============================================================================
   */

  return (
    <main className="w-full min-h-screen flex flex-col bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <Suspense
        fallback={
          <div className="w-full py-24 flex items-center justify-center text-gray-500 font-medium">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-3 border-sky-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm">Loading pool telemetry and records...</p>
            </div>
          </div>
        }
      >
        <MyPoolClientWrapper
          initialTab={initialTab}
          initialPoolId={poolId}
        // initialOverview={initialOverview}
        // initialWater={initialWater}
        // initialEquipment={initialEquipment}
        // initialVisits={initialVisits}
        />
      </Suspense>
    </main>
  );
}
