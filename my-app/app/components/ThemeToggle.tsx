// components/ThemeToggle.tsx
"use client";

import { useTheme } from "./theme-context";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <button
      onClick={() => {
        if (theme === "light") setTheme("dark");
        else if (theme === "dark") setTheme("system");
        else setTheme("light");
      }}
      className="p-2 rounded-md bg-secondary text-secondary-foreground hover:bg-muted transition-colors"
      aria-label="Toggle theme"
    >
      {theme === "light" && "☀️"}
      {theme === "dark" && "🌙"}
      {theme === "system" && (resolvedTheme === "dark" ? "🌙" : "☀️")}
      <span className="ml-2 text-sm">
        {theme === "light" && "Light"}
        {theme === "dark" && "Dark"}
        {theme === "system" && "System"}
      </span>
    </button>
  );
}
