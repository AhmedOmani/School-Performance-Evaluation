"use client";

import type { Locale } from "@/lib/i18n/config";

type EvidenceItem = {
  title: string;
  description: string | null;
  type: "FILE" | "LINK";
  domain: {
    nameEn: string;
    nameAr: string;
  };
  standard: {
    code: string;
    nameEn: string;
    nameAr: string;
  };
  indicator: {
    code: string;
    descriptionEn: string | null;
    descriptionAr: string | null;
  } | null;
};

type EvidenceDetailsCardProps = {
  locale: Locale;
  evidence: EvidenceItem;
};

export function EvidenceDetailsCard({
  locale,
  evidence,
}: EvidenceDetailsCardProps) {
  return (
    <div>
      <h3 className="font-medium text-slate-900 dark:text-slate-100">
        {evidence.title}
      </h3>
      {evidence.description && (
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          {evidence.description}
        </p>
      )}
      <div className="mt-3 space-y-1 text-sm text-slate-600 dark:text-slate-400">
        <p>
          <span className="font-medium">
            {locale === "ar" ? "المجال" : "Domain"}:
          </span>{" "}
          {locale === "ar" ? evidence.domain.nameAr : evidence.domain.nameEn}
        </p>
        <p>
          <span className="font-medium">
            {locale === "ar" ? "المعيار" : "Standard"}:
          </span>{" "}
          {evidence.standard.code} -{" "}
          {locale === "ar" ? evidence.standard.nameAr : evidence.standard.nameEn}
        </p>
        {evidence.indicator && (
          <p>
            <span className="font-medium">
              {locale === "ar" ? "المؤشر" : "Indicator"}:
            </span>{" "}
            {evidence.indicator.code} -{" "}
            {locale === "ar"
              ? evidence.indicator.descriptionAr || evidence.indicator.descriptionEn
              : evidence.indicator.descriptionEn || evidence.indicator.descriptionAr}
          </p>
        )}
        <p>
          <span className="font-medium">
            {locale === "ar" ? "النوع" : "Type"}:
          </span>{" "}
          {evidence.type === "FILE"
            ? locale === "ar"
              ? "ملف"
              : "File"
            : locale === "ar"
            ? "رابط"
            : "Link"}
        </p>
      </div>
    </div>
  );
}

