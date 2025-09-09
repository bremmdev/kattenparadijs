"use client";

import React, { unstable_ViewTransition as ViewTransition } from "react";
import Image from "next/image";
import { intervalToDuration } from "date-fns";
import { dancing_script } from "@/app/fonts";
import { Cat } from "@/types/types";
import PassingIcon from "./PassingIcon";
import { getBanner } from "@/utils/banner";

type Props = {
  cat: Cat;
  imageCount: number;
};

const Bio = ({ cat, imageCount }: Props) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
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

  const banner = getBanner(cat ?? undefined);

  function toggleExpanded() {
    React.startTransition(() => {
      setIsExpanded((prev) => !prev);
    });
  }

  const BioContent = () => (
    <>
      <div className="my-1 flex flex-col justify-between gap-1 font-medium sm:my-2 sm:gap-2">
        <h3>Geboortedatum</h3>
        <span className="font-normal">{formattedBirthDate}</span>
      </div>
      {cat.passingDate && (
        <div className="my-1 flex flex-col justify-between gap-1 font-medium sm:my-2 sm:gap-2">
          <h3>Overlijdensdatum</h3>
          <span className="font-normal flex gap-1 justify-center items-center">
            {formattedPassingDate}
            <span className="font-normal">{`(${years ?? 0} jaar, ${months ?? 0} ${
              months === 1 ? "maand" : "maanden"
            })`}</span>
            <PassingIcon />
          </span>
        </div>
      )}
      {!cat.passingDate && (
        <div className="my-1 flex flex-col justify-between gap-1 font-medium sm:my-2 sm:gap-2">
          <h3>Leeftijd</h3>
          <span className="font-normal">{`${years ?? 0} jaar, ${months ?? 0} ${
            months === 1 ? "maand" : "maanden"
          }`}</span>
        </div>
      )}
      <div className="my-1 flex flex-col justify-between gap-1 font-medium sm:my-2 sm:gap-2">
        <h3>Bijnaam</h3>
        <span className="font-normal">{formattedNicknames}</span>
      </div>
      <div className="my-1 flex flex-col justify-between gap-1 font-medium sm:my-2 sm:gap-2">
        <h3>Aantal foto's</h3>
        <span className="font-normal">{imageCount}</span>
      </div>
    </>
  );

  return (
    <div className="flex flex-col md:flex-row gap-8 mb-8">
      <div className="flex flex-col justify-center relative p-2 text-center w-full md:flex-1/3 md:min-w-xs mx-auto bg-theme-lightest rounded-lg md:p-4 text-xs md:text-base">
        <div className="flex justify-center items-center gap-2 border-b border-b-theme-light pb-4">
          <Image src={cat.iconUrl} alt="logo" width={36} height={36} />
          <h2
            className={`${dancing_script.className} tracking-wider text-center text-theme capitalize text-2xl md:text-3xl flex gap-1 items-center translate-y-1 md:translate-y-0.5`}
          >
            {cat.name}
            {cat.passingDate && <PassingIcon />}
          </h2>
          <img
            src="chevron.svg"
            width="22px"
            height="22px"
            className={`md:hidden absolute right-8 top-4 translate-y-1 transition-all cursor-pointer ${
              isExpanded ? "rotate-180" : "rotate-0"
            } hover:scale-105 hover:brightness-105`}
            onClick={toggleExpanded}
          />
        </div>

        {/* mobile bio is collapsed by default but can be toggled */}
        <div
          id="bio-content"
          className={`md:hidden py-1 mt-4 ${isExpanded ? "block" : "hidden"}`}
        >
          <BioContent />
        </div>

        {/* desktop bio is always visible and can't be toggled */}
        <div className="hidden md:block py-1 mt-4">
          <BioContent />
        </div>
      </div>

      {banner && (
        <Image
          src={banner}
          alt={`${cat.name} banner`}
          priority
          className="rounded-lg w-full shrink md:max-w-2xl overflow-hidden"
        />
      )}
    </div>
  );
};

export default Bio;
