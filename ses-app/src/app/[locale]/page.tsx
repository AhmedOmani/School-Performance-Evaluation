import Link from "next/link";
import { LanguageSwitch } from "@/components/language-switch";
import { ThemeToggle } from "@/components/theme-toggle";
import { defaultLocale, type Locale } from "@/lib/i18n/config";
import { getServerTranslation } from "@/lib/i18n/server";
import { resolveLocale } from "@/lib/i18n/utils";
import { prisma } from "@/lib/prisma";

type LandingPageProps = {
  params: Promise<{ locale?: string }>;
};

export default async function LandingPage({ params }: LandingPageProps) {
  const { locale: rawLocale } = await params;
  let locale: Locale = defaultLocale;

  try {
    locale = resolveLocale(rawLocale);
  } catch {
    locale = defaultLocale;
  }

  const { t } = await getServerTranslation(locale, "common");

  // Fetch axes with domains from database for landing page
  const axes = await prisma.axis.findMany({
    include: {
      domains: {
        include: {
          standards: {
            select: {
              id: true,
              code: true,
              nameEn: true,
              nameAr: true,
            },
          },
        },
      },
    },
    orderBy: {
      id: "asc",
    },
  });

  // Localize the data
  const localizedAxes = axes.map((axis) => ({
    id: axis.id,
    name: locale === "ar" ? axis.nameAr : axis.nameEn,
    description: locale === "ar" ? axis.descriptionAr : axis.descriptionEn,
    domains: axis.domains.map((domain) => ({
      id: domain.id,
      code: domain.code,
      name: locale === "ar" ? domain.nameAr : domain.nameEn,
      description:
        locale === "ar" ? domain.descriptionAr : domain.descriptionEn,
      standardsCount: domain.standards.length,
    })),
  }));

  return (
    <main className="flex min-h-screen flex-col gap-8 bg-gradient-to-br from-slate-50 via-white to-slate-100 px-6 pb-16 pt-12 text-slate-900 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 dark:text-slate-100">
      {/* Header */}
      <header className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-4xl font-bold text-primary dark:text-primary-light">
            {t("app.title")}
          </h1>
          <p className="mt-2 text-lg text-slate-600 dark:text-slate-300">
            {t("app.tagline")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <LanguageSwitch currentLocale={locale} />
          <Link
            href={`/${locale}/login`}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-dark dark:bg-primary-light dark:hover:bg-primary"
          >
            {t("actions.login")}
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="text-center">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          {locale === "ar"
            ? "نحو مدرسة متجددة في أدائها... موثقة في أدلتها... متميزة في نتائجها."
            : "Towards a renewed school in its performance... documented in its evidence... distinguished in its results."}
        </h2>
        <Link
          href={`/${locale}/login`}
          className="mt-6 inline-block rounded-lg bg-primary px-8 py-3 text-lg font-semibold text-white transition hover:bg-primary-dark dark:bg-primary-light dark:hover:bg-primary"
        >
          {locale === "ar" ? "ابدأ الآن" : "Start Now"}
        </Link>
      </section>

      {/* Main Axes Section */}
      <section className="space-y-8">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {locale === "ar"
              ? "المحاور الرئيسة والمجالات التابعة لها"
              : "Main Axes and Sub-fields"}
          </h3>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            {locale === "ar"
              ? "استكشف المحاور الثلاثة والمجالات المرتبطة بكل محور لمعرفة المؤشرات والأدلة المطلوبة."
              : "Explore the three axes and the fields associated with each axis to know the required indicators and evidence."}
          </p>
        </div>

        {/* Axes Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {localizedAxes.map((axis, index) => (
            <div
              key={axis.id}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-900"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary dark:bg-primary/20">
                  {locale === "ar"
                    ? `المحور ${index + 1 === 1 ? "الأول" : index + 1 === 2 ? "الثاني" : "الثالث"}`
                    : `Axis ${index + 1}`}
                </span>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {axis.domains.length}{" "}
                  {locale === "ar" ? "مجالات" : "domains"}
                </span>
              </div>
              <h4 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                {axis.name}
              </h4>
              {axis.description && (
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  {axis.description}
                </p>
              )}

              {/* Domains List */}
              <div className="mt-4 space-y-2">
                {axis.domains.map((domain) => (
                  <div
                    key={domain.id}
                    className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-gray-700 dark:bg-gray-800"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-900 dark:text-slate-100">
                        {domain.name}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {domain.code}
                      </span>
                    </div>
                    {domain.description && (
                      <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                        {domain.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}