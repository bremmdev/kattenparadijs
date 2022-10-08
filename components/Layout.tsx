import Image from "next/image";
import logo from "../public/logo.svg";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b-2 border-rose-300 bg-white">
        <div className="flex items-center max-w-6xl mx-auto px-8 py-4 sm:px-12">
          <Image src={logo} alt="logo" width={42} height={42} />
          <h1 className="font-handwriting text-rose-500 text-3xl tracking-wider ml-6">
            Kattenparadijs
          </h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto py-12 px-8 sm:px-12">{children}</main>
    </div>
  );
}
