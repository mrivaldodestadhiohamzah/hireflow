"use client";

import { useEffect, useState } from "react";
import { languageStorageKey, type Language } from "@/lib/i18n";
import { appCopy } from "@/lib/product-copy";

export function useLanguage() {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem(languageStorageKey);
    if (stored === "en" || stored === "id") setLanguage(stored);
  }, []);

  const changeLanguage = (next: Language) => {
    setLanguage(next);
    window.localStorage.setItem(languageStorageKey, next);
  };

  return { language, changeLanguage };
}

export function LanguageSwitcher({ language, onChange, compact = false }: { language: Language; onChange: (language: Language) => void; compact?: boolean }) {
  return <div aria-label={appCopy[language].language} className={`inline-flex items-center rounded-lg border bg-white p-0.5 text-[11px] font-bold ${compact ? "shadow-sm" : ""}`}>
    <button type="button" aria-pressed={language === "en"} onClick={() => onChange("en")} className={`rounded-md px-2 py-1 transition ${language === "en" ? "bg-ink text-white" : "text-slate-500 hover:text-ink"}`}>EN</button>
    <button type="button" aria-pressed={language === "id"} onClick={() => onChange("id")} className={`rounded-md px-2 py-1 transition ${language === "id" ? "bg-ink text-white" : "text-slate-500 hover:text-ink"}`}>ID</button>
  </div>;
}
