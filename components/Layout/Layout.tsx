"use client";

import Header from "./Header";
import BackToTop from "@/components//UI/BackToTop";
import { usePathname } from "next/navigation";
import Head from "next/head";
import { Poppins, Dancing_Script } from "next/font/google";
import useBodyToViewportRatio from "@/hooks/useBodyToViewportRatio";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["300", "400", "500", "700"],
});

export const dancing_script = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing-script",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  //only show back to top button when the body is longer than the viewport
  //we use the router.asPath as a dependency to make sure the hook is called again when the page changes
  const { bodyToViewportRatio } = useBodyToViewportRatio(pathname);
  const showBackToTop = bodyToViewportRatio && bodyToViewportRatio > 1.2;

  return (
    <>
      <Head>
        <meta name="description" content="Een mooie verzameling kattenfoto's" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
      </Head>
      <div
        className={`${poppins.variable} font-sans min-h-screen bg-gray-50 pb-8`}
      >
        <Header />
        <main className="max-w-6xl mx-auto py-6 px-8 sm:px-12 sm:py-8">
          {children}
        </main>
        {showBackToTop && <BackToTop />}
      </div>
    </>
  );
}
