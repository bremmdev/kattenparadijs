"use client";

import React from "react";
import { Cat } from "@/types/types";
import Gallery from "@/components/Gallery/Gallery";
import useWindowSize from "@/hooks/useWindowSize";
import Confetti from "react-confetti";
import Bio from "@/components/Cat/Bio";
import { checkBirthday } from "@/utils/checkBirthday";
import NorrisBanner from "@/public/norris_banner.webp";
import Image from "next/image";

const CatOverview = ({
  cat,
  isDetail = false,
}: {
  cat: Cat | null;
  isDetail: boolean;
}) => {
  const { width: windowWidth, height: windowHeight } = useWindowSize();
  const [showConfetti, setShowConfetti] = React.useState(false);

  React.useEffect(() => {
    const istBirthday = checkBirthday(cat?.birthDate);

    if (istBirthday) {
      setShowConfetti(true);
    } else {
      setShowConfetti(false);
    }
  }, [cat]);

  return (
    <>
      {showConfetti && <Confetti width={windowWidth} height={windowHeight} />}
      {cat && <Bio cat={cat} key={cat.name} />}
      {cat?.name === "norris" && (
        <Image
          width={576}
          className="w-full sm:w-xl rounded-lg block mx-auto my-8 sm:-mt-4"
          src={NorrisBanner}
          alt="Norris banner"
        />
      )}
      <Gallery cat={cat} isDetail={isDetail} />
    </>
  );
};

export default CatOverview;
