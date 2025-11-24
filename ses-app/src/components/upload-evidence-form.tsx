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
import { FileText, Layers, Upload, Link } from "lucide-react";

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
      let filePath = null;

      // Step 1: Upload file to S3 if type is FILE
      if (evidenceType === "FILE" && file) {
        // 1. Get presigned URL
        const urlResponse = await fetch("/api/evidence/upload-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filename: file.name,
            contentType: file.type,
          }),
        });

        if (!urlResponse.ok) {
          const errorData = await urlResponse.json();
          throw new Error(errorData.error || "Failed to get upload URL");
        }

        const { uploadUrl, key } = await urlResponse.json();
        filePath = key;

        // 2. Upload file to S3 directly
        const uploadResponse = await fetch(uploadUrl, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
        });

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload file to storage");
        }
      }

      // Step 2: Save metadata to database
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("domainId", selectedDomainId);
      formData.append("standardId", selectedStandardId);
      formData.append("indicatorId", selectedIndicatorId);
      formData.append("type", evidenceType);

      if (filePath) {
        formData.append("filePath", filePath);
      } else if (evidenceType === "LINK") {
        formData.append("url", url);
      }

      const response = await fetch("/api/evidence/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save evidence metadata");
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
    <div className="py-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          <span className="bg-gradient-to-r from-primary via-blue-600 to-accent bg-clip-text text-transparent animate-gradient bg-300%">
            {t("upload.title")}
          </span>
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          {t("upload.subtitle")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive font-medium border border-destructive/20 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
            {error}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column: Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="relative overflow-hidden border-primary/10 bg-card/50 backdrop-blur-sm shadow-sm">
              {/* Gradient Top Strip */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-blue-500 to-accent animate-gradient bg-300%" />

              <CardHeader>
                <div className="flex items-center gap-3 mb-1">
                  <div className="p-2 rounded-md bg-primary/10 text-primary">
                    <FileText className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-primary">{locale === "ar" ? "تفاصيل الدليل" : "Evidence Details"}</CardTitle>
                </div>
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
                    className="border-primary/20 focus-visible:ring-primary/30"
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
                    className="flex min-h-[80px] w-full rounded-md border border-primary/20 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder={locale === "ar" ? "وصف مختصر للدليل..." : "Brief description of the evidence..."}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-primary/10 bg-card/50 backdrop-blur-sm shadow-sm">
              {/* Gradient Top Strip */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-blue-500 to-accent animate-gradient bg-300%" />

              <CardHeader>
                <div className="flex items-center gap-3 mb-1">
                  <div className="p-2 rounded-md bg-blue-500/10 text-blue-600">
                    <Layers className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-primary">{locale === "ar" ? "تصنيف الدليل" : "Classification"}</CardTitle>
                </div>
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
            <Card className="relative overflow-hidden border-primary/10 bg-card/50 backdrop-blur-sm shadow-sm h-fit sticky top-24">
              {/* Gradient Top Strip */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-blue-500 to-accent animate-gradient bg-300%" />

              <CardHeader>
                <div className="flex items-center gap-3 mb-1">
                  <div className="p-2 rounded-md bg-accent/10 text-accent">
                    {evidenceType === "FILE" ? <Upload className="h-5 w-5" /> : <Link className="h-5 w-5" />}
                  </div>
                  <CardTitle className="text-primary">{t("upload.fields.evidenceMethod")}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <EvidenceTypeSelector
                  value={evidenceType}
                  onChange={(type) => {
                    setEvidenceType(type);
                    setError("");
                  }}
                />

                <Separator className="bg-primary/10" />

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
                      className="border-primary/20 focus-visible:ring-primary/30"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex flex-col gap-4 sticky top-[32rem]">
              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-[1.02]"
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
                className="w-full border-primary/20 hover:bg-primary/5 hover:text-primary"
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