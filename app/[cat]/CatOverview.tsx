"use client";

import React from "react";
import { Cat } from "@/types/types";
import Gallery from "@/components/Gallery/Gallery";
import useWindowSize from "@/hooks/useWindowSize";
import Confetti from "react-confetti";
import Bio from "@/components/Cat/Bio";
import { checkBirthday } from "@/utils/checkBirthday";
import { useImages } from "@/hooks/useImages";

const CatOverview = ({
  cat,
  isDetail = false,
}: {
  cat: Cat | null;
  isDetail: boolean;
}) => {
  const { width: windowWidth, height: windowHeight } = useWindowSize();
  const [showConfetti, setShowConfetti] = React.useState(false);

  const { data } = useImages(cat?.name);
  const catImageCount = data?.pages[0]?.count ?? 0;

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
      {cat && <Bio cat={cat} key={cat.name} imageCount={catImageCount} />}
      <Gallery cat={cat} isDetail={isDetail} />
    </>
  );
};

export default CatOverview;
