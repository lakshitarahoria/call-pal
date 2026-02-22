"use client";

import { useEffect } from "react";
import { useAppContext } from "@/src/AppContext";
import type { Theme } from "@/lib/theme";

function isTheme(t: object | null): t is Theme {
  return t !== null && "backgroundColor" in t && "primaryColor" in t;
}

export default function ThemeApply() {
  const { theme } = useAppContext();

  useEffect(() => {
    const root = document.documentElement;
    if (theme && isTheme(theme)) {
      root.style.setProperty("--theme-background", theme.backgroundColor);
      root.style.setProperty("--theme-primary", theme.primaryColor);
      root.style.setProperty("--theme-text", theme.textColor);
    } else {
      root.style.setProperty("--theme-background", "#ffffff");
      root.style.setProperty("--theme-primary", "#7C3AED");
      root.style.setProperty("--theme-text", "#1F2937");
    }
  }, [theme]);

  return null;
}
