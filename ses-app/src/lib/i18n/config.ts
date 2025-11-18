export const locales = ["en" , "ar"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ar";

export const namespaces = ["common"] as const;
export type Namespace = (typeof namespaces)[number];