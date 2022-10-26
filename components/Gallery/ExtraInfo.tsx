import { useState, useEffect } from "react";
import { intervalToDuration } from "date-fns";

type Props = {
  takenAt: string;
  birthDate: string;
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

  //format date
  const [year, month, day] = takenAt.split("-") || [];
  const formattedTakenAt = `${day}-${month}-${year}`;

  //determine the age of the cat using the birthdate and the takenAt date
  const { years, months } = intervalToDuration({
    start: Date.parse(birthDate),
    end: Date.parse(takenAt),
  });

  const formattedAge = `${years} jaar, ${months} maanden`;

  return (
    <div className="hidden sm:flex flex-col items-center z-10 absolute bottom-6 left-4 right-4 ">
      {showInfo && (
        <div className="animate-fade flex flex-col text-xs w-full text-center bg-white bg-opacity-70 mb-2 py-2 font-medium rounded-md">
          <span>Datum: {formattedTakenAt}</span>
          <span>Leeftijd: {formattedAge}</span>
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