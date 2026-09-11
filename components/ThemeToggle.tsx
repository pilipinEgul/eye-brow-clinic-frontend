"use client";

import { useEffect, useState } from "react";

const KEY = "emcey-theme-mode";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [mode, setMode] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const current = (document.documentElement.getAttribute("data-theme") as "light" | "dark") || "light";
    setMode(current);
    setMounted(true);
  }, []);

  function toggle() {
    const next = mode === "dark" ? "light" : "dark";
    setMode(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(KEY, next);
    } catch {
      // ignore
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      title={mode === "dark" ? "Light mode" : "Dark mode"}
      className={`grid h-10 w-10 place-items-center rounded-full border border-nude-200 bg-white/70 text-ink-700 transition hover:border-terracotta-400 hover:text-terracotta-500 ${className}`}
    >
      {/* Avoid hydration mismatch: render a neutral icon until mounted */}
      <i className={`pi ${mounted && mode === "dark" ? "pi-sun" : "pi-moon"} text-sm`} aria-hidden />
    </button>
  );
}
