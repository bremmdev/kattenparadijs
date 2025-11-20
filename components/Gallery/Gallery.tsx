"use client";

import { ImageWithDimensions } from "@/types/types";
import GalleryItem from "./GalleryItem";
import React from "react";
import Modal from "../Modal";
import SelectRandomCat from "./SelectRandomCat";
import Image from "next/image";
import useHandleClickOutsideImage from "@/hooks/useHandleClickOutsideImage";
import { sortImagesIntoColumns } from "@/utils/sortIntoColumns";
import { useColumns } from "@/hooks/useColumns";
import { useImages } from "@/hooks/useImages";
import FetchMoreBtn from "./FetchMoreBtn";
import { Cat } from "@/types/types";
import { ViewTransition } from "react";
import CatCount from "./CatCount";

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
  const images = data?.pages.flatMap((page) => page.images) ?? [];
  const catImageCount = data?.pages[0]?.count ?? 0;

  /* STATE */
  const [selectedImage, setSelectedImage] =
    React.useState<ImageWithDimensions | null>(null);
  const [columns, setColumns] = React.useState<
    Array<Array<ImageWithDimensions>>
  >(() => sortImagesIntoColumns(images, 4));

  //determine how many columns to display based on screen width
  const columnCount = useColumns("images");

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

  /* 
    LOGIC TO DETERMINE LCP IMAGE
    1. Get all images in the first 3 rows of each column (to account for different image heights)
    2. Check if any of these images are in the first row
    3. If yes, pick the first one that is in the first row, if no, pick the first image from the candidates
    4. If no candidates, pick the very first image in the gallery
  */

  let LCPImageCandidates: Array<ImageWithDimensions> = [];
  let hasLCPImage = false;
  let LCPImage = null;
  // only on home page or all cats page
  if (!isDetail || queryArg === "all") {
    LCPImageCandidates = columns
      .map((c) => c.slice(0, 3))
      .flat()
      .filter((img) => img.height > img.width);

    hasLCPImage = LCPImageCandidates.length > 0;

    const topRow = columns.map((c) => c[0]);
    const isLCPInTopRow = LCPImageCandidates.some((img) =>
      topRow.includes(img)
    );

    LCPImage = hasLCPImage
      ? isLCPInTopRow
        ? LCPImageCandidates.find((img) => topRow.includes(img))!
        : LCPImageCandidates[0]
      : images[0];
  }

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

      {!isDetail && (
        <>
          <SelectRandomCat
            images={images}
            setSelectedImage={setSelectedImage}
          />
          <CatCount count={catImageCount} />
        </>
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
                  isLCP={img.id === LCPImage?.id}
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
