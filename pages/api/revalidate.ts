import { NextApiRequest, NextApiResponse } from "next";
import { isValidSignature, SIGNATURE_HEADER_NAME } from '@sanity/webhook';

const secret = process.env.SANITY_WEBHOOK_SECRET as string;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const signature = req.headers[SIGNATURE_HEADER_NAME];
  const isValid = isValidSignature(JSON.stringify(req.body), signature as string, secret);

  // Validate signature
  if (!isValid) {
    res.status(401).json({ success: false, message: 'Invalid signature' });
    return;
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
