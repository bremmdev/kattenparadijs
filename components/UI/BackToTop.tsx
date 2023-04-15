import Image from "next/image";

const BackToTop = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="flex justify-center" onClick={scrollToTop}>
      <Image
        src="chevron-double-up.svg"
        width="52"
        height="52"
        className="transition-all duration-300 rounded-full p-1 bg-rose-100 opacity-80 hover:scale-110"
        alt="back to top"
      />
    </div>
  );
};

export default BackToTop;
