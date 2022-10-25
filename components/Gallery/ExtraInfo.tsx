import { useState } from "react";
import { intervalToDuration } from "date-fns";

type Props = {
  takenAt: string;
  birthDate: string;
};

const ExtraInfo = (props: Props) => {
  const { takenAt, birthDate } = props;

  const [showInfo, setShowInfo] = useState<boolean>(false);

  const [year, month, day] = takenAt.split("-") || [];
  const formattedTakenAt = `${day}-${month}-${year}`;

  const { years, months } = intervalToDuration({
    start: Date.parse(birthDate),
    end: Date.parse(takenAt),
  });

  const formattedAge = `${years} jaar, ${months} maanden`;

  return (
    <div className="flex flex-col items-center z-10 absolute bottom-6 left-4 right-4 ">
      {showInfo && (
        <div className="animate-fade flex flex-col text-xs w-full text-center bg-white bg-opacity-70 mb-2 py-2 font-medium rounded-md">
          <span>Datum: {formattedTakenAt}</span>
          <span>Leeftijd: {formattedAge}</span>
        </div>
      )}

      <div
        className="transition-all flex items-center justify-center w-8 h-8 rounded-full bg-white bg-opacity-50 hover:scale-105"
        onClick={() => setShowInfo((prev) => !prev)}
      >
        {showInfo ? (
          <img src="/close-icon.svg" alt="close" width="24px" height="24px" />
        ) : (
          <img src="/info-icon.svg" alt="info" width="20px" height="20px" />
        )}
      </div>
    </div>
  );
};

export default ExtraInfo;
