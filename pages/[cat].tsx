import { GetStaticPropsContext, InferGetStaticPropsType, NextPage } from "next";
import { useRouter } from "next/router";
import { sanityClient } from "../sanity";
import { groq } from "next-sanity";
import type { ImageWithDimensions, Cat } from "../types/types";
import Image from "next/image";
import Gallery from "../components/Gallery/Gallery";
import { useRef } from "react";
import Modal from "../components/Modal";
import ImageNotFound from "../components/UI/ImageNotFound";
import Bio from "../components/Cat/Bio";
import Confetti from "react-confetti";
import useWindowSize from "../hooks/useWindowSize";
import React from "react";
import { checkBirthday } from "../utils/checkBirthday";
import useHandleClickOutsideImage from "../hooks/useHandleClickOutsideImage";

const CatPage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  images,
  cat,
}) => {
  const { width: windowWidth, height: windowHeight } = useWindowSize();
  const [showConfetti, setShowConfetti] = React.useState(false);

  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);

  let selectedImage: ImageWithDimensions | undefined;
  let returnPath = "";

  if (router.query.imageId) {
    selectedImage = images.find((image) => image.id === router.query.imageId);
    returnPath = router.query.cat as string;
  }

  const handleClose = (e: React.MouseEvent) => {
    const img = modalRef.current?.querySelector("img")!;
    const hasClickedOutsideOfImage = useHandleClickOutsideImage(e, img);

    if (hasClickedOutsideOfImage) {
      router.push(
        {
          pathname: router.query.cat as string,
        },
        undefined,
        { scroll: false }
      );
    }
  };

  React.useEffect(() => {
    const istBirthday = checkBirthday(cat?.birthDate);

    if (istBirthday) {
      setShowConfetti(true);
    } else {
      setShowConfetti(false);
    }
  }, [cat]);

  //handle invalid query param error
  if (router.query.imageId && !selectedImage) {
    return <ImageNotFound returnPath={returnPath} />;
  }

  return (
    <>
      {showConfetti && <Confetti width={windowWidth} height={windowHeight} />}
      {cat && <Bio cat={cat} key={cat.name} />}

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

export default CatPage;

export async function getStaticPaths() {
  const catNames: Array<Pick<Cat, "name">> = await sanityClient.fetch(
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

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const catParam = context?.params?.cat as string;

  //query for pictures with single cat
  let queryFilter = `"${catParam}" in cat[]->name && length(cat) == 1`;

  //query for pictures with multiple cats
  if (catParam === "all") {
    queryFilter = `length(cat) > 1`;
  }

  const query = groq`*[_type == "catimage" && ${queryFilter}] | order(_createdAt desc) {
    "cats": cat[]->{name, birthDate, "iconUrl": icon.asset->url},
    "id":_id,
    "url": img.asset->url,
    "width": img.asset->metadata.dimensions.width,
    "height": img.asset->metadata.dimensions.height,
    "blurData": img.asset->metadata.lqip,
    takenAt
  }`;

  const images: ImageWithDimensions[] = await sanityClient.fetch(query);

  const cats: Cat[] =
    (await sanityClient.fetch(groq`*[_type == "cat"]{
    name,
    birthDate,
    "iconUrl": icon.asset->url,
    nicknames
  }`)) ?? [];

  //get cat based on query param
  const selectedCat = cats.find((cat) => cat.name === catParam) || null;

  return {
    props: {
      images,
      cat: selectedCat,
    },
  };
};
