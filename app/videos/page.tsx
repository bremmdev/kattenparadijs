export const revalidate = 86400;

import { videoGroqQuery } from "@/utils/queries";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { sanityClient } from "@/sanity";
import VideosOverview from "./VideosOverview";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kattenparadijs | Videos",
  description: "Bekijk alle video's van onze katten",
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

export default async function VideosPage() {
  const queryClient = new QueryClient();
  const query = videoGroqQuery({ page: 0 });

  //prefetch the first page of images
  await queryClient.prefetchInfiniteQuery({
    queryKey: ["videos"],
    queryFn: async () => await sanityClient.fetch(query),
    staleTime: Infinity, // data is always fresh as we revalidate when data in Sanity changes
    initialPageParam: 0,
  });

  return (
    // Pass dehydrated state to the HydrationBoundary to hydrate the client cache with the prefetched data
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <VideosOverview />
      </HydrationBoundary>
    </>
  );
}
