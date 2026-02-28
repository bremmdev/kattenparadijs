'use server';

import { getSimilarImages } from "@/search/similar-images";
import { cookies } from "next/headers";

export async function getSimilarCatPhotos(url: string, cat: string) {
    const cookieStore = await cookies();
    const AUTH_KEY = cookieStore.get("KATTENPARADIJS_AUTH")?.value ?? "";

    if (AUTH_KEY !== process.env.KATTENPARADIJS_AUTH) {
        return {
            data: null,
            error: "Unauthorized"
        }
    }

    try {
        const similarPhotos = await getSimilarImages({ url, cat });
        return {
            data: similarPhotos,
            error: null
        }
    } catch (error) {
        console.error(error);
        return {
            data: null,
            error: error instanceof Error ? error.message : "Failed to get similar cat photos"
        }
    }
}

