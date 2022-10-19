import Image from "next/image";
import { intervalToDuration } from "date-fns";
import { useEffect, useState } from "react";

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

  //close the bio if we go to another cat page
  useEffect(() => {
    setIsExpanded(false)
  }, [cat])

  const formattedNicknames = cat.nicknames.join(", ");
  return (
    <div className="flex flex-col justify-center relative max-w-xl text-center mx-auto bg-rose-50 rounded-lg p-3 mb-10">
      <img
        src="chevron.svg"
        width="24px"
        height="24px"
        className={`absolute right-8 top-6 transition-all cursor-pointer ${
          isExpanded ? "rotate-180" : "rotate-0"
        } hover:scale-105 hover:brightness-105`}
        onClick={() => setIsExpanded((prev) => !prev)}
      />
      <div className="flex justify-center items-center gap-2 border-b border-b-rose-300 pb-4">
        <Image src={cat.iconUrl} alt="logo" width={36} height={36} />
        <h2 className="font-handwriting tracking-wider text-center text-rose-500 capitalize translate-y-1 text-3xl">
          {cat.name}
        </h2>
      </div>
      {isExpanded && (
        <div className="py-2">
          <div className="text-xs flex flex-col justify-between gap-2 font-medium my-2 sm:text-sm">
            <h3>Geboortedatum</h3>
            <span className="font-normal">{formattedBirthDate}</span>
          </div>
          <div className="text-xs flex flex-col justify-between gap-2 font-medium my-2 sm:text-sm">
            <h3>Leeftijd</h3>
            <span className="font-normal">{`${years} jaar, ${months} maanden`}</span>
          </div>
          <div className="text-xs flex flex-col justify-between gap-2 font-medium my-2 sm:text-sm">
            <h3>Bijnaam</h3>
            <span className="font-normal">{formattedNicknames}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bio;
