// Lightweight i18n for the app (the landing page stays English).
//
// Dictionaries are keyed by the English source text, so untranslated strings simply fall
// back to English. Keys may contain {0}, {1}… placeholders to match strings built at
// runtime, e.g. "Humidity > 85% (now {0}%)".
//
// `tr()` is a plain function rather than a hook: the app shell re-mounts its subtree
// when the language changes (see AppShell), so every call re-runs with the new language.

import { useSyncExternalStore } from "react";
import { hi } from "./i18n/hi";
import { mr } from "./i18n/mr";

export type Lang = "en" | "hi" | "mr";

export const languages: { code: Lang; label: string; short: string }[] = [
  { code: "en", label: "English", short: "EN" },
  { code: "hi", label: "हिन्दी", short: "हि" },
  { code: "mr", label: "मराठी", short: "मर" },
];

const STORAGE_KEY = "cropify-lang";

type Pattern = { re: RegExp; template: string };
type Compiled = { exact: Map<string, string>; patterns: Pattern[] };

function compile(dict: Record<string, string>): Compiled {
  const exact = new Map<string, string>();
  const patterns: Pattern[] = [];
  for (const [key, value] of Object.entries(dict)) {
    if (/\{\d\}/.test(key)) {
      const source = key
        .split(/(\{\d\})/)
        .map((part) =>
          /^\{\d\}$/.test(part) ? "(.+?)" : part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        )
        .join("");
      patterns.push({ re: new RegExp(`^${source}$`, "s"), template: value });
    } else {
      exact.set(key, value);
    }
  }
  // most specific (longest literal text) first, so "{0} lesions" beats a looser pattern
  const literalLength = (re: RegExp) => re.source.replace(/\(\.\+\?\)/g, "").length;
  patterns.sort((a, b) => literalLength(b.re) - literalLength(a.re));
  return { exact, patterns };
}

const compiled: Record<Exclude<Lang, "en">, Compiled> = { hi: compile(hi), mr: compile(mr) };

let current: Lang = "en";
const listeners = new Set<() => void>();

function lookup(text: string, c: Compiled): string | undefined {
  const hit = c.exact.get(text);
  if (hit !== undefined) return hit;
  for (const { re, template } of c.patterns) {
    const m = re.exec(text);
    if (m) {
      // placeholders inside the captured values are translated too ("{0} lesions" → "7 घाव")
      return template.replace(/\{(\d)\}/g, (_, i: string) => {
        const v = m[Number(i) + 1] ?? "";
        return lookup(v, c) ?? v;
      });
    }
  }
  return undefined;
}

/** Translate a UI value. Non-strings (numbers, elements, arrays) pass through untouched. */
export function tr<T>(value: T): T {
  if (current === "en" || typeof value !== "string") return value;
  const c = compiled[current];
  const trimmed = value.trim();
  if (!trimmed) return value;
  const hit = lookup(trimmed, c);
  if (hit === undefined) return value;
  // keep any surrounding whitespace the source text relied on
  const lead = value.slice(0, value.indexOf(trimmed));
  const trail = value.slice(value.indexOf(trimmed) + trimmed.length);
  return (lead + hit + trail) as T;
}

export function getLang(): Lang {
  return current;
}

export function setLang(lang: Lang) {
  if (lang === current) return;
  current = lang;
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // storage unavailable — the choice still applies for this visit
  }
  document.documentElement.lang = lang;
  listeners.forEach((l) => l());
}

/** Restore the saved language. Called once after hydration so SSR output stays English. */
export function restoreLang() {
  let saved: string | null = null;
  try {
    saved = localStorage.getItem(STORAGE_KEY);
  } catch {
    saved = null;
  }
  if (saved === "hi" || saved === "mr") setLang(saved);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useLang(): Lang {
  return useSyncExternalStore(subscribe, getLang, () => "en" as Lang);
}
