import { useRouter } from "next/router";

import { ImageWithDimensions } from "../../pages";

const SelectRandomCat = ({ images }: { images: ImageWithDimensions[] }) => {
  const router = useRouter();

  const selectRandomCat = () => {
    const rndIdx = Math.floor(Math.random() * images.length);
    const selectedId = images[rndIdx].id;
    document
      .querySelector(`a[href="/?imageId=${selectedId}"]`)
      ?.scrollIntoView();
    router.push(`/?imageId=${selectedId}`, undefined, { scroll: false });
  };

  return (
    <div className="flex justify-center mb-6">
      <button
        className="inline-block text-3xl font-bold rounded-full mx-auto bg-rose-200 w-12 h-12 text-center"
        onClick={selectRandomCat}
      >
        ?
      </button>
    </div>
  );
};

export default SelectRandomCat;
