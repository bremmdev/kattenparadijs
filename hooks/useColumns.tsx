import React from "react";

type Resource = "images" | "videos";

const breakPointsToColumns = {
  images: {
    sm: 2,
    md: 3,
    lg: 4,
  },
  videos: {
    sm: 1,
    md: 2,
    lg: 3,
  },
};

export const useColumns = (resource: Resource) => {
  const defaultColumns = breakPointsToColumns[resource].lg;

  const [columns, setColumns] = React.useState<number>(defaultColumns);

  React.useEffect(() => {
    //resize handler
    const handleResize = () => {
      const width = window.innerWidth;

      if (width < 640) {
        setColumns(breakPointsToColumns[resource].sm);
        return;
      }
      if (width < 960) {
        setColumns(breakPointsToColumns[resource].md);
        return;
      }

      setColumns(breakPointsToColumns[resource].lg);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return columns;
};
