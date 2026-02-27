'use server';

import { getSimilarImages } from "@/search/similar-images";
import { cookies } from "next/headers";

export async function getSimilarCatPhotos(url: string, cat: string) {
    const cookieStore = await cookies();
    const AUTH_KEY = cookieStore.get("KATTENPARADIJS_AUTH")?.value ?? "";

    if (AUTH_KEY !== process.env.KATTENPARADIJS_AUTH) {
        return {
            error: "Unauthorized"
        }
    }

    console.log("cat", cat);

    try {
        const similarPhotos = await getSimilarImages({ url, cat });
        return similarPhotos;
    } catch (error) {
        console.error(error);
        return {
            error: "Failed to get similar cat photos"
        }
    }
}

