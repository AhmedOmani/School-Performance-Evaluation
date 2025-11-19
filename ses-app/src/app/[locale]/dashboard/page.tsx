import { notFound, redirect } from "next/navigation";
import { LanguageSwitch } from "@/components/language-switch";
import { ThemeToggle } from "@/components/theme-toggle";
import { defaultLocale, type Locale } from "@/lib/i18n/config";
import { getServerTranslation } from "@/lib/i18n/server";
import { resolveLocale } from "@/lib/i18n/utils";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/session";
import { LogoutButton } from "@/components/logout-button";
import { AuthenticatedLayout } from "@/components/layouts/authenticated-layout";

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
    <AuthenticatedLayout locale={locale} userName={user.name}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {t("navigation.dashboard")}
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            {locale === "ar"
              ? "نظرة عامة على الأدلة والإحصائيات"
              : "Overview of Evidence and Statistics"}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-red-200 bg-white p-6 shadow-sm dark:border-red-800 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {locale === "ar" ? "مرفوض" : "Rejected"}
                </p>
                <p className="mt-1 text-3xl font-bold text-red-600 dark:text-red-400">
                  {rejectedCount}
                </p>
              </div>
              <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/20">
                <span className="text-2xl">✕</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-green-200 bg-white p-6 shadow-sm dark:border-green-800 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {locale === "ar" ? "معتمد" : "Approved"}
                </p>
                <p className="mt-1 text-3xl font-bold text-green-600 dark:text-green-400">
                  {approvedCount}
                </p>
              </div>
              <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/20">
                <span className="text-2xl">✓</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-yellow-200 bg-white p-6 shadow-sm dark:border-yellow-800 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {locale === "ar" ? "قيد المراجعة" : "Under Review"}
                </p>
                <p className="mt-1 text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                  {underReviewCount}
                </p>
              </div>
              <div className="rounded-full bg-yellow-100 p-3 dark:bg-yellow-900/20">
                <span className="text-2xl">⏳</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-blue-200 bg-white p-6 shadow-sm dark:border-blue-800 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {locale === "ar" ? "إجمالي الأدلة" : "Total Evidence"}
                </p>
                <p className="mt-1 text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {totalEvidence}
                </p>
              </div>
              <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/20">
                <span className="text-2xl">📄</span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <h3 className="text-lg font-semibold">
              {locale === "ar" ? "حسب المجال" : "By Domain"}
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {locale === "ar"
                ? "توزيع الأدلة حسب المجالات"
                : "Evidence distribution by domains"}
            </p>
            <div className="mt-4 space-y-2">
              {domainStats.map((stat, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-sm">{stat.name}</span>
                  <span className="font-semibold">{stat.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <h3 className="text-lg font-semibold">
              {locale === "ar" ? "حسب الحالة" : "By Status"}
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {locale === "ar"
                ? "نسبة الأدلة حسب الحالة"
                : "Evidence proportion by status"}
            </p>
            {/* Donut chart will go here */}
          </div>
        </div>

        {/* Recent Evidence */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <h3 className="text-lg font-semibold">
            {locale === "ar" ? "آخر الأدلة المرفوعة" : "Latest Uploaded Evidence"}
          </h3>
          <div className="mt-4 space-y-2">
            {recentEvidence.length > 0 ? (
              recentEvidence.map((evidence) => (
                <div
                  key={evidence.id}
                  className="flex items-center justify-between rounded-lg border border-slate-200 p-3 dark:border-gray-700"
                >
                  <span className="text-sm font-medium">{evidence.title}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {evidence.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {locale === "ar" ? "لا توجد أدلة بعد" : "No evidence yet"}
              </p>
            )}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}