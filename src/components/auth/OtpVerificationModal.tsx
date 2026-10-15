"use client";

import React, { useEffect } from "react";
import OtpVerificationCard from "./OtpVerificationCard";

interface OtpVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email?: string;
  onSuccess?: (code: string) => void;
}

export const OtpVerificationModal: React.FC<OtpVerificationModalProps> = ({
  isOpen,
  onClose,
  email,
  onSuccess,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-[560px]">
        <OtpVerificationCard
          isModal
          email={email}
          onClose={onClose}
          onVerify={(code) => {
            if (onSuccess) onSuccess(code);
          }}
        />
      </div>
    </div>
  );
};

export default OtpVerificationModal;

