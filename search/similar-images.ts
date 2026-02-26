const INDEX_NAME = "cat-photos";
import { vectorizeImage } from "./vectorize-utils";

export async function getSimilarImages({ url, id }: { url: string, id: string }) {
    const vector = await vectorizeImage(url);

    const res = await fetch(
        `${process.env.AZURE_SEARCH_ENDPOINT}/indexes/${INDEX_NAME}/docs/search?api-version=2025-09-01`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": process.env.AZURE_SEARCH_ADMIN_KEY!,
            },
            body: JSON.stringify({
                filter: `id ne '${id}'`, // exclude the current image from the results
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
}

// getSimilarImages({
//     url: "https://cdn.sanity.io/images/e991dsae/production/a6fd19d450ee0f549aee1ca8e41bb018106a34c0-1023x768.jpg",
//     id: "b5aea061-2b93-4940-bc19-4a6feb3a9504"
// }).catch((err) => {
//     console.error(err);
//     process.exit(1);
// });