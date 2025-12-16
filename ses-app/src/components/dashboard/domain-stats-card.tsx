import { Card, CardHeader, CardTitle, CardDescription, CardContent, EmptyState } from "@/components/ui";
import { BarChart3 } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";

type DomainStat = {
  name: string | undefined;
  count: number;
};

type DomainStatsCardProps = {
  locale: Locale;
  stats: DomainStat[];
};

export function DomainStatsCard({ locale, stats }: DomainStatsCardProps) {
  const maxCount = Math.max(...stats.map((s) => s.count), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{locale === "ar" ? "حسب المجال" : "By Domain"}</CardTitle>
        <CardDescription>
          {locale === "ar"
            ? "توزيع الأدلة حسب المجالات"
            : "Evidence distribution by domains"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {stats.length > 0 ? (
          <div className="space-y-4">
            {stats.map((stat, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {stat.name || "Unknown"}
                  </span>
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                    {stat.count}
                  </span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden dark:bg-gray-700">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${(stat.count / maxCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<BarChart3 className="h-12 w-12" />}
            title={locale === "ar" ? "لا توجد بيانات" : "No data available"}
            description={
              locale === "ar"
                ? "لا توجد أدلة مرفوعة بعد"
                : "No evidence has been uploaded yet"
            }
          />
        )}
      </CardContent>
    </Card>
  );
}


