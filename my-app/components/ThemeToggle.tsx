// components/ThemeToggle.tsx
"use client";

import { Moon, Sun } from "lucide-react";
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
      className="p-2 transition-colors border rounded-full cursor-pointer bg-background text-secondary-foreground hover:bg-muted"
      aria-label="Toggle theme"
    >
      {theme === "light" && <Moon size={15} />}
      {theme === "dark" && <Sun size={18} />}
      {theme === "system" && (resolvedTheme === "dark" ? <Sun size={18} className="font-semibold" /> : <Moon size={15} />)}
      {/* <span className="ml-2 text-sm">
        {theme === "light" && "Light"}
        {theme === "dark" && "Dark"}
        {theme === "system" && "System"}
      </span> */}
    </button>
  );
}
