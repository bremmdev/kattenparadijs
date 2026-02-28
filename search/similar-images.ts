const INDEX_NAME = "cat-photos";
import { vectorizeImage } from "./vectorize-utils";

export async function getSimilarImages({ url, cat }: { url: string, cat: string }) {
    const vector = await vectorizeImage(url);

    try {
        const res = await fetch(
            `${process.env.AZURE_SEARCH_ENDPOINT}/indexes/${INDEX_NAME}/docs/search?api-version=2025-09-01`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "api-key": process.env.AZURE_SEARCH_ADMIN_KEY!,
                },
                body: JSON.stringify({
                    filter: `catName eq '${cat}'`,
                    vectorQueries: [
                        {
                            kind: "vector",
                            vector: vector,
                            k: 4,
                            fields: "imageVector",
                        },
                    ],
                }),
            }
        );
        const data = await res.json();
        return data;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to get similar images from Search Index");
    }
}