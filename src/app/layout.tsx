import type { Metadata } from "next";
import { Onest } from "next/font/google";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

const onest = Onest({
  subsets: ["latin"],
  variable: "--font-onest",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${onest.variable} font-['Onest'] h-full antialiased`}
    >
      <body className={`${onest.className} min-h-full flex flex-col bg-background-color! font-['Onest']`}>
        {children}
      </body>
    </html>
  );
}
