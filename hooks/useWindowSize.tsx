import React from "react";

interface Size {
  width: number | undefined;
  height: number | undefined;
}

function useWindowSize(): Size {
  // Initialize state with undefined width/height so server and client renders match
  const [windowSize, setWindowSize] = React.useState<Size>({
    width: undefined,
    height: undefined,
  });

  React.useEffect(() => {
    function handleResize() {
      setWindowSize({
        //width without scrollbar
        width: document.body.scrollWidth,
        height: window.innerHeight,
      });
    }
    window.addEventListener("resize", handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount
  return windowSize;
}

export default useWindowSize;
