"use client";

import React, { useRef } from "react";
import Container from "@/components/ui/CustomUi/Container";
import SectionHeading from "@/components/ui/CustomUi/SectionHeading";
import Accordion from "@/components/ui/CustomUi/Accordion";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap-util";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  defaultOpen?: boolean;
}

const FAQS: FAQItem[] = [
  {
    id: "cost",
    question: "How much does maintenance cost?",
    answer:
      "Depends on your pool size and how often you'd like us to visit. Essential starts at €880 a year, Pro at €2,640. Send us a few details and we'll give you an exact price.",
    defaultOpen: true,
  },
  {
    id: "home",
    question: "Do I need to be home during a visit?",
    answer:
      "No, as long as our technician has safe access to the pool and pump room. We leave a detailed digital visit record with dated photos and chemical logs in your app immediately after every session.",
  },
  {
    id: "breakage",
    question: "What happens if something breaks between visits?",
    answer:
      "Simply report it in the Pure Pool app or give us a quick call. Our team will schedule an urgent diagnostic visit, provide upfront pricing for replacement parts, and fix it quickly.",
  },
  {
    id: "change-plan",
    question: "Can I change my plan later?",
    answer:
      "Yes! You can upgrade, downgrade, or pause your maintenance plan anytime with 14 days notice. There are no lock-in contracts or surprise cancellation penalties.",
  },
  {
    id: "coverage",
    question: "What areas do you cover?",
    answer:
      "We service private residential properties, residential communities, and commercial hospitality facilities throughout Madrid and surrounding municipalities.",
  },
];

export const QuestionsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const faqListRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!faqListRef.current) return;
      const items = faqListRef.current.querySelectorAll(".faq-accordion-item");
      if (!items || items.length === 0) return;

      gsap.fromTo(
        items,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: faqListRef.current,
            start: "top 85%",
            toggleActions: "restart none none reverse",
          },
        }
      );
    },
    { dependencies: [] }
  );

  return (
    <section ref={sectionRef} className="w-full py-20 md:py-28 bg-white overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Heading & Subtitle */}
          <SectionHeading
            align="left"
            badge="Questions"
            title="Frequently asked questions"
            description="A few things people usually ask before signing up."
            className="lg:col-span-5"
          />

          {/* Right Column: Accordion Items */}
          <div ref={faqListRef} className="lg:col-span-7 border-b border-gray-200">
            {FAQS.map((faq) => (
              <div key={faq.id} className="faq-accordion-item">
                <Accordion
                  item={{
                    question: faq.question,
                    answer: faq.answer,
                  }}
                  variant="bordered"
                  defaultOpen={faq.defaultOpen}
                />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default QuestionsSection;

