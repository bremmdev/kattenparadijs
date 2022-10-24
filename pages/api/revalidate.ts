import { NextApiRequest, NextApiResponse } from "next";
import { isValidRequest } from "@sanity/webhook"

const secret = process.env.SANITY_WEBHOOK_SECRET || '';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!isValidRequest(req, secret)) {
    res.status(401).json({ message: "Invalid signature" })
    return
  }
  try {
    const {
      body: { _type, cat },
    } = req;

    switch (_type) {
      case "catimage":
        //always revalidate main page when an image is added
        await res.revalidate(`/`);

        //check length of 'cats'
        if (cat.length > 1) {
          await res.revalidate(`/all`);
          return res.json({ message: `Revalidated page for all cats` });
        }

        //revalidate page for specific cat
        await res.revalidate(`/${cat[0]}`);
        return res.json({ message: `Revalidated page for ${cat[0]}` });
    }

    return res.json({ message: "Incorrect type" });
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).send({ message: "Error revalidating" });
  }
}
