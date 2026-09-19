"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Container from "@/components/ui/CustomUi/Container";
import { AllImages } from "../../../public/images/AllImages";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap-util";

const STANDARD_ITEMS = [
  "A fixed checklist followed on every visit, no shortcuts",
  "Chemistry tested and logged before any chemical is added",
  "Equipment checked for wear, not just switched on and off",
  "Every visit reviewed by our office before you see it",
  "Full history kept for the life of your pool",
];

export const AboutStandardSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

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

      if (contentRef.current) {
        const title = contentRef.current.querySelector(".standard-title");
        const subtitle = contentRef.current.querySelector(".standard-subtitle");
        const items = contentRef.current.querySelectorAll(".standard-item");

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
            0
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
            0.1
          );
        }

        if (items && items.length > 0) {
          tl.fromTo(
            items,
            { opacity: 0, x: -16 },
            {
              opacity: 1,
              x: 0,
              duration: 0.75,
              stagger: 0.08,
              ease: "power3.out",
              force3D: true,
            },
            0.2
          );
        }
      }

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
          0.1
        );
      }
    },
    { dependencies: [] }
  );

  return (
    <section ref={sectionRef} className="w-full py-16 md:py-24 bg-white overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left Column: Information & Standards Checklist */}
          <div ref={contentRef} className="lg:col-span-6 flex flex-col gap-6 order-2 lg:order-1">
            <div>
              <h2 className="standard-title text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold text-gray-900 tracking-tight leading-tight">
                The Pure Pool Maintenance Standard
              </h2>
              <p className="standard-subtitle text-[clamp(1rem,1.8vw,1.15rem)] font-medium text-gray-600 mt-2">
                Built around one question: would we be happy if this were our own pool?
              </p>
            </div>

            <div className="flex flex-col gap-3.5 sm:gap-4 mt-1">
              {STANDARD_ITEMS.map((item, index) => (
                <div
                  key={index}
                  className="standard-item flex items-center gap-3.5 group"
                >
                  <div className="size-3 rounded-full bg-sky-500 shrink-0 group-hover:scale-125 transition-transform duration-200" />
                  <span className="text-sm sm:text-base text-gray-800 font-medium leading-relaxed">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Image */}
          <div ref={imageRef} className="lg:col-span-6 order-1 lg:order-2">
            <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-lg border border-gray-100 bg-gray-50">
              <Image
                src={AllImages.ourStoryTwo}
                alt="Luxury resort swimming pool maintained to Pure Pool standards"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default AboutStandardSection;

