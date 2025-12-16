"use client";

import { Button, Card, CardHeader, CardTitle, CardContent, LoadingSkeleton, EmptyState } from "@/components/ui";
import { FileSearch } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";

export type EvidenceItem = {
  id: string;
  title: string;
  type: "FILE" | "LINK";
  domain: {
    nameEn: string;
    nameAr: string;
  };
  standard: {
    code: string;
  };
  submittedBy: {
    name: string;
  };
};

type ReviewEvidenceListProps = {
  locale: Locale;
  evidence: EvidenceItem[];
  loading: boolean;
  selectedEvidenceId: string | null;
  onSelectEvidence: (evidence: EvidenceItem) => void;
  onDownload: (evidenceId: string, type: "FILE" | "LINK") => void;
};

export function ReviewEvidenceList({
  locale,
  evidence,
  loading,
  selectedEvidenceId,
  onSelectEvidence,
  onDownload,
}: ReviewEvidenceListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {locale === "ar" ? "الأدلة قيد المراجعة" : "Evidence Under Review"}
        </CardTitle>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {evidence.length}{" "}
          {locale === "ar" ? "دليل يحتاج مراجعة" : "items pending review"}
        </p>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <LoadingSkeleton variant="list" rows={3} />
        ) : evidence.length === 0 ? (
          <EmptyState
            icon={<FileSearch className="h-12 w-12" />}
            title={
              locale === "ar"
                ? "لا توجد أدلة تحتاج مراجعة"
                : "No evidence pending review"
            }
            description={
              locale === "ar"
                ? "جميع الأدلة تمت مراجعتها"
                : "All evidence has been reviewed"
            }
          />
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-gray-700">
            {evidence.map((item) => (
              <div
                key={item.id}
                className={`cursor-pointer p-4 transition-colors ${
                  selectedEvidenceId === item.id
                    ? "bg-primary/10 dark:bg-primary/20"
                    : "hover:bg-slate-50 dark:hover:bg-gray-800"
                }`}
                onClick={() => onSelectEvidence(item)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-900 dark:text-slate-100">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                      {locale === "ar" ? item.domain.nameAr : item.domain.nameEn} -{" "}
                      {item.standard.code}
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {locale === "ar" ? "مرفوع من" : "Submitted by"}: {item.submittedBy.name}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDownload(item.id, item.type);
                    }}
                  >
                    {item.type === "FILE"
                      ? locale === "ar"
                        ? "عرض"
                        : "View"
                      : locale === "ar"
                      ? "فتح"
                      : "Open"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

