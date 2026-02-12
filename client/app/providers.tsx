"use client";

import { Provider } from "react-redux";
import { makeStore, AppStore } from "./utils/store";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from "@clerk/nextjs";
import { useRef } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore>(null);
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
  }

  return (
    <ClerkProvider>
      <Provider store={storeRef.current}>
        {children}
        <Toaster />
      </Provider>
    </ClerkProvider>
  );
}
