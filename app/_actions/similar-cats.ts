'use server';

import { getSimilarImages } from "@/search/similar-images";
import { cookies } from "next/headers";

export async function getSimilarCatPhotos(url: string, id: string) {
    const cookieStore = await cookies();
    const AUTH_KEY = cookieStore.get("KATTENPARADIJS_AUTH")?.value ?? "";

    if (AUTH_KEY !== process.env.KATTENPARADIJS_AUTH) {
        return {
            error: "Unauthorized"
        }
    }

    const similarPhotos = await getSimilarImages({ url, id });
    return similarPhotos;
}

