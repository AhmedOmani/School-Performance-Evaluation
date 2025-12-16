"use client";

import { Button, Separator } from "@/components/ui";
import type { Locale } from "@/lib/i18n/config";

type PaginationControlsProps = {
  locale: Locale;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function PaginationControls({
  locale,
  page,
  totalPages,
  onPageChange,
}: PaginationControlsProps) {
  if (totalPages <= 1) return null;

  return (
    <>
      <Separator />
      <div className="flex items-center justify-between px-4 py-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
        >
          {locale === "ar" ? "السابق" : "Previous"}
        </Button>
        <span className="text-sm text-slate-600 dark:text-slate-400">
          {locale === "ar" ? "صفحة" : "Page"} {page}{" "}
          {locale === "ar" ? "من" : "of"} {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
        >
          {locale === "ar" ? "التالي" : "Next"}
        </Button>
      </div>
    </>
  );
}

