"use client";

import { Card, CardHeader, CardTitle, CardContent, Label, Textarea, Button } from "@/components/ui";
import { EvidenceDetailsCard } from "./evidence-details-card";
import { ReviewStatusButtons } from "./review-status-buttons";
import type { Locale } from "@/lib/i18n/config";

type EvidenceItem = {
  id: string;
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

type ReviewPanelProps = {
  locale: Locale;
  selectedEvidence: EvidenceItem | null;
  reviewStatus: "APPROVED" | "REJECTED" | "";
  reviewNotes: string;
  submitting: boolean;
  onStatusChange: (status: "APPROVED" | "REJECTED") => void;
  onNotesChange: (notes: string) => void;
  onSubmit: () => void;
};

export function ReviewPanel({
  locale,
  selectedEvidence,
  reviewStatus,
  reviewNotes,
  submitting,
  onStatusChange,
  onNotesChange,
  onSubmit,
}: ReviewPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {locale === "ar" ? "مراجعة الدليل" : "Review Evidence"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {selectedEvidence ? (
          <div className="space-y-4">
            {/* Evidence Details */}
            <EvidenceDetailsCard locale={locale} evidence={selectedEvidence} />

            {/* Review Status */}
            <ReviewStatusButtons
              locale={locale}
              reviewStatus={reviewStatus}
              onStatusChange={onStatusChange}
            />

            {/* Review Notes */}
            <div>
              <Label className="mb-2 block">
                {locale === "ar" ? "ملاحظات" : "Notes"} (
                {locale === "ar" ? "اختياري" : "Optional"})
              </Label>
              <Textarea
                value={reviewNotes}
                onChange={(e) => onNotesChange(e.target.value)}
                rows={4}
                placeholder={
                  locale === "ar"
                    ? "أضف ملاحظات حول المراجعة..."
                    : "Add review notes..."
                }
              />
            </div>

            {/* Submit Button */}
            <Button
              onClick={onSubmit}
              disabled={!reviewStatus || submitting}
              className="w-full"
            >
              {submitting
                ? locale === "ar"
                  ? "جاري الحفظ..."
                  : "Saving..."
                : locale === "ar"
                ? "حفظ المراجعة"
                : "Submit Review"}
            </Button>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400">
            {locale === "ar"
              ? "اختر دليل للمراجعة"
              : "Select an evidence item to review"}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

