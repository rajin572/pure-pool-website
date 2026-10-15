"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { AllImages } from "@/../public/images/AllImages";
import { ShieldCheck, Sparkles, Check, Clock, Phone, FileText, Camera } from "lucide-react";

export type AuthPanelVariant = "register" | "login" | "forgot" | "reset-success";

interface PanelItem {
  number?: string;
  icon?: React.ReactNode;
  title: string;
  desc: string;
}

interface AuthLeftPanelProps {
  variant?: AuthPanelVariant;
  customTitle?: string;
  customSubtitle?: string;
}

export const AuthLeftPanel: React.FC<AuthLeftPanelProps> = ({
  variant = "register",
  customTitle,
  customSubtitle,
}) => {
  const getContent = (): {
    title: string;
    subtitle: string;
    category: string;
    items: PanelItem[];
  } => {
    switch (variant) {
      case "login":
        return {
          title: customTitle || "Welcome back.",
          subtitle:
            customSubtitle ||
            "Your pool's status, visit history and every invoice — all in one place.",
          category: "WHAT'S WAITING FOR YOU",
          items: [
            {
              icon: <Clock className="w-4 h-4 text-white" />,
              title: "Your next visit",
              desc: "See who's coming and exactly when.",
            },
            {
              icon: <Camera className="w-4 h-4 text-white" />,
              title: "Every water reading",
              desc: "Chemistry logged and photographed each visit.",
            },
            {
              icon: <FileText className="w-4 h-4 text-white" />,
              title: "Invoices and quotes",
              desc: "Review, approve and pay in one place.",
            },
          ],
        };
      case "forgot":
        return {
          title: customTitle || "Let's get you back in.",
          subtitle:
            customSubtitle ||
            "A quick code check and you'll be back to your pool in under a minute.",
          category: "HOW THIS WORKS",
          items: [
            {
              icon: <ShieldCheck className="w-4 h-4 text-white" />,
              title: "Secure one-time code",
              desc: "Six digits, tied to your account only.",
            },
            {
              icon: <Clock className="w-4 h-4 text-white" />,
              title: "Expires in 10 minutes",
              desc: "Request a fresh one whenever you need.",
            },
            {
              icon: <Phone className="w-4 h-4 text-white" />,
              title: "Still stuck?",
              desc: "Call us on +34 910 882 140, 9am–7pm.",
            },
          ],
        };
      case "reset-success":
        return {
          title: customTitle || "You're all set.",
          subtitle:
            customSubtitle ||
            "Your account is secured with the new password. Nothing else to do.",
          category: "GOOD TO KNOW",
          items: [
            {
              icon: <ShieldCheck className="w-4 h-4 text-white" />,
              title: "Signed out everywhere",
              desc: "Other devices will ask for the new password.",
            },
            {
              icon: <Check className="w-4 h-4 text-white" />,
              title: "Nothing else changed",
              desc: "Your pool, visits and invoices are untouched.",
            },
            {
              icon: <Sparkles className="w-4 h-4 text-white" />,
              title: "Keep it safe",
              desc: "Never share your credentials with anyone.",
            },
          ],
        };
      case "register":
      default:
        return {
          title: customTitle || "Let's get your pool set up.",
          subtitle:
            customSubtitle ||
            "Join 400+ pool owners across Madrid who stopped wondering whether anyone actually showed up.",
          category: "WHAT HAPPENS NEXT",
          items: [
            {
              number: "1",
              title: "Tell us about your pool",
              desc: "Five short steps. About three minutes.",
            },
            {
              number: "2",
              title: "We visit and set things up",
              desc: "Your technician records the equipment on site.",
            },
            {
              number: "3",
              title: "We take it from there",
              desc: "Same technician, same day, photos every visit.",
            },
          ],
        };
    }
  };

  const content = getContent();

  return (
    <aside className="w-full lg:w-[480px] xl:w-[540px] 2xl:w-[560px] hidden lg:flex p-8 sm:p-12 xl:p-14 relative bg-gradient-to-b from-cyan-400 via-sky-600 via-55% to-blue-800 text-white flex-col justify-between items-start overflow-hidden shrink-0 shadow-2xl">
      {/* Decorative backdrop light circles */}
      <div className="size-96 -left-28 top-[650px] absolute rounded-full border-[1.5px] border-white/20 pointer-events-none" />
      <div className="size-72 right-[-60px] -top-24 absolute rounded-full border-[1.5px] border-white/20 pointer-events-none" />

      {/* Brand Logo */}
      <div className="relative z-10 w-full mb-8 lg:mb-12">
        <Link href="/" className="inline-block hover:opacity-90 transition-opacity">
          <Image
            src={AllImages.logoSecondary}
            alt="Pure Pool Madrid"
            width={140}
            height={50}
            className="w-28 sm:w-32 h-auto object-contain"
            priority
          />
        </Link>
      </div>

      {/* Main Copy & Feature Flow */}
      <div className="relative z-10 w-full flex flex-col justify-start items-start gap-6 sm:gap-8 my-auto py-4">
        <div className="flex flex-col gap-3">
          <h1 className="text-white text-3xl sm:text-4xl xl:text-5xl font-bold font-['Onest'] leading-tight tracking-tight">
            {content.title}
          </h1>
          <p className="text-white/85 text-sm sm:text-base font-medium font-['Onest'] leading-relaxed max-w-md">
            {content.subtitle}
          </p>
        </div>

        <div className="text-white/60 text-xs font-bold font-['Onest'] tracking-wider uppercase">
          {content.category}
        </div>

        <div className="w-full flex flex-col gap-4 sm:gap-5">
          {content.items.map((item, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="size-9 bg-white/20 rounded-2xl outline outline-1 outline-offset-[-1px] outline-white/30 flex items-center justify-center shrink-0 text-white font-bold text-sm shadow-sm">
                {item.number ? item.number : item.icon}
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-white text-sm sm:text-base font-semibold font-['Onest'] leading-snug">
                  {item.title}
                </span>
                <span className="text-white/75 text-xs sm:text-sm font-medium font-['Onest'] leading-relaxed">
                  {item.desc}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Proof Pool Image */}
      <div className="relative z-10 w-full mt-8 lg:mt-12">
        <div className="relative w-full h-36 sm:h-44 rounded-2xl overflow-hidden border border-white/30 shadow-xl group">
          <Image
            src={AllImages.myPool}
            alt="Pure Pool Madrid luxury maintenance"
            fill
            sizes="(max-width: 1024px) 100vw, 480px"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white/90">
            <span className="font-semibold flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              Verified Madrid Care
            </span>
            <span className="text-white/70">400+ Active Pools</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AuthLeftPanel;
