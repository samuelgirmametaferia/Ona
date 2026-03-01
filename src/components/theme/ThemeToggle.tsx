"use client";

import { useTheme } from "./ThemeProvider";
import { Sun, Moon, Monitor } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme, resolved } = useTheme();

  return (
    <div className="flex rounded-xl bg-[var(--bg-tertiary)] p-1">
      <button
        type="button"
        onClick={() => setTheme("light")}
        className={`icon-hover rounded-lg p-2 transition-colors ${
          theme === "light"
            ? "bg-[var(--bg-elevated)] text-[var(--text-primary)] shadow"
            : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
        }`}
        title="Light"
        aria-label="Light mode"
      >
        <Sun className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => setTheme("dark")}
        className={`icon-hover rounded-lg p-2 transition-colors ${
          theme === "dark"
            ? "bg-[var(--bg-elevated)] text-[var(--text-primary)] shadow"
            : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
        }`}
        title="Dark"
        aria-label="Dark mode"
      >
        <Moon className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => setTheme("system")}
        className={`icon-hover rounded-lg p-2 transition-colors ${
          theme === "system"
            ? "bg-[var(--bg-elevated)] text-[var(--text-primary)] shadow"
            : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
        }`}
        title="System"
        aria-label="System preference"
      >
        <Monitor className="h-4 w-4" />
      </button>
    </div>
  );
}
