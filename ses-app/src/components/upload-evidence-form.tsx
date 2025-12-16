"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n/client";
import { Button, Input, Label, Textarea, Card, CardContent, useToast } from "@/components/ui";
import { CascadingDropdowns } from "./upload/cascading-dropdowns";
import { EvidenceTypeToggle } from "./upload/evidence-type-toggle";
import { FileUploadZone } from "./upload/file-upload-zone";
import type { Locale } from "@/lib/i18n/config";
import type { Axis } from "@prisma/client";

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
  const { addToast } = useToast();

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedAxisId, setSelectedAxisId] = useState<string>("");
  const [selectedDomainId, setSelectedDomainId] = useState<string>("");
  const [selectedStandardId, setSelectedStandardId] = useState<string>("");
  const [evidenceType, setEvidenceType] = useState<"FILE" | "LINK">("FILE");
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title =
        locale === "ar" ? "العنوان مطلوب" : "Title is required";
    }

    if (!selectedAxisId) {
      newErrors.axis =
        locale === "ar" ? "المحور مطلوب" : "Axis is required";
    }

    if (!selectedDomainId) {
      newErrors.domain =
        locale === "ar" ? "المجال مطلوب" : "Domain is required";
    }

    if (!selectedStandardId) {
      newErrors.standard =
        locale === "ar" ? "المعيار مطلوب" : "Standard is required";
    }

    if (evidenceType === "FILE" && !file) {
      newErrors.file =
        locale === "ar" ? "يرجى اختيار ملف" : "Please select a file";
    }

    if (evidenceType === "LINK" && !url.trim()) {
      newErrors.url =
        locale === "ar" ? "يرجى إدخال رابط" : "Please enter a URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      addToast({
        type: "error",
        title: locale === "ar" ? "خطأ في التحقق" : "Validation Error",
        description:
          locale === "ar"
            ? "يرجى ملء جميع الحقول المطلوبة"
            : "Please fill all required fields",
      });
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("domainId", selectedDomainId);
      formData.append("standardId", selectedStandardId);
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
        const errorMsg = data.error || "Failed to upload evidence";
        throw new Error(errorMsg);
      }

      // Success toast
      addToast({
        type: "success",
        title:
          locale === "ar" ? "تم الرفع بنجاح" : "Upload Successful",
        description:
          locale === "ar"
            ? "تم رفع الدليل بنجاح"
            : "Evidence uploaded successfully",
      });

      // Small delay to show success message
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Redirect to dashboard
      router.push(`/${locale}/dashboard`);
      router.refresh();
    } catch (err) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : locale === "ar"
          ? "حدث خطأ أثناء رفع الدليل"
          : "An error occurred while uploading evidence";
      
      addToast({
        type: "error",
        title: locale === "ar" ? "فشل الرفع" : "Upload Failed",
        description: errorMsg,
      });
      
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 py-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {t("upload.title")}
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          {t("upload.subtitle")}
        </p>
      </div>

      {/* Form */}
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <Label className="mb-2 block">
                {t("upload.fields.title")} *
              </Label>
              <Input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) {
                    setErrors((prev) => ({ ...prev, title: "" }));
                  }
                }}
                className={errors.title ? "border-red-500 focus:border-red-500" : ""}
                required
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.title}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <Label className="mb-2 block">
                {t("upload.fields.description")}
              </Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            {/* Cascading Dropdowns */}
            <CascadingDropdowns
              locale={locale}
              axes={axes}
              selectedAxisId={selectedAxisId}
              selectedDomainId={selectedDomainId}
              selectedStandardId={selectedStandardId}
              onAxisChange={setSelectedAxisId}
              onDomainChange={setSelectedDomainId}
              onStandardChange={setSelectedStandardId}
            />

            {/* Evidence Type Toggle */}
            <EvidenceTypeToggle
              evidenceType={evidenceType}
              onTypeChange={(type) => {
                setEvidenceType(type);
                if (type === "FILE") {
                  setUrl("");
                } else {
                  setFile(null);
                }
              }}
            />

            {/* File Upload */}
            {evidenceType === "FILE" && (
              <FileUploadZone
                locale={locale}
                file={file}
                onFileSelect={(file) => {
                  setFile(file);
                  if (errors.file) {
                    setErrors((prev) => ({ ...prev, file: "" }));
                  }
                }}
                onError={(error) => {
                  setErrors((prev) => ({ ...prev, file: error }));
                  addToast({
                    type: "error",
                    title: locale === "ar" ? "خطأ في الملف" : "File Error",
                    description: error,
                  });
                }}
              />
            )}

            {/* URL Input */}
            {evidenceType === "LINK" && (
              <div>
                <Label className="mb-2 block">
                  {t("upload.fields.url")} *
                </Label>
                <Input
                  type="url"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    if (errors.url) {
                      setErrors((prev) => ({ ...prev, url: "" }));
                    }
                  }}
                  className={errors.url ? "border-red-500 focus:border-red-500" : ""}
                  placeholder="https://example.com"
                  required
                />
                {errors.url && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.url}
                  </p>
                )}
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading
                  ? locale === "ar"
                    ? "جاري الرفع..."
                    : "Uploading..."
                  : t("actions.save")}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/${locale}/dashboard`)}
              >
                {t("actions.cancel")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
