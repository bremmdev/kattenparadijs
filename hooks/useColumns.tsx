import React from "react";

export const useColumns = () => {
  const [columns, setColumns] = React.useState<number>(4);

  React.useEffect(() => {
    //resize handler
    const handleResize = () => {
      const width = window.innerWidth;

      if (width < 640) {
        setColumns(2);
        return;
      }
      if (width < 960) {
        setColumns(3);
        return;
      }

      setColumns(4);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return columns;
};
