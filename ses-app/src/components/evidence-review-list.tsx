"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/lib/i18n/client";
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
      alert(
        locale === "ar"
          ? "يرجى اختيار حالة المراجعة"
          : "Please select a review status"
      );
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
      
      alert(
        locale === "ar"
          ? "تم تحديث حالة الدليل بنجاح"
          : "Evidence status updated successfully"
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : locale === "ar"
          ? "فشل تحديث حالة الدليل"
          : "Failed to update evidence status"
      );
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "REJECTED":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "UNDER_REVIEW":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          {locale === "ar" ? "مراجعة الأدلة" : "Review Evidence"}
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          {locale === "ar"
            ? "مراجعة واعتماد أو رفض الأدلة المرفوعة"
            : "Review, approve, or reject uploaded evidence"}
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Evidence List */}
        <div className="rounded-xl border border-slate-200 bg-white dark:border-gray-700 dark:bg-gray-900">
          <div className="border-b border-slate-200 p-4 dark:border-gray-700">
            <h2 className="text-lg font-semibold">
              {locale === "ar" ? "الأدلة قيد المراجعة" : "Evidence Under Review"}
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {evidence.length}{" "}
              {locale === "ar" ? "دليل يحتاج مراجعة" : "items pending review"}
            </p>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-600 dark:text-slate-400">
              {locale === "ar" ? "جاري التحميل..." : "Loading..."}
            </div>
          ) : evidence.length === 0 ? (
            <div className="p-8 text-center text-slate-600 dark:text-slate-400">
              {locale === "ar"
                ? "لا توجد أدلة تحتاج مراجعة"
                : "No evidence pending review"}
            </div>
          ) : (
            <div className="divide-y divide-slate-200 dark:divide-gray-700">
              {evidence.map((item) => (
                <div
                  key={item.id}
                  className={`cursor-pointer p-4 transition-colors ${
                    selectedEvidence?.id === item.id
                      ? "bg-primary/10 dark:bg-primary/20"
                      : "hover:bg-slate-50 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => {
                    setSelectedEvidence(item);
                    setReviewStatus("");
                    setReviewNotes("");
                  }}
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
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(item.id, item.type);
                      }}
                      className="ml-2 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-white transition hover:bg-primary-dark dark:bg-primary-light"
                    >
                      {item.type === "FILE"
                        ? locale === "ar"
                          ? "عرض"
                          : "View"
                        : locale === "ar"
                        ? "فتح"
                        : "Open"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Review Panel */}
        <div className="rounded-xl border border-slate-200 bg-white dark:border-gray-700 dark:bg-gray-900">
          <div className="border-b border-slate-200 p-4 dark:border-gray-700">
            <h2 className="text-lg font-semibold">
              {locale === "ar" ? "مراجعة الدليل" : "Review Evidence"}
            </h2>
          </div>

          {selectedEvidence ? (
            <div className="p-4 space-y-4">
              {/* Evidence Details */}
              <div>
                <h3 className="font-medium text-slate-900 dark:text-slate-100">
                  {selectedEvidence.title}
                </h3>
                {selectedEvidence.description && (
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    {selectedEvidence.description}
                  </p>
                )}
                <div className="mt-3 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <p>
                    <span className="font-medium">
                      {locale === "ar" ? "المجال" : "Domain"}:
                    </span>{" "}
                    {locale === "ar"
                      ? selectedEvidence.domain.nameAr
                      : selectedEvidence.domain.nameEn}
                  </p>
                  <p>
                    <span className="font-medium">
                      {locale === "ar" ? "المعيار" : "Standard"}:
                    </span>{" "}
                    {selectedEvidence.standard.code} -{" "}
                    {locale === "ar"
                      ? selectedEvidence.standard.nameAr
                      : selectedEvidence.standard.nameEn}
                  </p>
                  {selectedEvidence.indicator && (
                    <p>
                      <span className="font-medium">
                        {locale === "ar" ? "المؤشر" : "Indicator"}:
                      </span>{" "}
                      {selectedEvidence.indicator.code} -{" "}
                      {locale === "ar"
                        ? selectedEvidence.indicator.descriptionAr ||
                          selectedEvidence.indicator.descriptionEn
                        : selectedEvidence.indicator.descriptionEn ||
                          selectedEvidence.indicator.descriptionAr}
                    </p>
                  )}
                  <p>
                    <span className="font-medium">
                      {locale === "ar" ? "النوع" : "Type"}:
                    </span>{" "}
                    {selectedEvidence.type === "FILE"
                      ? locale === "ar"
                        ? "ملف"
                        : "File"
                      : locale === "ar"
                      ? "رابط"
                      : "Link"}
                  </p>
                </div>
              </div>

              {/* Review Status */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {locale === "ar" ? "قرار المراجعة" : "Review Decision"} *
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setReviewStatus("APPROVED")}
                    className={`flex-1 rounded-lg border-2 px-4 py-3 font-medium transition-colors ${
                      reviewStatus === "APPROVED"
                        ? "border-green-500 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                        : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-gray-600 dark:bg-gray-800 dark:text-slate-300"
                    }`}
                  >
                    ✓ {locale === "ar" ? "اعتماد" : "Approve"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setReviewStatus("REJECTED")}
                    className={`flex-1 rounded-lg border-2 px-4 py-3 font-medium transition-colors ${
                      reviewStatus === "REJECTED"
                        ? "border-red-500 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                        : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-gray-600 dark:bg-gray-800 dark:text-slate-300"
                    }`}
                  >
                    ✕ {locale === "ar" ? "رفض" : "Reject"}
                  </button>
                </div>
              </div>

              {/* Review Notes */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {locale === "ar" ? "ملاحظات" : "Notes"} (
                  {locale === "ar" ? "اختياري" : "Optional"})
                </label>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  rows={4}
                  placeholder={
                    locale === "ar"
                      ? "أضف ملاحظات حول المراجعة..."
                      : "Add review notes..."
                  }
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-slate-100"
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={handleReview}
                disabled={!reviewStatus || submitting}
                className="w-full rounded-md bg-primary px-4 py-2 font-medium text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50 dark:bg-primary-light"
              >
                {submitting
                  ? locale === "ar"
                    ? "جاري الحفظ..."
                    : "Saving..."
                  : locale === "ar"
                  ? "حفظ المراجعة"
                  : "Submit Review"}
              </button>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400">
              {locale === "ar"
                ? "اختر دليل للمراجعة"
                : "Select an evidence item to review"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}