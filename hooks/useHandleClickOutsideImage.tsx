import React from "react";
import { getContainedSize } from "@/utils/getContainedSize";

const useHandleClickOutsideImage = (
  e: React.MouseEvent,
  img: HTMLImageElement
) => {
  //image size can be altered because of object-fit, so we need the contained size of the image, not the 'full' size of the image
  const [imageWidth, imageHeight] = getContainedSize(img);
  const viewport = window.innerWidth;
  const viewportHeight = window.innerHeight;

  //we know the viewport size and the image size, so we can use pageX and pageY to determine if the user clicked outside the image
  const hasClickedOutsideOfImage =
    e.pageX < viewport / 2 - imageWidth / 2 ||
    e.pageX > viewport / 2 + imageWidth / 2 ||
    (e.pageY - window.scrollY) < viewportHeight / 2 - imageHeight / 2 ||
    (e.pageY - window.scrollY) > viewportHeight / 2 + imageHeight / 2;

  return hasClickedOutsideOfImage;
};

export default useHandleClickOutsideImage;
