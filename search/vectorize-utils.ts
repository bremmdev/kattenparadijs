import OpenAI from "openai";

const INDEX_NAME = "cat-photos";

const openai = new OpenAI({
    apiKey: process.env.AZURE_AI_KEY!,
    baseURL: process.env.AZURE_AI_ENDPOINT!,
});

export async function vectorizeImage(
    imageUrl: string
): Promise<number[]> {
    const imageRes = await fetch(imageUrl);
    if (!imageRes.ok) throw new Error(`Failed to fetch image: ${imageUrl}`);

    const buffer = await imageRes.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    const contentType = imageRes.headers.get("content-type") ?? "image/jpeg";
    const dataUrl = `data:${contentType};base64,${base64}`;

    try {
        const embedding = await openai.embeddings.create({
            model: "embed-v-4-0",
            input: [dataUrl],
            dimensions: 1024,
        });

        return embedding.data[0].embedding;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to vectorize image");
    }
}

export function syncVectorToSearchIndex(image: {
    sanityId: string;
    imageUrl: string;
    catName: string;
    vector: number[];
}) {
    return fetch(
        `${process.env.AZURE_SEARCH_ENDPOINT}/indexes/${INDEX_NAME}/docs/index?api-version=2025-09-01`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": process.env.AZURE_SEARCH_ADMIN_KEY!,
            },
            body: JSON.stringify({
                value: [{
                    "@search.action": "mergeOrUpload",
                    id: image.sanityId,
                    imageUrl: image.imageUrl,
                    catName: image.catName,
                    imageVector: image.vector,
                }],
            }),
        }
    );
}

// Run this if sync failed and you want to manually vectorize and index an image
export async function syncVectorToSearchIndexManually() {
    const imageUrl = "https://cdn.sanity.io/images/e991dsae/production/f67001263c6453fd68ff83ab4e7908980d231992-1023x768.jpg";
    const sanityId = "201664f5-47b6-4e90-bf3d-f7a21ba157cf";
    const catName = "norris";
    const vector = await vectorizeImage(imageUrl);
    return syncVectorToSearchIndex({
        sanityId: sanityId,
        imageUrl: imageUrl,
        catName: catName,
        vector: vector,
    });
}