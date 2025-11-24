// src/components/upload-evidence-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n/client";
import type { Locale } from "@/lib/i18n/config";
import type { Axis } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { EvidenceTypeSelector } from "@/components/upload/evidence-type-selector";
import { FileUploadZone } from "@/components/upload/file-upload-zone";
import { CascadingSelects } from "@/components/upload/cascading-selects";

type UploadEvidenceFormProps = {
  locale: Locale;
  axes: Axis[];
};

export function UploadEvidenceForm({
  locale,
  axes,
}: UploadEvidenceFormProps) {
  const { t } = useTranslation("common");
  const router = useRouter();

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedAxisId, setSelectedAxisId] = useState<string>("");
  const [selectedDomainId, setSelectedDomainId] = useState<string>("");
  const [selectedStandardId, setSelectedStandardId] = useState<string>("");
  const [selectedIndicatorId, setSelectedIndicatorId] = useState<string>("");
  const [evidenceType, setEvidenceType] = useState<"FILE" | "LINK">("FILE");
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!title || !selectedDomainId || !selectedStandardId || !selectedIndicatorId) {
      const errorMsg = locale === "ar"
        ? "يرجى ملء جميع الحقول المطلوبة"
        : "Please fill all required fields";
      setError(errorMsg);
      setLoading(false);
      return;
    }

    if (evidenceType === "FILE" && !file) {
      const errorMsg = locale === "ar"
        ? "يرجى اختيار ملف"
        : "Please select a file";
      setError(errorMsg);
      setLoading(false);
      return;
    }

    if (evidenceType === "LINK" && !url) {
      const errorMsg = locale === "ar"
        ? "يرجى إدخال رابط"
        : "Please enter a URL";
      setError(errorMsg);
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("domainId", selectedDomainId);
      formData.append("standardId", selectedStandardId);
      formData.append("indicatorId", selectedIndicatorId);
      formData.append("type", evidenceType);

      if (evidenceType === "FILE" && file) {
        formData.append("file", file);
      } else if (evidenceType === "LINK") {
        formData.append("url", url);
      }

      const response = await fetch("/api/evidence/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload evidence");
      }

      // Success!
      // Small delay to ensure user sees the loading state
      await new Promise(resolve => setTimeout(resolve, 500));

      // Redirect to dashboard
      router.push(`/${locale}/dashboard`);
      router.refresh();
    } catch (err) {
      console.error("Error in handleSubmit:", err);
      const errorMsg = err instanceof Error
        ? err.message
        : locale === "ar"
          ? "حدث خطأ أثناء رفع الدليل"
          : "An error occurred while uploading evidence";
      setError(errorMsg);
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {t("upload.title")}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {t("upload.subtitle")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive font-medium border border-destructive/20">
            {error}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column: Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>{locale === "ar" ? "تفاصيل الدليل" : "Evidence Details"}</CardTitle>
                <CardDescription>
                  {locale === "ar" ? "أدخل المعلومات الأساسية للدليل" : "Enter the basic information for the evidence"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">
                    {t("upload.fields.title")} <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={locale === "ar" ? "مثال: خطة الأنشطة المدرسية" : "e.g., School Activities Plan"}
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">
                    {t("upload.fields.description")}
                  </Label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder={locale === "ar" ? "وصف مختصر للدليل..." : "Brief description of the evidence..."}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{locale === "ar" ? "تصنيف الدليل" : "Classification"}</CardTitle>
                <CardDescription>
                  {locale === "ar" ? "حدد المجال والمعيار المرتبط بالدليل" : "Select the domain and standard related to the evidence"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CascadingSelects
                  locale={locale}
                  axes={axes}
                  selectedAxisId={selectedAxisId}
                  selectedDomainId={selectedDomainId}
                  selectedStandardId={selectedStandardId}
                  selectedIndicatorId={selectedIndicatorId}
                  onAxisChange={(id) => {
                    setSelectedAxisId(id);
                    setSelectedDomainId("");
                    setSelectedStandardId("");
                    setSelectedIndicatorId("");
                  }}
                  onDomainChange={(id) => {
                    setSelectedDomainId(id);
                    setSelectedStandardId("");
                    setSelectedIndicatorId("");
                  }}
                  onStandardChange={(id) => {
                    setSelectedStandardId(id);
                    setSelectedIndicatorId("");
                  }}
                  onIndicatorChange={setSelectedIndicatorId}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Upload */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>{t("upload.fields.evidenceMethod")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <EvidenceTypeSelector
                  value={evidenceType}
                  onChange={(type) => {
                    setEvidenceType(type);
                    setError("");
                  }}
                />

                <Separator />

                {evidenceType === "FILE" ? (
                  <div className="space-y-4">
                    <Label>{t("upload.fields.file")} <span className="text-destructive">*</span></Label>
                    <FileUploadZone
                      locale={locale}
                      file={file}
                      onFileChange={setFile}
                      error={error && !file ? error : undefined}
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Label htmlFor="url">{t("upload.fields.url")} <span className="text-destructive">*</span></Label>
                    <Input
                      id="url"
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://example.com"
                      required={evidenceType === "LINK"}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex flex-col gap-4">
              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="w-full"
              >
                {loading
                  ? locale === "ar" ? "جاري الرفع..." : "Uploading..."
                  : t("actions.save")}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => router.push(`/${locale}/dashboard`)}
                className="w-full"
              >
                {t("actions.cancel")}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}