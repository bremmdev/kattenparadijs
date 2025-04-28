"use client";

import { ImageWithDimensions } from "@/types/types";
import GalleryItem from "./GalleryItem";
import React from "react";
import Modal from "../Modal";
import { usePathname } from "next/navigation";
import SelectRandomCat from "./SelectRandomCat";
import Image from "next/image";
import useHandleClickOutsideImage from "@/hooks/useHandleClickOutsideImage";
import { sortImagesIntoColumns } from "@/utils/sortIntoColumns";
import { useColumns } from "@/hooks/useColumns";
import { useImages } from "@/hooks/useImages";
import FetchMoreBtn from "./FetchMoreBtn";
import { Cat } from "@/types/types";
import { unstable_ViewTransition as ViewTransition } from "react";

type Props = {
  cat: Cat | null;
  isDetail?: boolean;
};

const Gallery = ({ cat, isDetail }: Props) => {
  //Determine if we should fetch all images or only images of a specific cat
  let queryArg = undefined;
  if (isDetail) {
    queryArg = cat?.name ?? "all";
  }

  const { data, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useImages(queryArg);
  const images = data?.pages.flat() ?? [];
  const pathname = usePathname();

  /* STATE */
  const [selectedImage, setSelectedImage] =
    React.useState<ImageWithDimensions | null>(null);
  const [columns, setColumns] = React.useState<
    Array<Array<ImageWithDimensions>>
  >(() => sortImagesIntoColumns(images, 4));

  //determine how many columns to display based on screen width
  const columnCount = useColumns("images");

  const isIndexPage = pathname === "/";
  const modalRef = React.useRef<HTMLDivElement>(null);

  const handleClose = (e: React.MouseEvent) => {
    const img = modalRef.current?.querySelector("img")!;
    const hasClickedOutsideOfImage = useHandleClickOutsideImage(e, img);

    if (hasClickedOutsideOfImage) {
      setSelectedImage(null);
    }
  };

  React.useEffect(() => {
    const columns = sortImagesIntoColumns(images, columnCount);
    setColumns(columns);
  }, [data, columnCount]);

  return (
    <>
      {selectedImage && (
        <ViewTransition enter="fade-in">
          <Modal ref={modalRef} onClose={handleClose}>
            <Image
              src={selectedImage.url}
              fill
              alt="kat"
              className="object-contain"
            />
          </Modal>
        </ViewTransition>
      )}

      {isIndexPage && (
          <SelectRandomCat
            images={images}
            setSelectedImage={setSelectedImage}
          />
      )}

      {/*each column is an array of images that should be displayed as a flex column, 
      so we can use break-inside-avoid to prevent images from being taken out of their column*/}
      <ViewTransition>
      <div className="columns-2 gap-5 sm:columns-3 md:columns-4">
        {columns.map((column, idx) => (
          <div
            key={idx}
            className="flex flex-col gap-3 items-center break-inside-avoid"
          >
            {column.map((img, idx) => (
              <GalleryItem
                hasPriority={idx < 3}
                key={img.id}
                img={img}
                setSelectedImage={setSelectedImage}
              />
            ))}
          </div>
        ))}
      </div>
      </ViewTransition>
      {hasNextPage && (
        <FetchMoreBtn
          isFetching={isFetching}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
        />
      )}
    </>
  );
};

export default Gallery;
