import Link from "next/link";

const NotFound = () => {
  return (
    <div className="flex flex-col gap-8 items-center justify-center">
      <p className="text-center text-red-500 font-bold">
        Oops! The requested page cannot be found.
      </p>
      <Link
        href={"/"}
        className="transition-color bg-rose-500 text-white py-3 px-8 rounded-md font-bold hover:bg-rose-400"
      >
        Home
      </Link>
    </div>
  );
};

export default NotFound;
