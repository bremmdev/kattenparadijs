import { GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import { sanityClient } from "../sanity";
import { groq } from "next-sanity";
import { ImageWithDimensions } from "./index";

interface CatName {
  name: string;
}

const Cat: NextPage<{ images: ImageWithDimensions[] }> = ({ images }) => {
  const router = useRouter();

  // console.log(router.query);

  return <div>{router.query.cat}</div>;
};

export default Cat;

export async function getStaticPaths() {
  const catNames: CatName[] = await sanityClient.fetch(
    groq`*[_type == "cat"]{ name }`
  );

  //create paths for all the cats
  const paths = catNames.map((catName) => ({ params: { cat: catName.name } }));

  //add an extra path for the page that has photos with multiple cats
  paths.push({ params: { cat: "all" } });

  return {
    paths,
    fallback: false,
  };
}

export const getStaticProps: GetStaticProps = async (context) => {
  const cat = context?.params?.cat;
  console.log(cat);

  //query for pictures with single cat
  let queryFilter = `"${cat}" in cat[]->name && length(cat) == 1`;

  //query for pictures with multiple cats
  if (cat === "all") {
    queryFilter = `length(cat) > 1`;
  }

  const query = groq`*[_type == "catimage" && ${queryFilter}] | order(_createdAt desc) {
    "cats": cat[]->{name, birthDate, "iconUrl": icon.asset->url},
    "id":_id,
    "url": img.asset->url,
    "width": img.asset->metadata.dimensions.width,
    "height": img.asset->metadata.dimensions.height
  }`;

  const images: ImageWithDimensions[] = await sanityClient.fetch(query);
  console.log(images);

  return {
    props: {
      images,
    },
  };
};
