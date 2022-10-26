import React from "react";
import { ImageWithDimensions } from "../../pages";
import Image from "next/image";
import Link from "next/link";
import ExtraInfo from "./ExtraInfo";

type Props = {
  img: ImageWithDimensions;
  path?: string;
};

const GalleryItem = (props: Props) => {
  const { img, path } = props;

  //only show extra info if image has takenAt property and there is only one cat in the image
  const hasExtraInfo = Boolean(img.takenAt) && img.cats.length === 1;

  return (
    <div
      className="relative cursor-pointer hover:opacity-95 hover:scale-105 transition-all duration-300"
      key={img.id}
    >
      {hasExtraInfo && (
        <ExtraInfo
          birthDate={img.cats[0].birthDate}
          takenAt={img.takenAt as string}
        />
      )}

      <Link href={`${path ?? ""}/?imageId=${img.id}`}>
        <a>
          <Image
            src={img.url}
            width={img.width / 2}
            height={img.height / 2}
            alt="kat"
            className="rounded-xl"
            placeholder="blur"
            blurDataURL={img.blurData}
          />
        </a>
      </Link>
    </div>
  );
};

export default GalleryItem;
