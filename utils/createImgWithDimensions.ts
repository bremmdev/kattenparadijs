import { ImageType } from "../pages";
import probe from "probe-image-size";

export async function createImgWithDimensions(img: ImageType) {
  //get the width and height from the img url
  let result = await probe(img.url);
  return {
    ...img,
    width: result.width,
    height: result.height,
  };
}