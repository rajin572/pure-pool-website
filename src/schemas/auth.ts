import * as z from "zod";
import { PASSWORD_MAX, PASSWORD_MIN } from "@/service/AuthService/AuthServiceApi";

const email = z.string().trim().min(1, "Email is required").email("Enter a valid email address");
const newPassword = z
  .string()
  .min(PASSWORD_MIN, `Use at least ${PASSWORD_MIN} characters`)
  .max(PASSWORD_MAX, `Use at most ${PASSWORD_MAX} characters`);

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

export const registerSchema = z
  .object({
    fullName: z.string().trim().min(2, "Enter your full name"),
    email,
    phoneNumber: z.string().trim().max(30, "Phone number is too long"),
    password: newPassword,
    confirmPassword: z.string().min(1, "Please confirm your password"),
    acceptTerms: z.boolean().refine((v) => v, "Please accept the terms to continue"),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({ email });

export const resetPasswordSchema = z
  .object({
    newPassword,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
