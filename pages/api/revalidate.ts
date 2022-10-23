import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(401).json({ message: "Must be a POST request" });
  }

  // if (req.query.secret !== process.env.MY_SECRET_TOKEN) {
  //   return res.status(401).json({ message: "Invalid token" });
  // }

  try {
    const {
      body: { type, cat },
    } = req;

    switch (type) {
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
