import { notFound, redirect } from "next/navigation";
import {
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  BarChart3,
  PieChart
} from "lucide-react";
import { defaultLocale, type Locale } from "@/lib/i18n/config";
import { getServerTranslation } from "@/lib/i18n/server";
import { resolveLocale } from "@/lib/i18n/utils";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/session";
import { AuthenticatedLayout } from "@/components/layouts/authenticated-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
    },
  });

  const domainStats = evidenceByDomain.map((stat: { domainId: string; _count: { id: number } }) => {
    const domain = domains.find((d: { id: string; nameEn: string; nameAr: string }) => d.id === stat.domainId);
    return {
      name: locale === "ar" ? domain?.nameAr : domain?.nameEn,
      count: stat._count.id,
    };
  });



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
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            {t("navigation.dashboard")}
          </h1>
          <p className="text-muted-foreground">
            {locale === "ar"
              ? "نظرة عامة على الأدلة والإحصائيات"
              : "Overview of Evidence and Statistics"}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {locale === "ar" ? "إجمالي الأدلة" : "Total Evidence"}
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEvidence}</div>
              <p className="text-xs text-muted-foreground">
                {locale === "ar" ? "تم رفعها للنظام" : "Uploaded to system"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {locale === "ar" ? "معتمد" : "Approved"}
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
              <p className="text-xs text-muted-foreground">
                {totalEvidence > 0 ? Math.round((approvedCount / totalEvidence) * 100) : 0}% {locale === "ar" ? "من الإجمالي" : "of total"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {locale === "ar" ? "قيد المراجعة" : "Under Review"}
              </CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{underReviewCount}</div>
              <p className="text-xs text-muted-foreground">
                {locale === "ar" ? "بانتظار الإجراء" : "Pending action"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {locale === "ar" ? "مرفوض" : "Rejected"}
              </CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{rejectedCount}</div>
              <p className="text-xs text-muted-foreground">
                {locale === "ar" ? "بحاجة لتصحيح" : "Needs correction"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
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
              <div className="space-y-4">
                {domainStats.map((stat: { name: string | undefined; count: number }, idx: number) => (
                  <div key={idx} className="flex items-center">
                    <div className="w-full flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{stat.name}</span>
                        <span className="text-sm text-muted-foreground">{stat.count}</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-secondary">
                        <div
                          className="h-2 rounded-full bg-primary"
                          style={{ width: `${totalEvidence > 0 ? (stat.count / totalEvidence) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {domainStats.length === 0 && (
                  <div className="flex h-[200px] items-center justify-center text-muted-foreground">
                    {locale === "ar" ? "لا توجد بيانات" : "No data available"}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                {locale === "ar" ? "آخر الأدلة المرفوعة" : "Latest Uploaded Evidence"}
              </CardTitle>
              <CardDescription>
                {locale === "ar" ? "آخر 5 ملفات تم رفعها" : "Last 5 files uploaded"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentEvidence.length > 0 ? (
                  recentEvidence.map((evidence: { id: string; title: string; status: string; submittedAt: Date }) => (
                    <div
                      key={evidence.id}
                      className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{evidence.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(evidence.submittedAt).toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US")}
                        </p>
                      </div>
                      <Badge variant={getStatusVariant(evidence.status)}>
                        {getStatusText(evidence.status)}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="flex h-[200px] items-center justify-center text-muted-foreground">
                    {locale === "ar" ? "لا توجد أدلة بعد" : "No evidence yet"}
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