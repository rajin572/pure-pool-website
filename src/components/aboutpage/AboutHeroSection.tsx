"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Container from "@/components/ui/CustomUi/Container";
import { AllImages } from "../../../public/images/AllImages";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap-util";

export const AboutHeroSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const textGroupRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;
      if (prefersReducedMotion()) return;

      if (bgRef.current) {
        gsap.fromTo(
          bgRef.current,
          { opacity: 0.35, scale: 1.14 },
          {
            opacity: 1,
            scale: 1.05,
            duration: 1.3,
            ease: "power3.out",
            force3D: true,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 95%",
              toggleActions: "restart none none reverse",
            },
          }
        );

        gsap.to(bgRef.current, {
          yPercent: 15,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      if (titleRef.current && descRef.current) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 90%",
            toggleActions: "restart none none reverse",
          },
        });

        tl.fromTo(
          titleRef.current,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.95,
            ease: "power3.out",
            force3D: true,
          },
          0
        ).fromTo(
          descRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: "power3.out",
            force3D: true,
          },
          0.15
        );
      }
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-[520px] md:min-h-[580px] lg:min-h-[640px] flex items-center justify-center overflow-hidden"
    >
      {/* Dynamic Background Image with subtle parallax */}
      <div
        ref={bgRef}
        className="absolute inset-0 -z-10 select-none will-change-transform scale-105"
      >
        <Image
          src={AllImages.aboutUsHeroBanner}
          alt="Luxury swimming pool in Madrid - Pure Pool"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Cinematic Backdrop Overlays */}
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60" />
      </div>

      <Container className="relative z-10 pt-36 pb-20 md:pt-44 md:pb-28 flex flex-col items-center text-center">
        <div ref={textGroupRef} className="max-w-4xl flex flex-col items-center gap-5 sm:gap-6">
          <h1
            ref={titleRef}
            className="text-[clamp(2.25rem,5.5vw,4.25rem)] font-bold text-white tracking-tight leading-[1.12]"
          >
            We look after your pool like it&apos;s our own
          </h1>
          <p
            ref={descRef}
            className="text-[clamp(1.05rem,1.8vw,1.35rem)] text-white/90 font-normal leading-relaxed max-w-3xl"
          >
            Founded in Madrid in 2014, Pure Pool has grown from one technician with a
            van to a team covering the whole city — without losing the habit of
            showing up.
          </p>
        </div>
      </Container>
    </section>
  );
};

export default AboutHeroSection;

