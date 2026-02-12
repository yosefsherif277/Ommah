"use client";

import { Provider } from "react-redux";
import { store } from "./utils/store";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from "@clerk/nextjs";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <Provider store={store}>
        {children}
        <Toaster />
      </Provider>
    </ClerkProvider>
  );
}
