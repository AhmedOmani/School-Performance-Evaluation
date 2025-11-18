// src/components/layouts/authenticated-layout.tsx
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Upload, 
  FolderOpen, 
  FileText, 
  Users 
} from "lucide-react";
import { LanguageSwitch } from "@/components/language-switch";
import { ThemeToggle } from "@/components/theme-toggle";
import { LogoutButton } from "@/components/logout-button";
import { useTranslation } from "@/lib/i18n/client";
import type { Locale } from "@/lib/i18n/config";

type AuthenticatedLayoutProps = {
  children: React.ReactNode;
  locale: Locale;
  userName?: string;
};

export function AuthenticatedLayout({
  children,
  locale,
  userName,
}: AuthenticatedLayoutProps) {
  const { t } = useTranslation("common");
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside
        className={`fixed ${
          locale === "ar" ? "right-0" : "left-0"
        } top-0 h-full w-64 border-r border-slate-200 bg-white dark:border-gray-700 dark:bg-gray-800`}
      >
        <div className="flex h-full flex-col p-4">
          {/* Sidebar Header */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {t("navigation.dashboard")}
            </h2>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-2">
            <Link
              href={`/${locale}/dashboard`}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                isActive(`/${locale}/dashboard`)
                  ? "bg-primary text-white dark:bg-primary-light"
                  : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-gray-700"
              }`}
            >
              <LayoutDashboard className="h-5 w-5" />
              <span>{t("navigation.dashboard")}</span>
            </Link>

            <Link
              href={`/${locale}/upload`}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                isActive(`/${locale}/upload`)
                  ? "bg-primary text-white dark:bg-primary-light"
                  : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-gray-700"
              }`}
            >
              <Upload className="h-5 w-5" />
              <span>{t("navigation.upload")}</span>
            </Link>

            <Link
              href={`/${locale}/evidence`}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                isActive(`/${locale}/evidence`)
                  ? "bg-primary text-white dark:bg-primary-light"
                  : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-gray-700"
              }`}
            >
              <FolderOpen className="h-5 w-5" />
              <span>{t("navigation.evidence")}</span>
            </Link>

            <Link
              href={`/${locale}/reports`}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                isActive(`/${locale}/reports`)
                  ? "bg-primary text-white dark:bg-primary-light"
                  : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-gray-700"
              }`}
            >
              <FileText className="h-5 w-5" />
              <span>{t("navigation.reports")}</span>
            </Link>

            <Link
              href={`/${locale}/users`}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                isActive(`/${locale}/users`)
                  ? "bg-primary text-white dark:bg-primary-light"
                  : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-gray-700"
              }`}
            >
              <Users className="h-5 w-5" />
              <span>{t("navigation.users")}</span>
            </Link>
          </nav>

          {/* Sidebar Footer */}
          <div className="mt-auto border-t border-slate-200 pt-4 dark:border-gray-700">
            <div className="text-center text-xs text-slate-500 dark:text-slate-400">
              <div className="mb-2 text-lg font-bold text-primary">AM</div>
              <div>
                {locale === "ar"
                  ? "منصة الذكاء الاصطناعي | AI MNSA"
                  : "AI Platform | AI MNSA"}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`flex-1 ${
          locale === "ar" ? "mr-64" : "ml-64"
        } transition-all`}
      >
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <LogoutButton locale={locale} />
              <Link
                href={`/${locale}/dashboard`}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-dark dark:bg-primary-light"
              >
                {t("navigation.dashboard")}
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600 dark:text-slate-300">
                {userName || "User"}
              </span>
              <ThemeToggle />
              <LanguageSwitch currentLocale={locale} />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}