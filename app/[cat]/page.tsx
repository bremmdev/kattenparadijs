export const revalidate = 86400;

//throw a 404 if the cat is not found
export const dynamicParams = false;

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React from "react";
import { sanityClient } from "@/sanity";
import { Cat } from "@/types/types";
import { catGroqQuery, imageGroqQuery } from "@/utils/queries";
import CatOverview from "./CatOverview";
import { groq } from "next-sanity";
import type { Metadata, ResolvingMetadata } from "next";
import { CatName } from "@/types/types";

export async function generateMetadata({
  params,
}: PageProps<"/[cat]">): Promise<Metadata> {
  const awaitedParams = await params;

  const cat = awaitedParams?.cat as string;

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

  return {
    title: `Kattenparadijs | ${cat[0].toUpperCase() + cat.slice(1)}`,
    description: `Bekijk alle foto's van ${cat === "all" ? "onze katten" : cat[0].toUpperCase() + cat.slice(1)}`,
    openGraph: {
      images: [
        {
          url: ogImages[cat as CatName],
          width: 1920,
          height: 1080,
          alt: `Kattenparadijs - ${cat[0].toUpperCase() + cat.slice(1)}`,
        },
      ],
    },
  };
}

export default async function CatDetailPage({ params }: PageProps<"/[cat]">) {
  const queryClient = new QueryClient();
  const awaitedParams = await params;

  const catParam = awaitedParams?.cat as string;

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
    staleTime: Infinity, // data is always fresh as we revalidate when data in Sanity changes
    initialPageParam: 0,
  });

  //query for cats
  const cats: Array<Cat> = (await sanityClient.fetch(catGroqQuery)) ?? [];

  //get cat based on query param
  const selectedCat = cats.find((cat) => cat.name === catParam) || null;

  return (
    // Pass dehydrated state to the HydrationBoundary to hydrate the client cache with the prefetched data
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CatOverview cat={selectedCat} isDetail />
    </HydrationBoundary>
  );
}

// Return a list of `params` to populate the [slug] dynamic segment
export async function generateStaticParams() {
  const catNames: Array<Pick<Cat, "name">> = await sanityClient.fetch(
    groq`*[_type == "cat"]{ name }`
  );

  //create paths for all the cats
  const paths = catNames.map((catName) => ({ cat: catName.name }));

  //add an extra path for the page that has photos with multiple cats
  paths.push({ cat: "all" });

  return paths;
}
