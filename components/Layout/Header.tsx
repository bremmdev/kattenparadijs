import Link from "next/link";
import Image from "next/image";
import Avatars from "@/components/Cat/Avatars";
import logo from "@/public/logo.svg";
import { dancing_script } from "@/app/fonts";

const Header = () => {
  return (
    <header className="border-b-2 border-rose-300 bg-white">
    <div className="flex flex-col max-w-6xl mx-auto px-8 py-2 sm:px-12 sm:py-4 sm:flex-row">
      <div className="flex justify-center">
        <Link href="/">
          <Image src={logo} alt="logo" width={36} height={36} />
        </Link>
        <Link href="/">
          <h1 className={`${dancing_script.className} font-handwriting text-rose-500 text-3xl tracking-wider ml-4 translate-y-1`}>
            Kattenparadijs
          </h1>
        </Link>
      </div>
      <Avatars />
    </div>
  </header>
  )
}

export default Header