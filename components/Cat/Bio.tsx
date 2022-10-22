import Image from "next/image";
import { intervalToDuration } from "date-fns";
import { useState } from "react";

interface Cat {
  name: string;
  birthDate: string;
  iconUrl: string;
  nicknames: string[];
}

type Props = {
  cat: Cat;
};

const Bio = ({ cat }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const [year, month, day] = cat.birthDate.split("-");
  const formattedBirthDate = `${day}-${month}-${year}`;

  const { years, months } = intervalToDuration({
    start: Date.parse(cat.birthDate),
    end: new Date(),
  });

  const formattedNicknames = cat.nicknames.join(", ");
  return (
    <div className="flex flex-col justify-center relative max-w-xl p-2 mb-6 text-center mx-auto bg-rose-50 rounded-lg sm:p-3 sm:mb-10">
      <img
        src="chevron.svg"
        width="20px"
        height="20px"
        className={`absolute right-8 top-4 translate-y-1 transition-all cursor-pointer ${
          isExpanded ? "rotate-180" : "rotate-0"
        } hover:scale-105 hover:brightness-105 sm:top-6 sm:translate-y-0`}
        onClick={() => setIsExpanded((prev) => !prev)}
      />
      <div className="flex justify-center items-center gap-2 border-b border-b-rose-300 pb-4">
        <Image src={cat.iconUrl} alt="logo" width={32} height={32} />
        <h2 className="font-handwriting tracking-wider text-center text-rose-500 capitalize translate-y-1 text-2xl">
          {cat.name}
        </h2>
      </div>
      {isExpanded && (
        <div className="py-1">
          <div className="text-xs my-1 flex flex-col justify-between gap-1 font-medium sm:my-2 sm:gap-2 sm:text-sm">
            <h3>Geboortedatum</h3>
            <span className="font-normal">{formattedBirthDate}</span>
          </div>
          <div className="text-xs my-1 flex flex-col justify-between gap-1 font-medium sm:my-2 sm:gap-2 sm:text-sm">
            <h3>Leeftijd</h3>
            <span className="font-normal">{`${years} jaar, ${months} maanden`}</span>
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
