"use client";

import Header from "./Header";
import BackToTop from "@/components/UI/BackToTop";
import useBodyToViewportRatio from "@/hooks/useBodyToViewportRatio";
import { poppins } from "@/app/fonts";
import Toaster from "@/components/UI/Toaster";

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
