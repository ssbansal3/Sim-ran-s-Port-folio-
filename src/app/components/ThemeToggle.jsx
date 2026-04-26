"use client";

import { useLayoutEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const STORAGE_KEY = "theme";

function applyTheme(mode) {
  const root = document.documentElement;
  if (mode === "dark") {
    root.setAttribute("data-theme", "dark");
  } else {
    root.removeAttribute("data-theme");
  }
}

export default function ThemeToggle() {
  const [isLight, setIsLight] = useState(true);

  useLayoutEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const light = stored !== "dark";
      applyTheme(light ? "light" : "dark");
      setIsLight(light);
    } catch {
      applyTheme("light");
      setIsLight(true);
    }
  }, []);

  function toggle() {
    const next = isLight ? "dark" : "light";
    applyTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next === "light" ? "light" : "dark");
    } catch {
      /* ignore */
    }
    setIsLight(next === "light");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
      className="fixed bottom-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] transition hover:scale-110"
    >
      {isLight ? (
        <Moon className="h-[18px] w-[18px]" strokeWidth={1.75} />
      ) : (
        <Sun className="h-[18px] w-[18px]" strokeWidth={1.75} />
      )}
    </button>
  );
}
