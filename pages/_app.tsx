import "@/styles/globals.css";
import type { AppProps } from "next/app";
import React from "react";
import Layout from "@/components/Layout/Layout";
import { QueryClient, QueryClientProvider, HydrationBoundary  } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = React.useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={pageProps.dehydratedState}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </HydrationBoundary>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default MyApp;
