import React from "react";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { siteConfig } from "@/lib/site-config";
import {
  AboutHeroSection,
  AboutOurStorySection,
} from "@/components/aboutpage";

// Below-the-fold sections are dynamically code-split so the initial bundle stays lean,
// while remaining fully SSR server-rendered for crawlers and SEO.
const AboutDifferentSection = dynamic(
  () => import("@/components/aboutpage/AboutDifferentSection")
);
const AboutStandardSection = dynamic(
  () => import("@/components/aboutpage/AboutStandardSection")
);
const AboutTeamSection = dynamic(
  () => import("@/components/aboutpage/AboutTeamSection")
);

const pageUrl = "/about-us";
const pageTitle = "About Us | Pure Pool";
const pageDescription =
  "Learn how Pure Pool grew from one pool to four hundred across Madrid. Real accountability, fixed checklists, photo proof on every visit, and certified technicians.";

export const metadata: Metadata = {
  title: "About Us",
  description: pageDescription,
  keywords: [
    "about pure pool",
    "pool maintenance company Madrid",
    "pool care team Madrid",
    "swimming pool experts Madrid",
    "Roberto Vidal pool care",
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
    images: [{ url: "/images/aboutpage/aboutUsHeroBanner.jpg", alt: pageTitle }],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    images: ["/images/aboutpage/aboutUsHeroBanner.jpg"],
  },
};

// JSON-LD structured data for the About page
const structuredData = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: pageTitle,
  description: pageDescription,
  url: `${siteConfig.siteUrl}${pageUrl}`,
  mainEntity: {
    "@type": "LocalBusiness",
    name: siteConfig.name,
    description: pageDescription,
    url: siteConfig.siteUrl,
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    address: {
      "@type": "PostalAddress",
      ...siteConfig.contact.address,
    },
    founder: {
      "@type": "Person",
      name: "Roberto Vidal",
      jobTitle: "Founder & Director",
    },
    employee: [
      {
        "@type": "Person",
        name: "Ana López",
        jobTitle: "Operations Manager",
      },
      {
        "@type": "Person",
        name: "Carlos Martínez",
        jobTitle: "Senior Technician",
      },
      {
        "@type": "Person",
        name: "Laura García",
        jobTitle: "Customer Care",
      },
    ],
  },
};

/**
 * ==============================================================================
 * REDUX TOOLKIT QUERY (RTK QUERY) INTEGRATION REFERENCE
 * ==============================================================================
 * When the backend API is connected, uncomment the following queries / mutations
 * or wrap this Server Component with preloaded SSR data:
 *
 * 1. GET (Read About Us content & team list):
 *    export const { useGetAboutUsContentQuery, useGetTeamMembersQuery } = aboutApi;
 *    // Example usage in a client sub-component or prefetching in server:
 *    // const { data: teamData, isLoading, error } = useGetTeamMembersQuery();
 *
 * 2. POST (Submit contact inquiry or feedback from About Us):
 *    export const { useSubmitInquiryMutation } = aboutApi;
 *    // const [submitInquiry, { isLoading: isSubmitting }] = useSubmitInquiryMutation();
 *    // await submitInquiry({ name, email, message }).unwrap();
 *
 * 3. PATCH / PUT (Admin updates for About Us page content/team):
 *    export const { useUpdateAboutSectionMutation } = aboutApi;
 *    // const [updateAboutSection] = useUpdateAboutSectionMutation();
 *    // await updateAboutSection({ id: sectionId, content: updatedData }).unwrap();
 *
 * 4. DELETE (Admin removal of team member or record):
 *    export const { useDeleteTeamMemberMutation } = aboutApi;
 *    // const [deleteTeamMember] = useDeleteTeamMemberMutation();
 *    // await deleteTeamMember(memberId).unwrap();
 * ==============================================================================
 */

export default function AboutUsPage() {
  return (
    <div className="w-full flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 1. Hero Section */}
      <AboutHeroSection />

      {/* 2. Our Story Section */}
      <AboutOurStorySection />

      {/* 3. What Makes Pure Pool Different Section */}
      <AboutDifferentSection />

      {/* 4. The Pure Pool Maintenance Standard Section */}
      <AboutStandardSection />

      {/* 5. The People Behind It / Team Section */}
      <AboutTeamSection />
    </div>
  );
}