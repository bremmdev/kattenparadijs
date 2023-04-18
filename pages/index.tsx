import type { InferGetStaticPropsType, NextPage } from "next";
import Image from "next/image";
import React, { useRef } from "react";
import useHandleClickOutsideImage from "../hooks/useHandleClickOutsideImage";
import { useRouter } from "next/router";
import Modal from "../components/Modal";
import { sanityClient } from "../sanity";
import { groq } from "next-sanity";
import Gallery from "../components/Gallery/Gallery";
import ImageNotFound from "../components/UI/ImageNotFound";
import SelectRandomCat from "../components/Gallery/SelectRandomCat";
import type { ImageWithDimensions, Cat } from "../types/types";
import Head from "next/head";

const Home: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  images,
}) => {
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);

  let selectedImage: ImageWithDimensions | undefined;

  if (router.query.imageId) {
    selectedImage = images.find((image) => image.id === router.query.imageId);
  }

  const handleClose = (e: React.MouseEvent) => {
    const img = modalRef.current?.querySelector("img")!;
    const hasClickedOutsideOfImage = useHandleClickOutsideImage(e, img);

    if (hasClickedOutsideOfImage) {
      router.push(
        {
          pathname: "/",
        },
        undefined,
        { scroll: false }
      );
    }
  };

  //handle invalid query param error
  if (router.query.imageId && !selectedImage) {
    return <ImageNotFound returnPath={"/"} />;
  }

  return (
    <>
      <Head>
        <title>Kattenparadijs</title>
        <meta
          property="og:image"
          content="https://raw.githubusercontent.com/bremmdev/kattenparadijs/main/public/og-home.png"
        />
      </Head>
      {images.length === 0 && (
        <p className="text-center">There are no images yet.</p>
      )}

      {images.length > 0 && router.query.imageId && selectedImage && (
        <Modal ref={modalRef} onClose={handleClose}>
          <Image
            src={selectedImage.url}
            fill
            alt="kat"
            className="object-contain"
          />
        </Modal>
      )}

      {images.length > 0 && (
        <>
          <SelectRandomCat images={images} />
          <Gallery images={images} />
        </>
      )}
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
  "blurData": img.asset->metadata.lqip,
  takenAt
}`;

export async function getStaticProps() {
  const images: Array<ImageWithDimensions> = await sanityClient.fetch(query);

  return {
    props: {
      images,
    },
  };
}
