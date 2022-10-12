export function getContainedSize(img: HTMLImageElement) {
  var ratio = img.naturalWidth/img.naturalHeight
  var imageWidth = img.height*ratio
  var imageHeight = img.height
  if (imageWidth > img.width) {
    imageWidth = img.width
    imageHeight = img.width/ratio
  }
  return [imageWidth, imageHeight]
}