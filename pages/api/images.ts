import { NextApiRequest, NextApiResponse } from "next";
import { groq } from "next-sanity";
import { sanityClient } from "@/sanity";
import type { ImageWithDimensions } from "@/types/types";
import { PAGE_SIZE } from "@/hooks/useImages";

const query = groq`*[_type == "catimage"] | order(_createdAt desc) {
  "cats": cat[]->{name, birthDate, "iconUrl": icon.asset->url, nicknames},
  "id":_id,
  "url": img.asset->url,
  "width": img.asset->metadata.dimensions.width,
  "height": img.asset->metadata.dimensions.height,
  "blurData": img.asset->metadata.lqip,
  takenAt
}`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const page = Number(req.query.page) || 0;

  const range = `[${page * PAGE_SIZE}...${(page + 1) * PAGE_SIZE}]`;
  const images: Array<ImageWithDimensions> = await sanityClient.fetch(
    `${query}${range}`
  );

  return res.json(images);
}
