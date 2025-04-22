"use client";

import React from "react";
import { ImageWithDimensions } from "@/types/types";
import { flushSync } from "react-dom";

type Props = {
  images: Array<ImageWithDimensions>;
  setSelectedImage: React.Dispatch<
    React.SetStateAction<ImageWithDimensions | null>
  >;
};

const SelectRandomCat = (props: Props) => {
  const { images, setSelectedImage } = props;

  const handleOnClick = () => {
    const rndIdx = Math.floor(Math.random() * images.length);
    const randomImg = images[rndIdx];

    if ("startViewTransition" in document) {
      document.startViewTransition(() => {
        document.getElementById("bio-content")?.classList.add("disable-viewtransition");
        flushSync(() => setSelectedImage(randomImg));
      });
    } else {
      setSelectedImage(randomImg);
    }
  };

  return (
    <button
      className="flex justify-center items-center mb-6 transition-all duration-300 text-slate-600 text-3xl font-bold rounded-full mx-auto size-12 text-center bg-radial from-theme-lightest to-theme-light hover:scale-110 hover:brightness-105"
      onClick={handleOnClick}
    >
      ?
    </button>
  );
};

export default SelectRandomCat;
