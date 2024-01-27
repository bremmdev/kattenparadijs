"use client";

import React from "react";
import { useVideos } from "@/hooks/useVideos";
import FetchMoreBtn from "@/components/Gallery/FetchMoreBtn";
import { sortVideosIntoColumns } from "@/utils/sortIntoColumns";
import { useColumns } from "@/hooks/useColumns";
import { Video } from "@/types/types";

const VideosOverview = () => {
  const { data, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useVideos();

  const videos = data?.pages.flat() ?? [];

  const [columns, setColumns] = React.useState<Array<Array<Video>>>(() =>
    sortVideosIntoColumns(videos, 3)
  );

  //determine how many columns to display based on screen width
  const columnCount = useColumns("videos");

  React.useEffect(() => {
    const columns = sortVideosIntoColumns(videos, columnCount);
    setColumns(columns);
  }, [data, columnCount]);

  return (
    <>
      {/*each column is an array of videos that should be displayed as a flex column, 
      so we can use break-inside-avoid to prevent videos from being taken out of their column*/}
      <div className="columns-1 gap-5 sm:columns-2 md:columns-3">
        {columns.map((column, idx) => (
          <div
            key={idx}
            className="flex flex-col gap-3 items-center break-inside-avoid"
          >
            {column.map((video, idx) => (
              <div key={video.id}>
                <video
                  width={video.width}
                  height={video.height}
                  controls
                  className="rounded-xl"
                >
                  <source src={video.url} type="video/mp4" />
                </video>
              </div>
            ))}
          </div>
        ))}
      </div>
      {hasNextPage && (
        <FetchMoreBtn
          isFetching={isFetching}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
        />
      )}
    </>
  );
};

export default VideosOverview;
