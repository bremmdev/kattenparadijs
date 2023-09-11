import { NextApiRequest, NextApiResponse } from "next";
import { sanityClient } from "@/sanity";
import type { ImageWithDimensions } from "@/types/types";
import { imageGroqQuery } from "@/utils/queries";

function getQueryFilter(cat?: string) {
  if (!cat) return undefined;
  if (cat === "all") {
    return `length(cat) > 1`;
  }
  return `"${cat}" in cat[]->name && length(cat) == 1`;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const page = Number(req.query.page) || 0;
  const cat = req.query.cat as string | undefined;

  //query for [cat].tsx
  let queryFilter = getQueryFilter(cat);

  const query = imageGroqQuery({ filter: queryFilter, page });

  const images: Array<ImageWithDimensions> = await sanityClient.fetch(query);

  return res.json(images);
}
