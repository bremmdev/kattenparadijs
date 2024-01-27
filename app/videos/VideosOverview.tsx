"use client";

import React from "react";
import { useVideos } from "@/hooks/useVideos";
import { Video } from "@/types/types";
import FetchMoreBtn from "@/components/Gallery/FetchMoreBtn";

const VideosOverview = () => {
  const { data, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useVideos();

  const videos = data?.pages.flat() ?? [];

  /* STATE */
  //divide images into columns for masonry layout
  const columns: Array<Array<Video>> = [[], []];

  videos.forEach((video, idx) => {
    columns[idx % 2].push(video);
  });

  return (
    <>
      {/*each column is an array of videos that should be displayed as a flex column, 
      so we can use break-inside-avoid to prevent videos from being taken out of their column*/}
      <div className="columns-2 gap-5">
        {columns.map((column, idx) => (
          <div
            key={idx}
            className="flex flex-col gap-3 items-center break-inside-avoid"
          >
            {column.map((video, idx) => (
              <video
                className="rounded-lg"
                key={video.id}
                controls
                width={video.width}
                height={video.height}
              >
                <source src={video.url} type="video/mp4" />
              </video>
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
