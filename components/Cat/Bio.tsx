"use client";

import Image from "next/image";
import { intervalToDuration } from "date-fns";
import { useState } from "react";
import { dancing_script } from "@/app/fonts";
import { Cat } from "@/types/types";
import PassingIcon from "./PassingIcon";
import { flushSync } from "react-dom";

type Props = {
  cat: Cat;
};

const Bio = ({ cat }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const [year, month, day] = cat.birthDate.split("-");
  const formattedBirthDate = `${day}-${month}-${year}`;

  let formattedPassingDate = "";
  if (cat.passingDate) {
    const [year, month, day] = cat.passingDate.split("-");
    formattedPassingDate = `${day}-${month}-${year}`;
  }

  //calculate age based on birthdate and passing date if available
  const { years, months } = intervalToDuration({
    start: Date.parse(cat.birthDate),
    end: cat.passingDate ? Date.parse(cat.passingDate) : new Date(),
  });

  const formattedNicknames = cat.nicknames.join(", ");

  function toggleExpanded() {
    if ("startViewTransition" in document) {
      document.startViewTransition(() => {
        flushSync(() => setIsExpanded((prev) => !prev));
      });
    } else {
      setIsExpanded((prev) => !prev);
    }
  }

  return (
    <div className="flex flex-col justify-center relative max-w-xl p-2 mb-6 text-center mx-auto bg-theme-lightest rounded-lg sm:p-3 sm:mb-10">
      <img
        src="chevron.svg"
        width="20px"
        height="20px"
        className={`absolute right-8 top-4 translate-y-1 transition-all cursor-pointer ${
          isExpanded ? "rotate-180" : "rotate-0"
        } hover:scale-105 hover:brightness-105 sm:top-6 sm:translate-y-0`}
        onClick={toggleExpanded}
      />
      <div className="flex justify-center items-center gap-2 border-b border-b-theme-light pb-4">
        <Image src={cat.iconUrl} alt="logo" width={32} height={32} />
        <h2
          className={`${dancing_script.className} tracking-wider text-center text-theme capitalize translate-y-1 text-2xl flex gap-1 items-center`}
        >
          {cat.name}
          {cat.passingDate && <PassingIcon />}
        </h2>
      </div>
      {isExpanded && (
        <div id="bio-content" className="py-1">
          <div className="text-xs my-1 flex flex-col justify-between gap-1 font-medium sm:my-2 sm:gap-2 sm:text-sm">
            <h3>Geboortedatum</h3>
            <span className="font-normal">{formattedBirthDate}</span>
          </div>
          {cat.passingDate && (
            <div className="text-xs my-1 flex flex-col justify-between gap-1 font-medium sm:my-2 sm:gap-2 sm:text-sm">
              <h3>Overlijdensdatum</h3>
              <span className="font-normal flex gap-1 justify-center items-center">
                {formattedPassingDate}
                <PassingIcon />
              </span>
            </div>
          )}
          <div className="text-xs my-1 flex flex-col justify-between gap-1 font-medium sm:my-2 sm:gap-2 sm:text-sm">
            <h3>Leeftijd</h3>
            <span className="font-normal">{`${years} jaar, ${months} ${
              months === 1 ? "maand" : "maanden"
            }`}</span>
          </div>
          <div className="text-xs my-1 flex flex-col justify-between gap-1 font-medium sm:my-2 sm:gap-2 sm:text-sm">
            <h3>Bijnaam</h3>
            <span className="font-normal">{formattedNicknames}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bio;
