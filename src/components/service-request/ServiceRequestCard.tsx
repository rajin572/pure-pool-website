"use client";

import React from "react";
import { ServiceRequestRecord } from "@/service/ServiceRequestService/ServiceRequestServiceApi";
import { Calendar, User, Clock, AlertCircle } from "lucide-react";

interface ServiceRequestCardProps {
  request: ServiceRequestRecord;
  onClick?: () => void;
}

export const ServiceRequestCard: React.FC<ServiceRequestCardProps> = ({
  request,
  onClick,
}) => {
  const getStatusBadge = (status: ServiceRequestRecord["status"]) => {
    switch (status) {
      case "In progress":
        return "bg-amber-50 text-amber-700 border-amber-300";
      case "Submitted":
        return "bg-sky-50 text-sky-700 border-sky-300";
      case "Scheduled":
        return "bg-teal-50 text-teal-700 border-teal-300";
      case "Completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-300";
      case "Cancelled":
        return "bg-gray-100 text-gray-600 border-gray-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getUrgencyBadge = (urgency: ServiceRequestRecord["urgency"]) => {
    switch (urgency) {
      case "Urgent":
        return "text-red-700 bg-red-50 border-red-200";
      case "High":
        return "text-amber-700 bg-amber-50 border-amber-200";
      default:
        return "text-gray-600 bg-gray-100 border-gray-200";
    }
  };

  return (
    <div
      onClick={onClick}
      className="p-5 sm:p-6 rounded-2xl bg-white border border-gray-200/90 shadow-xs hover:shadow-md hover:border-sky-300 transition-all duration-200 flex flex-col gap-4 cursor-pointer"
    >
      {/* Top Bar: Reference ID & Status Badge */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
            {request.reference}
          </span>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getUrgencyBadge(
              request.urgency
            )}`}
          >
            {request.urgency}
          </span>
        </div>

        <span
          className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold border ${getStatusBadge(
            request.status
          )}`}
        >
          {request.status}
        </span>
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-1.5">
        <h3 className="text-lg sm:text-xl font-bold text-sky-600 tracking-tight">
          {request.categoryTitle}
        </h3>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed line-clamp-3">
          {request.description}
        </p>
      </div>

      {/* Metadata Bar */}
      <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-gray-500">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>Created: {request.createdAt}</span>
          </div>

          {request.scheduledDate && (
            <div className="flex items-center gap-1.5 text-teal-700 font-medium">
              <Clock className="w-4 h-4 text-teal-600" />
              <span>Scheduled: {request.scheduledDate}</span>
            </div>
          )}

          {request.technicianName && (
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-gray-400" />
              <span>Tech: {request.technicianName}</span>
            </div>
          )}
        </div>

        <span className="text-xs font-semibold text-gray-600 bg-gray-100/80 px-2.5 py-1 rounded-md">
          {request.poolName}
        </span>
      </div>
    </div>
  );
};

export default ServiceRequestCard;

