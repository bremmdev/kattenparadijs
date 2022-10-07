import React from "react";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";
import { ImageType, ImageWithDimensions } from "./index";
import { GetStaticPaths, GetStaticProps } from "next";
import { BASE_URL } from "./index";
import { NextPage } from "next";
import { createImgWithDimensions } from "../utils/createImgWithDimensions";
import Modal from "../components/Modal";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

const ImageDetailPage: NextPage<{ image: ImageWithDimensions }> = ({
  image,
}) => {
  return (
    <Modal>
      <Image
        src={image.url}
        width={image.width}
        height={image.height}
        alt="kat"
        className="rounded-xl object-cover shadow-lg h-[10vh] w-full"
      />
    </Modal>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  //list of all the images in the storage bucket
  const { data } = await supabase.storage.from("images").list();

  const paths = data
    ? data.map((img) => ({ params: { imageId: img.id } }))
    : [];
  console.log(paths);

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  //list of all the images in the storage bucket

  const imageId = context.params?.imageId;

  const { data } = await supabase.storage.from("images").list();

  const img = data?.find((img) => img.id === imageId);
  let imageWithDimension: ImageWithDimensions | null = null;

  if (img) {
    const imageObj: ImageType = {
      name: img.name,
      id: img.id,
      url: `${BASE_URL}${img.name}`,
    };

    imageWithDimension = await createImgWithDimensions(imageObj);
  }

  return {
    props: {
      image: imageWithDimension,
    },
  };
};

export default ImageDetailPage;
