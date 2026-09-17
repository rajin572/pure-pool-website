import React from "react";
import type { Metadata } from "next";
import {
  HeroSection,
  WhatWeDoSection,
  PurePoolAppSection,
  GettingStartedSection,
  MaintenancePlansSection,
  QuestionsSection,
  CustomerTestimonialsSection,
  OurWorkSection,
  GetStartedSection,
} from "@/components/homepage";

export const metadata: Metadata = {
  title: "Pure Pool | Professional Pool Maintenance & Care in Madrid",
  description:
    "Expert pool maintenance and cleaning in Madrid. Real-time visit photos, chemical balance tracking, and certified pool technicians.",
};

export default function HomePage() {
  return (
    <div className="w-full flex flex-col">
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