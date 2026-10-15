"use client";

import React from "react";
import { Phone, MessageCircle, Mail } from "lucide-react";
import { EMERGENCY_INFO } from "@/service/HelpCenterService/HelpCenterServiceApi";

export const ContactMethodsGrid: React.FC = () => {
  const methods = [
    {
      title: "Customer Service",
      detail: EMERGENCY_INFO.customerServiceDisplay,
      subtitle: EMERGENCY_INFO.customerServiceHours,
      href: `tel:${EMERGENCY_INFO.customerService}`,
      buttonText: "Call now",
      icon: Phone,
      iconBg: "bg-sky-50 text-sky-600 border border-sky-100",
      btnBg: "bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-800",
    },
    {
      title: "WhatsApp Support",
      detail: EMERGENCY_INFO.whatsappDisplay,
      subtitle: "Fastest response for photos, water test logs & quick questions.",
      href: `https://wa.me/${EMERGENCY_INFO.whatsapp.replace(/\+/g, "")}`,
      buttonText: "Chat on WhatsApp",
      icon: MessageCircle,
      iconBg: "bg-emerald-50 text-emerald-600 border border-emerald-100",
      btnBg: "bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-600",
    },
    {
      title: "Email Us",
      detail: EMERGENCY_INFO.email,
      subtitle: "Detailed inquiries and documentation. We reply within 2 hours.",
      href: `mailto:${EMERGENCY_INFO.email}`,
      buttonText: "Send email",
      icon: Mail,
      iconBg: "bg-blue-50 text-blue-600 border border-blue-100",
      btnBg: "bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-800",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 w-full">
      {methods.map((method, idx) => {
        const IconComponent = method.icon;
        return (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-zinc-200/90 p-5 sm:p-6 flex flex-col justify-between gap-5 shadow-2xs hover:shadow-xs hover:border-zinc-300 transition-all"
          >
            <div className="flex flex-col gap-3">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${method.iconBg}`}
              >
                <IconComponent className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-zinc-900 text-base sm:text-lg">
                  {method.title}
                </h3>
                <p className="text-sm font-semibold text-sky-700 mt-0.5">
                  {method.detail}
                </p>
                <p className="text-xs sm:text-sm text-zinc-500 font-medium mt-1 leading-relaxed">
                  {method.subtitle}
                </p>
              </div>
            </div>

            <a
              href={method.href}
              target={method.href.startsWith("http") ? "_blank" : undefined}
              rel={method.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className={`w-full h-11 px-4 rounded-xl text-sm font-semibold inline-flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs ${method.btnBg}`}
            >
              <span>{method.buttonText}</span>
            </a>
          </div>
        );
      })}
    </div>
  );
};

export default ContactMethodsGrid;

