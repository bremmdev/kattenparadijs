'use client';

import { ImageWithDimensions } from "@/types/types";
import Image from "next/image";
import ExtraInfo from "./ExtraInfo";

type Props = {
  img: ImageWithDimensions;
  setSelectedImage: React.Dispatch<
    React.SetStateAction<ImageWithDimensions | null>
  >;
  hasPriority?: boolean;
};

const GalleryItem = (props: Props) => {
  const { img, setSelectedImage, hasPriority } = props;

  const handleImageClick = () => {
    setSelectedImage(img);
  };

  //only show extra info if image has takenAt property and there is only one cat in the image
  const hasExtraInfo = Boolean(img.takenAt) && img.cats.length === 1;

  return (
    <div className="relative cursor-pointer hover:opacity-95 hover:scale-105 transition-all duration-300">
      {hasExtraInfo && (
        <ExtraInfo
          birthDate={img.cats[0].birthDate}
          takenAt={img.takenAt as string}
        />
      )}

      <button onClick={handleImageClick}>
        <Image
          src={img.url}
          width={img.width / 2}
          height={img.height / 2}
          alt="kat"
          className="rounded-xl"
          placeholder="blur"
          blurDataURL={img.blurData}
          priority={hasPriority}
        />
      </button>
    </div>
  );
};

export default GalleryItem;
