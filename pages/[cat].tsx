import { GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import { sanityClient } from "../sanity";
import { groq } from "next-sanity";
import { ImageWithDimensions } from "./index";
import Link from "next/link";
import Image from "next/image";
import Gallery from "../components/Gallery/Gallery";
import { useRef } from "react";
import { getContainedSize } from "../utils/getContainedSize";
import Modal from "../components/Modal";
import ImageNotFound from '../components/UI/ImageNotFound'

interface CatName {
  name: string;
}

const Cat: NextPage<{ images: ImageWithDimensions[] }> = ({ images }) => {
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);
  console.log(router)

  let selectedImage: ImageWithDimensions | undefined;
  let returnPath = ''

  if (router.query.imageId) {
    selectedImage = images.find((image) => image.id === router.query.imageId);
    returnPath = router.query.cat as string
  }

  const handleClose = (e: React.MouseEvent) => {
    //image size can be altered because of object-fit, so we need the contained size of the image, not the 'full' size of the image
    const [imageWidth, imageHeight] = getContainedSize(
      modalRef.current?.querySelector("img")!
    );
    const viewport = window.innerWidth;
    const viewportHeight = window.innerHeight;

    //we know the viewport size and the image size, so we can use pageX and pageY to determine if the user clicked outside the image
    const hasClickedOutsideOfImage =
      e.pageX < viewport / 2 - imageWidth / 2 ||
      e.pageX > viewport / 2 + imageWidth / 2 ||
      e.pageY < viewportHeight / 2 - imageHeight / 2 ||
      e.pageY > viewportHeight / 2 + imageHeight / 2;

    if (hasClickedOutsideOfImage) {
      router.push(router.query.cat as string);
    }
  };

  //handle invalid query param error
  if (router.query.imageId && !selectedImage) {
    return <ImageNotFound returnPath={returnPath}/>
  }

  return (
    <>
      {images.length === 0 && (
        <p className="text-center">There are no images yet.</p>
      )}

      {images.length > 0 && router.query.imageId && selectedImage && (
        <Modal ref={modalRef} onClose={handleClose}>
          <Image
            src={selectedImage.url}
            layout="fill"
            alt="kat"
            className="object-contain"
          />
        </Modal>
      )}

      {images.length > 0 && <Gallery path={router.asPath} images={images} />}
    </>
  );
};

export default Cat;

export async function getStaticPaths() {
  const catNames: CatName[] = await sanityClient.fetch(
    groq`*[_type == "cat"]{ name }`
  );

  //create paths for all the cats
  const paths = catNames.map((catName) => ({ params: { cat: catName.name } }));

  //add an extra path for the page that has photos with multiple cats
  paths.push({ params: { cat: "all" } });

  return {
    paths,
    fallback: false,
  };
}

export const getStaticProps: GetStaticProps = async (context) => {
  const cat = context?.params?.cat;
  console.log(cat);

  //query for pictures with single cat
  let queryFilter = `"${cat}" in cat[]->name && length(cat) == 1`;

  //query for pictures with multiple cats
  if (cat === "all") {
    queryFilter = `length(cat) > 1`;
  }

  const query = groq`*[_type == "catimage" && ${queryFilter}] | order(_createdAt desc) {
    "cats": cat[]->{name, birthDate, "iconUrl": icon.asset->url},
    "id":_id,
    "url": img.asset->url,
    "width": img.asset->metadata.dimensions.width,
    "height": img.asset->metadata.dimensions.height
  }`;

  const images: ImageWithDimensions[] = await sanityClient.fetch(query);
  // console.log(images);

  return {
    props: {
      images,
    },
  };
};
