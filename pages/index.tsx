import type { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";
import React, { useState } from "react";
import { createImgWithDimensions } from "../utils/createImgWithDimensions";
import { useRouter } from "next/router";
import Modal from "../components/Modal";

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
  const router = useRouter();

  const handleClose = (e: React.MouseEvent) => {
    //only return to home if we click on the overlay
    if ((e.target as HTMLElement).id === "modal_overlay") {
      router.push("/");
    }
  };

  return (
    <>
      {images.length === 0 && (
        <p className="text-center">There are no images yet.</p>
      )}

      {images.length > 0 && router.query.imageId && (
        <Modal onClose={handleClose}>
          <Image
            src={images.find((image) => image.id === router.query.imageId)!.url}
            layout="fill"
            alt="kat"
            className="object-contain"
          />
        </Modal>
      )}

      {images.length > 0 && (
        <div className="columns-2 space-y-8 gap-8 sm:gap-10 md:columns-3">
          {images.map((img) => (
            <div  className="mb-8 cursor-pointer hover:opacity-95 hover:scale-105 transition-all duration-300" key={img.id}>
              <Link href={`/?imageId=${img.id}`}>
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
