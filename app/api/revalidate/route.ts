export const dynamic = "force-dynamic";
import { revalidatePath } from "next/cache";
import { type NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";

const secret = process.env.SANITY_WEBHOOK_SECRET as string;

export async function POST(request: NextRequest) {
  const { isValidSignature, body } = await parseBody<{
    _type: string;
    cat: string;
  }>(request, secret);

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
