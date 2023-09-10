import { useInfiniteQuery } from "@tanstack/react-query";

export const PAGE_SIZE = 36;

export const useImages = () => {
  return useInfiniteQuery({
    queryKey: ["images"],
    queryFn: ({ pageParam = 0 }) => getImages(pageParam),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length < PAGE_SIZE) {
        return false;
      }
      return pages.length;
    },
    staleTime: 1000 * 60 * 5,
  });
};

async function getImages(page: number = 0) {
  const res = await fetch(`/api/images?page=${page}`);
  const json = await res.json();
  return json;
}
