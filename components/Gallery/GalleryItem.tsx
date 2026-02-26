"use client";

import React from "react";
import { ImageWithDimensions } from "@/types/types";
import Image from "next/image";
import GalleryActions from "./GalleryActions";

type Props = {
  img: ImageWithDimensions;
  setSelectedImage: React.Dispatch<
    React.SetStateAction<ImageWithDimensions | null>
  >;
  hasPriority?: boolean;
  isLCP?: boolean;
};

const GalleryItem = (props: Props) => {
  const { img, setSelectedImage, hasPriority, isLCP } = props;

  const handleImageClick = () => {
    React.startTransition(() => {
      //disable view transition for the bio content to prevent it from animating
      document
        .getElementById("bio-content")
        ?.classList.add("disable-viewtransition");
      setSelectedImage(img);
    });
  };

  const hasMultipleCats = img.cats.length > 1;


  return (
    <div className="group relative cursor-pointer hover:opacity-95 hover:scale-105 transition-all duration-300">

      <GalleryActions takenAt={img.takenAt as string} isVideo={false} birthDate={hasMultipleCats ? undefined : img.cats[0].birthDate} isMultipleCats={hasMultipleCats} imageUrl={img.url} id={img.id as string} />
      <button onClick={handleImageClick}>
        <Image
          src={img.url}
          width={img.width / 2}
          height={img.height / 2}
          alt="kat"
          className="rounded-xl"
          blurDataURL={img.blurData}
          priority={hasPriority}
          fetchPriority={isLCP ? "high" : "auto"}
        />
      </button>
    </div>
  );
};

export default GalleryItem;
