import { defaultLocale, locales, type Locale } from "./config";

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function resolveLocale(candidate?: string): Locale {
  if (!candidate) {
    return defaultLocale;
  }
  
  if (isLocale(candidate)) {
    return candidate;
  }
  
  throw new Error(`Unsupported locale: ${candidate}`);
}

