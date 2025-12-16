import { Card, CardHeader, CardTitle, CardContent, Badge, EmptyState } from "@/components/ui";
import { FileText } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";

type RecentEvidence = {
  id: string;
  title: string;
  status: "UNDER_REVIEW" | "APPROVED" | "REJECTED";
  submittedAt: string;
};

type RecentEvidenceCardProps = {
  locale: Locale;
  evidence: RecentEvidence[];
};

export function RecentEvidenceCard({
  locale,
  evidence,
}: RecentEvidenceCardProps) {
  const getStatusVariant = (
    status: string
  ): "approved" | "rejected" | "under-review" => {
    switch (status) {
      case "APPROVED":
        return "approved";
      case "REJECTED":
        return "rejected";
      case "UNDER_REVIEW":
        return "under-review";
      default:
        return "under-review";
    }
  };

  const getStatusText = (status: string) => {
    if (locale === "ar") {
      switch (status) {
        case "APPROVED":
          return "معتمد";
        case "REJECTED":
          return "مرفوض";
        case "UNDER_REVIEW":
          return "قيد المراجعة";
        default:
          return status;
      }
    } else {
      switch (status) {
        case "APPROVED":
          return "Approved";
        case "REJECTED":
          return "Rejected";
        case "UNDER_REVIEW":
          return "Under Review";
        default:
          return status;
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {locale === "ar" ? "آخر الأدلة المرفوعة" : "Latest Uploaded Evidence"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {evidence.length > 0 ? (
          <div className="space-y-3">
            {evidence.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-lg border border-slate-200 p-3 transition-colors hover:bg-slate-50 dark:border-gray-700 dark:hover:bg-gray-800"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                    {item.title}
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {new Date(item.submittedAt).toLocaleDateString(
                      locale === "ar" ? "ar-SA" : "en-US"
                    )}
                  </p>
                </div>
                <Badge variant={getStatusVariant(item.status)} className="ml-3">
                  {getStatusText(item.status)}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<FileText className="h-12 w-12" />}
            title={locale === "ar" ? "لا توجد أدلة بعد" : "No evidence yet"}
            description={
              locale === "ar"
                ? "ابدأ برفع أول دليل لك"
                : "Start by uploading your first evidence"
            }
          />
        )}
      </CardContent>
    </Card>
  );
}

