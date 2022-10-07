import type { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";
import { useState } from "react";
import { createImgWithDimensions } from "../utils/createImgWithDimensions";

export const BASE_URL =
  "https://dfphzeytrypxfhsoszzw.supabase.co/storage/v1/object/public/images/";

export interface ImageWithDimensions extends ImageType {
  width: number;
  height: number;
}

export interface ImageType {
  name: string;
  id: string;
  url: string;
}

const Home: NextPage<{ images: ImageWithDimensions[] }> = ({ images }) => {
  return (
    <>
      {images.length === 0 && (
        <p className="text-center">There are no images yet.</p>
      )}
      {images.length > 0 && (
        <div className="columns-2 space-y-8 gap-8 sm:gap-10 md:columns-3">
          {images.map((img, idx) => (
            <div className="mb-8 cursor-pointer" key={img.id}>
              <Link href={img.id}>
                <a>
                  <Image
                    src={img.url}
                    width={img.width}
                    height={img.height}
                    alt="kat"
                    className="rounded-xl"
                  />
                </a>
              </Link>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Home;

export async function getStaticProps() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  const supabase = createClient(supabaseUrl, supabaseKey);

  let imagesWithDimension: ImageWithDimensions[] = [];
  let images: ImageType[] = [];

  //list of all the images in the storage bucket
  let { data } = await supabase.storage.from("images").list();

  if (data && data.length >= 1) {
    images = data.map((img) => {
      return {
        name: img.name,
        id: img.id,
        url: `${BASE_URL}${img.name}`,
      };
    });

    //add the height and width to each url
    imagesWithDimension = await Promise.all(
      images.map(async (img) => {
        return await createImgWithDimensions(img);
      })
    );
  }

  return {
    props: {
      images: imagesWithDimension,
    },
  };
}
