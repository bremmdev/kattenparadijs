import Link from "next/link";

const NotFound = () => {
  return (
    <div className="flex flex-col gap-8 items-center justify-center">
      <p className="text-center text-theme text-sm sm:text-base font-bold">
        Oops! The requested page cannot be found.
      </p>
      <Link
        href={"/"}
        className="transition-color bg-theme text-white py-3 px-8 rounded-md font-bold hover:bg-theme/90"
      >
        Home
      </Link>
    </div>
  );
};

export default NotFound;
