import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ImageWithDimensions } from "../../pages";
import styles from './Gallery.module.css'

type Props = {
  images: ImageWithDimensions[];
  path?: string
};

const Gallery = (props: Props) => {

  const { images, path } = props

  return (
    <div className="columns-2 space-y-4 gap-6 sm:columns-3 md:columns-4">
      {images.map((img) => (
        <div
          className="cursor-pointer hover:opacity-95 hover:scale-105 transition-all duration-300"
          key={img.id}
        >
          <Link href={`${path ?? ''}/?imageId=${img.id}`}>
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
      ))}
    </div>
  );
};

export default Gallery;
