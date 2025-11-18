import Link from "next/link";
import { LanguageSwitch } from "@/components/language-switch";
import { ThemeToggle } from "@/components/theme-toggle";
import { LoginForm } from "@/components/login-form";
import { defaultLocale, type Locale } from "@/lib/i18n/config";
import { getServerTranslation } from "@/lib/i18n/server";
import { resolveLocale } from "@/lib/i18n/utils";

type LoginPageProps = {
  params: Promise<{ locale?: string }>;
};

export default async function LoginPage({ params }: LoginPageProps) {
  const { locale: rawLocale } = await params;
  let locale: Locale = defaultLocale;

  try {
    locale = resolveLocale(rawLocale);
  } catch {
    locale = defaultLocale;
  }

  const { t } = await getServerTranslation(locale, "common");

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 px-6 py-12 text-slate-900 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 dark:text-slate-100">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 pt-6">
        <Link
          href={`/${locale}`}
          className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
        >
          ← {locale === "ar" ? "العودة" : "Back"}
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <LanguageSwitch currentLocale={locale} />
        </div>
      </header>

      {/* Login Card */}
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-lg dark:border-gray-700 dark:bg-gray-900">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          {t("actions.login")}
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          {locale === "ar"
            ? "سجل الدخول للوصول إلى لوحة التحكم"
            : "Sign in to access the dashboard"}
        </p>

        <LoginForm locale={locale} />

        <div className="mt-4 text-center">
          <Link
            href="#"
            className="text-sm text-primary hover:underline dark:text-primary-light"
          >
            {locale === "ar" ? "نسيت كلمة المرور؟" : "Forgot password?"}
          </Link>
        </div>
      </div>
    </main>
  );
}