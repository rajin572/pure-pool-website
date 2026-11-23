"use client";

import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { User, Mail, Phone, Lock, Camera, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ReuseableForm from "@/components/ui/CustomUi/ReuseForm/ReuseableForm";
import { FormInput } from "@/components/ui/CustomUi/ReuseForm/Form";
import { Button } from "@/components/ui/button";
import UserAvatar from "./UserAvatar";
import { errorMessage } from "@/lib/apiRequest";
import { applySessionUser } from "@/lib/useSessionUser";
import type { ISessionUser } from "@/service/AuthService/AuthServiceApi";
import { updateProfile } from "@/service/ProfileService/ProfileServiceApi";
import { uploadFiles, validateImages } from "@/service/UploadService/UploadServiceApi";

const editProfileSchema = z.object({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters"),
  email: z.string(),
  phoneNumber: z.string(),
});

type EditProfileFormData = z.infer<typeof editProfileSchema>;

export interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: ISessionUser;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ open, onOpenChange, user }) => {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: { fullName: user.name, email: user.email, phoneNumber: user.phone ?? "" },
  });

  // The parent remounts this modal every time it opens (key), so it always starts from what
  // the server says, never from a half-finished edit.
  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const problem = validateImages([file]);
    if (problem) {
      toast.error(problem);
      return;
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data: EditProfileFormData) => {
    const nameChanged = data.fullName.trim() !== user.name;
    if (!nameChanged && !avatarFile) {
      onOpenChange(false);
      return;
    }
    setIsSubmitting(true);
    try {
      let avatarUrl: string | undefined;
      if (avatarFile) {
        const up = await uploadFiles([avatarFile]);
        if (!up.success || !up.data[0]) {
          toast.error(errorMessage(up, "The photo could not be uploaded."));
          return;
        }
        avatarUrl = up.data[0].url;
      }
      const res = await updateProfile({
        ...(nameChanged ? { name: data.fullName.trim() } : {}),
        ...(avatarUrl ? { avatarUrl } : {}),
      });
      if (!res.success) {
        toast.error(errorMessage(res, "Your profile could not be saved."));
        return;
      }
      applySessionUser(res.data);
      toast.success("Profile updated");
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-[92vw] max-w-lg p-0 overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white shadow-2xl"
        showCloseButton={true}
      >
        <DialogHeader className="pt-6 px-6 pb-2 border-b border-slate-100">
          <DialogTitle className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Edit profile
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-5 max-h-[80vh] overflow-y-auto">
          {/* Avatar with Camera badge */}
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="relative group">
              <div className="size-20 sm:size-24 rounded-full overflow-hidden ring-4 ring-slate-100 shadow-md bg-slate-100 relative">
                {avatarPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarPreview} alt={user.name} className="size-full object-cover" />
                ) : (
                  <UserAvatar src={user.avatarUrl} alt={user.name} />
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 size-7 sm:size-8 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white flex items-center justify-center shadow-md ring-2 ring-white transition-all transform hover:scale-105 cursor-pointer"
                aria-label="Change profile picture"
              >
                <Camera className="size-3.5 sm:size-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Form */}
          <ReuseableForm form={form} onSubmit={onSubmit} className="space-y-4">
            <div>
              <FormInput
                control={form.control}
                name="fullName"
                label="Full Name"
                placeholder="Enter your full name"
                autoComplete="name"
                prefix={<User className="size-4 text-slate-400" />}
                inputClassName="bg-white! border-slate-200! focus:border-[#0284C7]! text-slate-900! text-sm! py-4! rounded-xl!"
              />
            </div>

            <div>
              <FormInput
                control={form.control}
                name="email"
                label="Email"
                disabled={true}
                prefix={<Mail className="size-4 text-slate-400" />}
                suffix={<Lock className="size-4 text-slate-400" />}
                inputClassName="bg-slate-50! border-slate-200! text-slate-500! cursor-not-allowed! text-sm! py-4! rounded-xl!"
              />
            </div>

            <div>
              <FormInput
                control={form.control}
                name="phoneNumber"
                label="Phone Number"
                placeholder="No phone number on file"
                disabled={true}
                prefix={<Phone className="size-4 text-slate-400" />}
                suffix={<Lock className="size-4 text-slate-400" />}
                inputClassName="bg-slate-50! border-slate-200! text-slate-500! cursor-not-allowed! text-sm! py-4! rounded-xl!"
              />
            </div>

            <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-xl p-3.5 flex items-start gap-3 mt-4">
              <AlertCircle className="size-4.5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs sm:text-[13px] text-[#92400E] leading-relaxed">
                Your email address and phone number can&apos;t be changed here. Contact
                Support and we&apos;ll update them for you.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-5 mt-6 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="h-10 sm:h-11 px-5 rounded-xl border-slate-200 text-slate-700 font-medium hover:bg-slate-50 text-sm"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-10 sm:h-11 px-6 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-medium text-sm shadow-xs transition"
              >
                {isSubmitting ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </ReuseableForm>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;
