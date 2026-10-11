import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { tr } from "@/lib/i18n";

export function ThemeToggle({ className }: { className?: string }) {
  const [isDark, setIsDark] = useState(false);

  // The root shell applies the saved class before paint; just mirror it here.
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    document.documentElement.classList.toggle("dark", nextDark);
    try {
      localStorage.setItem("cropify-theme", nextDark ? "dark" : "light");
    } catch {
      // storage unavailable (private mode) — theme still applies for this visit
    }
  };

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full text-sm transition-colors cursor-pointer",
        className,
      )}
      title={isDark ? tr("Switch to light mode") : tr("Switch to dark mode")}
      aria-label={tr("Toggle light and dark mode")}
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}
