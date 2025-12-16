"use client";

import { Button, Badge } from "@/components/ui";
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

type EvidenceTableRowProps = {
  locale: Locale;
  item: {
    id: string;
    title: string;
    description: string | null;
    type: "FILE" | "LINK";
    status: "UNDER_REVIEW" | "APPROVED" | "REJECTED";
    submittedAt: string;
    domain: Domain;
    standard: Standard;
  };
  onDownload: (evidenceId: string, type: "FILE" | "LINK") => void;
};

export function EvidenceTableRow({
  locale,
  item,
  onDownload,
}: EvidenceTableRowProps) {
  const getStatusVariant = (status: string): "approved" | "rejected" | "under-review" => {
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
    <tr className="transition-colors hover:bg-slate-50 dark:hover:bg-gray-800/50">
      <td className="px-6 py-4">
        <div className="font-medium text-slate-900 dark:text-slate-100">
          {item.title}
        </div>
        {item.description && (
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {item.description.length > 50
              ? `${item.description.substring(0, 50)}...`
              : item.description}
          </div>
        )}
      </td>
      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
        {locale === "ar" ? item.domain.nameAr : item.domain.nameEn}
      </td>
      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
        {item.standard.code} -{" "}
        {locale === "ar" ? item.standard.nameAr : item.standard.nameEn}
      </td>
      <td className="px-6 py-4">
        <Badge variant={getStatusVariant(item.status)}>
          {getStatusText(item.status)}
        </Badge>
      </td>
      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
        {new Date(item.submittedAt).toLocaleDateString(
          locale === "ar" ? "ar-SA" : "en-US"
        )}
      </td>
      <td className="px-6 py-4">
        <Button
          size="sm"
          onClick={() => onDownload(item.id, item.type)}
        >
          {item.type === "FILE"
            ? locale === "ar"
              ? "تحميل"
              : "Download"
            : locale === "ar"
            ? "فتح"
            : "Open"}
        </Button>
      </td>
    </tr>
  );
}

