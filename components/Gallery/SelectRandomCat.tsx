import { useRouter } from "next/router";
import { ImageWithDimensions } from "../../types/types";

const SelectRandomCat = ({ images }: { images: ImageWithDimensions[] }) => {
  const router = useRouter();

  const selectRandomCat = () => {
    const rndIdx = Math.floor(Math.random() * images.length);
    const selectedId = images[rndIdx].id;
    router.push(`/?imageId=${selectedId}`, undefined, { scroll: false });
  };

  return (
    <div className="flex justify-center mb-6">
      <button
        className="transition-all duration-300 inline-block text-slate-500 text-3xl font-bold rounded-full mx-auto w-12 h-12 text-center bg-gradient-radial from-rose-100 via-rose-200 to-rose-300 hover:scale-110 hover:brightness-105"
        onClick={selectRandomCat}
      >
        ?
      </button>
    </div>
  );
};

export default SelectRandomCat;
