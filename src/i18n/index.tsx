import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import en, { type Dictionary } from "./en";
import kn from "./kn";
import { useRouterState } from "@tanstack/react-router";

export type Lang = "en" | "kn";
export const LANGS: Lang[] = ["en", "kn"];
export const dictionaries: Record<Lang, Dictionary> = { en, kn };
export const LANG_STORAGE_KEY = "cc-lang";

export function isLang(v: unknown): v is Lang {
  return v === "en" || v === "kn";
}

/** Look up "a.b" in a dictionary and fill {placeholders}. */
export function translate(dict: Dictionary, key: string, vars?: Record<string, string>): string {
  const value = key.split(".").reduce<unknown>((o, k) => (o as Record<string, unknown>)?.[k], dict);
  let s = typeof value === "string" ? value : key;
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, v);
  return s;
}

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, vars?: Record<string, string>) => string;
};

const I18nContext = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(LANG_STORAGE_KEY);
      if (isLang(stored)) setLangState(stored);
    } catch { /* Language still works if browser storage is disabled. */ }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { window.localStorage.setItem(LANG_STORAGE_KEY, l); } catch { /* Keep in memory. */ }
  }, []);

  const value = useMemo<Ctx>(
    () => ({ lang, setLang, t: (k, v) => translate(dictionaries[lang], k, v) }),
    [lang, setLang],
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}

/** Keep browser metadata in the selected language after hydration/navigation. */
export function LocalizedMetadata() {
  const { t } = useI18n();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => {
    const pages: Record<string, string> = { "/": "home", "/login": "login", "/signup": "signup", "/profile": "profile", "/explore": "explore", "/exams": "exams", "/ai-guide": "ai" };
    const page = pages[pathname] ?? "notFound";
    const title = t(`meta.${page}Title`);
    const description = t(page === "notFound" ? "notFound.body" : `meta.${page}Description`);
    document.title = title;
    for (const [selector, content] of [["meta[name='description']", description], ["meta[property='og:title']", title], ["meta[property='og:description']", description]]) {
      if (selector && content) document.querySelector(selector)?.setAttribute("content", content);
    }
  }, [pathname, t]);
  return null;
}

/** SSR starts in English; browser navigation uses the saved language. */
export function pageMeta(titleKey: string, descKey: string) {
  let lang: Lang = "en";
  try {
    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem(LANG_STORAGE_KEY);
      if (isLang(saved)) lang = saved;
    }
  } catch { /* Fall back to the SSR language if storage is unavailable. */ }
  const title = translate(dictionaries[lang], titleKey);
  const description = translate(dictionaries[lang], descKey);
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  };
}

