import { GetStaticPropsContext, InferGetStaticPropsType, NextPage } from "next";
import { sanityClient } from "@/sanity";
import { groq } from "next-sanity";
import Gallery from "@/components/Gallery/Gallery";
import Bio from "@/components/Cat/Bio";
import Confetti from "react-confetti";
import useWindowSize from "@/hooks/useWindowSize";
import React from "react";
import { checkBirthday } from "@/utils/checkBirthday";
import Head from "next/head";
import { Cat, CatName, ImageWithDimensions } from "@/types/types";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { catGroqQuery, imageGroqQuery } from "@/utils/queries";
import { useImages } from "@/hooks/useImages";
import FetchMoreBtn from "@/components/Gallery/FetchMoreBtn";

const CatPage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  // images,
  cat,
  ogImage,
}) => {
  const { width: windowWidth, height: windowHeight } = useWindowSize();
  const [showConfetti, setShowConfetti] = React.useState(false);

  const { data, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useImages(cat?.name ?? "all");
  const images = data?.pages.flat() ?? [];

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

      <Gallery images={images} />
      {hasNextPage && (
        <FetchMoreBtn
          isFetching={isFetching}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
        />
      )}
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
  const queryClient = new QueryClient();
  const catParam = context?.params?.cat as string;

  //query for pictures with single cat
  let queryFilter = `"${catParam}" in cat[]->name && length(cat) == 1`;

  //query for pictures with multiple cats
  if (catParam === "all") {
    queryFilter = `length(cat) > 1`;
  }

  const query = imageGroqQuery({ filter: queryFilter, page: 0 });

  //prefetch the first page of images
  await queryClient.prefetchInfiniteQuery({
    queryKey: ["images", { cat: catParam }],
    queryFn: async () => await sanityClient.fetch(query),
    staleTime: 1000 * 60 * 5,
    initialPageParam: 0,
  });

  //query for cats
  const cats: Array<Cat> = (await sanityClient.fetch(catGroqQuery)) ?? [];

  //get cat based on query param
  const selectedCat = cats.find((cat) => cat.name === catParam) || null;

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      cat: selectedCat,
      ogImage: ogImages[catParam as CatName | "all"],
    },
  };
};
