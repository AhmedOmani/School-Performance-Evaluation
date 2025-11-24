"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/lib/i18n/client";
import type { Locale } from "@/lib/i18n/config";
import {
  CheckCircle2,
  XCircle,
  FileText,
  ExternalLink,
  Download,
  AlertCircle,
  Search,
  Check,
  X,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl">
          <span className="bg-gradient-to-r from-primary via-blue-600 to-accent bg-clip-text text-transparent animate-gradient bg-300%">
            {locale === "ar" ? "مراجعة الأدلة" : "Review Evidence"}
          </span>
        </h1>
        <p className="text-lg text-muted-foreground">
          {locale === "ar"
            ? "مراجعة واعتماد أو رفض الأدلة المرفوعة"
            : "Review, approve, or reject uploaded evidence"}
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive font-medium border border-destructive/20 flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Evidence List */}
        <Card className="relative overflow-hidden border-primary/10 bg-card/50 backdrop-blur-sm shadow-sm h-fit">
          {/* Gradient Top Strip */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-blue-500 to-accent animate-gradient bg-300%" />

          <CardHeader>
            <CardTitle className="text-primary flex items-center gap-2">
              <Clock className="h-5 w-5" />
              {locale === "ar" ? "الأدلة قيد المراجعة" : "Evidence Under Review"}
            </CardTitle>
            <CardDescription>
              {evidence.length}{" "}
              {locale === "ar" ? "دليل يحتاج مراجعة" : "items pending review"}
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center text-muted-foreground">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  <p>{locale === "ar" ? "جاري التحميل..." : "Loading..."}</p>
                </div>
              </div>
            ) : evidence.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground flex flex-col items-center gap-3">
                <div className="p-3 rounded-full bg-primary/5 text-primary">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <p>{locale === "ar" ? "لا توجد أدلة تحتاج مراجعة" : "No evidence pending review"}</p>
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {evidence.map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      "cursor-pointer p-4 transition-all duration-300 hover:bg-accent/5",
                      selectedEvidence?.id === item.id
                        ? "bg-primary/5 border-l-4 border-primary pl-3"
                        : "border-l-4 border-transparent"
                    )}
                    onClick={() => {
                      setSelectedEvidence(item);
                      setReviewStatus("");
                      setReviewNotes("");
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 space-y-1">
                        <h3 className={cn(
                          "font-semibold text-foreground transition-colors",
                          selectedEvidence?.id === item.id ? "text-primary" : ""
                        )}>
                          {item.title}
                        </h3>
                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                          <Badge variant="outline" className="font-normal bg-background/50">
                            {locale === "ar" ? item.domain.nameAr : item.domain.nameEn}
                          </Badge>
                          <Badge variant="secondary" className="font-mono text-[10px]">
                            {item.standard.code}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground pt-1">
                          {locale === "ar" ? "مرفوع من" : "Submitted by"}: <span className="font-medium text-foreground">{item.submittedBy.name}</span>
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(item.id, item.type);
                        }}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                      >
                        {item.type === "FILE" ? <Download className="h-4 w-4" /> : <ExternalLink className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Review Panel */}
        <Card className="relative overflow-hidden border-primary/10 bg-card/50 backdrop-blur-sm shadow-sm h-fit sticky top-24">
          {/* Gradient Top Strip */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-blue-500 to-accent animate-gradient bg-300%" />

          <CardHeader>
            <CardTitle className="text-primary flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              {locale === "ar" ? "مراجعة الدليل" : "Review Evidence"}
            </CardTitle>
          </CardHeader>

          <CardContent>
            {selectedEvidence ? (
              <div className="space-y-6">
                {/* Evidence Details */}
                <div className="space-y-4 rounded-lg bg-secondary/20 p-4 border border-secondary/40">
                  <div>
                    <h3 className="font-bold text-lg text-foreground">
                      {selectedEvidence.title}
                    </h3>
                    {selectedEvidence.description && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {selectedEvidence.description}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span className="font-medium text-foreground min-w-[80px]">{locale === "ar" ? "المجال" : "Domain"}:</span>
                      <span>{locale === "ar" ? selectedEvidence.domain.nameAr : selectedEvidence.domain.nameEn}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span className="font-medium text-foreground min-w-[80px]">{locale === "ar" ? "المعيار" : "Standard"}:</span>
                      <Badge variant="outline" className="font-mono text-xs">{selectedEvidence.standard.code}</Badge>
                      <span>{locale === "ar" ? selectedEvidence.standard.nameAr : selectedEvidence.standard.nameEn}</span>
                    </div>
                    {selectedEvidence.indicator && (
                      <div className="flex items-start gap-2 text-muted-foreground">
                        <span className="font-medium text-foreground min-w-[80px] shrink-0">{locale === "ar" ? "المؤشر" : "Indicator"}:</span>
                        <div className="flex flex-col gap-1">
                          <Badge variant="secondary" className="w-fit font-mono text-xs">{selectedEvidence.indicator.code}</Badge>
                          <span className="text-xs leading-relaxed">
                            {locale === "ar"
                              ? selectedEvidence.indicator.descriptionAr || selectedEvidence.indicator.descriptionEn
                              : selectedEvidence.indicator.descriptionEn || selectedEvidence.indicator.descriptionAr}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span className="font-medium text-foreground min-w-[80px]">{locale === "ar" ? "النوع" : "Type"}:</span>
                      <Badge variant={selectedEvidence.type === "FILE" ? "default" : "secondary"}>
                        {selectedEvidence.type === "FILE" ? (locale === "ar" ? "ملف" : "File") : (locale === "ar" ? "رابط" : "Link")}
                      </Badge>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-2 border-primary/20 hover:bg-primary/5 hover:text-primary"
                    onClick={() => handleDownload(selectedEvidence.id, selectedEvidence.type)}
                  >
                    {selectedEvidence.type === "FILE" ? <Download className="h-4 w-4" /> : <ExternalLink className="h-4 w-4" />}
                    {locale === "ar" ? "عرض الدليل" : "View Evidence"}
                  </Button>
                </div>

                {/* Review Status */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">
                    {locale === "ar" ? "قرار المراجعة" : "Review Decision"} <span className="text-destructive">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setReviewStatus("APPROVED")}
                      className={cn(
                        "flex items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 font-medium transition-all duration-200",
                        reviewStatus === "APPROVED"
                          ? "border-green-500 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 shadow-sm ring-1 ring-green-500/20"
                          : "border-border bg-card hover:bg-accent/50 hover:border-muted-foreground/30"
                      )}
                    >
                      <CheckCircle2 className="h-5 w-5" />
                      {locale === "ar" ? "اعتماد" : "Approve"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setReviewStatus("REJECTED")}
                      className={cn(
                        "flex items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 font-medium transition-all duration-200",
                        reviewStatus === "REJECTED"
                          ? "border-destructive bg-destructive/10 text-destructive shadow-sm ring-1 ring-destructive/20"
                          : "border-border bg-card hover:bg-accent/50 hover:border-muted-foreground/30"
                      )}
                    >
                      <XCircle className="h-5 w-5" />
                      {locale === "ar" ? "رفض" : "Reject"}
                    </button>
                  </div>
                </div>

                {/* Review Notes */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    {locale === "ar" ? "ملاحظات" : "Notes"} <span className="text-muted-foreground font-normal">({locale === "ar" ? "اختياري" : "Optional"})</span>
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
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                {/* Submit Button */}
                <Button
                  onClick={handleReview}
                  disabled={!reviewStatus || submitting}
                  className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-[1.02]"
                  size="lg"
                >
                  {submitting ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      {locale === "ar" ? "جاري الحفظ..." : "Saving..."}
                    </>
                  ) : (
                    locale === "ar" ? "حفظ المراجعة" : "Submit Review"
                  )}
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground text-center p-6 border-2 border-dashed border-primary/10 rounded-lg bg-primary/5">
                <div className="p-4 rounded-full bg-background shadow-sm mb-4">
                  <FileText className="h-8 w-8 text-primary/40" />
                </div>
                <p className="text-lg font-medium">{locale === "ar" ? "اختر دليل للمراجعة" : "Select an evidence item to review"}</p>
                <p className="text-sm mt-1 max-w-xs opacity-70">
                  {locale === "ar"
                    ? "انقر على أي عنصر من القائمة لعرض التفاصيل واتخاذ قرار"
                    : "Click on any item from the list to view details and make a decision"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}