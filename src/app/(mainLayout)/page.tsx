import React from "react";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { HeroSection, WhatWeDoSection } from "@/components/homepage";
import { siteConfig } from "@/lib/site-config";

// Below-the-fold sections are code-split into their own chunks so the initial
// route bundle (and hydration cost) stays small. Content is still fully
// server-rendered for crawlers/SEO — `next/dynamic` only defers the client JS,
// not the HTML (ssr defaults to true).
const PurePoolAppSection = dynamic(() => import("@/components/homepage/PurePoolAppSection"));
const GettingStartedSection = dynamic(() => import("@/components/homepage/GettingStartedSection"));
const MaintenancePlansSection = dynamic(() => import("@/components/homepage/MaintenancePlansSection"));
const QuestionsSection = dynamic(() => import("@/components/homepage/QuestionsSection"));
const CustomerTestimonialsSection = dynamic(() => import("@/components/homepage/CustomerTestimonialsSection"));
const OurWorkSection = dynamic(() => import("@/components/homepage/OurWorkSection"));
const GetStartedSection = dynamic(() => import("@/components/homepage/GetStartedSection"));

const pageUrl = "/";
const pageTitle = siteConfig.title;
const pageDescription = siteConfig.description;

export const metadata: Metadata = {
  // No `title` here — the root layout's `title.default` is already the exact
  // fully-branded string, and setting one here would run it through the
  // "%s | Pure Pool" template too, duplicating the brand name.
  description: pageDescription,
  keywords: [
    "pool maintenance Madrid",
    "pool cleaning service Madrid",
    "swimming pool technician Madrid",
    "piscina mantenimiento Madrid",
    "pool chemical balancing",
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
    images: [{ url: siteConfig.ogImage, alt: pageTitle }],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    images: [siteConfig.ogImage],
  },
};

// Structured data mirrors the real, visible page content (services, pricing) so it
// stays honest — no fabricated ratings/reviews or unconfirmed social profiles.
const structuredData = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  name: siteConfig.name,
  description: siteConfig.description,
  url: siteConfig.siteUrl,
  image: `${siteConfig.siteUrl}${siteConfig.ogImage}`,
  telephone: siteConfig.contact.phone,
  email: siteConfig.contact.email,
  areaServed: siteConfig.areaServed,
  priceRange: "€60 - €340",
  address: {
    "@type": "PostalAddress",
    ...siteConfig.contact.address,
  },
  makesOffer: [
    {
      "@type": "Offer",
      name: "Essential Maintenance Plan",
      price: "60",
      priceCurrency: "EUR",
      description: "Fortnightly visits for smaller residential pools.",
    },
    {
      "@type": "Offer",
      name: "Premium Maintenance Plan",
      price: "85",
      priceCurrency: "EUR",
      description: "Weekly visits and priority response.",
    },
    {
      "@type": "Offer",
      name: "Commercial Maintenance Plan",
      price: "340",
      priceCurrency: "EUR",
      description: "Hotels, communities and public pools with regulatory requirements.",
    },
  ],
};

export default function HomePage() {
  return (
    <div className="w-full flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. What We Do Section */}
      <WhatWeDoSection />

      {/* 3. The Pure Pool App Section */}
      <PurePoolAppSection />

      {/* 4. Getting Started Section */}
      <GettingStartedSection />

      {/* 5. Maintenance Plans Section */}
      <MaintenancePlansSection />

      {/* 6. Questions (FAQ) Section */}
      <QuestionsSection />

      {/* 7. Customer Testimonials Section */}
      <CustomerTestimonialsSection />

      {/* 8. Our Work (Masonry) Section */}
      <OurWorkSection />

      {/* 9. Get Started / CTA Section */}
      <GetStartedSection />
    </div>
  );
}
