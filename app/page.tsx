export const revalidate = 86400;

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React from "react";
import { sanityClient } from "@/sanity";
import { imageGroqQuery } from "@/utils/queries";
import CatsOverview from "./CatsOverview";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kattenparadijs",
  description: "Foto's van al onze katten",
  openGraph: {
    images: [
      {
        url: "https://user-images.githubusercontent.com/76665118/210135017-7d48fad3-49db-47da-9ac3-d45d5b358174.png",
        width: 1920,
        height: 1080,
        alt: "Kattenparadijs",
      },
    ],
  },
};

export default async function CatsPage() {
  const queryClient = new QueryClient();
  const query = imageGroqQuery({ page: 0 });

  //prefetch the first page of images
  await queryClient.prefetchInfiniteQuery({
    queryKey: ["images", {}],
    queryFn: async () => await sanityClient.fetch(query),
    staleTime: 1000 * 60 * 5,
    initialPageParam: 0,
  });

  return (
    // Neat! Serialization is now as easy as passing props.
    // HydrationBoundary is a Client Component, so hydration will happen there.
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <CatsOverview />
      </HydrationBoundary>
    </>
  );
}
