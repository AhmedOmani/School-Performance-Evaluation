"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/client";
import type { Locale } from "@/lib/i18n/config";
import { usePathname } from "next/navigation";

type LanguageSwitchProps = {
  currentLocale: Locale;
};

export function LanguageSwitch({ currentLocale }: LanguageSwitchProps) {
  const { t } = useTranslation("common");
  const pathname = usePathname();
  const targetLocale: Locale = currentLocale === "en" ? "ar" : "en";
  
  const newPath = pathname.replace(/^\/(en|ar)/, `/${targetLocale}`);
  return (
    <Link
      href={newPath}
      className="rounded-md border border-primary px-3 py-1.5 text-sm font-medium text-primary transition hover:bg-primary hover:text-white dark:border-primary-light dark:text-primary-light dark:hover:bg-primary-light/20"
    >
      {t("actions.switchLanguage")}
    </Link>
  );
}