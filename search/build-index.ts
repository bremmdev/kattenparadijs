const INDEX_NAME = "cat-photos";
import { groq, createClient } from "next-sanity";
import { vectorizeImage } from "./vectorize-utils";

type CatImage = {
    sanityId: string;
    imageUrl: string;
    catName: string;
}

type ImageResp = {
    images: Array<CatImage>;
}

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: "2021-08-11",
    useCdn: false,
});

async function countDocuments() {
    const res = await fetch(
        `${process.env.AZURE_SEARCH_ENDPOINT}/indexes/${INDEX_NAME}/docs/$count?api-version=2025-09-01`,
        {
            headers: { "api-key": process.env.AZURE_SEARCH_ADMIN_KEY! },
        }
    );
    const count = await res.text();
    console.log(`Documents in index: ${count}`);
}

async function uploadBatch(
    images: Array<CatImage & { vector: number[] }>
) {
    const res = await fetch(
        `${process.env.AZURE_SEARCH_ENDPOINT}/indexes/${INDEX_NAME}/docs/index?api-version=2025-09-01`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": process.env.AZURE_SEARCH_ADMIN_KEY!,
            },
            body: JSON.stringify({
                value: images.map((image) => ({
                    "@search.action": "mergeOrUpload",
                    id: image.sanityId,
                    imageUrl: image.imageUrl,
                    catName: image.catName,
                    imageVector: image.vector,
                })),
            }),
        }
    );
    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Batch index failed ${res.status}: ${err}`);
    }

    const data = await res.json();
    const failed = data.value.filter((d: any) => !d.status);
    if (failed.length > 0) {
        console.error(`${failed.length} documents failed to index:`, failed);
    }
}

async function getImages(): Promise<ImageResp> {
    // only get images with single cat
    const imageQuery = groq`{
        "images": *[_type == "catimage" && length(cat) == 1] | order(_createdAt desc) {
            "sanityId": _id,
            "imageUrl": img.asset->url,
            "catName": cat[0]->name,
        }
    }`;
    // Let it throw — indexImages() will catch it
    return client.fetch(imageQuery);
}

async function indexImages() {
    const images = await getImages();
    const CONCURRENCY = 5;
    const BATCH_SIZE = 100;
    const vectorized: Array<CatImage & { vector: number[] }> = [];

    // Vectorize concurrently
    for (let i = 0; i < images.images.length; i += CONCURRENCY) {
        const batch = images.images.slice(i, i + CONCURRENCY);
        const results = await Promise.all(
            batch.map(async (image) => {
                try {
                    const vector = await vectorizeImage(image.imageUrl);
                    return { ...image, vector };
                } catch (err) {
                    console.error(`Skipping ${image.imageUrl}:`, err);
                    return null;
                }
            })
        );
        vectorized.push(
            ...results.filter(
                (r): r is CatImage & { vector: number[] } => r !== null
            )
        );
        console.log(
            `Vectorized ${Math.min(i + CONCURRENCY, images.images.length)}/${images.images.length}`
        );
    }

    // Upload in batches
    for (let i = 0; i < vectorized.length; i += BATCH_SIZE) {
        const batch = vectorized.slice(i, i + BATCH_SIZE);
        await uploadBatch(batch);
        console.log(
            `Indexed ${Math.min(i + BATCH_SIZE, vectorized.length)}/${vectorized.length}`
        );
    }

    await countDocuments();
}

indexImages().catch((err) => {
    console.error(err);
    process.exit(1);
});

