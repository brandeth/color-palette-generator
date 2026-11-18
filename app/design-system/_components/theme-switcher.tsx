"use client";

import { useEffect, useState } from "react";

type Theme = "system" | "light" | "dark";

const options: { value: Theme; label: string }[] = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

/*
 * Preview-only theme switch for the design system page. Sets data-theme on
 * <html> (see globals.css) and removes it again when leaving the page.
 * Not persisted: the app-wide theme toggle is a separate piece of work.
 */
export function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "system") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => () => document.documentElement.removeAttribute("data-theme"), []);

  return (
    <div
      role="group"
      aria-label="Preview theme"
      className="flex gap-paintbox-050 rounded-paintbox-full bg-surface-alt p-paintbox-050"
    >
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={theme === o.value}
          onClick={() => setTheme(o.value)}
          className="h-paintbox-400 cursor-pointer rounded-paintbox-full px-paintbox-150 text-preset-8-bold text-text-muted hover:text-text aria-pressed:bg-surface aria-pressed:text-text aria-pressed:shadow-paintbox-md"
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
