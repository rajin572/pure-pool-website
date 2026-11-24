"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Container from "@/components/ui/CustomUi/Container";
import { getContracts, type ContractRecord } from "@/service/ContractsService/ContractsServiceApi";

const STATUS_BADGE: Record<string, string> = {
  AWAITING_SIGNATURE: "text-amber-700 bg-amber-50 border border-amber-300",
  SIGNED: "text-emerald-700 bg-emerald-50 border border-emerald-300",
  ACTIVE: "text-emerald-700 bg-emerald-50 border border-emerald-300",
  ENDING_SOON: "text-amber-700 bg-amber-50 border border-amber-300",
  EXPIRED: "text-red-700 bg-red-50 border border-red-200",
  CANCELLED: "text-red-700 bg-red-50 border border-red-200",
  DRAFT: "text-gray-700 bg-gray-100 border border-gray-300",
};

const STATUS_LABEL: Record<string, string> = {
  AWAITING_SIGNATURE: "Awaiting your signature",
  SIGNED: "Signed",
  ACTIVE: "Active",
  ENDING_SOON: "Ending soon",
  EXPIRED: "Expired",
  CANCELLED: "Cancelled",
  DRAFT: "Draft",
};

export const ContractsClient: React.FC = () => {
  const [contracts, setContracts] = useState<ContractRecord[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await getContracts();
      if (cancelled) return;
      if (res.success) setContracts(res.data);
      else setLoadError(res.error.message);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="w-full min-h-screen bg-[#F9FAFB] flex flex-col">
      <div className="w-full bg-[#041D37] h-20 sm:h-24 shadow-xs" />

      <div className="w-full py-10 md:py-14">
        <Container>
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-zinc-900 text-2xl sm:text-3xl font-bold tracking-tight">My Contracts</h1>
              <p className="text-zinc-600 text-sm sm:text-base font-medium mt-1">Your maintenance plan agreements and renewals.</p>
            </div>

            {!contracts ? (
              <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs py-16 text-center text-sm text-gray-500">Loading your contracts...</div>
            ) : loadError ? (
              <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs py-16 text-center text-sm text-red-600">{loadError}</div>
            ) : contracts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs py-16 text-center text-sm text-gray-500">No contracts yet.</div>
            ) : (
              <div className="flex flex-col gap-3">
                {contracts.map((c) => (
                  <Link
                    key={c._id}
                    href={`/contracts/${c._id}`}
                    className="w-full p-5 bg-white rounded-2xl border border-gray-200/90 flex items-center justify-between gap-4 hover:border-blue-200 hover:shadow-xs transition-all"
                  >
                    <div>
                      <div className="text-zinc-900 font-semibold text-base">{c.number || c._id}</div>
                      <div className="text-zinc-500 text-sm mt-0.5">
                        {typeof c.planId === "object" && c.planId ? c.planId.name : "—"} · €{c.lockedPrice.toLocaleString()}/year
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold shrink-0 ${STATUS_BADGE[c.displayStatus] || STATUS_BADGE.DRAFT}`}>
                      {STATUS_LABEL[c.displayStatus] || c.displayStatus}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </Container>
      </div>
    </main>
  );
};

export default ContractsClient;
