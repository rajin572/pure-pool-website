"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import {
  IUserProfile,
  updateProfileApi,
} from "@/service/ProfileService/ProfileServiceApi";

const editProfileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email(),
  phoneNumber: z.string().min(6, "Phone number is required"),
});

type EditProfileFormData = z.infer<typeof editProfileSchema>;

export interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: IUserProfile;
  onProfileUpdated?: (updatedUser: IUserProfile) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  open,
  onOpenChange,
  user,
  onProfileUpdated,
}) => {
  const [avatarPreview, setAvatarPreview] = useState<string>(
    user.avatar || "/images/userAvatar.png"
  );
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      fullName: user.fullName || "Juan Pérez Martínez",
      email: user.email || "juan.perez.m92@gmail.com",
      phoneNumber: user.phoneNumber || "+34 612 847 395",
    },
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    }
  };

  const onSubmit = async (data: EditProfileFormData) => {
    try {
      setIsSubmitting(true);
      // API call (ready for backend)
      // const res = await updateProfileApi({ fullName: data.fullName, avatar: avatarFile || undefined });
      await updateProfileApi({ fullName: data.fullName, avatar: avatarFile || undefined });
      
      if (onProfileUpdated) {
        onProfileUpdated({
          ...user,
          fullName: data.fullName,
          avatar: avatarPreview,
        });
      }
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update profile", error);
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
                <Image
                  src={avatarPreview}
                  alt={user.fullName}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
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
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Form */}
          <ReuseableForm form={form} onSubmit={onSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <FormInput
                control={form.control}
                name="fullName"
                label="Full Name"
                placeholder="Enter your full name"
                prefix={<User className="size-4 text-slate-400" />}
                inputClassName="bg-white! border-slate-200! focus:border-[#0284C7]! text-slate-900! text-sm! py-4! rounded-xl!"
              />
            </div>

            {/* Email (Read-Only) */}
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

            {/* Phone Number (Read-Only) */}
            <div>
              <FormInput
                control={form.control}
                name="phoneNumber"
                label="Phone Number"
                disabled={true}
                prefix={<Phone className="size-4 text-slate-400" />}
                suffix={<Lock className="size-4 text-slate-400" />}
                inputClassName="bg-slate-50! border-slate-200! text-slate-500! cursor-not-allowed! text-sm! py-4! rounded-xl!"
              />
            </div>

            {/* Warning Callout Box */}
            <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-xl p-3.5 flex items-start gap-3 mt-4">
              <AlertCircle className="size-4.5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs sm:text-[13px] text-[#92400E] leading-relaxed">
                Your email address and phone number can&apos;t be changed here. Contact
                Support and we&apos;ll update them for you.
              </p>
            </div>

            {/* Footer Buttons */}
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
