import React from "react";
import throttle from "@/utils/throttle";
import { usePathname } from "next/navigation";

const useBodyToViewportRatio = () => {
  const pathname = usePathname();

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
  }, [pathname]);

  return { bodyToViewportRatio };
};

export default useBodyToViewportRatio;
