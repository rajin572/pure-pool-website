"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { AlertCircle, RotateCcw, Home, Mail } from "lucide-react";
import { AllImages } from "../../public/images/AllImages";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service if needed
    console.error("Pure Pool runtime error:", error);
  }, [error]);

  const handleContact = () => {
    const subject = encodeURIComponent("Pure Pool Website Error Report");
    const body = encodeURIComponent(
      `Hi Pure Pool Support,\n\nI encountered an error on the website.\n\nError Message: ${error.message}\nDigest Code: ${error.digest || "N/A"}\nURL: ${typeof window !== "undefined" ? window.location.href : ""}`
    );
    window.location.href = `mailto:support@purepool.es?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50/80 via-slate-50 to-sky-100/40 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Subtle Ambient Water/Pool Glows */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-sky-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-400/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-200/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-lg w-full relative z-10">
        {/* Main Error Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_20px_50px_rgba(2,132,199,0.12),0_4px_16px_rgba(0,0,0,0.04)] border border-sky-100/80 p-7 sm:p-10 text-center relative overflow-hidden">
          {/* Top Accent Gradient Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-sky-400 via-blue-600 to-cyan-400" />

          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Link href="/" className="inline-block hover:opacity-90 transition-opacity">
              <Image
                src={AllImages.logo}
                alt="Pure Pool Logo"
                width={160}
                height={40}
                className="h-8 sm:h-9 w-auto object-contain"
                priority
              />
            </Link>
          </div>

          {/* Error Status Icon */}
          <div className="mx-auto w-16 h-16 rounded-2xl bg-sky-50 border border-sky-200/70 flex items-center justify-center mb-5 text-sky-600 shadow-inner">
            <AlertCircle className="w-8 h-8 text-sky-600" />
          </div>

          {/* Main Heading */}
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-2.5">
            Oops! Something went wrong
          </h1>

          {/* Error Message */}
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-md mx-auto mb-6">
            An unexpected error occurred while loading this page. Our team has been notified,
            and we&apos;re working to get everything running smoothly again.
          </p>

          {/* Error Details (for development) */}
          {process.env.NODE_ENV === "development" && (
            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 mb-6 text-left shadow-xs">
              <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-200/70">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Error Details (Dev Mode)
                </span>
                {error.digest && (
                  <span className="text-[10px] font-mono font-medium bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md">
                    ID: {error.digest.slice(0, 8)}
                  </span>
                )}
              </div>
              <p className="text-xs text-rose-600 font-mono break-words leading-relaxed max-h-36 overflow-y-auto">
                {error.message || "An unknown runtime error occurred."}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 mt-6">
            <button
              onClick={reset}
              type="button"
              className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-white font-semibold text-sm bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 shadow-md shadow-sky-500/25 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Try Again
            </button>
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-slate-700 hover:text-slate-900 font-semibold text-sm bg-slate-100 hover:bg-slate-200/80 border border-slate-200 transition-all duration-200 cursor-pointer"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
          </div>

          {/* Contact Support */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-xs sm:text-sm text-slate-500 mb-2">
              Still having trouble?
            </p>
            <button
              onClick={handleContact}
              type="button"
              className="inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold text-sky-600 hover:text-sky-700 transition-colors cursor-pointer group"
            >
              <Mail className="w-4 h-4 text-sky-500 group-hover:scale-110 transition-transform" />
              <span>support@purepool.es</span>
            </button>
          </div>
        </div>

        {/* Error Code / Digest */}
        {error.digest && (
          <div className="text-center mt-4">
            <p className="text-xs text-slate-400 font-mono">
              Error Digest: {error.digest}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
