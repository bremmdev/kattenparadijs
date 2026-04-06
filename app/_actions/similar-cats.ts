'use server';

import { getSimilarImages } from "@/search/similar-images";
import { cookies } from "next/headers";
import { headers } from "next/headers";

const MAX_RUNTIME_MS = 10_000;
const SAFETY_BUFFER_MS = 1_000;
const TIMEOUT_ERROR = "Timed out while fetching similar cat photos";

export async function getSimilarCatPhotos(url: string, cat: string) {
    const now = Date.now();
    const cookieStore = await cookies();
    const ip = (await headers()).get("x-forwarded-for") ?? "";
    const AUTH_KEY = cookieStore.get("KATTENPARADIJS_AUTH")?.value ?? "";
    const isAuthed = AUTH_KEY === process.env.KATTENPARADIJS_AUTH || ip === process.env.ALLOWED_IPV4 || ip === process.env.ALLOWED_IPV6;

    if (!isAuthed) {
        return {
            data: null,
            error: "Unauthorized"
        }
    }

    const deadlineAt = now + MAX_RUNTIME_MS - SAFETY_BUFFER_MS;
    const controller = new AbortController();
    const timeoutMs = Math.max(deadlineAt - Date.now(), 0);
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const similarPhotos = await getSimilarImages({
            url,
            cat,
            signal: controller.signal,
            deadlineAt,
        });

        return {
            data: similarPhotos,
            error: null
        }
    } catch (error) {
        console.error(error);

        return {
            data: null,
            error: controller.signal.aborted
                ? TIMEOUT_ERROR
                : error instanceof Error
                    ? error.message
                    : "Failed to get similar cat photos"
        }
    } finally {
        clearTimeout(timeoutId);
    }
}

