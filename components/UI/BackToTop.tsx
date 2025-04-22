import ChevronUp from "../Icons/ChevronUp";

const BackToTop = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className="mx-auto grid place-items-center size-12 transition-all duration-300 rounded-full p-1 bg-radial from-theme-lightest to-theme-light hover:scale-110"
      aria-label="back to top"
    >
      <ChevronUp />
    </button>
  );
};

export default BackToTop;
