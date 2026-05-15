// get id from command line arguments
const sanityId = process.argv[2];

async function deleteIndexedImage(sanityId: string) {
    try {
        const res = await fetch(
            `${process.env.AZURE_SEARCH_ENDPOINT}/indexes/cat-photos/docs/index?api-version=2025-09-01`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "api-key": process.env.AZURE_SEARCH_ADMIN_KEY!,
                },
                body: JSON.stringify({
                    value: [{
                        "@search.action": "delete",
                        id: sanityId,
                    }],
                }),
            });
        if (!res.ok) {
            throw new Error("Failed to delete indexed image");
        }
        console.log("Indexed image deleted");
    } catch (error) {
        console.error(error);
        throw new Error("Failed to delete indexed image");
    }
}

deleteIndexedImage(sanityId);