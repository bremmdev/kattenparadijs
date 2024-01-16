import { ImageWithDimensions } from "@/types/types";
import { useInfiniteQuery } from "@tanstack/react-query";

export const PAGE_SIZE = 36;

export const useImages = (cat?: string) => {
  return useInfiniteQuery<Array<ImageWithDimensions>>({
    queryKey: ["images", { cat: cat }],
    queryFn: ({ pageParam }) => getImages(pageParam as number, cat),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length < PAGE_SIZE) {
        return false;
      }
      return pages.length;
    },
    initialPageParam: 0,
    staleTime: 1000 * 60 * 5,
  });
};

async function getImages(page: number = 0, cat?: string) {
  const params = `page=${page}` + (cat ? `&cat=${cat}` : "");
  const res = await fetch(`/api/images?${params}`);
  const json = await res.json();
  return json;
}
