"use client";

import React, { useRef } from "react";
import Container from "@/components/ui/CustomUi/Container";
import SectionHeading from "@/components/ui/CustomUi/SectionHeading";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap-util";

interface StepItem {
  number: string;
  title: string;
  description: string;
}

const STEPS: StepItem[] = [
  {
    number: "STEP 01",
    title: "Tell us about your pool",
    description:
      "Send us the basics — where you are, roughly how big it is, and what you're currently doing about maintenance. We'll come back with a fixed monthly price.",
  },
  {
    number: "STEP 02",
    title: "We visit and set things up",
    description:
      "Your technician checks the pool properly on the first visit, records the equipment, and confirms the details. Nothing is guessed at.",
  },
  {
    number: "STEP 03",
    title: "We take it from there",
    description:
      "Same technician, same day each week. You get a notification after every visit with the photos and readings — and you can stop thinking about it.",
  },
];

export const GettingStartedSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const stepsContainerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!stepsContainerRef.current) return;
      const cards = stepsContainerRef.current.querySelectorAll(".step-card");
      const lines = stepsContainerRef.current.querySelectorAll(".step-line");
      if (!cards || cards.length === 0) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stepsContainerRef.current,
          start: "top 85%",
          toggleActions: "restart none none reverse",
        },
      });

      tl.fromTo(
        cards,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: "power2.out",
        }
      );

      if (lines.length > 0) {
        tl.fromTo(
          lines,
          { scaleX: 0 },
          {
            scaleX: 1,
            transformOrigin: "left center",
            duration: 0.6,
            stagger: 0.12,
            ease: "power2.out",
          },
          0.15
        );
      }
    },
    { dependencies: [] }
  );

  return (
    <section ref={sectionRef} className="w-full py-20 md:py-28 bg-white overflow-hidden">
      <Container>
        <SectionHeading
          badge="Getting Started"
          title={<>Three steps and you&apos;re set up</>}
          description="No survey fees, no long waiting periods, and no locked-in annual lock-ins. Just transparent service from day one."
          maxWidth="max-w-3xl"
        />

        <div ref={stepsContainerRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mt-14 md:mt-16">
          {STEPS.map((step) => (
            <div key={step.number} className="step-card flex flex-col items-start gap-3.5">
              <div className="w-full flex items-center gap-3">
                <span className="text-sky-600 text-xs font-mono font-bold tracking-widest uppercase">
                  {step.number}
                </span>
                <div className="step-line flex-1 h-[1px] bg-gray-200" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug">
                {step.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default GettingStartedSection;

