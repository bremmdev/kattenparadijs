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
