export function getContainedSize(img: HTMLImageElement) {
  const ratio = img.naturalWidth / img.naturalHeight;
  let imageWidth = img.height * ratio;
  let imageHeight = img.height;
  if (imageWidth > img.width) {
    imageWidth = img.width;
    imageHeight = img.width / ratio;
  }
  return [imageWidth, imageHeight];
}

export const getImageDimensions = (url: string) => {
  const regex = /-(\d+)x(\d+)\.(jpg|jpeg|png|webp|gif)$/i;
  const match = url.match(regex);
  if (!match) {
    return null;
  }
  return {
    width: parseInt(match[1], 10),
    height: parseInt(match[2], 10),
  };
}
