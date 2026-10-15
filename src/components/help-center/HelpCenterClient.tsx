"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Container from "@/components/ui/CustomUi/Container";
import HelpCenterHeader from "./HelpCenterHeader";
import EmergencyHotlineBanner from "./EmergencyHotlineBanner";
import ContactMethodsGrid from "./ContactMethodsGrid";
import HoursAndLocationCard from "./HoursAndLocationCard";
import SendMessageForm from "./SendMessageForm";
import HelpCenterFaqSection from "./HelpCenterFaqSection";
import { FAQItem } from "@/service/HelpCenterService/HelpCenterServiceApi";
import { prefersReducedMotion } from "@/lib/gsap-util";

interface HelpCenterClientProps {
  initialFaqs?: FAQItem[];
}

export const HelpCenterClient: React.FC<HelpCenterClientProps> = ({
  initialFaqs,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;

    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
      );
    }
  }, []);

  return (
    <main className="w-full min-h-screen bg-[#F8F9FA] pb-24">
      {/* Top Contrast Bar for transparent fixed Navbar */}
      <div className="w-full bg-[#041D37] h-20 sm:h-24 shadow-xs" />

      <div className="w-full pt-10 sm:pt-14">
        <Container>
          <div ref={contentRef} className="flex flex-col gap-8 sm:gap-10">
            {/* 1. Header */}
            <HelpCenterHeader />

            {/* 2. 24/7 Pool Emergency Hotline Banner */}
            <EmergencyHotlineBanner />

            {/* 3. Direct Contact Channels Grid (Phone, WhatsApp, Email) */}
            <ContactMethodsGrid />

            {/* 4. Operating Hours & Madrid Office Location */}
            <HoursAndLocationCard />

            {/* 5. "Send Us a Message" Contact Form */}
            <SendMessageForm />

            {/* 6. Frequently Asked Questions (Accordion) */}
            <HelpCenterFaqSection initialFaqs={initialFaqs} />
          </div>
        </Container>
      </div>
    </main>
  );
};

export default HelpCenterClient;

