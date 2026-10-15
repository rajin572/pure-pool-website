"use client";

import React, { useState, useRef, useEffect } from "react";
import ReusableGradientButton from "@/components/ui/CustomUi/ReusableGradientButton";
import { Clock, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface OtpVerificationCardProps {
  email?: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  onVerify?: (otp: string) => void;
  onResend?: () => void;
  backHref?: string;
  isModal?: boolean;
  onClose?: () => void;
}

export const OtpVerificationCard: React.FC<OtpVerificationCardProps> = ({
  email = "user•••@gmail.com",
  title = "Submit your code",
  subtitle,
  buttonText = "Verify Code",
  onVerify,
  onResend,
  backHref,
  isModal = false,
  onClose,
}) => {
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState<number>(45);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    // Only accept numeric digit
    const cleaned = value.replace(/\D/g, "");
    if (!cleaned) {
      const next = [...digits];
      next[index] = "";
      setDigits(next);
      return;
    }

    // Single digit or paste
    if (cleaned.length === 1) {
      const next = [...digits];
      next[index] = cleaned;
      setDigits(next);
      if (index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    } else {
      // Pasted full OTP
      const chars = cleaned.slice(0, 6).split("");
      const next = [...digits];
      chars.forEach((c, i) => {
        if (index + i < 6) next[index + i] = c;
      });
      setDigits(next);
      const nextFocus = Math.min(index + chars.length, 5);
      inputRefs.current[nextFocus]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    if (timer > 0) return;
    setTimer(45);
    setDigits(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
    if (onResend) onResend();
  };

  const fullCode = digits.join("");
  const isComplete = fullCode.length === 6;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isComplete) return;

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsSuccess(true);
      if (onVerify) onVerify(fullCode);
    }, 600);
  };

  return (
    <div
      className={`w-full max-w-[560px] bg-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-gray-100 flex flex-col gap-6 relative z-20 ${
        isModal ? "animate-in fade-in zoom-in-95 duration-200" : ""
      }`}
    >
      {/* Top Navigation Row */}
      <div className="flex items-center justify-between w-full">
        {backHref ? (
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 text-zinc-600 hover:text-blue-600 text-sm font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Link>
        ) : (
          <div />
        )}

        {isModal && onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-gray-100 transition-colors"
          >
            <span className="text-xl leading-none">&times;</span>
          </button>
        )}
      </div>

      {/* Header */}
      <div className="flex flex-col gap-2">
        <h2 className="text-zinc-900 text-2xl sm:text-3xl font-bold font-['Onest'] leading-tight">
          {title}
        </h2>
        <p className="text-zinc-600 text-sm sm:text-base font-medium font-['Onest'] leading-relaxed">
          {subtitle || `Enter the code we have sent to ${email}`}
        </p>
      </div>

      {/* OTP Input Row */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-2 sm:gap-3.5">
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                inputRefs.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className={`w-12 h-14 sm:w-16 sm:h-16 text-center text-2xl sm:text-3xl font-bold font-['Onest'] rounded-xl transition-all outline-none ${
                digit
                  ? "outline outline-2 -outline-offset-1 outline-blue-600 text-blue-600 bg-blue-50/20"
                  : "outline outline-1 -outline-offset-1 outline-gray-200 text-zinc-400 bg-white focus:outline-2 focus:outline-blue-500"
              }`}
              placeholder="–"
            />
          ))}
        </div>

        {/* Resend & Timer Row */}
        <div className="flex items-center justify-between text-sm sm:text-base font-medium text-zinc-600">
          <div className="flex items-center gap-1.5">
            <span>Didn&apos;t get the code?</span>
            <button
              type="button"
              onClick={handleResend}
              disabled={timer > 0}
              className={`font-semibold transition-colors cursor-pointer ${
                timer > 0
                  ? "text-zinc-400 cursor-not-allowed"
                  : "text-blue-600 hover:text-blue-700 underline"
              }`}
            >
              Resend it
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-zinc-900 font-semibold">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>{timer > 0 ? `${timer}s` : "Expired"}</span>
          </div>
        </div>

        {/* Submit Button */}
        <ReusableGradientButton
          type="submit"
          disabled={!isComplete || isVerifying}
          className="w-full h-14 rounded-2xl text-base sm:text-lg font-bold shadow-md cursor-pointer disabled:opacity-50"
        >
          {isSuccess ? (
            <span className="flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-white" />
              Verified
            </span>
          ) : isVerifying ? (
            "Verifying code..."
          ) : (
            buttonText
          )}
        </ReusableGradientButton>
      </form>
    </div>
  );
};

export default OtpVerificationCard;

