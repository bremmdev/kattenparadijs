import { ImageWithDimensions } from "../../types/types";
import GalleryItem from "./GalleryItem";

type Props = {
  images: ImageWithDimensions[];
  path?: string;
};

const Gallery = (props: Props) => {
  const { images, path } = props;

  return (
    <div className="columns-2 space-y-4 gap-6 sm:columns-3 md:columns-4">
      {images.map((img) => (
        <GalleryItem key={img.id} img={img} path={path} />
      ))}
    </div>
  );
};

export default Gallery;
