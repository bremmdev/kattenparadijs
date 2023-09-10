import type { InferGetStaticPropsType, NextPage } from "next";
import React, { useRef } from "react";
import { sanityClient } from "@/sanity";
import { groq } from "next-sanity";
import Gallery from "@/components/Gallery/Gallery";
import Head from "next/head";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { PAGE_SIZE, useImages } from "@/hooks/useImages";
import Spinner from "@/components/UI/Spinner";

const Home: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({}) => {
  const { data, isFetching, error, fetchNextPage, hasNextPage } = useImages();
  const images = data?.pages.flat() ?? [];

  return (
    <>
      <Head>
        <title>Kattenparadijs</title>
        <meta
          property="og:image"
          content="https://user-images.githubusercontent.com/76665118/210135017-7d48fad3-49db-47da-9ac3-d45d5b358174.png"
        />
      </Head>

      <>
        <Gallery images={images} />
        {hasNextPage && (
          <div className="flex justify-center my-6">
            <button
              className="flex gap-2 cursor-pointer rounded-xl text-slate-950 border-2 border-slate-600 bg-white py-[10px] px-5 transition-colors duration-300 hover:bg-slate-50 md:text-base"
              onClick={() => fetchNextPage()}
              disabled={isFetching}
            >
              {isFetching ? "Loading..." : "Load more"}
              {isFetching && <Spinner />}
            </button>
          </div>
        )}
      </>
    </>
  );
};

export default Home;

export async function getStaticProps() {
  const query = groq`*[_type == "catimage"] | order(_createdAt desc) {
    "cats": cat[]->{name, birthDate, "iconUrl": icon.asset->url, nicknames},
    "id":_id,
    "url": img.asset->url,
    "width": img.asset->metadata.dimensions.width,
    "height": img.asset->metadata.dimensions.height,
    "blurData": img.asset->metadata.lqip,
    takenAt
  }[0...${PAGE_SIZE}]`;

  const queryClient = new QueryClient();

  //prefetch the first page of images
  await queryClient.prefetchInfiniteQuery({
    queryKey: ["images"],
    queryFn: async () => await sanityClient.fetch(query),
    staleTime: 1000 * 60 * 5,
  });

  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
}
