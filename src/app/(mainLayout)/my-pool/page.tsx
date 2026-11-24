import React, { Suspense } from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { MyPoolClientWrapper } from "@/components/mypool";

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
 * My Pool data (pool list, specs, water, equipment, visits) is fetched client-side by
 * MyPoolClientWrapper — the pool switcher needs to refetch per pool anyway, so there is no
 * SSR benefit to prefetching one pool's data here.
 */
export default async function MyPoolPage({ searchParams }: MyPoolPageProps) {
  const resolvedParams = await searchParams;
  const initialTab = resolvedParams?.tab || "overview";
  const poolId = resolvedParams?.poolId;

  return (
    <main className="w-full min-h-screen flex flex-col bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <Suspense fallback={<></>}>
        <MyPoolClientWrapper initialTab={initialTab} initialPoolId={poolId} />
      </Suspense>
    </main>
  );
}
