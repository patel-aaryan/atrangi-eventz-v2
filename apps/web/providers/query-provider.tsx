"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode, useState } from "react";

interface QueryProviderProps {
  readonly children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh
            gcTime: 10 * 60 * 1000, // 10 minutes - garbage collection time
            refetchOnWindowFocus: false, // Don't refetch when user returns to tab
            retry: 1, // Retry failed requests once
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* DevTools only show in development */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
