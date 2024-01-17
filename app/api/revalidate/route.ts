export const dynamic = "force-dynamic";
import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import { revalidatePath } from "next/cache";
import { type NextRequest } from "next/server";

const secret = process.env.SANITY_WEBHOOK_SECRET as string;

export async function POST(request: NextRequest) {
  const signature = request.headers.get(SIGNATURE_HEADER_NAME);
  const body = await request.json();
  const isValid = await isValidSignature(body, signature as string, secret);

  // Validate signature
  if (!isValid) {
    return Response.json(
      { success: false, message: "Invalid signature" },
      { status: 401 }
    );
  }

  try {
    const { _type, cat } = body;

    switch (_type) {
      case "catimage":
        //always revalidate main page when an image is added
        revalidatePath(`/`);

        //check length of 'cats'
        if (cat.length > 1) {
          // await res.revalidate(`/all`);
          revalidatePath(`/all`);
          return Response.json({ message: `Revalidated page for all cats` });
        }

        //revalidate page for specific cat
        revalidatePath(`/${cat[0]}`);
        return Response.json({ message: `Revalidated page for ${cat[0]}` });
    }

    return Response.json({ message: "Incorrect type" });
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return Response.json({ message: "Error revalidating" }, { status: 500 });
  }
}
