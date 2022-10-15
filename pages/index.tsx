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

export interface Cat {
  name: string;
  birthDate: string;
  iconUrl: string;
}

export interface ImageWithDimensions {
  cats: Cat[];
  width: number;
  height: number;
  id: string;
  url: string;
  takenAt?: string;
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
    return (
      <div className="flex flex-col gap-8 items-center justify-center">
        <p className="text-center text-red-500 font-bold">
          Oops! The requested image cannot be found.
        </p>
        <Link href={"/"}>
          <a className="transition-color bg-rose-500 text-white py-3 px-8 rounded-md font-bold hover:bg-rose-400">
            Home
          </a>
        </Link>
      </div>
    );
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

      {images.length > 0 && (
        <div className="columns-2 space-y-8 gap-8 sm:gap-10 md:columns-3">
          {images.map((img) => (
            <div
              className="mb-8 cursor-pointer hover:opacity-95 hover:scale-105 transition-all duration-300"
              key={img.id}
            >
              <Link href={`/?imageId=${img.id}`}>
                <a>
                  <Image
                    src={img.url}
                    width={img.width}
                    height={img.height}
                    alt="kat"
                    className="rounded-xl"
                  />
                </a>
              </Link>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Home;

const query = groq`*[_type == "catimage"]{
  "cats": cat[]->{name, birthDate, "iconUrl": icon.asset->url},
  "id":_id,
  "url": img.asset->url,
  "width": img.asset->metadata.dimensions.width,
  "height": img.asset->metadata.dimensions.height
}`;

export async function getStaticProps() {
  const images: ImageWithDimensions[] = await sanityClient.fetch(query);

  images.forEach(img => console.log(img.cats))
  console.log(images);

  return {
    props: {
      images,
    },
  };
}
