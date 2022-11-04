import Image from "next/image";
import logo from "../public/logo.svg";
import Avatars from "./Cat/Avatars";
import Link from "next/link";
import BackToTop from "./UI/BackToTop";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import throttle from "./utils/throttle";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const router = useRouter();

  const listenToResize = throttle(() => {
    const shouldShowBackToTop =
      document.body.getBoundingClientRect().height > window.innerHeight * 1.2;
    if (shouldShowBackToTop) {
      setShowBackToTop(true);
    } else setShowBackToTop(false);
  });

  //asPath as dependency to re-run on route switch
  useEffect(() => {
    //first time check if we need to render backToTop
    listenToResize();
    window.addEventListener("resize", listenToResize);

    return () => window.removeEventListener("resize", listenToResize);
  }, [router.asPath]);

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <header className="border-b-2 border-rose-300 bg-white">
        <div className="flex flex-col max-w-6xl mx-auto px-8 py-2 sm:px-12 sm:py-4 sm:flex-row">
          <div className="flex justify-center">
            <Link href="/">
              <a>
                <Image src={logo} alt="logo" width={36} height={36} />
              </a>
            </Link>
            <Link href="/">
              <a>
                <h1 className="font-handwriting text-rose-500 text-3xl tracking-wider ml-4 translate-y-1">
                  Kattenparadijs
                </h1>
              </a>
            </Link>
          </div>
          <Avatars />
        </div>
      </header>

      <main className="max-w-6xl mx-auto py-6 px-8 sm:px-12 sm:py-8">
        {children}
      </main>
      {showBackToTop && <BackToTop />}
    </div>
  );
}
