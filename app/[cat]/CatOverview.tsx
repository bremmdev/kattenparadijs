"use client";

import React from "react";
import { Cat } from "@/types/types";
import Gallery from "@/components/Gallery/Gallery";
import useWindowSize from "@/hooks/useWindowSize";
import Confetti from "react-confetti";
import Bio from "@/components/Cat/Bio";
import { checkBirthday } from "@/utils/checkBirthday";
import { unstable_ViewTransition as ViewTransition } from "react";

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
      <ViewTransition enter="fade-in-fast">
        <Gallery cat={cat} isDetail={isDetail} />
      </ViewTransition>
    </>
  );
};

export default CatOverview;
