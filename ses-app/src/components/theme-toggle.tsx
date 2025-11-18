"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <button
      type="button"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="rounded-md border border-primary-dark px-3 py-1.5 text-sm font-medium transition hover:bg-primary-light hover:text-white dark:border-gray-600 dark:hover:bg-gray-700"
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}