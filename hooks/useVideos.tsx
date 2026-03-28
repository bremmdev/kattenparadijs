import { Video } from "@/types/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { VIDEO_PAGE_SIZE } from "@/utils/constants";

export const useVideos = () => {
  return useInfiniteQuery<Array<Video>>({
    queryKey: ["videos"],
    queryFn: ({ pageParam }) => getVideos(pageParam as number),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length < VIDEO_PAGE_SIZE) {
        return undefined;
      }
      return pages.length;
    },
    initialPageParam: 0,
  });
};

async function getVideos(page: number = 0) {
  const params = `page=${page}`;
  const res = await fetch(`/api/videos?${params}`);
  const json = await res.json();
  return json;
}
