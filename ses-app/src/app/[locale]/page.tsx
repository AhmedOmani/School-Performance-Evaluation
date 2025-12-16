import Link from "next/link";
import { Button, Card, CardHeader, CardTitle, CardContent, Badge } from "@/components/ui";
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
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      <div className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-8">
        {/* Header */}
        <header className="mb-16 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="space-y-2">
            <h1 className="text-5xl font-bold tracking-tight text-primary dark:text-primary-light">
              {t("app.title")}
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              {t("app.tagline")}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <LanguageSwitch currentLocale={locale} />
            <Button asChild>
              <Link href={`/${locale}/login`}>{t("actions.login")}</Link>
            </Button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="mb-24 text-center">
          <h2 className="mx-auto max-w-4xl text-4xl font-bold leading-tight text-slate-900 dark:text-slate-100 sm:text-5xl">
            {locale === "ar"
              ? "نحو مدرسة متجددة في أدائها... موثقة في أدلتها... متميزة في نتائجها."
              : "Towards a renewed school in its performance... documented in its evidence... distinguished in its results."}
          </h2>
          <Button asChild size="lg" className="mt-8">
            <Link href={`/${locale}/login`}>
              {locale === "ar" ? "ابدأ الآن" : "Start Now"}
            </Link>
          </Button>
        </section>

        {/* Main Axes Section */}
        <section className="space-y-12">
          <div className="text-center space-y-3">
            <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {locale === "ar"
                ? "المحاور الرئيسة والمجالات التابعة لها"
                : "Main Axes and Sub-fields"}
            </h3>
            <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-300">
              {locale === "ar"
                ? "استكشف المحاور الثلاثة والمجالات المرتبطة بكل محور لمعرفة المؤشرات والأدلة المطلوبة."
                : "Explore the three axes and the fields associated with each axis to know the required indicators and evidence."}
            </p>
          </div>

          {/* Axes Cards */}
          <div className="grid gap-8 md:grid-cols-3">
            {localizedAxes.map((axis, index) => (
              <Card
                key={axis.id}
                className="transition-shadow hover:shadow-lg"
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="default">
                      {locale === "ar"
                        ? `المحور ${index + 1 === 1 ? "الأول" : index + 1 === 2 ? "الثاني" : "الثالث"}`
                        : `Axis ${index + 1}`}
                    </Badge>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {axis.domains.length}{" "}
                      {locale === "ar" ? "مجالات" : "domains"}
                    </span>
                  </div>
                  <CardTitle className="text-2xl">{axis.name}</CardTitle>
                  {axis.description && (
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                      {axis.description}
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  {/* Domains List */}
                  <div className="space-y-3">
                    {axis.domains.map((domain) => (
                      <div
                        key={domain.id}
                        className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-gray-700 dark:bg-gray-800"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-slate-900 dark:text-slate-100">
                            {domain.name}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {domain.code}
                          </Badge>
                        </div>
                        {domain.description && (
                          <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                            {domain.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
