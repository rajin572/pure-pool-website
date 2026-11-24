"use client";

import React from "react";
import { ServiceRequestRecord, KIND_LABEL } from "@/service/ServiceRequestService/ServiceRequestServiceApi";
import { Calendar, User, Clock } from "lucide-react";

interface ServiceRequestCardProps {
  request: ServiceRequestRecord;
  onClick?: () => void;
}

const nameOf = (v: { name: string } | string | null | undefined) => (v && typeof v === "object" ? v.name : v || "—");

const formatDate = (iso: string) => new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });

export const ServiceRequestCard: React.FC<ServiceRequestCardProps> = ({ request, onClick }) => {
  const getStatusBadge = (status: ServiceRequestRecord["customerStatus"]) => {
    switch (status) {
      case "IN_PROGRESS":
        return "bg-amber-50 text-amber-700 border-amber-300";
      case "SUBMITTED":
        return "bg-sky-50 text-sky-700 border-sky-300";
      case "SCHEDULED":
        return "bg-teal-50 text-teal-700 border-teal-300";
      case "COMPLETED":
        return "bg-emerald-50 text-emerald-700 border-emerald-300";
      case "CANCELLED":
        return "bg-gray-100 text-gray-600 border-gray-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const statusLabel: Record<ServiceRequestRecord["customerStatus"], string> = {
    SUBMITTED: "Submitted",
    SCHEDULED: "Scheduled",
    IN_PROGRESS: "In progress",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
  };

  const getUrgencyBadge = (urgency: ServiceRequestRecord["urgency"]) => {
    switch (urgency) {
      case "URGENT":
      case "EMERGENCY":
        return "text-red-700 bg-red-50 border-red-200";
      case "HIGH":
        return "text-amber-700 bg-amber-50 border-amber-200";
      default:
        return "text-gray-600 bg-gray-100 border-gray-200";
    }
  };

  const urgencyLabel: Record<ServiceRequestRecord["urgency"], string> = {
    LOW: "Low",
    NORMAL: "Normal",
    HIGH: "High",
    URGENT: "Urgent",
    EMERGENCY: "Emergency",
  };

  const scheduledAt = typeof request.visitId === "object" ? request.visitId?.scheduledAt : undefined;

  return (
    <div
      onClick={onClick}
      className="p-5 sm:p-6 rounded-2xl bg-white border border-gray-200/90 shadow-xs hover:shadow-md hover:border-sky-300 transition-all duration-200 flex flex-col gap-4 cursor-pointer"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
            {request.number || request._id.slice(-6).toUpperCase()}
          </span>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getUrgencyBadge(request.urgency)}`}>
            {urgencyLabel[request.urgency]}
          </span>
        </div>

        <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold border ${getStatusBadge(request.customerStatus)}`}>
          {statusLabel[request.customerStatus]}
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        <h3 className="text-lg sm:text-xl font-bold text-sky-600 tracking-tight">
          {request.title || KIND_LABEL[request.kind]}
        </h3>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed line-clamp-3">{request.description}</p>
      </div>

      <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-gray-500">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>Created: {formatDate(request.createdAt)}</span>
          </div>

          {scheduledAt && (
            <div className="flex items-center gap-1.5 text-teal-700 font-medium">
              <Clock className="w-4 h-4 text-teal-600" />
              <span>Scheduled: {formatDate(scheduledAt)}</span>
            </div>
          )}

          {typeof request.visitId === "object" && request.visitId?.technicianId && (
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-gray-400" />
              <span>Tech: {nameOf(request.visitId.technicianId)}</span>
            </div>
          )}
        </div>

        <span className="text-xs font-semibold text-gray-600 bg-gray-100/80 px-2.5 py-1 rounded-md">
          {nameOf(request.poolId)}
        </span>
      </div>
    </div>
  );
};

export default ServiceRequestCard;
