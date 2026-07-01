"use client";

import { Moon, Sun } from "lucide-react";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const timeout = window.setTimeout(() => setMounted(true), 0);

    return () => window.clearTimeout(timeout);
  }, []);

  const isDark = mounted && theme === "dark";
  const label = isDark ? "Switch to light theme" : "Switch to dark theme";

  return (
    <button
      onClick={() => {
        if (!mounted) {
          return;
        }

        setTheme(isDark ? "light" : "dark");
      }}
      aria-label={label}
      className="
        card-surface
        p-2.5
        sm:p-3
        transition-default
        hover:scale-105
      "
    >
      {!mounted ? (
        <Moon size={20} className="opacity-0" />
      ) : isDark ? (
        <Sun size={20} />
      ) : (
        <Moon size={20} />
      )}
    </button>
  );
}
