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
      body: { type, name },
    } = req;

    switch (type) {
      case "cat":
        await res.revalidate(`/`);
        await res.revalidate(`/${name}`);
        return res.json({ message: `Revalidated page for ${name}` });
    }

    return res.json({ message: "Incorrect type" });
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).send({ message: "Error revalidating" });
  }
}
