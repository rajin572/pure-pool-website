"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/CustomUi/Container";
import SectionHeading from "@/components/ui/CustomUi/SectionHeading";
import { AllImages } from "../../../public/images/AllImages";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap-util";

interface GetStartedSectionProps {
  onOpenQuoteModal?: () => void;
}

export const GetStartedSection: React.FC<GetStartedSectionProps> = ({
  onOpenQuoteModal,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current || !bgRef.current) return;

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
            start: "top 85%",
            toggleActions: "restart none none reverse",
          },
        }
      );

      gsap.to(bgRef.current, {
        yPercent: 14,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative w-full py-24 md:py-32 overflow-hidden flex items-center justify-center">
      {/* Background Image with Vibrant Blue Water Tone */}
      <div ref={bgRef} className="absolute inset-0 -z-10 select-none scale-105 will-change-transform">
        <Image
          src={AllImages.requestQuoteBackground}
          alt="Luxury Madrid swimming pool reflection"
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-700/80 via-blue-600/75 to-sky-700/80 mix-blend-multiply" />
        <div className="absolute inset-0 bg-black/25" />
      </div>

      <Container className="relative z-10 text-center flex flex-col items-center">
        <SectionHeading
          variant="light"
          maxWidth="max-w-3xl"
          badge="Get Started"
          badgeClassName="tracking-widest"
          title={<>Let&apos;s take a look at your pool</>}
          titleClassName="text-[clamp(2rem,5vw,3.25rem)]"
          description={<>Send us a few details and we&apos;ll come back with a fixed monthly price. No obligation, and no charge for the first assessment.</>}
          descriptionClassName="text-[clamp(1rem,2vw,1.15rem)] max-w-2xl mx-auto"
          className="gap-3 sm:gap-4"
        >
          <div className="pt-4">
            {onOpenQuoteModal ? (
              <button
                type="button"
                onClick={onOpenQuoteModal}
                className="px-8 py-3.5 bg-white text-gray-900 rounded-xl font-semibold text-base sm:text-lg shadow-xl hover:bg-white/95 hover:scale-102 transition-all duration-200 active:scale-98 cursor-pointer inline-block"
              >
                Request a quote
              </button>
            ) : (
              <Link
                href="/contact"
                className="px-8 py-3.5 bg-white text-gray-900 rounded-xl font-semibold text-base sm:text-lg shadow-xl hover:bg-white/95 hover:scale-102 transition-all duration-200 active:scale-98 cursor-pointer inline-block"
              >
                Request a quote
              </Link>
            )}
          </div>
        </SectionHeading>
      </Container>
    </section>
  );
};

export default GetStartedSection;

