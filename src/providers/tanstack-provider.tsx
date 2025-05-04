"use client";

import React from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

function TanstackProvider({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

export { TanstackProvider };
