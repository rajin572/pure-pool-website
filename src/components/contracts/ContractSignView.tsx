"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, Download } from "lucide-react";
import Container from "@/components/ui/CustomUi/Container";
import { getContractDetail, signContract, type ContractRecord } from "@/service/ContractsService/ContractsServiceApi";
import { downloadPdf } from "@/lib/apiFiles";

interface Props {
  contractId: string;
}

export const ContractSignView: React.FC<Props> = ({ contractId }) => {
  const router = useRouter();
  const [contract, setContract] = useState<ContractRecord | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [agree, setAgree] = useState(false);
  const [signerName, setSignerName] = useState("");
  const [signerTitle, setSignerTitle] = useState("");
  const [signing, setSigning] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await getContractDetail(contractId);
      if (cancelled) return;
      if (res.success) setContract(res.data);
      else setLoadError(res.error.message);
    })();
    return () => {
      cancelled = true;
    };
  }, [contractId]);

  if (loadError) {
    return <div className="w-full min-h-screen flex items-center justify-center text-sm text-red-600">{loadError}</div>;
  }

  if (!contract) {
    return <div className="w-full min-h-screen flex items-center justify-center text-sm text-gray-500">Loading contract...</div>;
  }

  const plan = typeof contract.planId === "object" ? contract.planId : null;
  const canSign = contract.status === "AWAITING_SIGNATURE";

  const handleSign = async () => {
    if (!agree || !signerName.trim()) {
      toast.error("Please confirm your agreement and enter your full name.");
      return;
    }
    setSigning(true);
    const res = await signContract(contract._id, signerName.trim(), signerTitle.trim() || undefined);
    setSigning(false);
    if (!res.success) {
      toast.error(res.error.message);
      return;
    }
    toast.success("Contract signed! Your invoice is ready.");
    router.push("/invoices");
  };

  const handleDownloadPdf = async () => {
    setDownloading(true);
    try {
      await downloadPdf(`/contracts/${contract._id}/pdf`, { fileName: `${contract.number || contract._id}.pdf` });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not download the PDF");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <main className="w-full min-h-screen bg-[#F9FAFB] flex flex-col">
      <div className="w-full bg-[#041D37] h-20 sm:h-24 shadow-xs" />

      <div className="w-full py-10 md:py-14">
        <Container>
          <div className="max-w-2xl mx-auto flex flex-col gap-6">
            <div>
              <h1 className="text-zinc-900 text-2xl sm:text-3xl font-bold tracking-tight">Contract {contract.number || contract._id}</h1>
              <p className="text-zinc-600 text-sm sm:text-base font-medium mt-1">
                {plan?.name || "—"} plan · €{contract.lockedPrice.toLocaleString()}/year
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-4 shadow-2xs">
              <h2 className="text-zinc-900 text-lg font-bold">What&apos;s included</h2>
              {plan?.inclusions?.length ? (
                <div className="flex flex-col gap-2.5">
                  {plan.inclusions.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Check className="size-4 text-emerald-600 shrink-0" />
                      <span className="text-sm text-zinc-800">{item}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-zinc-500">No inclusions recorded.</p>
              )}

              <div className="h-px bg-gray-200" />

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-zinc-500">Visits per year</div>
                  <div className="text-zinc-900 font-semibold mt-0.5">{contract.visitsIncluded ?? plan?.visitsPerYear ?? "—"}</div>
                </div>
                <div>
                  <div className="text-zinc-500">Term</div>
                  <div className="text-zinc-900 font-semibold mt-0.5">
                    {contract.startsAt ? new Date(contract.startsAt).toLocaleDateString() : "—"} – {contract.endsAt ? new Date(contract.endsAt).toLocaleDateString() : "—"}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={downloading}
                className="w-fit flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-semibold cursor-pointer disabled:opacity-60"
              >
                <Download className="w-4 h-4" />
                {downloading ? "Preparing PDF…" : "Download contract PDF"}
              </button>
            </div>

            {canSign ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-4 shadow-2xs">
                <h2 className="text-zinc-900 text-lg font-bold">Sign to confirm</h2>

                <div className="flex flex-col gap-3">
                  <input
                    type="text"
                    value={signerName}
                    onChange={(e) => setSignerName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full h-11 px-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-500"
                  />
                  <input
                    type="text"
                    value={signerTitle}
                    onChange={(e) => setSignerTitle(e.target.value)}
                    placeholder="Title (optional, e.g. Owner)"
                    className="w-full h-11 px-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-500"
                  />
                  <label className="flex items-start gap-2.5 text-sm text-zinc-700 cursor-pointer">
                    <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5" />
                    <span>I agree to the terms of this contract and authorize Pure Pool to invoice me accordingly.</span>
                  </label>
                </div>

                <button
                  type="button"
                  onClick={handleSign}
                  disabled={signing}
                  className="w-full py-4 bg-gradient-to-br from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white text-base font-bold rounded-2xl shadow-sm transition-all cursor-pointer disabled:opacity-60"
                >
                  {signing ? "Signing..." : "Sign contract"}
                </button>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-center gap-3">
                <Check className="size-5 text-emerald-700" />
                <p className="text-emerald-700 text-sm font-medium">
                  Signed{contract.signedAt ? ` on ${new Date(contract.signedAt).toLocaleDateString()}` : ""}
                  {contract.signerName ? ` by ${contract.signerName}` : ""}.
                </p>
              </div>
            )}
          </div>
        </Container>
      </div>
    </main>
  );
};

export default ContractSignView;
