"use client";

import { Card } from "@/components/ui";
import { LoadingSkeleton, EmptyState } from "@/components/ui";
import { FileText } from "lucide-react";
import { EvidenceTableRow } from "./evidence-table-row";
import type { Locale } from "@/lib/i18n/config";

type Domain = {
  id: string;
  nameEn: string;
  nameAr: string;
};

type Standard = {
  id: string;
  code: string;
  nameEn: string;
  nameAr: string;
};

type EvidenceItem = {
  id: string;
  title: string;
  description: string | null;
  type: "FILE" | "LINK";
  status: "UNDER_REVIEW" | "APPROVED" | "REJECTED";
  submittedAt: string;
  domain: Domain;
  standard: Standard;
};

type EvidenceTableProps = {
  locale: Locale;
  evidence: EvidenceItem[];
  loading: boolean;
  onDownload: (evidenceId: string, type: "FILE" | "LINK") => void;
};

export function EvidenceTable({
  locale,
  evidence,
  loading,
  onDownload,
}: EvidenceTableProps) {
  if (loading) {
    return <LoadingSkeleton variant="table" rows={5} />;
  }

  if (evidence.length === 0) {
    return (
      <Card>
        <EmptyState
          icon={<FileText className="h-12 w-12" />}
          title={locale === "ar" ? "لا توجد أدلة" : "No evidence found"}
          description={
            locale === "ar"
              ? "لم يتم العثور على أي أدلة تطابق معايير البحث"
              : "No evidence matches your search criteria"
          }
        />
      </Card>
    );
  }

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b-2 border-slate-200 bg-slate-50/50 dark:border-gray-700 dark:bg-gray-800/50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-slate-100">
                {locale === "ar" ? "العنوان" : "Title"}
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-slate-100">
                {locale === "ar" ? "المجال" : "Domain"}
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-slate-100">
                {locale === "ar" ? "المعيار" : "Standard"}
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-slate-100">
                {locale === "ar" ? "الحالة" : "Status"}
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-slate-100">
                {locale === "ar" ? "تاريخ الرفع" : "Submitted"}
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-slate-100">
                {locale === "ar" ? "الإجراءات" : "Actions"}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
            {evidence.map((item) => (
              <EvidenceTableRow
                key={item.id}
                locale={locale}
                item={item}
                onDownload={onDownload}
              />
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

