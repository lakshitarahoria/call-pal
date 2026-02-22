"use client";

import { AppProvider } from "@/src/AppContext";
import ThemeApply from "./components/ThemeApply";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <ThemeApply />
      {children}
    </AppProvider>
  );
}
