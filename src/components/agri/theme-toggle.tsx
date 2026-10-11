import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial preference from localStorage or root class
    const saved = localStorage.getItem("agritwin-theme");
    if (saved === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("agritwin-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("agritwin-theme", "light");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="inline-flex items-center justify-center size-9 rounded-full bg-surface-2 hover:bg-surface-2/80 text-foreground border border-border shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label="Toggle Light and Dark Mode"
    >
      {isDark ? (
        <Sun className="size-4 text-amber-400 animate-in spin-in-180 duration-300" />
      ) : (
        <Moon className="size-4 text-slate-700 animate-in spin-in-180 duration-300" />
      )}
    </button>
  );
}
