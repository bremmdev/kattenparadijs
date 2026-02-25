const INDEX_NAME = "cat-photos";

export async function vectorizeImage(imageUrl: string): Promise<number[]> {
    const imageRes = await fetch(imageUrl);
    if (!imageRes.ok) throw new Error(`Failed to fetch image: ${imageUrl}`);

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
    return data.data[0].embedding;
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