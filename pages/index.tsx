import type { GetStaticProps, NextPage } from "next";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";
import { useState } from "react";
import probe from "probe-image-size";

interface ImageObject {
  url: string;
  width: number;
  height: number;
}

const Home: NextPage<{ imageObjs: ImageObject[] }> = ({ imageObjs }) => {
  return (
    <div className="columns-2 space-y-8 gap-8 sm:gap-10 md:columns-3">
      {imageObjs?.map((img, idx) => (
        <div className="mb-8" key={idx}>
          <Image
            src={img.url}
            width={img.width}
            height={img.height}
            alt="kat"
            className="rounded-xl"
          />
        </div>
      ))}
    </div>
  );
};

export default Home;

async function createImgObj(url: string) {
  //get the width and height from the img url
  let result = await probe(url);
  return {
    url: result.url,
    width: result.width,
    height: result.height,
  };
}

export async function getStaticProps() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  const supabase = createClient(supabaseUrl, supabaseKey);

  let imageObjs: ImageObject[] = [];

  //list of all the image in the bucker
  const { data: images, error } = await supabase.storage.from("images").list();

  let imageUrls: string[] = [];

  if (images) {
    const imageNames = images.map((item) => item.name);
    imageUrls = imageNames.map((imageName) => {
      const { data } = supabase.storage.from("images").getPublicUrl(imageName);
      return data!.publicURL;
    });

    //add the height and width to each url
    imageObjs = await Promise.all(
      imageUrls.map(async (url) => {
        return await createImgObj(url);
      })
    );
  }

  return {
    props: {
      imageObjs,
    },
  };
}
