import { notFound, redirect } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  BarChart3,
  PieChart,
  ArrowUpRight
} from "lucide-react";
import { defaultLocale, type Locale } from "@/lib/i18n/config";
import { getServerTranslation } from "@/lib/i18n/server";
import { resolveLocale } from "@/lib/i18n/utils";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/session";
import { AuthenticatedLayout } from "@/components/layouts/authenticated-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DomainBarChart } from "@/components/charts/domain-bar-chart";
import { StatusDonutChart } from "@/components/charts/status-donut-chart";
import Link from "next/link";

type DashboardPageProps = {
  params: Promise<{ locale?: string }>;
};

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale: rawLocale } = await params;
  let locale: Locale = defaultLocale;

  try {
    locale = resolveLocale(rawLocale);
  } catch {
    return notFound();
  }

  let user;
  try {
    user = await requireAuth();
  } catch {
    redirect(`/${locale}/login?callbackUrl=/${locale}/dashboard`);
  }

  const { t } = await getServerTranslation(locale, "common");

  // Fetch evidence statistics
  const [totalEvidence, approvedCount, rejectedCount, underReviewCount] =
    await Promise.all([
      prisma.evidence.count(),
      prisma.evidence.count({ where: { status: "APPROVED" } }),
      prisma.evidence.count({ where: { status: "REJECTED" } }),
      prisma.evidence.count({ where: { status: "UNDER_REVIEW" } }),
    ]);

  // Fetch evidence by domain
  const evidenceByDomain = await prisma.evidence.groupBy({
    by: ["domainId"],
    _count: {
      id: true,
    },
  });

  // Get domain names for the chart
  const domainIds = evidenceByDomain.map((e: { domainId: string }) => e.domainId);
  const domains = await prisma.domain.findMany({
    where: { id: { in: domainIds } },
    select: {
      id: true,
      nameEn: true,
      nameAr: true,
    },
  });

  const recentEvidence = await prisma.evidence.findMany({
    take: 5,
    orderBy: { submittedAt: "desc" },
    select: {
      id: true,
      title: true,
      status: true,
      submittedAt: true,
      domain: {
        select: {
          nameEn: true,
          nameAr: true
        }
      },
      standard: {
        select: {
          code: true
        }
      }
    },
  });

  const domainStats = evidenceByDomain.map((stat: { domainId: string; _count: { id: number } }) => {
    const domain = domains.find((d: { id: string; nameEn: string; nameAr: string }) => d.id === stat.domainId);
    return {
      name: locale === "ar" ? domain?.nameAr : domain?.nameEn,
      count: stat._count.id,
    };
  });

  const statusStats = [
    { name: locale === "ar" ? "معتمد" : "Approved", value: approvedCount, color: "#22c55e" }, // green-500
    { name: locale === "ar" ? "قيد المراجعة" : "Under Review", value: underReviewCount, color: "#eab308" }, // yellow-500
    { name: locale === "ar" ? "مرفوض" : "Rejected", value: rejectedCount, color: "#ef4444" }, // red-500
  ].filter(item => item.value > 0);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "APPROVED": return "success";
      case "REJECTED": return "destructive";
      case "UNDER_REVIEW": return "warning";
      default: return "secondary";
    }
  };

  const getStatusText = (status: string) => {
    if (locale === "ar") {
      switch (status) {
        case "APPROVED": return "معتمد";
        case "REJECTED": return "مرفوض";
        case "UNDER_REVIEW": return "قيد المراجعة";
        default: return status;
      }
    } else {
      switch (status) {
        case "APPROVED": return "Approved";
        case "REJECTED": return "Rejected";
        case "UNDER_REVIEW": return "Under Review";
        default: return status;
      }
    }
  };

  return (
    <AuthenticatedLayout locale={locale} userName={user.name} userRole={user.role}>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            <span className="bg-gradient-to-r from-primary via-blue-600 to-accent bg-clip-text text-transparent animate-gradient bg-300%">
              {t("navigation.dashboard")}
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            {locale === "ar"
              ? "نظرة عامة على الأدلة والإحصائيات"
              : "Overview of Evidence and Statistics"}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150 fill-mode-both">
          <Card className="relative overflow-hidden border-primary/10 bg-gradient-to-br from-primary/5 to-primary/10 shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-primary/20 group">
            <div className="absolute right-2 top-2 h-20 w-20 rounded-full bg-primary/10 blur-2xl group-hover:bg-primary/20 transition-colors" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-primary">
                {locale === "ar" ? "إجمالي الأدلة" : "Total Evidence"}
              </CardTitle>
              <FileText className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{totalEvidence}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {locale === "ar" ? "تم رفعها للنظام" : "Uploaded to system"}
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-green-500/10 bg-gradient-to-br from-green-500/5 to-green-500/10 shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-green-500/20 group">
            <div className="absolute right-2 top-2 h-20 w-20 rounded-full bg-green-500/10 blur-2xl group-hover:bg-green-500/20 transition-colors" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-600 dark:text-green-400">
                {locale === "ar" ? "معتمد" : "Approved"}
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-700 dark:text-green-300">{approvedCount}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {totalEvidence > 0 ? Math.round((approvedCount / totalEvidence) * 100) : 0}% {locale === "ar" ? "من الإجمالي" : "of total"}
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-yellow-500/10 bg-gradient-to-br from-yellow-500/5 to-yellow-500/10 shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-yellow-500/20 group">
            <div className="absolute right-2 top-2 h-20 w-20 rounded-full bg-yellow-500/10 blur-2xl group-hover:bg-yellow-500/20 transition-colors" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                {locale === "ar" ? "قيد المراجعة" : "Under Review"}
              </CardTitle>
              <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-700 dark:text-yellow-300">{underReviewCount}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {locale === "ar" ? "بانتظار الإجراء" : "Pending action"}
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-accent/10 bg-gradient-to-br from-accent/5 to-accent/10 shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-accent/20 group">
            <div className="absolute right-2 top-2 h-20 w-20 rounded-full bg-accent/10 blur-2xl group-hover:bg-accent/20 transition-colors" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-accent">
                {locale === "ar" ? "مرفوض" : "Rejected"}
              </CardTitle>
              <XCircle className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">{rejectedCount}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {locale === "ar" ? "بحاجة لتصحيح" : "Needs correction"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 md:grid-cols-2 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both">
          {/* Domain Bar Chart */}
          <Card className="shadow-md border-primary/5 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <BarChart3 className="h-5 w-5" />
                {locale === "ar" ? "حسب المجال" : "By Domain"}
              </CardTitle>
              <CardDescription>
                {locale === "ar"
                  ? "توزيع الأدلة حسب المجالات"
                  : "Evidence distribution by domains"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {domainStats.length > 0 ? (
                <DomainBarChart data={domainStats} locale={locale} />
              ) : (
                <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                  {locale === "ar" ? "لا توجد بيانات" : "No data available"}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Status Donut Chart */}
          <Card className="shadow-md border-primary/5 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <PieChart className="h-5 w-5" />
                {locale === "ar" ? "حسب الحالة" : "By Status"}
              </CardTitle>
              <CardDescription>
                {locale === "ar"
                  ? "توزيع الأدلة حسب حالة الاعتماد"
                  : "Evidence distribution by approval status"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {statusStats.length > 0 ? (
                <StatusDonutChart data={statusStats} locale={locale} />
              ) : (
                <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                  {locale === "ar" ? "لا توجد بيانات" : "No data available"}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Latest Evidence Section - Full Width */}
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500 fill-mode-both">
          <Card className="shadow-md border-primary/5 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Clock className="h-5 w-5" />
                  {locale === "ar" ? "آخر الأدلة المرفوعة" : "Latest Uploaded Evidence"}
                </CardTitle>
                <CardDescription className="mt-1">
                  {locale === "ar" ? "آخر 5 ملفات تم رفعها للنظام" : "Last 5 files uploaded to the system"}
                </CardDescription>
              </div>
              <Link href={`/${locale}/evidence`}>
                <Button variant="ghost" size="sm" className="gap-2">
                  {locale === "ar" ? "عرض الكل" : "View All"}
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentEvidence.length > 0 ? (
                  recentEvidence.map((evidence: { id: string; title: string; status: string; submittedAt: Date; domain: { nameEn: string; nameAr: string }; standard: { code: string } }) => (
                    <div
                      key={evidence.id}
                      className="flex items-center justify-between border-b border-border/50 pb-4 last:border-0 last:pb-0 hover:bg-muted/30 p-3 rounded-lg transition-colors"
                    >
                      <div className="space-y-1">
                        <p className="text-base font-semibold text-foreground">{evidence.title}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="outline" className="font-normal bg-background/50">
                            {locale === "ar" ? evidence.domain.nameAr : evidence.domain.nameEn}
                          </Badge>
                          <span className="text-xs">•</span>
                          <span className="font-mono text-xs">{evidence.standard.code}</span>
                          <span className="text-xs">•</span>
                          <span>
                            {new Date(evidence.submittedAt).toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US", {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                      <Badge variant={getStatusVariant(evidence.status) as any} className="shadow-sm px-3 py-1">
                        {getStatusText(evidence.status)}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="flex h-[150px] items-center justify-center text-muted-foreground bg-muted/10 rounded-lg border border-dashed border-muted">
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="h-8 w-8 opacity-50" />
                      <p>{locale === "ar" ? "لا توجد أدلة بعد" : "No evidence yet"}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}