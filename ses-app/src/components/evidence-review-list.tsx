"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/lib/i18n/client";
import { Card, CardContent, useToast } from "@/components/ui";
import { ReviewEvidenceList } from "./review/review-evidence-list";
import { ReviewPanel } from "./review/review-panel";
import type { Locale } from "@/lib/i18n/config";

type EvidenceItem = {
  id: string;
  title: string;
  description: string | null;
  type: "FILE" | "LINK";
  status: "UNDER_REVIEW" | "APPROVED" | "REJECTED";
  notes: string | null;
  submittedAt: string;
  reviewedAt: string | null;
  domain: {
    id: string;
    nameEn: string;
    nameAr: string;
  };
  standard: {
    id: string;
    code: string;
    nameEn: string;
    nameAr: string;
  };
  indicator: {
    id: string;
    code: string;
    descriptionEn: string | null;
    descriptionAr: string | null;
  } | null;
  submittedBy: {
    name: string;
    email: string;
  };
  reviewedBy: {
    name: string;
    email: string;
  } | null;
};

type EvidenceReviewListProps = {
  locale: Locale;
};

export function EvidenceReviewList({ locale }: EvidenceReviewListProps) {
  const { t } = useTranslation("common");
  const { addToast } = useToast();

  const [evidence, setEvidence] = useState<EvidenceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceItem | null>(null);
  const [reviewStatus, setReviewStatus] = useState<"APPROVED" | "REJECTED" | "">("");
  const [reviewNotes, setReviewNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch evidence pending review
  useEffect(() => {
    const fetchEvidence = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch("/api/evidence?status=UNDER_REVIEW&limit=50");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch evidence");
        }

        setEvidence(data.evidence || []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : locale === "ar"
            ? "فشل تحميل الأدلة"
            : "Failed to load evidence"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEvidence();
  }, [locale]);

  const handleReview = async () => {
    if (!selectedEvidence || !reviewStatus) {
      addToast({
        type: "warning",
        title: locale === "ar" ? "تنبيه" : "Warning",
        description:
          locale === "ar"
            ? "يرجى اختيار حالة المراجعة"
            : "Please select a review status",
      });
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(`/api/evidence/${selectedEvidence.id}/review`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: reviewStatus,
          notes: reviewNotes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update evidence status");
      }

      // Remove reviewed evidence from list
      setEvidence((prev) => prev.filter((e) => e.id !== selectedEvidence.id));

      // Reset form
      setSelectedEvidence(null);
      setReviewStatus("");
      setReviewNotes("");

      addToast({
        type: "success",
        title:
          locale === "ar" ? "تم التحديث بنجاح" : "Update Successful",
        description:
          locale === "ar"
            ? "تم تحديث حالة الدليل بنجاح"
            : "Evidence status updated successfully",
      });
    } catch (err) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : locale === "ar"
          ? "فشل تحديث حالة الدليل"
          : "Failed to update evidence status";
      
      setError(errorMsg);
      addToast({
        type: "error",
        title: locale === "ar" ? "فشل التحديث" : "Update Failed",
        description: errorMsg,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownload = async (evidenceId: string, type: "FILE" | "LINK") => {
    try {
      const response = await fetch(`/api/evidence/${evidenceId}/download`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get download URL");
      }

      window.open(data.downloadUrl, "_blank");
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : locale === "ar"
          ? "فشل فتح الملف"
          : "Failed to open file"
      );
    }
  };


  return (
    <div className="space-y-8 py-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {locale === "ar" ? "مراجعة الأدلة" : "Review Evidence"}
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          {locale === "ar"
            ? "مراجعة واعتماد أو رفض الأدلة المرفوعة"
            : "Review, approve, or reject uploaded evidence"}
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <Card>
          <CardContent className="p-4">
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Evidence List */}
        <ReviewEvidenceList
          locale={locale}
          evidence={evidence.map((item) => ({
            id: item.id,
            title: item.title,
            type: item.type,
            domain: item.domain,
            standard: item.standard,
            submittedBy: item.submittedBy,
          }))}
          loading={loading}
          selectedEvidenceId={selectedEvidence?.id || null}
          onSelectEvidence={(item) => {
            const fullItem = evidence.find((e) => e.id === item.id);
            if (fullItem) {
              setSelectedEvidence(fullItem);
              setReviewStatus("");
              setReviewNotes("");
            }
          }}
          onDownload={handleDownload}
        />

        {/* Review Panel */}
        <ReviewPanel
          locale={locale}
          selectedEvidence={selectedEvidence}
          reviewStatus={reviewStatus}
          reviewNotes={reviewNotes}
          submitting={submitting}
          onStatusChange={setReviewStatus}
          onNotesChange={setReviewNotes}
          onSubmit={handleReview}
        />
      </div>
    </div>
  );
}
