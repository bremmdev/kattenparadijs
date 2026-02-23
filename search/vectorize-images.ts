
import { groq, createClient } from "next-sanity";

async function getImages() {
    const client = createClient({
        projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
        dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
        apiVersion: "2021-08-11",
        useCdn: false,
    });

    try {
        // only get images with single cat
        const imageQuery = groq`{
    "images":
      *[_type == "catimage" && length(cat) == 1] | order(_createdAt desc) {
      "sanityId": _id,
      "imageUrl": img.asset->url,
      "catName": cat[0]->name,
  }}`;

        const images = await client.fetch(imageQuery);
        return images;
    } catch (error) {
        console.error(error);
        return [];
    }
}


async function indexImages() {
    const images = await getImages();
    console.log(images);
}

indexImages();