import { notFound, redirect } from "next/navigation";
import { X, Check, Clock, FileText } from "lucide-react";
import { defaultLocale, type Locale } from "@/lib/i18n/config";
import { getServerTranslation } from "@/lib/i18n/server";
import { resolveLocale } from "@/lib/i18n/utils";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/session";
import { AuthenticatedLayout } from "@/components/layouts/authenticated-layout";
import { StatsCard } from "@/components/dashboard/stats-card";
import { DomainStatsCard } from "@/components/dashboard/domain-stats-card";
import { RecentEvidenceCard } from "@/components/dashboard/recent-evidence-card";

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
  const domainIds = evidenceByDomain.map((e) => e.domainId);
  const domains = await prisma.domain.findMany({
    where: { id: { in: domainIds } },
    select: {
      id: true,
      nameEn: true,
      nameAr: true,
    },
  });

  const domainStats = evidenceByDomain.map((stat) => {
    const domain = domains.find((d) => d.id === stat.domainId);
    return {
      name: locale === "ar" ? domain?.nameAr : domain?.nameEn,
      count: stat._count.id,
    };
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

  return (
    <AuthenticatedLayout locale={locale} userName={user.name} userRole={user.role}>
      <div className="space-y-8 py-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {t("navigation.dashboard")}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            {locale === "ar"
              ? "نظرة عامة على الأدلة والإحصائيات"
              : "Overview of Evidence and Statistics"}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title={locale === "ar" ? "مرفوض" : "Rejected"}
            value={rejectedCount}
            icon={<X className="h-5 w-5" />}
            iconBgColor="bg-red-100 dark:bg-red-900/20"
            iconColor="text-red-600 dark:text-red-400"
            borderColor="border-red-200 dark:border-red-800"
            textColor="text-red-600 dark:text-red-400"
          />
          <StatsCard
            title={locale === "ar" ? "معتمد" : "Approved"}
            value={approvedCount}
            icon={<Check className="h-5 w-5" />}
            iconBgColor="bg-green-100 dark:bg-green-900/20"
            iconColor="text-green-600 dark:text-green-400"
            borderColor="border-green-200 dark:border-green-800"
            textColor="text-green-600 dark:text-green-400"
          />
          <StatsCard
            title={locale === "ar" ? "قيد المراجعة" : "Under Review"}
            value={underReviewCount}
            icon={<Clock className="h-5 w-5" />}
            iconBgColor="bg-yellow-100 dark:bg-yellow-900/20"
            iconColor="text-yellow-600 dark:text-yellow-400"
            borderColor="border-yellow-200 dark:border-yellow-800"
            textColor="text-yellow-600 dark:text-yellow-400"
          />
          <StatsCard
            title={locale === "ar" ? "إجمالي الأدلة" : "Total Evidence"}
            value={totalEvidence}
            icon={<FileText className="h-5 w-5" />}
            iconBgColor="bg-blue-100 dark:bg-blue-900/20"
            iconColor="text-blue-600 dark:text-blue-400"
            borderColor="border-blue-200 dark:border-blue-800"
            textColor="text-blue-600 dark:text-blue-400"
          />
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 lg:grid-cols-2">
          <DomainStatsCard locale={locale} stats={domainStats} />
          
          {/* Status Chart Placeholder */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {locale === "ar" ? "حسب الحالة" : "By Status"}
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {locale === "ar"
                ? "نسبة الأدلة حسب الحالة"
                : "Evidence proportion by status"}
            </p>
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {locale === "ar" ? "معتمد" : "Approved"}
                </span>
                <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                  {approvedCount}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {locale === "ar" ? "قيد المراجعة" : "Under Review"}
                </span>
                <span className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                  {underReviewCount}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {locale === "ar" ? "مرفوض" : "Rejected"}
                </span>
                <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                  {rejectedCount}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Evidence */}
        <RecentEvidenceCard
          locale={locale}
          evidence={recentEvidence.map((e) => ({
            ...e,
            submittedAt: e.submittedAt.toISOString(),
          }))}
        />
      </div>
    </AuthenticatedLayout>
  );
}
