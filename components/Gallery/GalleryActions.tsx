'use client';

import { useState } from "react";
import { intervalToDuration } from "date-fns";
import { differenceInCalendarDays } from "date-fns";
import { Info, Sparkles } from "lucide-react";
import { getSimilarCatPhotos } from "@/app/_actions/similar-cats";
import { SimilarCatPhoto, SimilarCatPhotoWithDimensions } from "@/types/types";
import { getImageDimensions } from "@/utils/images";


type Props = {
    takenAt: string;
    birthDate?: string;
    isVideo?: boolean;
    isMultipleCats?: boolean;
    imageUrl?: string;
    id?: string;
    cat?: string;
    onSimilarImages?: React.Dispatch<
        React.SetStateAction<Array<SimilarCatPhotoWithDimensions>>
    >;
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

export default function GalleryActions(props: Props) {
    const { takenAt, birthDate, isVideo, isMultipleCats, imageUrl, id, onSimilarImages, cat } = props;

    const [showInfo, setShowInfo] = useState<boolean>(false);

    const handleFindSimilarImages = async () => {
        if (!imageUrl || !id || !cat) return;
        const similarPhotos = await getSimilarCatPhotos(imageUrl, cat);

        // format the similar photos and sort them by height/width ratio
        const formattedSimilarPhotos = similarPhotos.value.map((photo: SimilarCatPhoto, index: number) => ({
            ...photo,
            width: getImageDimensions(photo.imageUrl)?.width,
            height: getImageDimensions(photo.imageUrl)?.height,
            chosen: index === 0,
        })).sort((a: SimilarCatPhotoWithDimensions, b: SimilarCatPhotoWithDimensions) => (b.height / b.width) - (a.height / a.width));

        onSimilarImages?.(formattedSimilarPhotos);
    }

    //format date and determine age
    //formattedAge is bogus when birthDate is null but it's not used in that case
    const [year, month, day] = takenAt?.split("-") ?? [];
    const formattedTakenAt = `${day}-${month}-${year}`;
    const formattedAge = determineAge(takenAt, birthDate || "");

    const resourceType = isVideo ? "video" : "image";

    const position = {
        "image": "absolute bottom-6 left-4 right-4",
        "video": "absolute bottom-12 left-4 right-4",
    }

    return (
        <div onMouseLeave={() => setShowInfo(false)} className={`flex opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-300 delay-0 group-hover:delay-700 justify-center items-center w-fit rounded-full mx-auto min-w-10 px-4 min-h-10 z-10 bg-white/70 ${position[resourceType]}`}>
            {showInfo ? (
                <span className="animate-fade flex flex-col items-center justify-between text-xs lg:text-sm w-full text-center py-2 font-medium">
                    <span>{formattedTakenAt}</span>
                    {birthDate && <span>{formattedAge}</span>}
                </span>

            ) : (
                <span className="flex items-center gap-2 justify-center">
                    {!takenAt ? null : <button aria-label="Show extra information" onClick={() => setShowInfo(true)}><Info className="transition-all hover:scale-105 size-6" /></button>}
                    {!isVideo && !isMultipleCats && <button aria-label="Find similar images" onClick={handleFindSimilarImages}><Sparkles className="transition-all hover:scale-105 size-6" /></button>}</span>
            )}
        </div>
    )
}


















