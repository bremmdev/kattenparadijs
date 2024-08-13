import groq from "groq";
const PAGE_SIZE = 36;

type GroqArgs = {
  filter?: string;
  page?: number;
};

export const imageGroqQuery = (args: GroqArgs) => {
  const { filter, page } = args;

  const queryFilter = `_type == "catimage"` + (filter ? ` && ${filter}` : "");
  const range =
    page || page === 0
      ? `[${page * PAGE_SIZE}...${(page + 1) * PAGE_SIZE}]`
      : "";

  return groq`*[${queryFilter}] | order(_createdAt desc) {
    "cats": cat[]->{name, birthDate, passingDate, "iconUrl": icon.asset->url, nicknames},
    "id":_id,
    "url": img.asset->url,
    "width": img.asset->metadata.dimensions.width,
    "height": img.asset->metadata.dimensions.height,
    "blurData": img.asset->metadata.lqip,
    takenAt
  }${range}`;
};

export const catGroqQuery = groq`*[_type == "cat"]{
  name,
  birthDate,
  passingDate,
  "iconUrl": icon.asset->url,
  nicknames
}`;

export const videoGroqQuery = (args: GroqArgs) => {
  const { page } = args;

  const range =
    page || page === 0
      ? `[${page * PAGE_SIZE}...${(page + 1) * PAGE_SIZE}]`
      : "";

  return groq`*[_type == "catvideo"] | order(_createdAt desc) {
    "cats": cat[]->{name, birthDate, "iconUrl": icon.asset->url, nicknames},
    "id":_id,
    "url":video.asset->url,
    width,
    height,
    takenAt
  }${range}`;
};
