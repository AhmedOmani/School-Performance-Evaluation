"use client";

import { Check, X } from "lucide-react";
import { Button } from "@/components/ui";
import type { Locale } from "@/lib/i18n/config";

type ReviewStatusButtonsProps = {
  locale: Locale;
  reviewStatus: "APPROVED" | "REJECTED" | "";
  onStatusChange: (status: "APPROVED" | "REJECTED") => void;
};

export function ReviewStatusButtons({
  locale,
  reviewStatus,
  onStatusChange,
}: ReviewStatusButtonsProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
        {locale === "ar" ? "قرار المراجعة" : "Review Decision"} *
      </label>
      <div className="flex gap-3">
        <Button
          type="button"
          variant={reviewStatus === "APPROVED" ? "default" : "outline"}
          className={`flex-1 ${
            reviewStatus === "APPROVED"
              ? "bg-green-600 hover:bg-green-700 dark:bg-green-700"
              : ""
          }`}
          onClick={() => onStatusChange("APPROVED")}
        >
          <Check className="h-4 w-4" /> {locale === "ar" ? "اعتماد" : "Approve"}
        </Button>
        <Button
          type="button"
          variant={reviewStatus === "REJECTED" ? "destructive" : "outline"}
          className="flex-1"
          onClick={() => onStatusChange("REJECTED")}
        >
          <X className="h-4 w-4" /> {locale === "ar" ? "رفض" : "Reject"}
        </Button>
      </div>
    </div>
  );
}

