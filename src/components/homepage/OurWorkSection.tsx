"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Container from "@/components/ui/CustomUi/Container";
import SectionHeading from "@/components/ui/CustomUi/SectionHeading";
import { AllImages } from "../../../public/images/AllImages";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap-util";

export const OurWorkSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!galleryRef.current) return;
      const cards = galleryRef.current.querySelectorAll(".work-card");
      if (!cards || cards.length === 0) return;

      gsap.fromTo(
        cards,
        { opacity: 0, y: 30, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.06,
          ease: "power2.out",
          scrollTrigger: {
            trigger: galleryRef.current,
            start: "top 85%",
            toggleActions: "restart none none reverse",
          },
        }
      );
    },
    { dependencies: [] }
  );

  return (
    <section ref={sectionRef} className="w-full py-20 md:py-28 bg-white overflow-hidden">
      <Container>
        {/* Section Heading */}
        <SectionHeading
          badge="Our Work"
          title="Pools currently in our care"
          description="A look at a few of the residential, community and hospitality pools we maintain across Madrid."
          className="mb-12 md:mb-16"
        />

        {/* Masonry Grid with Interactive Lightbox */}
        <PhotoProvider>
          <div ref={galleryRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
            {/* Column 1 */}
            <div className="flex flex-col gap-6 lg:gap-8">
              <PhotoView src={AllImages.pool1.src}>
                <div className="work-card group relative w-full aspect-[4/3] sm:aspect-square rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer bg-gray-100">
                  <Image
                    src={AllImages.pool1}
                    alt="Lush residential garden pool with palm trees in Madrid"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                    <span className="text-white text-sm font-semibold tracking-wide">
                      La Moraleja Residence
                    </span>
                  </div>
                </div>
              </PhotoView>

              <PhotoView src={AllImages.pool4.src}>
                <div className="work-card group relative w-full aspect-[4/3] sm:aspect-square rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer bg-gray-100">
                  <Image
                    src={AllImages.pool4}
                    alt="Private estate swimming pool surrounded by greenery"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                    <span className="text-white text-sm font-semibold tracking-wide">
                      Pozuelo Private Estate
                    </span>
                  </div>
                </div>
              </PhotoView>
            </div>

            {/* Column 2 */}
            <div className="flex flex-col gap-6 lg:gap-8">
              <PhotoView src={AllImages.pool2.src}>
                <div className="work-card group relative w-full aspect-[16/10] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer bg-gray-100">
                  <Image
                    src={AllImages.pool2}
                    alt="Panoramic natural landscape swimming pool"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                    <span className="text-white text-sm font-semibold tracking-wide">
                      Sierra de Madrid Villa
                    </span>
                  </div>
                </div>
              </PhotoView>

              <PhotoView src={AllImages.pool3.src}>
                <div className="work-card group relative w-full aspect-[16/10] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer bg-gray-100">
                  <Image
                    src={AllImages.pool3}
                    alt="Modern rooftop city skyline pool"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                    <span className="text-white text-sm font-semibold tracking-wide">
                      Salamanca Rooftop
                    </span>
                  </div>
                </div>
              </PhotoView>

              <PhotoView src={AllImages.pool5.src}>
                <div className="work-card group relative w-full aspect-[4/3] sm:aspect-square rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer bg-gray-100">
                  <Image
                    src={AllImages.pool5}
                    alt="Tropical resort styled lagoon pool with sun loungers"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                    <span className="text-white text-sm font-semibold tracking-wide">
                      Arturo Soria Residence
                    </span>
                  </div>
                </div>
              </PhotoView>
            </div>

            {/* Column 3 */}
            <div className="flex flex-col gap-6 lg:gap-8 md:col-span-2 lg:col-span-1">
              <PhotoView src={AllImages.pool6.src}>
                <div className="work-card group relative w-full aspect-[4/3] sm:aspect-square rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer bg-gray-100">
                  <Image
                    src={AllImages.pool6}
                    alt="Commercial hotel pool with clean blue tile"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                    <span className="text-white text-sm font-semibold tracking-wide">
                      Chamberí Hospitality Facility
                    </span>
                  </div>
                </div>
              </PhotoView>

              <PhotoView src={AllImages.myPool.src}>
                <div className="work-card group relative w-full aspect-[4/3] sm:aspect-square rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer bg-gray-100">
                  <Image
                    src={AllImages.myPool}
                    alt="Architectural pergola swimming pool with stepping stones"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                    <span className="text-white text-sm font-semibold tracking-wide">
                      Aravaca Community Pool
                    </span>
                  </div>
                </div>
              </PhotoView>
            </div>
          </div>
        </PhotoProvider>
      </Container>
    </section>
  );
};

export default OurWorkSection;

