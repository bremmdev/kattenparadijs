import React from "react";
import throttle from "../components/utils/throttle";

//this hook determines the ratio between the body height and the viewport height
//accepts a dependency to re-run on change
const useBodyToViewportRatio = <T,>(dependency: T) => {
  const [bodyToViewportRatio, setBodyToViewportRatio] = React.useState<
    number | null
  >(null);

  const listenToResize = throttle(() => {
    const ratio =
      document.body.getBoundingClientRect().height / window.innerHeight;
    setBodyToViewportRatio(ratio);
  });

  React.useEffect(() => {
    //first time after mount
    listenToResize();
    window.addEventListener("resize", listenToResize);

    return () => window.removeEventListener("resize", listenToResize);
  }, [dependency]);

  return { bodyToViewportRatio };
};

export default useBodyToViewportRatio;
