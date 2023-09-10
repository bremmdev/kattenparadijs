import React from "react";

type Props = React.ComponentPropsWithoutRef<"button">;

const SelectRandomCat = (props: Props) => {
  return (
    <button
      className="flex justify-center items-center mb-6 transition-all duration-300 text-slate-500 text-3xl font-bold rounded-full mx-auto w-12 h-12 text-center bg-gradient-radial from-rose-100 via-rose-200 to-rose-300 hover:scale-110 hover:brightness-105"
      {...props}
    >
      ?
    </button>
  );
};

export default SelectRandomCat;
