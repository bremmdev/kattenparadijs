export const revalidate = 86400;

import { videoGroqQuery } from "@/utils/queries";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { sanityClient } from "@/sanity";
import VideosOverview from "./VideosOverview";

export default async function VideosPage() {
  const queryClient = new QueryClient();
  const query = videoGroqQuery({ page: 0 });

  //prefetch the first page of images
  await queryClient.prefetchInfiniteQuery({
    queryKey: ["videos"],
    queryFn: async () => await sanityClient.fetch(query),
    staleTime: 1000 * 60 * 5,
    initialPageParam: 0,
  });

  return (
    // Neat! Serialization is now as easy as passing props.
    // HydrationBoundary is a Client Component, so hydration will happen there.
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <VideosOverview />
      </HydrationBoundary>
    </>
  );
}
