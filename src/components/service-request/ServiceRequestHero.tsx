"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Container from "@/components/ui/CustomUi/Container";
import { AllImages } from "../../../public/images/AllImages";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap-util";

export const ServiceRequestHero: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;
      if (prefersReducedMotion()) return;

      if (bgRef.current) {
        gsap.fromTo(
          bgRef.current,
          { opacity: 0.5, scale: 1.12 },
          {
            opacity: 1,
            scale: 1.04,
            duration: 1.2,
            ease: "power3.out",
            force3D: true,
          }
        );

        gsap.to(bgRef.current, {
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      if (contentRef.current) {
        const badge = contentRef.current.querySelector(".hero-badge");
        const title = contentRef.current.querySelector(".hero-title");
        const desc = contentRef.current.querySelector(".hero-desc");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 90%",
            toggleActions: "restart none none reverse",
          },
        });

        if (badge) {
          tl.fromTo(
            badge,
            { opacity: 0, y: 14 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", force3D: true },
            0
          );
        }

        if (title) {
          tl.fromTo(
            title,
            { opacity: 0, y: 22 },
            { opacity: 1, y: 0, duration: 0.75, ease: "power3.out", force3D: true },
            0.08
          );
        }

        if (desc) {
          tl.fromTo(
            desc,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", force3D: true },
            0.18
          );
        }
      }
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-[380px] md:min-h-[440px] flex items-end pb-12 pt-32 sm:pt-36 overflow-hidden bg-slate-900"
    >
      {/* Dynamic Background Image with subtle parallax */}
      <div
        ref={bgRef}
        className="absolute inset-0 select-none will-change-transform scale-105 pointer-events-none"
      >
        <Image
          src={AllImages.pool6}
          alt="Pure Pool service requests and emergency intervention"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center pointer-events-none"
        />
        {/* Cinematic Backdrop Overlays */}
        <div className="absolute inset-0 bg-black/50 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />
      </div>

      <Container className="relative z-10 w-full">
        <div ref={contentRef} className="flex flex-col gap-3 max-w-3xl">
          {/* Badge Pill */}
          <div className="hero-badge flex items-center">
            <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs sm:text-sm font-semibold text-white/95 bg-white/15 backdrop-blur-md border border-white/20 shadow-xs">
              24/7 Madrid Dispatch & Support
            </span>
          </div>

          {/* Title */}
          <h1 className="hero-title text-[clamp(2.25rem,4.5vw,3.5rem)] font-bold text-white tracking-tight leading-[1.15]">
            Service Requests
          </h1>

          {/* Subtitle */}
          <p className="hero-desc text-base sm:text-lg text-white/85 font-normal leading-relaxed max-w-2xl">
            File maintenance tickets, schedule specialist inspections, review active dispatches,
            or reach our rapid response unit for urgent pool emergencies.
          </p>
        </div>
      </Container>
    </section>
  );
};

export default ServiceRequestHero;
