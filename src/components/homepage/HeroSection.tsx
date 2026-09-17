"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Container from "@/components/ui/CustomUi/Container";
import SectionHeading from "@/components/ui/CustomUi/SectionHeading";
import ReusableGradientButton from "@/components/ui/CustomUi/ReusableGradientButton";
import { AllImages } from "../../../public/images/AllImages";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap-util";

interface HeroSectionProps {
  onOpenQuoteModal?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenQuoteModal }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      if (bgRef.current) {
        gsap.fromTo(
          bgRef.current,
          { opacity: 0.3, scale: 1.15 },
          {
            opacity: 1,
            scale: 1.05,
            duration: 1.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 95%",
              toggleActions: "restart none none reverse",
            },
          }
        );

        gsap.to(bgRef.current, {
          yPercent: 16,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    },
    { scope: sectionRef }
  );
  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Dynamic Background Image with subtle parallax */}
      <div ref={bgRef} className="absolute inset-0 -z-10 select-none will-change-transform scale-105">
        <Image
          src={AllImages.heroBackground}
          alt="Luxury swimming pool maintained by Pure Pool Madrid"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Cinematic Backdrop Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/40 to-black/65" />
      </div>

      <Container className="relative z-10 pt-36 pb-20 md:pt-44 md:pb-28 flex flex-col items-center text-center">
        <SectionHeading
          variant="light"
          titleAs="h1"
          maxWidth="max-w-4xl"
          title="Pool Care You Can Actually See"
          titleClassName="text-[clamp(2.25rem,6vw,4.5rem)] leading-[1.08]"
          description={<>Every visit comes with dated photos and water readings, handled by the same certified technician, week after week. No surprises, no guesswork — just a pool that&apos;s always ready.</>}
          descriptionClassName="text-[clamp(1rem,2vw,1.25rem)] font-medium max-w-3xl leading-relaxed sm:leading-8"
          className="gap-5 sm:gap-6"
        >
          <div className="pt-3">
            {onOpenQuoteModal ? (
              <ReusableGradientButton
                type="button"
                onClick={onOpenQuoteModal}
                size="lg"
                className="px-8 py-4 text-base sm:text-lg font-bold rounded-2xl shadow-xl hover:scale-102 transition-transform duration-200"
              >
                Get a free quote
              </ReusableGradientButton>
            ) : (
              <ReusableGradientButton
                type="redirect"
                href="/contact"
                size="lg"
                className="px-8 py-4 text-base sm:text-lg font-bold rounded-2xl shadow-xl hover:scale-102 transition-transform duration-200"
              >
                Get a free quote
              </ReusableGradientButton>
            )}
          </div>
        </SectionHeading>
      </Container>
    </section>
  );
};

export default HeroSection;

