import { useInfiniteQuery } from "@tanstack/react-query";

export const PAGE_SIZE = 36;

export const useImages = (cat?: string) => {
  return useInfiniteQuery({
    queryKey: ["images", { cat: cat }],
    queryFn: ({ pageParam = 0 }) => getImages(pageParam, cat),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length < PAGE_SIZE) {
        return false;
      }
      return pages.length;
    },
    staleTime: 1000 * 60 * 5,
  });
};

async function getImages(page: number = 0, cat?: string) {
  const params = `page=${page}` + (cat ? `&cat=${cat}` : "");
  const res = await fetch(`/api/images?${params}`);
  const json = await res.json();
  return json;
}
