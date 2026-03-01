const INDEX_NAME = "cat-photos";

const schema = {
    name: INDEX_NAME,
    fields: [
        { name: "id", type: "Edm.String", key: true, filterable: true, facetable: false }, // unique id for the document, same as sanityId
        { name: "imageUrl", type: "Edm.String", retrievable: true, filterable: false, facetable: false },
        { name: "catName", type: "Edm.String", retrievable: true, filterable: true, facetable: false },
        {
            name: "imageVector",
            type: "Collection(Edm.Single)",
            searchable: true,
            retrievable: false, // don't send 1024 floats back to client
            dimensions: 1024, // number of dimensions in the vector, must match Azure's dimensions
            vectorSearchProfile: "hnsw-profile",
        },
    ],
    vectorSearch: {
        algorithms: [
            {
                name: "hnsw-algo", // hnsw = Hierarchical Navigable Small World Graph, a data structure for efficient similarity search
                kind: "hnsw",
                hnswParameters: {
                    metric: "cosine", // cosine similarity = best for semantic vectors
                    m: 8, // number of connections per node, higher = more accurate but slower
                    efConstruction: 400, // how thorough the index is built, higher = more accurate but slower
                    efSearch: 500, // how many candidate nodes are explored at query time (higher = more accurate but slower)
                },
            },
        ],
        profiles: [{ name: "hnsw-profile", algorithm: "hnsw-algo" }],
    },
};

async function createIndex() {
    const res = await fetch(
        `${process.env.AZURE_SEARCH_ENDPOINT}/indexes/${INDEX_NAME}?api-version=2025-09-01`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "api-key": process.env.AZURE_SEARCH_ADMIN_KEY!,
            },
            body: JSON.stringify(schema),
        }
    );
    const data = await res.json();
}

createIndex();