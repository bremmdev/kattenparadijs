"use client";

import { ImageWithDimensions, SimilarCatPhotoWithDimensions } from "@/types/types";
import GalleryItem from "./GalleryItem";
import React from "react";
import Modal from "../Modal";
import SelectRandomCat from "./SelectRandomCat";
import Image from "next/image";
import SimilarCatsModal from "../SimilarCatsModal";
import useHandleClickOutsideImage from "@/hooks/useHandleClickOutsideImage";
import { sortImagesIntoColumns } from "@/utils/sortIntoColumns";
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

  const [similarImages, setSimilarImages] = React.useState<Array<SimilarCatPhotoWithDimensions>>([]);

  const [columnsMobile, setColumnsMobile] = React.useState<
    Array<Array<ImageWithDimensions>>
  >(() => sortImagesIntoColumns(images, 2));

  const [columnsDesktop, setColumnsDesktop] = React.useState<
    Array<Array<ImageWithDimensions>>
  >(() => sortImagesIntoColumns(images, 4));

  const modalRef = React.useRef<HTMLDivElement>(null);

  const handleClose = (e: React.MouseEvent | KeyboardEvent) => {
    if (e instanceof KeyboardEvent && e.key === "Escape") {
      setSelectedImage(null);
      return;
    }

    const img = modalRef.current?.querySelector("img")!;
    const hasClickedOutsideOfImage = useHandleClickOutsideImage(e as React.MouseEvent, img);

    if (hasClickedOutsideOfImage) {
      setSelectedImage(null);
    }
  };

  React.useEffect(() => {
    const columnsMobile = sortImagesIntoColumns(images, 2);
    setColumnsMobile(columnsMobile);
    const columnsDesktop = sortImagesIntoColumns(images, 4);
    setColumnsDesktop(columnsDesktop);
  }, [data]);

  // only on home page or all cats page as other pages have banner images
  const useLCPImage = !isDetail || queryArg === "all";

  // get the top row and find the tallest image among them
  function getLCPImageId(columns: Array<Array<ImageWithDimensions>>) {
    let topRowImages: Array<ImageWithDimensions> = columns
      .map((c) => c.slice(0, 1))
      .flat();
    if (topRowImages.length === 0) return null;

    const lcpImage = topRowImages.reduce((max, current) => {
      return current.height > max.height ? current : max;
    }, topRowImages[0]); // Default to the first one if all else fails

    return lcpImage.id;
  }

  const mobileLCPImageId = getLCPImageId(columnsMobile);
  const desktopLCPImageId = getLCPImageId(columnsDesktop);


  const handleClearSimilarImages = () => {
    setSimilarImages([]);
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

      {similarImages.length > 0 && (
        <SimilarCatsModal images={similarImages} onClose={handleClearSimilarImages} />
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

      {/* 
        Each column is an array of images that should be displayed as a flex column, 
        so we can use break-inside-avoid to prevent images from being taken out of their column
        We render the layout twice, once for small screens (2 columns) and once for large screens (4 columns)
        This way we don't have any layout shifts on page load and the images are displayed immediately without loading indicator 
      */}
      <ViewTransition>
        <div className="columns-2 gap-5 md:hidden">
          {columnsMobile.map((column, idx) => (
            <div
              key={idx}
              className="flex flex-col gap-3 items-center break-inside-avoid"
            >
              {column.map((img, idx) => (
                <GalleryItem
                  hasPriority={idx < 3}
                  key={img.id}
                  img={img}
                  isLCP={img.id === mobileLCPImageId && useLCPImage}
                  setSelectedImage={setSelectedImage}
                  onSimilarImages={setSimilarImages}
                />
              ))}
            </div>
          ))}
        </div>
      </ViewTransition>

      {/*each column is an array of images that should be displayed as a flex column, 
      so we can use break-inside-avoid to prevent images from being taken out of their column*/}
      <ViewTransition>
        <div className="columns-4 gap-5 hidden md:block">
          {columnsDesktop.map((column, idx) => (
            <div
              key={idx}
              className="flex flex-col gap-3 items-center break-inside-avoid"
            >
              {column.map((img, idx) => (
                <GalleryItem
                  hasPriority={idx < 3}
                  key={img.id}
                  img={img}
                  isLCP={img.id === desktopLCPImageId && useLCPImage}
                  setSelectedImage={setSelectedImage}
                  onSimilarImages={setSimilarImages}
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
