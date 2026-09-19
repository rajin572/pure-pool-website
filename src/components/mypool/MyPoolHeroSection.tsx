"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Container from "@/components/ui/CustomUi/Container";
import { AllImages } from "../../../public/images/AllImages";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap-util";
import { cn } from "@/lib/utils";

export interface PoolOption {
  id: string;
  name: string;
  address: string;
  status: string;
}

export const POOL_OPTIONS: PoolOption[] = [
  {
    id: "main",
    name: "Main Residence Pool",
    address: "Calle de Alcalá 125, 28009 Madrid, Spain",
    status: "Water Balanced",
  },
  {
    id: "garden",
    name: "Garden Pool",
    address: "Calle de Velázquez 94, 28006 Madrid, Spain",
    status: "Water Balanced",
  },
  {
    id: "paseo",
    name: "Paseo de la Habana Pool",
    address: "Paseo de la Habana 45, 28036 Madrid, Spain",
    status: "Inspection Scheduled",
  },
];

interface MyPoolHeroSectionProps {
  selectedPoolId: string;
  onSelectPool: (id: string) => void;
}

export const MyPoolHeroSection: React.FC<MyPoolHeroSectionProps> = ({
  selectedPoolId,
  onSelectPool,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const currentPool =
    POOL_OPTIONS.find((p) => p.id === selectedPoolId) || POOL_OPTIONS[0];

  useGSAP(
    () => {
      if (!sectionRef.current || !contentRef.current) return;
      if (prefersReducedMotion()) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 90%",
          toggleActions: "restart none none reverse",
        },
      });

      const pills = contentRef.current.querySelector(".pool-pills");
      const badge = contentRef.current.querySelector(".pool-status-badge");
      const title = contentRef.current.querySelector(".pool-title");
      const address = contentRef.current.querySelector(".pool-address");

      if (pills) {
        tl.fromTo(
          pills,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.65, ease: "power3.out", force3D: true },
          0
        );
      }

      if (badge) {
        tl.fromTo(
          badge,
          { opacity: 0, scale: 0.9, y: 14 },
          { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "power3.out", force3D: true },
          0.08
        );
      }

      if (title) {
        tl.fromTo(
          title,
          { opacity: 0, y: 22 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", force3D: true },
          0.14
        );
      }

      if (address) {
        tl.fromTo(
          address,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", force3D: true },
          0.22
        );
      }
    },
    { dependencies: [] }
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-[460px] md:min-h-[520px] flex items-end pb-12 pt-28 overflow-hidden bg-slate-900"
    >
      {/* Background Image */}
      <Image
        src={AllImages.myPool}
        alt="My Pool resort pool setup"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center pointer-events-none"
      />

      {/* Cinematic Dark Overlay */}
      <div className="absolute inset-0 bg-black/50 pointer-events-none" />

      {/* Hero Content */}
      <Container className="relative z-10 w-full">
        <div ref={contentRef} className="flex flex-col gap-4 max-w-3xl">
          {/* Pool Switcher Pills */}
          <div className="pool-pills flex flex-wrap items-center gap-2">
            {POOL_OPTIONS.map((pool) => {
              const isActive = pool.id === currentPool.id;
              return (
                <button
                  key={pool.id}
                  type="button"
                  onClick={() => onSelectPool(pool.id)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 cursor-pointer",
                    isActive
                      ? "bg-white text-sky-700 shadow-md scale-[1.02]"
                      : "bg-zinc-900/75 hover:bg-zinc-900/90 text-white backdrop-blur-sm"
                  )}
                >
                  {pool.name}
                </button>
              );
            })}
          </div>

          {/* Status Badge */}
          <div className="pool-status-badge flex items-center pt-2">
            <span className="inline-flex items-center px-3.5 py-1 rounded-lg text-sm font-bold text-white bg-emerald-500 shadow-md backdrop-blur-sm">
              {currentPool.status}
            </span>
          </div>

          {/* Pool Name and Address */}
          <div className="flex flex-col gap-1">
            <h1 className="pool-title text-[clamp(2.25rem,4.5vw,3.5rem)] font-bold text-white tracking-tight leading-tight">
              {currentPool.name}
            </h1>
            <p className="pool-address text-base sm:text-lg text-white/90 font-medium leading-relaxed">
              {currentPool.address}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default MyPoolHeroSection;

