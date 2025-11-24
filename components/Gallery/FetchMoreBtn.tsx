"use client";

import Spinner from "../UI/Spinner";

type Props = {
  fetchNextPage: () => void;
  isFetching: boolean;
  isFetchingNextPage: boolean;
};

const FetchMoreBtn = (props: Props) => {
  const { fetchNextPage, isFetching, isFetchingNextPage } = props;

  return (
    <div className="flex justify-center my-6">
      <button
        className="flex gap-2 cursor-pointer rounded-xl text-slate-950 border-2 border-slate-600 bg-white py-2.5 px-5 transition-colors duration-300 hover:bg-slate-50 md:text-base"
        onClick={() => fetchNextPage()}
        disabled={isFetching}
      >
        {isFetchingNextPage ? "Loading..." : "Load more"}
        {isFetchingNextPage && <Spinner />}
      </button>
    </div>
  );
};

export default FetchMoreBtn;
