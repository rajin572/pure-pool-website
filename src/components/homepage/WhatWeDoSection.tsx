"use client";

import React, { useRef } from "react";
import Container from "@/components/ui/CustomUi/Container";
import SectionHeading from "@/components/ui/CustomUi/SectionHeading";
import { Waves, Wrench, PlusCircle, AlertCircle } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap-util";

interface ServiceCard {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SERVICES: ServiceCard[] = [
  {
    id: "weekly-maintenance",
    title: "Weekly maintenance",
    description: "Water testing, cleaning, filter checks and chemical balancing.",
    icon: Waves,
  },
  {
    id: "repairs",
    title: "Repairs",
    description: "Pumps, filters, chlorinators, heating and lighting. We diagnose and fix it quickly.",
    icon: Wrench,
  },
  {
    id: "installations",
    title: "Installations",
    description: "New filtration systems, salt chlorinators and heat pumps installed and registered.",
    icon: PlusCircle,
  },
  {
    id: "emergency-callouts",
    title: "Emergency callouts",
    description: "Green water, stopped pumps or leaks. Report the issue and we will be there.",
    icon: AlertCircle,
  },
];

export const WhatWeDoSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!cardsRef.current) return;
      const cards = cardsRef.current.querySelectorAll(".service-card");
      if (!cards || cards.length === 0) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: cardsRef.current,
          start: "top 85%",
          toggleActions: "restart none none reverse",
        },
      });

      tl.fromTo(
        cards,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.08,
          ease: "power2.out",
        }
      );

      const icons = cardsRef.current.querySelectorAll(".service-icon");
      if (icons.length > 0) {
        tl.fromTo(
          icons,
          { opacity: 0, scale: 0.75 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            stagger: 0.08,
            ease: "back.out(1.7)",
          },
          0.1
        );
      }
    },
    { dependencies: [] }
  );

  return (
    <section ref={sectionRef} className="w-full py-20 md:py-28 bg-white overflow-hidden">
      <Container>
        <SectionHeading
          align="left"
          badge="What we do"
          title="Everything your pool needs, handled"
          description="From regular scheduled care to urgent diagnostic callouts, our certified Madrid technicians take complete ownership of your pool’s hygiene and equipment."
          descriptionClassName="text-[clamp(0.95rem,1.8vw,1.1rem)]"
        />

        <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mt-12 md:mt-14">
          {SERVICES.map((service) => {
            const IconComponent = service.icon;
            return (
              <div
                key={service.id}
                className="service-card group p-6 sm:p-7 bg-white rounded-2xl border border-gray-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-lg hover:border-sky-400/80 transition-all duration-300 flex flex-col items-start gap-4"
              >
                <div className="service-icon size-11 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform duration-300">
                  <IconComponent className="size-6" />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-sky-600 transition-colors duration-200 leading-snug">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-600 font-normal leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export default WhatWeDoSection;

