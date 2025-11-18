"use client";

import { useEffect, useMemo, type ReactNode } from "react";
import { I18nextProvider } from "react-i18next";
import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next/initReactI18next";
import { defaultLocale, type Locale } from "@/lib/i18n/config";

type TranslationResources = {
  [locale: string]: {
    [namespace: string]: Record<string, string>;
  };
};

type TranslationProviderProps = {
  locale: Locale;
  resources: TranslationResources;
  children: ReactNode;
};

export function TranslationProvider({locale, resources, children}: TranslationProviderProps) {
  
  const i18n = useMemo(() => {
    const instance = createInstance();
    instance.use(initReactI18next).init({
      lng: locale,
      fallbackLng: defaultLocale,
      ns: ["common"],
      defaultNS: "common",
      resources,
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false, 
      },
    });
    return instance;
  }, [locale, resources]);


  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}