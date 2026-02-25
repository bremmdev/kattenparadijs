export const dynamic = "force-dynamic";
import { revalidatePath } from "next/cache";
import { type NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { vectorizeImage, syncVectorToSearchIndex } from "@/search/vectorize-utils";

const secret = process.env.SANITY_WEBHOOK_SECRET as string;

/** This webhook does 3 things:
 * 1. Revalidates the main page when an image is added
 * 2. Revalidates the page for the specific cat when an image is added
 * 3. Creates a vector for the image and adds it to the search index (only on new images for single cat images)
 */

export async function POST(request: NextRequest) {
  const { isValidSignature, body } = await parseBody<{
    sanityId: string;
    imageUrl: string;
    _type: string;
    cat: string;
  }>(request, secret);

  // we need to know if the operation is a create, update or delete
  const operation = request.headers.get("sanity-operation");

  if (!isValidSignature) {
    return Response.json(
      { success: false, message: "Invalid signature" },
      { status: 401 }
    );
  }

  try {
    if (!body?._type || !body?.cat)
      return Response.json({ message: "Incorrect type" });

    const { _type, cat } = body;

    switch (_type) {
      case "catimage":
        // always revalidate main page when an image is added
        revalidatePath(`/`);

        // cat can be "all" or a specific cat name
        if (cat.length > 1) {
          revalidatePath(`/all`);
          return Response.json({ message: `Revalidated page for all cats` });
        }

        // newly created images need to be indexed in the search index
        if (operation === "create") {
          const vector = await vectorizeImage(body.imageUrl);

          try {
            await syncVectorToSearchIndex({
              sanityId: body.sanityId,
              imageUrl: body.imageUrl,
              catName: body.cat[0],
              vector: vector,
            });
          } catch (err) {
            console.error("Error uploading to search index", err);
            revalidatePath(`/${cat[0]}`);
            return Response.json({ message: "Error uploading to search index" }, { status: 500 });
          }
        }
        // revalidate page for specific cat
        revalidatePath(`/${cat[0]}`);
        return Response.json({ message: `Revalidated page for ${cat[0]}` });
      case "catvideo":
        revalidatePath(`/videos`);
        return Response.json({ message: `Revalidated page for videos` });
    }

    return Response.json({ message: "Incorrect type" });
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return Response.json({ message: "Error revalidating" }, { status: 500 });
  }
}
