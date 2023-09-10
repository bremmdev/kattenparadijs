import { GetStaticPropsContext, InferGetStaticPropsType, NextPage } from "next";
import { useRouter } from "next/router";
import { sanityClient } from "@/sanity";
import { groq } from "next-sanity";
import type { ImageWithDimensions, Cat, CatName } from "@/types/types";
import Image from "next/image";
import Gallery from "@/components/Gallery/Gallery";
import { useRef } from "react";
import Modal from "@/components/Modal";
import ImageNotFound from "@/components/UI/ImageNotFound";
import Bio from "@/components/Cat/Bio";
import Confetti from "react-confetti";
import useWindowSize from "@/hooks/useWindowSize";
import React from "react";
import { checkBirthday } from "@/utils/checkBirthday";
import useHandleClickOutsideImage from "@/hooks/useHandleClickOutsideImage";
import Head from "next/head";

const CatPage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  images,
  cat,
  ogImage,
}) => {
  const { width: windowWidth, height: windowHeight } = useWindowSize();
  const [showConfetti, setShowConfetti] = React.useState(false);

  const router = useRouter();

  React.useEffect(() => {
    const istBirthday = checkBirthday(cat?.birthDate);

    if (istBirthday) {
      setShowConfetti(true);
    } else {
      setShowConfetti(false);
    }
  }, [cat]);

  const pageTitle =
    cat?.name && typeof cat.name === "string"
      ? `Kattenparadijs | ${cat.name.slice(0, 1).toUpperCase()}${cat.name.slice(
          1
        )}`
      : "Kattenparadijs | Alle Katten";

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta property="og:image" content={ogImage} />
      </Head>
      {showConfetti && <Confetti width={windowWidth} height={windowHeight} />}
      {cat && <Bio cat={cat} key={cat.name} />}

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

//og images for social media
const ogImages: Record<CatName | "all", string> = {
  all: "https://user-images.githubusercontent.com/76665118/210135017-7d48fad3-49db-47da-9ac3-d45d5b358174.png",
  norris:
    "https://kattenparadijs.bremm.dev/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fe991dsae%2Fproduction%2F92e0eeeeea41b32476afc39d5da4d4362617b51e-1200x1600.jpg&w=640&q=75",
  moos: "https://kattenparadijs.bremm.dev/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fe991dsae%2Fproduction%2Fb28bb4b619123c5d657fb5e01204b6ac1cb8efd4-1536x2048.jpg&w=828&q=75",
  daantje:
    "https://kattenparadijs.bremm.dev/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fe991dsae%2Fproduction%2F28fa09b34211bda594d0c8d51a18e6282ebe23cb-1200x1600.jpg&w=640&q=75",
  flynn:
    "https://kattenparadijs.bremm.dev/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fe991dsae%2Fproduction%2F5b9fc1c4970fa7ce993d1f9b1352e30ce4c2eae1-1536x2048.jpg&w=828&q=75",
};

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

  const images: Array<ImageWithDimensions> = await sanityClient.fetch(query);

  const cats: Array<Cat> =
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
      ogImage: ogImages[catParam as CatName | "all"],
    },
  };
};
