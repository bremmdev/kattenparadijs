"use client";

import React from "react";
import Image from "next/image";
import { SimilarCatPhotoWithDimensions } from "@/types/types";

type Props = {
  images: Array<SimilarCatPhotoWithDimensions>;
  onClose: () => void;
};

const SimilarCatsModal = ({ images, onClose }: Props) => {
  React.useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscapeKey);
    return () => window.removeEventListener("keydown", handleEscapeKey);
  }, [onClose]);

  React.useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div
      className="fixed z-50 inset-0 bg-black/80 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="grid grid-cols-2 grid-rows-2 gap-4 w-[85vmin] h-[85vmin]"
        onClick={(e) => e.stopPropagation()}
      >
        {images.map((img) => (
          <div
            key={img.id}
            className="relative overflow-hidden rounded-xl"
          >
            <Image
              src={img.imageUrl}
              alt="kat"
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimilarCatsModal;
