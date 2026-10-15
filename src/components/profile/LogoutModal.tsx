"use client";

import React, { useState } from "react";
import { LogOut } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { logoutUserApi } from "@/service/ProfileService/ProfileServiceApi";

export interface LogoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogoutConfirm?: () => void;
}

export const LogoutModal: React.FC<LogoutModalProps> = ({
  open,
  onOpenChange,
  onLogoutConfirm,
}) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      // API call (ready for backend)
      // await logoutUserApi();
      await logoutUserApi();

      if (onLogoutConfirm) {
        onLogoutConfirm();
      }
      onOpenChange(false);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-[92vw] max-w-sm p-6 overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white shadow-2xl text-center"
        showCloseButton={true}
      >
        <DialogHeader className="p-0 border-none space-y-0 text-center">
          {/* Centered Soft Red Icon Badge */}
          <div className="size-13 sm:size-14 rounded-full bg-red-50 text-[#EF4444] flex items-center justify-center mx-auto mb-4 ring-8 ring-red-50/50">
            <LogOut className="size-6 text-[#EF4444]" />
          </div>

          <DialogTitle className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight text-center">
            Log out of Pure Pool?
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-slate-500 mt-2 text-center max-w-xs mx-auto leading-relaxed">
            You&apos;ll need your email and password to sign back in. Your pool
            details stay exactly as they are.
          </DialogDescription>
        </DialogHeader>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mt-6 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 h-10 sm:h-11 rounded-xl border-slate-200 text-slate-700 font-medium hover:bg-slate-50 text-sm"
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={isLoggingOut}
            onClick={handleLogout}
            className="flex-1 h-10 sm:h-11 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white font-medium text-sm shadow-xs transition"
          >
            {isLoggingOut ? "Logging out..." : "Log out"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LogoutModal;

