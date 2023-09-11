import { ImageWithDimensions } from "@/types/types";
import GalleryItem from "./GalleryItem";
import React from "react";
import Modal from "../Modal";
import { useRouter } from "next/router";
import SelectRandomCat from "./SelectRandomCat";
import Image from "next/image";
import useHandleClickOutsideImage from "@/hooks/useHandleClickOutsideImage";
import { sortImagesIntoColumns } from "@/utils/sortImagesIntoColumns";
import { useColumns } from "@/hooks/useColumns";

type Props = {
  images: Array<ImageWithDimensions>;
};

const Gallery = (props: Props) => {
  const { images } = props;

  /* STATE */
  const [selectedImage, setSelectedImage] =
    React.useState<ImageWithDimensions | null>(null);
  const [columns, setColumns] = React.useState<
    Array<Array<ImageWithDimensions>>
  >(() => sortImagesIntoColumns(images, 4));

  //determine how many columns to display based on screen width
  const columnCount = useColumns();

  const isIndexPage = useRouter().pathname === "/";
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
  }, [images, columnCount]);

  return (
    <>
      {selectedImage && (
        <Modal ref={modalRef} onClose={handleClose}>
          <Image
            src={selectedImage.url}
            fill
            alt="kat"
            className="object-contain"
          />
        </Modal>
      )}

      {isIndexPage && (
        <SelectRandomCat images={images} setSelectedImage={setSelectedImage} />
      )}

      {/*each column is an array of images that should be displayed as a flex column, 
      so we can use break-inside-avoid to prevent images from being taken out of their column*/}
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
    </>
  );
};

export default Gallery;
