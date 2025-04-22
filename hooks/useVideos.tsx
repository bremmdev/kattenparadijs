import { Video } from "@/types/types";
import { useInfiniteQuery } from "@tanstack/react-query";

export const PAGE_SIZE = 48;

export const useVideos = () => {
  return useInfiniteQuery<Array<Video>>({
    queryKey: ["videos"],
    queryFn: ({ pageParam }) => getVideos(pageParam as number),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length < PAGE_SIZE) {
        return undefined;
      }
      return pages.length;
    },
    initialPageParam: 0,
    staleTime: 1000 * 60 * 5,
  });
};

async function getVideos(page: number = 0) {
  const params = `page=${page}`;
  const res = await fetch(`/api/videos?${params}`);
  const json = await res.json();
  return json;
}
