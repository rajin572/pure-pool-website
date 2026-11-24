"use client";

import React, { useEffect, useState } from "react";
import ReusableModal from "@/components/ui/CustomUi/ReuseableModal";
import { Button } from "@/components/ui/button";
import {
  getServiceRequestDetail,
  cancelServiceRequest,
  ServiceRequestRecord,
  KIND_LABEL,
} from "@/service/ServiceRequestService/ServiceRequestServiceApi";
import { errorMessage } from "@/lib/apiRequest";
import { resolveImageUrl } from "@/helpers/config/envConfig";
import { Loader2, X } from "lucide-react";

interface Props {
  requestId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancelled?: () => void;
}

const nameOf = (v: { name: string } | string | null | undefined) => (v && typeof v === "object" ? v.name : v || "—");

export default function ServiceRequestDetailModal({ requestId, open, onOpenChange, onCancelled }: Props) {
  const [request, setRequest] = useState<ServiceRequestRecord | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    (async () => {
      setRequest(null);
      setLoadError(null);
      const res = await getServiceRequestDetail(requestId);
      if (cancelled) return;
      if (res.success) setRequest(res.data);
      else setLoadError(res.error.message);
    })();
    return () => {
      cancelled = true;
    };
  }, [open, requestId]);

  const canCancel = request && (request.customerStatus === "SUBMITTED" || request.customerStatus === "SCHEDULED");

  const handleCancel = async () => {
    setCancelling(true);
    const res = await cancelServiceRequest(requestId, cancelReason || undefined);
    setCancelling(false);
    if (res.success) {
      setShowCancelConfirm(false);
      onCancelled?.();
      onOpenChange(false);
    } else {
      setLoadError(errorMessage(res));
    }
  };

  return (
    <ReusableModal open={open} onOpenChange={onOpenChange} title="Service request" maxWidth="sm:max-w-xl">
      {!request ? (
        <div className="py-12 flex items-center justify-center text-sm text-gray-500 gap-2">
          {loadError ? loadError : <><Loader2 className="w-4 h-4 animate-spin" /> Loading...</>}
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm text-gray-500">{request.number}</div>
              <h3 className="text-lg font-bold text-gray-900">{request.title || KIND_LABEL[request.kind]}</h3>
            </div>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed">{request.description}</p>

          {request.attachments.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {request.attachments.map((url, i) => (
                <a key={i} href={resolveImageUrl(url)} target="_blank" rel="noreferrer" className="w-20 h-16 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={resolveImageUrl(url)} alt={`Attachment ${i + 1}`} className="w-full h-full object-cover" />
                </a>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm pt-2 border-t border-gray-100">
            <div>
              <div className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Pool</div>
              <div className="font-medium text-gray-900">{nameOf(request.poolId)}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Status</div>
              <div className="font-medium text-gray-900">{request.customerStatus.replace("_", " ")}</div>
            </div>
            {typeof request.visitId === "object" && request.visitId?.scheduledAt && (
              <div>
                <div className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Scheduled</div>
                <div className="font-medium text-gray-900">{new Date(request.visitId.scheduledAt).toLocaleString()}</div>
              </div>
            )}
            {typeof request.visitId === "object" && request.visitId?.technicianId && (
              <div>
                <div className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Technician</div>
                <div className="font-medium text-gray-900">{nameOf(request.visitId.technicianId)}</div>
              </div>
            )}
            {request.cancelReason && (
              <div className="col-span-2">
                <div className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Cancelled</div>
                <div className="font-medium text-gray-900">{request.cancelReason}</div>
              </div>
            )}
          </div>

          {loadError && <div className="text-sm text-red-600">{loadError}</div>}

          {canCancel && !showCancelConfirm && (
            <Button type="button" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => setShowCancelConfirm(true)}>
              <X className="w-4 h-4 mr-1.5" /> Cancel this request
            </Button>
          )}

          {canCancel && showCancelConfirm && (
            <div className="flex flex-col gap-2 p-3 rounded-xl bg-red-50 border border-red-200">
              <label className="text-xs font-semibold text-gray-700">Reason (optional)</label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red-400"
                placeholder="e.g. No longer needed"
              />
              <div className="flex justify-end gap-2 pt-1">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowCancelConfirm(false)} disabled={cancelling}>
                  Keep request
                </Button>
                <Button type="button" size="sm" className="bg-red-600 hover:bg-red-700 text-white" onClick={handleCancel} disabled={cancelling}>
                  {cancelling ? "Cancelling..." : "Confirm cancel"}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </ReusableModal>
  );
}
