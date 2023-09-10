import { ImageWithDimensions } from "@/types/types";
import GalleryItem from "./GalleryItem";
import React from "react";
import Modal from "../Modal";
import { useRouter } from "next/router";
import SelectRandomCat from "./SelectRandomCat";
import Image from "next/image";
import useHandleClickOutsideImage from "@/hooks/useHandleClickOutsideImage";

type Props = {
  images: Array<ImageWithDimensions>;
  path?: string;
};

const sortImagesIntoColumns = (
  images: Array<ImageWithDimensions>,
  columnCount: number
) => {
  //divide images into columns for masonry layout
  const columns: Array<Array<ImageWithDimensions>> = [[], [], [], []];

  images.forEach((img, idx) => {
    columns[idx % columnCount].push(img);
  });

  return columns;
};

const Gallery = (props: Props) => {
  const { images } = props;

  const isIndexPage = useRouter().pathname === "/";

  const [selectedImage, setSelectedImage] =
    React.useState<ImageWithDimensions | null>(null);
  const [columns, setColumns] = React.useState<
    Array<Array<ImageWithDimensions>>
  >(() => sortImagesIntoColumns(images, 4));
  const [columnCount, setColumnCount] = React.useState<number>(4);

  const modalRef = React.useRef<HTMLDivElement>(null);

  const handleClose = (e: React.MouseEvent) => {
    const img = modalRef.current?.querySelector("img")!;
    const hasClickedOutsideOfImage = useHandleClickOutsideImage(e, img);

    if (hasClickedOutsideOfImage) {
      setSelectedImage(null);
    }
  };

  const onSelectRandom = () => {
    const rndIdx = Math.floor(Math.random() * images.length);
    const randomImg = images[rndIdx];
    setSelectedImage(randomImg);
  };

  React.useEffect(() => {
    //resize handler
    const handleResize = () => {
      const width = window.innerWidth;

      if (width < 640) {
        setColumnCount(2);
        return;
      }
      if (width < 960) {
        setColumnCount(3);
        return;
      }
      setColumnCount(4);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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

      {isIndexPage && <SelectRandomCat onClick={onSelectRandom} />}

      {/*each column is an array of images that should be displayed as a flex column, 
      so we can use break-inside-avoid to prevent images from being taken out of their column*/}
      <div className="columns-2 space-y-4 gap-5 sm:columns-3 md:columns-4">
        {columns.map((column, idx) => (
          <div key={idx} className="flex flex-col gap-5 break-inside-avoid">
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
