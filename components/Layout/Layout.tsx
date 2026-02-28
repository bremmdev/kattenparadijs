"use client";

import Header from "./Header";
import BackToTop from "@/components//UI/BackToTop";
import useBodyToViewportRatio from "@/hooks/useBodyToViewportRatio";
import { poppins } from "@/app/fonts";
import type { Metadata } from "next";
import Toaster from "@/components/UI/Toaster";

export const metadata: Metadata = {
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", type: "image/x-icon" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: ["/favicon.ico"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const { bodyToViewportRatio } = useBodyToViewportRatio();
  const showBackToTop = bodyToViewportRatio && bodyToViewportRatio > 1.2;

  return (
    <div
      className={`${poppins.className} font-sans min-h-screen bg-gray-50 pb-8`}
    >
      <Header />
      <main className="max-w-page-content mx-auto py-6 px-8 sm:px-12 sm:py-8">
        {children}
      </main>
      {showBackToTop && <BackToTop />}
      <Toaster />
    </div>
  );
}
