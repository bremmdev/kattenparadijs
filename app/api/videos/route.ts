export const dynamic = "force-dynamic";

import { type NextRequest } from "next/server";
import { sanityClient } from "@/sanity";
import type { Video } from "@/types/types";
import { videoGroqQuery } from "@/utils/queries";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = Number(searchParams.get("page")) || 0;

  const query = videoGroqQuery({ page });

  const images: Array<Video> = await sanityClient.fetch(query);

  return Response.json(images);
}
