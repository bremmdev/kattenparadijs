import React from "react";

const breakPointsToColumns = {
  sm: 1,
  md: 2,
  lg: 3,
};

export const useColumns = () => {
  const defaultColumns = breakPointsToColumns.lg;

  const [columns, setColumns] = React.useState<number>(defaultColumns);

  React.useEffect(() => {
    //resize handler
    const handleResize = () => {
      const width = window.innerWidth;

      if (width < 640) {
        setColumns(breakPointsToColumns.sm);
        return;
      }

      if (width < 960) {
        setColumns(breakPointsToColumns.md);
        return;
      }

      setColumns(breakPointsToColumns.lg);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return columns;
};
