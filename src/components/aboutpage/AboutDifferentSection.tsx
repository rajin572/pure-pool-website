"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Container from "@/components/ui/CustomUi/Container";
import { AllImages } from "../../../public/images/AllImages";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap-util";

interface DifferentItem {
  id: string;
  title: string;
  description: string;
}

const DIFFERENT_ITEMS: DifferentItem[] = [
  {
    id: "technician",
    title: "Same technician every week — not whoever's available",
    description:
      "Continuity means someone who actually knows your pool, not a rotating stranger reading notes.",
  },
  {
    id: "proof",
    title: "Photo proof on every single visit",
    description:
      "Before and after, every time. Not just when something looks off.",
  },
  {
    id: "readings",
    title: "Readings recorded, not eyeballed",
    description:
      "pH, chlorine, alkalinity — logged and tracked over time, so patterns show up before problems do.",
  },
  {
    id: "repairs",
    title: "Repairs quoted before any work starts",
    description:
      "You approve the price. No surprise invoices, ever.",
  },
];

export const AboutDifferentSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;
      if (prefersReducedMotion()) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          toggleActions: "restart none none reverse",
        },
      });

      if (imageRef.current) {
        tl.fromTo(
          imageRef.current,
          { opacity: 0, scale: 0.96, y: 25 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1.0,
            ease: "power3.out",
            force3D: true,
          },
          0
        );
      }

      if (contentRef.current) {
        const title = contentRef.current.querySelector(".diff-title");
        const subtitle = contentRef.current.querySelector(".diff-subtitle");
        const items = contentRef.current.querySelectorAll(".diff-item");

        if (title) {
          tl.fromTo(
            title,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.85,
              ease: "power3.out",
              force3D: true,
            },
            0.1
          );
        }

        if (subtitle) {
          tl.fromTo(
            subtitle,
            { opacity: 0, y: 16 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
              force3D: true,
            },
            0.18
          );
        }

        if (items && items.length > 0) {
          tl.fromTo(
            items,
            { opacity: 0, x: -16 },
            {
              opacity: 1,
              x: 0,
              duration: 0.8,
              stagger: 0.1,
              ease: "power3.out",
              force3D: true,
            },
            0.26
          );
        }
      }
    },
    { dependencies: [] }
  );

  return (
    <section ref={sectionRef} className="w-full py-16 md:py-24 bg-white overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left Column: Image */}
          <div ref={imageRef} className="lg:col-span-6">
            <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-lg border border-gray-100 bg-gray-50">
              <Image
                src={AllImages.ourStoryOne}
                alt="Pure Pool certified technician testing water chemistry"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
            </div>
          </div>

          {/* Right Column: Information & Key Differentiators */}
          <div ref={contentRef} className="lg:col-span-6 flex flex-col gap-6">
            <div>
              <h2 className="diff-title text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold text-gray-900 tracking-tight leading-tight">
                What makes Pure Pool different
              </h2>
              <p className="diff-subtitle text-[clamp(1rem,1.8vw,1.15rem)] font-medium text-gray-600 mt-2">
                Real accountability. Measured in photos, not promises.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:gap-5 mt-1">
              {DIFFERENT_ITEMS.map((item) => (
                <div
                  key={item.id}
                  className="diff-item border-l-4 border-sky-500 pl-4 sm:pl-5 py-1 flex flex-col gap-1 transition-all duration-200 hover:translate-x-1"
                >
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 font-normal leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default AboutDifferentSection;

