export const dynamic = 'force-dynamic'

import { type NextRequest } from "next/server";
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

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = Number(searchParams.get('page')) || 0;
  const cat = searchParams.get('cat') as string | undefined;

  //query for [cat].tsx
  let queryFilter = getQueryFilter(cat);

  const query = imageGroqQuery({ filter: queryFilter, page });

  const images: Array<ImageWithDimensions> = await sanityClient.fetch(query);

  return Response.json(images);
}
