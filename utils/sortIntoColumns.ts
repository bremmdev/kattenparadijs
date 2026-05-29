import { ImageWithDimensions, Video } from "@/types/types";

export const sortImagesIntoColumns = (
  images: Array<ImageWithDimensions>,
  columnCount: number
) => {
  //divide images into columns for masonry layout
  const columns: Array<Array<ImageWithDimensions>> = Array.from({ length: columnCount }, () => []);

  images.forEach((img, idx) => {
    columns[idx % columnCount].push(img);
  });

  return columns;
};


export const sortVideosIntoColumns = (
  videos: Array<Video>,
  columnCount: number
) => {
  //divide images into columns for masonry layout
  const columns: Array<Array<Video>> = Array.from({ length: columnCount }, () => []);

  videos.forEach((video, idx) => {
    columns[idx % columnCount].push(video);
  });

  return columns;
};

