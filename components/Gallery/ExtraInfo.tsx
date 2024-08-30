'use client';

import { useState, useEffect } from "react";
import { intervalToDuration } from "date-fns";
import { differenceInCalendarDays } from "date-fns";

type Props = {
  takenAt: string;
  birthDate?: string;
  isVideo?: boolean;
};

//determine the age of the cat using the birthdate and the takenAt date
const determineAge = (takenAt: string, birthDate: string) => {
  const { years, months = 0 } = intervalToDuration({
    start: Date.parse(birthDate),
    end: Date.parse(takenAt),
  });

  //calculate age in weeks when younger than 3 months
  if (years === 0 && months && months < 3) {
    const ageInDays =
      differenceInCalendarDays(Date.parse(takenAt), Date.parse(birthDate)) + 1;
    const ageInWeeks = Math.floor(ageInDays / 7);
    return `${ageInWeeks} weken`;
  }

  //return age in months and years when older than 3 months
  const numberOfYears = years && years > 0 ? `${years} jaar, ` : "";
  return `${numberOfYears}${months} ${months === 1 ? "maand" : "maanden"}`;
};

const ExtraInfo = (props: Props) => {
  const { takenAt, birthDate } = props;

  const [showInfo, setShowInfo] = useState<boolean>(false);

  //hide info after 3 seconds
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showInfo) {
      timer = setTimeout(() => {
        setShowInfo(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [showInfo]);

  //format date and determine age
  //formattedAge is bogus when birthDate is null but it's not used in that case
  const [year, month, day] = takenAt.split("-") || [];
  const formattedTakenAt = `${day}-${month}-${year}`;
  const formattedAge = determineAge(takenAt, birthDate || "");

  const resourceType = props.isVideo ? "video" : "image";

  const position = {
    "image": "absolute bottom-6 left-4 right-4",
    "video": "absolute bottom-12 left-4 right-4",
  }

  return (
    <div className={`hidden sm:flex flex-col items-center z-10 ${position[resourceType]}`}>
      {showInfo && (
        <div className="animate-fade flex flex-col text-xs w-full text-center bg-white bg-opacity-70 mb-2 py-2 font-medium rounded-md">
          <span>Datum: {formattedTakenAt}</span>
          {birthDate && <span>Leeftijd: {formattedAge}</span>}
        </div>
      )}

      <div
        className="transition-all flex items-center justify-center w-10 h-10 rounded-full bg-white bg-opacity-50 hover:scale-105"
        onClick={() => setShowInfo((prev) => !prev)}
      >
        {showInfo ? (
          <img src="/close-icon.svg" alt="close" width="28px" height="28px" />
        ) : (
          <img src="/info-icon.svg" alt="info" width="24px" height="24px" />
        )}
      </div>
    </div>
  );
};

export default ExtraInfo;
