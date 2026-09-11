"use client";

import { useEffect } from "react";
import type { DefaultMode } from "@/lib/theme";

/**
 * When the admin default is "system" and the visitor hasn't manually toggled,
 * follow the device's light/dark preference live (e.g. OS switches at sunset).
 * A manual toggle (localStorage 'emcey-theme-mode') always wins.
 */
export function ThemeSync({ defaultMode }: { defaultMode: DefaultMode }) {
  useEffect(() => {
    if (defaultMode !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const saved = localStorage.getItem("emcey-theme-mode");
      if (saved === "light" || saved === "dark") return; // manual override wins
      document.documentElement.setAttribute("data-theme", mq.matches ? "dark" : "light");
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [defaultMode]);

  return null;
}
