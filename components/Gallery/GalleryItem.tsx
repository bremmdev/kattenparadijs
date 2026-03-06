"use client";

import React, { useRef, useEffect, useState } from "react";
import { ImageWithDimensions, SimilarCatPhotoWithDimensions } from "@/types/types";
import Image from "next/image";
import GalleryActions from "./GalleryActions";

type Props = {
  img: ImageWithDimensions;
  setSelectedImage: React.Dispatch<
    React.SetStateAction<ImageWithDimensions | null>
  >;
  hasPriority?: boolean;
  isLCP?: boolean;
  onSimilarImages?: React.Dispatch<
    React.SetStateAction<Array<SimilarCatPhotoWithDimensions>>
  >;
};

const GalleryItem = (props: Props) => {
  const { img, setSelectedImage, hasPriority, isLCP, onSimilarImages } = props;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isLongPress, setIsLongPress] = useState<boolean>(false);
  const LONG_PRESS_DELAY = 500;

  const handleImageClick = () => {
    if (isLongPress) return;
    React.startTransition(() => {
      //disable view transition for the bio content to prevent it from animating
      document
        .getElementById("bio-content")
        ?.classList.add("disable-viewtransition");
      setSelectedImage(img);
    });
  };

  const hasMultipleCats = img.cats.length > 1;

  const handleMouseDown = () => {
    if (timerRef.current) return;
    timerRef.current = setTimeout(() => setIsLongPress(true), LONG_PRESS_DELAY);
  }

  const handleMouseUp = () => {
    if (!timerRef.current) return;
    clearTimeout(timerRef.current);
    timerRef.current = null;
    setIsLongPress(false);
  }

  // Prevent context menu from appearing on long press
  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
  }

  return (
    <div className="group relative cursor-pointer hover:opacity-95 hover:scale-105 transition-all duration-300" onPointerDown={handleMouseDown} onPointerUp={handleMouseUp} onContextMenu={handleContextMenu}>
      <GalleryActions isLongPress={isLongPress} takenAt={img.takenAt as string} cat={img.cats[0].name} isVideo={false} birthDate={hasMultipleCats ? undefined : img.cats[0].birthDate} onSimilarImages={onSimilarImages} isMultipleCats={hasMultipleCats} imageUrl={img.url} id={img.id as string} />
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
