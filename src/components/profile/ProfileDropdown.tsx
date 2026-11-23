"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Pencil,
  Lock,
  Droplet,
  Globe,
  LogOut,
  MailCheck,
  Trash2,
} from "lucide-react";
import { errorMessage } from "@/lib/apiRequest";
import type { ISessionUser } from "@/service/AuthService/AuthServiceApi";
import {
  languageName,
  requestEmailVerification,
} from "@/service/ProfileService/ProfileServiceApi";
import EditProfileModal from "./EditProfileModal";
import LanguageModal from "./LanguageModal";
import UpdatePasswordModal from "./UpdatePasswordModal";
import DeleteAccountModal from "./DeleteAccountModal";
import LogoutModal from "./LogoutModal";
import UserAvatar from "./UserAvatar";

export interface ProfileDropdownProps {
  /** The signed-in user from GET /auth/me. */
  user: ISessionUser;
  trigger?: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  onLogout?: () => void;
  className?: string;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  user,
  trigger,
  isOpen: controlledIsOpen,
  onOpenChange,
  onClose,
  onLogout,
  className = "",
}) => {
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(false);
  const isDropdownOpen =
    controlledIsOpen !== undefined ? controlledIsOpen : uncontrolledIsOpen;

  const setDropdownOpen = React.useCallback(
    (open: boolean) => {
      if (onOpenChange) {
        onOpenChange(open);
      } else {
        setUncontrolledIsOpen(open);
      }
    },
    [onOpenChange]
  );

  // Modal open states (persisted outside the dropdown popup)
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [updatePasswordOpen, setUpdatePasswordOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [sendingVerification, setSendingVerification] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    if (!isDropdownOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
        onClose?.();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDropdownOpen(false);
        onClose?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDropdownOpen, onClose, setDropdownOpen]);

  const handleOpenEdit = () => {
    setDropdownOpen(false);
    onClose?.();
    setEditProfileOpen(true);
  };

  const handleOpenPassword = () => {
    setDropdownOpen(false);
    onClose?.();
    setUpdatePasswordOpen(true);
  };

  const handleOpenLanguage = () => {
    setDropdownOpen(false);
    onClose?.();
    setLanguageOpen(true);
  };

  const handleOpenLogout = () => {
    setDropdownOpen(false);
    onClose?.();
    setLogoutOpen(true);
  };

  const handleOpenDelete = () => {
    setDropdownOpen(false);
    onClose?.();
    setDeleteOpen(true);
  };

  // POST /auth/request-verification emails a new code; the code is entered on the verify page.
  const handleVerifyEmail = async () => {
    setDropdownOpen(false);
    onClose?.();
    setSendingVerification(true);
    const res = await requestEmailVerification();
    setSendingVerification(false);
    if (!res.success) {
      toast.error(errorMessage(res, "We couldn't send the code."));
      return;
    }
    toast.success("We sent a code to your email.");
    window.location.assign(
      new URL(`/register/verify?email=${encodeURIComponent(user.email)}`, window.location.origin),
    );
  };

  const renderDropdownCard = () => (
    <div
      className={`w-72 sm:w-80 bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-[0_20px_50px_rgba(0,0,0,0.12),0_8px_20px_rgba(0,0,0,0.06)] border border-slate-200/90 text-slate-800 animate-in fade-in-0 zoom-in-95 duration-150 ${className}`}
    >
      {/* User Profile Header */}
      <div className="flex items-center gap-3 px-2 py-2">
        <div className="relative size-11 sm:size-12 rounded-full overflow-hidden bg-slate-100 ring-2 ring-slate-100 shrink-0">
          <UserAvatar src={user.avatarUrl} alt={user.name} />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-[15px] font-semibold text-slate-900 leading-snug truncate">
            {user.name}
          </h4>
          <p className="text-[13px] text-slate-500 leading-snug truncate mt-0.5">
            {user.email}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="my-2.5 border-b border-slate-100" />

      {/* Menu Items List */}
      <div className="space-y-0.5">
        {/* Until the email is verified the account only gets "Verify email" and "Log out". */}
        {user.emailVerified && (
        <>
        {/* Edit Name */}
        <button
          type="button"
          onClick={handleOpenEdit}
          className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-left hover:bg-slate-50 transition-colors cursor-pointer group"
        >
          <Pencil className="size-4.5 text-slate-600 group-hover:text-slate-900 transition-colors" />
          <span className="text-[14px] sm:text-[15px] font-medium text-slate-800 group-hover:text-slate-950">
            Edit Name
          </span>
        </button>

        {/* Update Password */}
        <button
          type="button"
          onClick={handleOpenPassword}
          className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-left hover:bg-slate-50 transition-colors cursor-pointer group"
        >
          <Lock className="size-4.5 text-slate-600 group-hover:text-slate-900 transition-colors" />
          <span className="text-[14px] sm:text-[15px] font-medium text-slate-800 group-hover:text-slate-950">
            Update Password
          </span>
        </button>

        {/* Pool Settings */}
        <Link
          href="/pool-settings"
          onClick={() => {
            setDropdownOpen(false);
            onClose?.();
          }}
          className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-left hover:bg-slate-50 transition-colors cursor-pointer group"
        >
          <Droplet className="size-4.5 text-slate-600 group-hover:text-slate-900 transition-colors" />
          <span className="text-[14px] sm:text-[15px] font-medium text-slate-800 group-hover:text-slate-950">
            Pool Settings
          </span>
        </Link>

        {/* Language */}
        <button
          type="button"
          onClick={handleOpenLanguage}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left hover:bg-slate-50 transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-3.5">
            <Globe className="size-4.5 text-slate-600 group-hover:text-slate-900 transition-colors" />
            <span className="text-[14px] sm:text-[15px] font-medium text-slate-800 group-hover:text-slate-950">
              Language
            </span>
          </div>
          <span className="text-[13px] sm:text-[14px] text-slate-400 font-normal">
            {languageName(user.preferredLocale)}
          </span>
        </button>
        </>
        )}

        {/* Verify email: only while the address is unverified */}
        {!user.emailVerified && (
          <>
          <p className="px-3 py-2 text-[13px] leading-snug text-amber-700 bg-amber-50 rounded-xl">
            Your email isn&apos;t verified yet. Verify it to unlock your account.
          </p>
          <button
            type="button"
            onClick={handleVerifyEmail}
            disabled={sendingVerification}
            className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-left hover:bg-slate-50 transition-colors cursor-pointer group disabled:opacity-60"
          >
            <MailCheck className="size-4.5 text-slate-600 group-hover:text-slate-900 transition-colors" />
            <span className="text-[14px] sm:text-[15px] font-medium text-slate-800 group-hover:text-slate-950">
              Verify email
            </span>
          </button>
          </>
        )}

        {/* Delete account */}
        {user.emailVerified && (
        <button
          type="button"
          onClick={handleOpenDelete}
          className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-left hover:bg-slate-50 transition-colors cursor-pointer group"
        >
          <Trash2 className="size-4.5 text-slate-600 group-hover:text-slate-900 transition-colors" />
          <span className="text-[14px] sm:text-[15px] font-medium text-slate-800 group-hover:text-slate-950">
            Delete account
          </span>
        </button>
        )}
      </div>

      {/* Divider */}
      <div className="my-2.5 border-b border-slate-100" />

      {/* Log Out Option */}
      <button
        type="button"
        onClick={handleOpenLogout}
        className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-left hover:bg-red-50/60 transition-colors cursor-pointer group"
      >
        <LogOut className="size-4.5 text-[#EF4444] group-hover:text-red-600 transition-colors" />
        <span className="text-[14px] sm:text-[15px] font-medium text-[#EF4444] group-hover:text-red-600">
          Log out
        </span>
      </button>
    </div>
  );

  return (
    <>
      {trigger ? (
        <div className="relative inline-block" ref={containerRef}>
          <div
            onClick={() => setDropdownOpen(!isDropdownOpen)}
            className="cursor-pointer"
          >
            {trigger}
          </div>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 z-50 origin-top-right">
              {renderDropdownCard()}
            </div>
          )}
        </div>
      ) : (
        isDropdownOpen && renderDropdownCard()
      )}

      {/* Modals */}
      {/* key: remount on open so each modal starts from the server's values */}
      <EditProfileModal
        key={`edit-${editProfileOpen}`}
        open={editProfileOpen}
        onOpenChange={setEditProfileOpen}
        user={user}
      />

      <UpdatePasswordModal
        open={updatePasswordOpen}
        onOpenChange={setUpdatePasswordOpen}
      />

      <LanguageModal
        key={`lang-${languageOpen}`}
        open={languageOpen}
        onOpenChange={setLanguageOpen}
        currentLocale={user.preferredLocale}
      />

      <DeleteAccountModal open={deleteOpen} onOpenChange={setDeleteOpen} />

      <LogoutModal
        open={logoutOpen}
        onOpenChange={setLogoutOpen}
        onLogoutConfirm={() => {
          onLogout?.();
        }}
      />
    </>
  );
};

export default ProfileDropdown;
