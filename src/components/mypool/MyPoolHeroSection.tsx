"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Container from "@/components/ui/CustomUi/Container";
import { AllImages } from "../../../public/images/AllImages";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap-util";
import { cn } from "@/lib/utils";
import type { IPoolSummary } from "@/service/MyPoolService/MyPoolServiceApi";

const STATUS_LABEL: Record<string, string> = {
  DRAFT: "Draft",
  PENDING_VERIFICATION: "Pending verification",
  VERIFIED: "Verified",
  ACTIVE: "Active",
  ARCHIVED: "Archived",
};

interface MyPoolHeroSectionProps {
  pools: IPoolSummary[];
  selectedPoolId: string;
  onSelectPool: (id: string) => void;
}

export const MyPoolHeroSection: React.FC<MyPoolHeroSectionProps> = ({
  pools,
  selectedPoolId,
  onSelectPool,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const currentPool = pools.find((p) => p._id === selectedPoolId) || pools[0];
  const property = currentPool && typeof currentPool.propertyId === "object" ? currentPool.propertyId : null;

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

      if (pills) tl.fromTo(pills, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.65, ease: "power3.out", force3D: true }, 0);
      if (badge) tl.fromTo(badge, { opacity: 0, scale: 0.9, y: 14 }, { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "power3.out", force3D: true }, 0.08);
      if (title) tl.fromTo(title, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", force3D: true }, 0.14);
      if (address) tl.fromTo(address, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", force3D: true }, 0.22);
    },
    { dependencies: [selectedPoolId] }
  );

  if (!currentPool) return null;

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-[460px] md:min-h-[520px] flex items-end pb-12 pt-28 overflow-hidden bg-slate-900"
    >
      <Image
        src={AllImages.myPool}
        alt="My Pool resort pool setup"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center pointer-events-none"
      />

      <div className="absolute inset-0 bg-black/50 pointer-events-none" />

      <Container className="relative z-10 w-full">
        <div ref={contentRef} className="flex flex-col gap-4 max-w-3xl">
          {pools.length > 1 && (
            <div className="pool-pills flex flex-wrap items-center gap-2">
              {pools.map((pool) => {
                const isActive = pool._id === currentPool._id;
                return (
                  <button
                    key={pool._id}
                    type="button"
                    onClick={() => onSelectPool(pool._id)}
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
          )}

          <div className="pool-status-badge flex items-center pt-2">
            <span className="inline-flex items-center px-3.5 py-1 rounded-lg text-sm font-bold text-white bg-emerald-500 shadow-md backdrop-blur-sm">
              {STATUS_LABEL[currentPool.status] || currentPool.status}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <h1 className="pool-title text-[clamp(2.25rem,4.5vw,3.5rem)] font-bold text-white tracking-tight leading-tight">
              {currentPool.name}
            </h1>
            <p className="pool-address text-base sm:text-lg text-white/90 font-medium leading-relaxed">
              {property ? [property.address, property.city].filter(Boolean).join(", ") : "Address not set"}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default MyPoolHeroSection;
