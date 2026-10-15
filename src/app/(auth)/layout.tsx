import React from "react";

export const metadata = {
  title: "Client Portal | Pure Pool Madrid",
  description: "Access your Pure Pool customer portal, service visits, maintenance records, and pool onboarding.",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-zinc-900 font-['Onest'] flex flex-col justify-center">
      {children}
    </div>
  );
}

