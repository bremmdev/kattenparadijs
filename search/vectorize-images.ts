
import { groq, createClient } from "next-sanity";

type Image = {
    sanityId: string;
    imageUrl: string;
    catName: string;
}

type ImageResp = {
    images: Array<Image>;
}

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: "2021-08-11",
    useCdn: false,
});

async function getImages(id?: string) {
    try {
        // only get images with single cat
        const imageQuery = groq`{
    "images":
      *[_type == "catimage" && length(cat) == 1 && _id == "${id}"] | order(_createdAt desc) {
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

async function vectorizeImage(image: Image): Promise<number[]> {
    try {
        const imageRes = await fetch(image.imageUrl);
        if (!imageRes.ok) throw new Error(`Failed to fetch image: ${image.imageUrl}`);

        const buffer = await imageRes.arrayBuffer();
        const base64 = Buffer.from(buffer).toString("base64");
        const contentType = imageRes.headers.get("content-type") ?? "image/jpeg";
        const dataUrl = `data:${contentType};base64,${base64}`;

        const res = await fetch(
            `${process.env.AZURE_AI_ENDPOINT}/images/embeddings?api-version=2024-05-01-preview`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "api-key": process.env.AZURE_AI_KEY!,
                },
                body: JSON.stringify({
                    model: "embed-v-4-0",
                    input: [{ image: dataUrl }],
                    dimensions: 1024,
                }),
            }
        );

        if (!res.ok) {
            const err = await res.text();
            throw new Error(`Image embedding error ${res.status}: ${err}`);
        }

        const data = await res.json();
        console.log(data.data[0].embedding, data.data[0].embedding.length);
        return data.data[0].embedding;
    } catch (error) {
        console.error(`Failed to vectorize ${image.imageUrl}:`, error);
        return [];
    }
}


async function indexImages() {
    const images: ImageResp = (await getImages("cffff72f-9ee2-4c64-8c0b-81d05262ef3e")) as ImageResp;
    console.log(images.images);

    for (const image of images.images) {
        await vectorizeImage(image);
    }
}

indexImages();