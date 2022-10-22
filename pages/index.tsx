import type { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import Image from "next/image";
import React, { useRef } from "react";
import { getContainedSize } from "../utils/getContainedSize";
import { useRouter } from "next/router";
import Modal from "../components/Modal";
import { sanityClient } from "../sanity";
import { groq } from "next-sanity";
import { imageConfigDefault } from "next/dist/shared/lib/image-config";
import Gallery from "../components/Gallery/Gallery";
import ImageNotFound from "../components/UI/ImageNotFound";

export interface Cat {
  name: string;
  birthDate: string;
  iconUrl: string;
  nicknames: string[]
}

export interface ImageWithDimensions {
  cats: Cat[];
  width: number;
  height: number;
  id: string;
  url: string;
  takenAt?: string;
  blurData: string;
}

const Home: NextPage<{ images: ImageWithDimensions[] }> = ({ images }) => {
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);

  let selectedImage: ImageWithDimensions | undefined;

  if (router.query.imageId) {
    selectedImage = images.find((image) => image.id === router.query.imageId);
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
      router.push("/");
    }
  };

  //handle invalid query param error
  if (router.query.imageId && !selectedImage) {
    if (router.query.imageId && !selectedImage) {
      return <ImageNotFound returnPath={"/"} />;
    }
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

      {images.length > 0 && <Gallery images={images} />}
    </>
  );
};

export default Home;

const query = groq`*[_type == "catimage"] | order(_createdAt desc) {
  "cats": cat[]->{name, birthDate, "iconUrl": icon.asset->url, nicknames},
  "id":_id,
  "url": img.asset->url,
  "width": img.asset->metadata.dimensions.width,
  "height": img.asset->metadata.dimensions.height,
  "blurData": img.asset->metadata.lqip
}`;

export async function getStaticProps() {
  const images: ImageWithDimensions[] = await sanityClient.fetch(query);

  // images.forEach((img) => console.log(img.cats));
  // console.log('xxx', images);

  return {
    props: {
      images,
    },
    revalidate:60
  };
}
