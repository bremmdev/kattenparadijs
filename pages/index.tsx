import type { InferGetStaticPropsType, NextPage } from "next";
import React from "react";
import { sanityClient } from "@/sanity";
import Gallery from "@/components/Gallery/Gallery";
import Head from "next/head";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { useImages } from "@/hooks/useImages";
import { imageGroqQuery } from "@/utils/queries";
import FetchMoreBtn from "@/components/Gallery/FetchMoreBtn";

const Home: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({}) => {
  const { data, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } =
  useImages();
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
          <FetchMoreBtn isFetching={isFetching} isFetchingNextPage={isFetchingNextPage} fetchNextPage={fetchNextPage} />
        )}
      </>
    </>
  );
};

export default Home;

export async function getStaticProps() {
  const queryClient = new QueryClient();
  const query = imageGroqQuery({page: 0});

  //prefetch the first page of images
  await queryClient.prefetchInfiniteQuery({
    queryKey: ["images", {}],
    queryFn: async () => await sanityClient.fetch(query),
    staleTime: 1000 * 60 * 5,
  });

  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
}
