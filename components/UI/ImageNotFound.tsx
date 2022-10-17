import React from "react";
import Link from "next/link";

type Props = {
  returnPath: string;
};

const ImageNotFound = (props: Props) => {
  return (
    <div className="flex flex-col gap-8 items-center justify-center">
      <p className="text-center text-red-500 font-bold">
        Oops! The requested image cannot be found.
      </p>
      <Link href={props.returnPath}>
        <a className="transition-color bg-rose-500 text-white py-3 px-8 rounded-md font-bold hover:bg-rose-400">
          {props.returnPath === "/" ? "Home" : "Back"}
        </a>
      </Link>
    </div>
  );
};

export default ImageNotFound;
