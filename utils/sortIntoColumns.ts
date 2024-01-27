import { ImageWithDimensions, Video } from "@/types/types";

export const sortImagesIntoColumns = (
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


export const sortVideosIntoColumns = (
  videos: Array<Video>,
  columnCount: number
) => {
  //divide images into columns for masonry layout
  const columns: Array<Array<Video>> = [[], [], []];

  videos.forEach((video, idx) => {
    columns[idx % columnCount].push(video);
  });

  return columns;
};

