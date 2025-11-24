import Image from "next/image";
import Link from "next/link";
import { ArrowRight, LayoutDashboard, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { LanguageSwitch } from "@/components/language-switch";
import { ThemeToggle } from "@/components/theme-toggle";
import { defaultLocale, type Locale } from "@/lib/i18n/config";
import { getServerTranslation } from "@/lib/i18n/server";
import { resolveLocale } from "@/lib/i18n/utils";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DomainItem } from "@/components/domain-item";

export const dynamic = "force-dynamic";

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
  let localizedAxes: any[] = [];

  try {
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
                indicators: {
                  select: {
                    id: true,
                    code: true,
                    descriptionEn: true,
                    descriptionAr: true,
                  },
                },
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
    localizedAxes = axes.map((axis) => ({
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
        standards: domain.standards.map((standard) => ({
          id: standard.id,
          code: standard.code,
          name: locale === "ar" ? standard.nameAr : standard.nameEn,
          indicators: standard.indicators.map((indicator) => ({
            id: indicator.id,
            code: indicator.code,
            description: locale === "ar" ? indicator.descriptionAr : indicator.descriptionEn,
          })),
        })),
      })),
    }));
  } catch (error) {
    console.error("Failed to fetch axes:", error);
    // You might want to track this error in Sentry
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="relative h-10 w-10 overflow-hidden rounded-full border border-primary/10 shadow-sm">
              <Image
                src="/logo.png"
                alt="School Logo"
                fill
                className="object-cover"
                sizes="60px"
              />
            </div>
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
      <section className="relative overflow-hidden bg-background pt-16 md:pt-20 lg:pt-24 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
        {/* Shiny Gradient Background */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-background">
          <div className="absolute top-0 z-[-2] h-screen w-screen bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.1),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.05),rgba(255,255,255,0))]" />
          <div className="absolute left-[50%] top-[-10%] h-[500px] w-[500px] -translate-x-[50%] rounded-full bg-primary/5 blur-[100px]" />
          <div className="absolute right-[20%] top-[10%] h-[300px] w-[300px] rounded-full bg-accent/5 blur-[80px]" />
        </div>

        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto max-w-3xl mb-12">
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="block text-primary drop-shadow-sm">{t("hero.title")}</span>
              <span className="block bg-gradient-to-r from-primary via-purple-500 to-accent bg-clip-text text-transparent pb-2 animate-gradient bg-300%">
                {t("hero.subtitle")}
              </span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              {t("hero.description")}
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href={`/${locale}/login`}>
                <Button size="lg" className="h-12 min-w-[200px] text-lg shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 hover:scale-105">
                  {t("hero.cta")}
                  <ArrowRight className={cn("ml-2 h-5 w-5", locale === "ar" && "rotate-180")} />
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="lg" className="h-12 min-w-[200px] text-lg border-primary/20 hover:bg-primary/5 hover:text-primary transition-all duration-300">
                  {t("hero.secondaryCta")}
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Image with Glassmorphism */}
          <div className="relative mx-auto max-w-2xl mt-10 perspective-1000 animate-in fade-in zoom-in-95 duration-1000 delay-300 fill-mode-both">
            <div className="relative rounded-xl bg-gradient-to-b from-primary/10 to-accent/5 p-2 shadow-2xl shadow-primary/10 backdrop-blur-sm ring-1 ring-white/20 transform transition-transform hover:scale-[1.01] duration-500">
              <div className="rounded-lg overflow-hidden bg-background/50 shadow-inner">
                <Image
                  src="/preview.jpeg"
                  alt="System Preview"
                  width={800}
                  height={450}
                  className="w-full h-auto rounded-lg object-cover"
                  priority
                />
              </div>

              {/* Decorative Elements */}
              <div className="absolute -left-4 -top-4 h-24 w-24 rounded-full bg-primary/20 blur-2xl animate-pulse" />
              <div className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-accent/20 blur-2xl animate-pulse delay-700" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32 relative">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000 view-timeline-name:--features-title">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              {t("features.title")}
            </h2>
            <div className="mt-4 h-1 w-24 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
          </div>

          <div className="grid gap-8 grid-cols-1 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300 fill-mode-both">
            {localizedAxes.map((axis) => (
              <div key={axis.id} className="group relative hover:-translate-y-1 transition-transform duration-300">
                {/* Card Glow Effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />

                <div className="relative h-full rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-xl">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <Target className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-3xl md:text-4xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {axis.name}
                  </h3>

                  <div className="space-y-4 mt-6">
                    {axis.domains.map((domain: any) => (
                      <DomainItem key={domain.id} domain={domain} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main >
  );
}