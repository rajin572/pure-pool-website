"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Container from "@/components/ui/CustomUi/Container";
import SectionHeading from "@/components/ui/CustomUi/SectionHeading";
import DownloadModal from "@/components/ui/CustomUi/Modal/DownloadModal";
import { AllImages } from "../../../public/images/AllImages";
import { Camera, Activity, CreditCard, FileText } from "lucide-react";
import { FaApple, FaGooglePlay } from "react-icons/fa6";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap-util";

interface AppFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const APP_FEATURES: AppFeature[] = [
  {
    id: "photos",
    title: "Before and after photos",
    description: "Every visit documented, so you can see the difference without leaving the house.",
    icon: Camera,
  },
  {
    id: "readings",
    title: "Water readings, tracked",
    description: "pH, chlorine and alkalinity recorded each week, with a chart showing how your pool holds up over time.",
    icon: Activity,
  },
  {
    id: "invoices",
    title: "Invoices and payments",
    description: "See what you owe and pay online. No paper, no chasing, no wondering what a charge was for.",
    icon: CreditCard,
  },
  {
    id: "documents",
    title: "All your documents in one place",
    description: "Warranties, certificates, equipment manuals and signed contracts, whenever you need them.",
    icon: FileText,
  },
];

export const PurePoolAppSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;
      const features = sectionRef.current.querySelectorAll(".app-feature-item");
      const downloadBtns = sectionRef.current.querySelector(".app-download-btns");

      if (features.length > 0) {
        gsap.fromTo(
          features,
          { opacity: 0, x: -20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 85%",
              toggleActions: "restart none none reverse",
            },
          }
        );
      }

      if (downloadBtns) {
        gsap.fromTo(
          downloadBtns,
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: "power2.out",
            scrollTrigger: {
              trigger: downloadBtns,
              start: "top 90%",
              toggleActions: "restart none none reverse",
            },
          }
        );
      }

      if (mockupRef.current) {
        gsap.fromTo(
          mockupRef.current,
          { opacity: 0, y: 35, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: mockupRef.current,
              start: "top 85%",
              toggleActions: "restart none none reverse",
            },
          }
        );

        gsap.to(mockupRef.current, {
          yPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        });
      }
    },
    { dependencies: [] }
  );

  return (
    <section ref={sectionRef} className="w-full py-20 md:py-28 bg-gradient-to-b from-[#f0f7ff] via-[#f7fbff] to-white overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left Column: App Benefits & Download Triggers */}
          <div className="lg:col-span-7 flex flex-col items-start gap-8">
            <SectionHeading
              align="left"
              maxWidth="max-w-xl"
              badge="The Pure Pool App"
              title="Know exactly what we did, every visit"
              description="Most pool companies leave a note on the gate. We give you the whole record — free with every maintenance plan."
            />

            {/* Feature List */}
            <div className="app-feature-list flex flex-col gap-6 w-full max-w-xl">
              {APP_FEATURES.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.id} className="app-feature-item flex items-start gap-4">
                    <div className="size-11 shrink-0 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-sm mt-0.5">
                      <Icon className="size-5" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug">
                        {feature.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Download Buttons Triggering DownloadModal */}
            <div className="app-download-btns flex flex-wrap items-center gap-4 pt-2">
              <DownloadModal>
                <div
                  className="flex items-center gap-3 px-5 py-3 rounded-xl bg-black text-white hover:bg-gray-900 shadow-md hover:scale-102 transition-all duration-200 cursor-pointer"
                >
                  <FaApple className="size-7 text-white shrink-0" />
                  <div className="flex flex-col items-start text-left leading-tight">
                    <span className="text-[10px] uppercase tracking-wider text-gray-300 font-medium">
                      Download on the
                    </span>
                    <span className="text-base font-bold text-white tracking-tight">
                      App Store
                    </span>
                  </div>
                </div>
              </DownloadModal>

              <DownloadModal>
                <div
                  className="flex items-center gap-3 px-5 py-3 rounded-xl bg-black text-white hover:bg-gray-900 shadow-md hover:scale-102 transition-all duration-200 cursor-pointer"
                >
                  <FaGooglePlay className="size-6 text-white shrink-0" />
                  <div className="flex flex-col items-start text-left leading-tight">
                    <span className="text-[10px] uppercase tracking-wider text-gray-300 font-medium">
                      GET IT ON
                    </span>
                    <span className="text-base font-bold text-white tracking-tight">
                      Google Play
                    </span>
                  </div>
                </div>
              </DownloadModal>
            </div>
          </div>

          {/* Right Column: Responsive App Mockup */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div ref={mockupRef} className="relative w-full max-w-[460px] aspect-[460/540] flex items-center justify-center will-change-transform">
              <Image
                src={AllImages.downloadMockup}
                alt="Pure Pool Smartphone App Preview"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-contain drop-shadow-2xl hover:scale-102 transition-transform duration-500"
                priority
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default PurePoolAppSection;

