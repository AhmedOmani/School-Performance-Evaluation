import Link from "next/link";
import { ArrowRight, LayoutDashboard, ShieldCheck } from "lucide-react";
import { LanguageSwitch } from "@/components/language-switch";
import { ThemeToggle } from "@/components/theme-toggle";
import { defaultLocale, type Locale } from "@/lib/i18n/config";
import { getServerTranslation } from "@/lib/i18n/server";
import { resolveLocale } from "@/lib/i18n/utils";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              {t("app.title")}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <LanguageSwitch currentLocale={locale} />
            <Button asChild variant="default" size="sm">
              <Link href={`/${locale}/login`}>
                {t("actions.login")}
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="outline" className="mb-6 rounded-full px-4 py-1 text-base">
              {locale === "ar" ? "نظام تقييم الأداء المدرسي" : "School Performance Evaluation System"}
            </Badge>
            <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              {locale === "ar"
                ? "نحو مدرسة متجددة في أدائها... موثقة في أدلتها... متميزة في نتائجها."
                : "Towards a renewed school in its performance... documented in its evidence... distinguished in its results."}
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              {t("app.tagline")}
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button asChild size="lg" className="gap-2">
                <Link href={`/${locale}/login`}>
                  {locale === "ar" ? "ابدأ الآن" : "Start Now"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="lg">
                <Link href="#features">
                  {locale === "ar" ? "اكتشف المزيد" : "Learn more"}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Axes Section */}
      <section id="features" className="bg-muted/50 py-24 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h3 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {locale === "ar"
                ? "المحاور الرئيسة والمجالات التابعة لها"
                : "Main Axes and Sub-fields"}
            </h3>
            <p className="mt-4 text-lg text-muted-foreground">
              {locale === "ar"
                ? "استكشف المحاور الثلاثة والمجالات المرتبطة بكل محور لمعرفة المؤشرات والأدلة المطلوبة."
                : "Explore the three axes and the fields associated with each axis to know the required indicators and evidence."}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {localizedAxes.map((axis: any, index: number) => (
              <Card key={axis.id} className="flex flex-col transition-all hover:shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <div className="mb-4 flex items-center justify-between">
                    <Badge variant="secondary">
                      {locale === "ar"
                        ? `المحور ${index + 1 === 1 ? "الأول" : index + 1 === 2 ? "الثاني" : "الثالث"}`
                        : `Axis ${index + 1}`}
                    </Badge>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <LayoutDashboard className="h-4 w-4" />
                      {axis.domains.length}{" "}
                      {locale === "ar" ? "مجالات" : "domains"}
                    </span>
                  </div>
                  <CardTitle className="text-xl">{axis.name}</CardTitle>
                  {axis.description && (
                    <CardDescription className="mt-2">
                      {axis.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="space-y-3">
                    {axis.domains.map((domain: any) => (
                      <div
                        key={domain.id}
                        className="rounded-lg border bg-card p-3 transition-colors hover:bg-accent/50"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">
                            {domain.name}
                          </span>
                          <Badge variant="outline" className="text-[10px] h-5">
                            {domain.code}
                          </Badge>
                        </div>
                        {domain.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2">
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
        </div>
      </section>
    </main>
  );
}