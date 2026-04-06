const INDEX_NAME = "cat-photos";
import { vectorizeImage } from "./vectorize-utils";

const TIMEOUT_ERROR = "Timed out while fetching similar cat photos";

function throwIfDeadlineReached(deadlineAt?: number) {
    if (deadlineAt !== undefined && Date.now() >= deadlineAt) {
        throw new Error(TIMEOUT_ERROR);
    }
}

export async function getSimilarImages({
    url,
    cat,
    signal,
    deadlineAt,
}: {
    url: string;
    cat: string;
    signal?: AbortSignal;
    deadlineAt?: number;
}) {
    throwIfDeadlineReached(deadlineAt);

    const vector = await vectorizeImage(url, { signal });

    throwIfDeadlineReached(deadlineAt);

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
                signal,
            }
        );

        throwIfDeadlineReached(deadlineAt);
        const data = await res.json();
        return data;
    } catch (error) {
        console.error(error);
        if (signal?.aborted || error instanceof Error && error.message === TIMEOUT_ERROR) {
            throw new Error(TIMEOUT_ERROR);
        }

        throw new Error("Failed to get similar images from Search Index");
    }
}