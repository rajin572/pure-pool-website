"use client";

import React from "react";
import Link from "next/link";
import { LifeBuoy } from "lucide-react";

export interface NeedAHandCardProps {
  supportHref?: string;
}

export const NeedAHandCard: React.FC<NeedAHandCardProps> = ({
  supportHref = "/contact",
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200/90 shadow-xs space-y-4">
      <h3 className="text-lg font-bold text-zinc-900 font-['Onest'] leading-6">
        Need a hand?
      </h3>

      <p className="text-zinc-600 text-sm sm:text-base font-medium font-['Onest'] leading-relaxed">
        Something here can&apos;t be edited, or the address has changed entirely?
        Send us a note and we&apos;ll sort it before your next visit.
      </p>

      <div>
        <Link
          href={supportHref}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm sm:text-base font-['Onest'] group transition-colors"
        >
          <LifeBuoy className="size-5 text-blue-600 group-hover:rotate-45 transition-transform duration-300" />
          <span>Contact support</span>
        </Link>
      </div>
    </div>
  );
};

export default NeedAHandCard;

