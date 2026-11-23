"use client";

import React from "react";
import { Check, Circle } from "lucide-react";
import { PASSWORD_MAX, PASSWORD_MIN } from "@/service/AuthService/AuthServiceApi";

type Level = { score: 0 | 1 | 2 | 3 | 4; label: string; text: string; bar: string };

const IDLE = { text: "text-zinc-500", bar: "bg-gray-200" };

/**
 * Strength hint for a password being chosen. The backend only requires PASSWORD_MIN to
 * PASSWORD_MAX characters; mixed case, digits, symbols and length only make the hint stronger.
 */
export const scorePassword = (pass: string): Level => {
  if (!pass) return { score: 0, label: "Enter a password", ...IDLE };
  if (pass.length < PASSWORD_MIN) {
    return { score: 0, label: `Too short: use at least ${PASSWORD_MIN} characters`, text: "text-red-600", bar: "bg-red-500" };
  }
  let score = 1;
  if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) score += 1;
  if (/\d/.test(pass)) score += 1;
  if (/[^A-Za-z0-9]/.test(pass)) score += 1;
  if (pass.length >= 16) score += 1;
  switch (Math.min(score, 4)) {
    case 1:
      return { score: 1, label: "Weak: add capitals, numbers or a symbol", text: "text-red-600", bar: "bg-red-500" };
    case 2:
      return { score: 2, label: "Fair: a number, a symbol or more length helps", text: "text-amber-600", bar: "bg-amber-500" };
    case 3:
      return { score: 3, label: "Strong", text: "text-emerald-600", bar: "bg-emerald-500" };
    default:
      return { score: 4, label: "Very strong", text: "text-emerald-700", bar: "bg-emerald-600" };
  }
};

const Rule = ({ met, children }: { met: boolean; children: React.ReactNode }) => (
  <li className={`flex items-center gap-2 text-xs font-medium transition-colors ${met ? "text-emerald-700" : "text-zinc-500"}`}>
    {met ? <Check className="size-3.5 shrink-0" aria-hidden /> : <Circle className="size-3.5 shrink-0 text-zinc-300" aria-hidden />}
    <span>
      {children}
      <span className="sr-only">{met ? " (done)" : " (not yet)"}</span>
    </span>
  </li>
);

/** Strength bars plus the live checklist of what the backend requires. */
export const PasswordStrength: React.FC<{ password: string; confirm?: string }> = ({ password, confirm }) => {
  const level = scorePassword(password);
  const lengthOk = password.length >= PASSWORD_MIN && password.length <= PASSWORD_MAX;
  const showMatch = confirm !== undefined;

  return (
    <div className="flex flex-col gap-2.5 -mt-1">
      <div className="flex flex-col gap-1.5">
        <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full" aria-hidden>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-full rounded-full transition-colors ${level.score >= i ? level.bar : "bg-gray-200"}`}
            />
          ))}
        </div>
        <span aria-live="polite" className={`text-xs font-medium font-['Onest'] ${level.text}`}>
          {level.label}
        </span>
      </div>

      <ul aria-label="Password requirements" className="flex flex-col gap-1">
        <Rule met={lengthOk}>
          {PASSWORD_MIN}–{PASSWORD_MAX} characters
        </Rule>
        {showMatch && <Rule met={confirm.length > 0 && confirm === password}>Both passwords match</Rule>}
      </ul>
    </div>
  );
};

export default PasswordStrength;
