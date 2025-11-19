// src/components/upload-evidence-form.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { 
  Sun, 
  FolderOpen, 
  FileText, 
  BarChart3, 
  Upload as UploadIcon, 
  Link as LinkIcon,
  Monitor
} from "lucide-react";
import { useTranslation } from "@/lib/i18n/client";
import type { Locale } from "@/lib/i18n/config";
import type { Axis } from "@prisma/client";

type Domain = {
  id: string;
  nameEn: string;
  nameAr: string;
  axis: {
    id: string;
    nameEn: string;
    nameAr: string;
  };
};

type Standard = {
  id: string;
  code: string;
  nameEn: string;
  nameAr: string;
  domain: {
    id: string;
    nameEn: string;
    nameAr: string;
  };
};

type Indicator = {
  id: string;
  code: string;
  descriptionEn: string | null;
  descriptionAr: string | null;
  standard: {
    id: string;
    code: string;
    nameEn: string;
    nameAr: string;
  };
};

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

  // Cascading data
  const [domains, setDomains] = useState<Domain[]>([]);
  const [standards, setStandards] = useState<Standard[]>([]);
  const [indicators, setIndicators] = useState<Indicator[]>([]);

  // Selected items for display
  const [selectedAxis, setSelectedAxis] = useState<Axis | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [selectedStandard, setSelectedStandard] = useState<Standard | null>(null);
  const [selectedIndicator, setSelectedIndicator] = useState<Indicator | null>(null);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [success, setSuccess] = useState(false);

  // Dropzone configuration
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
      "video/*": [".mp4", ".avi", ".mov", ".wmv"],
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
      }
    },
    onDropRejected: (rejectedFiles) => {
      const rejection = rejectedFiles[0];
      if (rejection.errors[0]?.code === "file-too-large") {
        setError(
          locale === "ar"
            ? "حجم الملف يتجاوز 50 ميجابايت"
            : "File size exceeds 50MB"
        );
      } else {
        setError(
          locale === "ar"
            ? "نوع الملف غير مدعوم"
            : "File type not supported"
        );
      }
    },
  });

  // Fetch domains when axis is selected
  useEffect(() => {
    if (selectedAxisId) {
      fetch(`/api/domains?axisId=${selectedAxisId}`)
        .then((res) => res.json())
        .then((data) => {
          setDomains(data.domains || []);
          setSelectedDomain(null);
          setSelectedDomainId("");
          setStandards([]);
          setSelectedStandard(null);
          setSelectedStandardId("");
          setIndicators([]);
          setSelectedIndicator(null);
          setSelectedIndicatorId("");
        })
        .catch((err) => console.error("Error fetching domains:", err));
    } else {
      setDomains([]);
      setSelectedDomain(null);
    }
  }, [selectedAxisId]);

  // Fetch standards when domain is selected
  useEffect(() => {
    if (selectedDomainId) {
      fetch(`/api/standards?domainId=${selectedDomainId}`)
        .then((res) => res.json())
        .then((data) => {
          setStandards(data.standards || []);
          setSelectedStandard(null);
          setSelectedStandardId("");
          setIndicators([]);
          setSelectedIndicator(null);
          setSelectedIndicatorId("");
        })
        .catch((err) => console.error("Error fetching standards:", err));
    } else {
      setStandards([]);
      setSelectedStandard(null);
    }
  }, [selectedDomainId]);

  // Fetch indicators when standard is selected
  useEffect(() => {
    if (selectedStandardId) {
      fetch(`/api/indicators?standardId=${selectedStandardId}`)
        .then((res) => res.json())
        .then((data) => {
          setIndicators(data.indicators || []);
          setSelectedIndicator(null);
          setSelectedIndicatorId("");
        })
        .catch((err) => console.error("Error fetching indicators:", err));
    } else {
      setIndicators([]);
      setSelectedIndicator(null);
    }
  }, [selectedStandardId]);

  // Update selected items when IDs change
  useEffect(() => {
    if (selectedAxisId) {
      const axis = axes.find((a) => a.id === selectedAxisId);
      setSelectedAxis(axis || null);
    } else {
      setSelectedAxis(null);
    }
  }, [selectedAxisId, axes]);

  useEffect(() => {
    if (selectedDomainId) {
      const domain = domains.find((d) => d.id === selectedDomainId);
      setSelectedDomain(domain || null);
    } else {
      setSelectedDomain(null);
    }
  }, [selectedDomainId, domains]);

  useEffect(() => {
    if (selectedStandardId) {
      const standard = standards.find((s) => s.id === selectedStandardId);
      setSelectedStandard(standard || null);
    } else {
      setSelectedStandard(null);
    }
  }, [selectedStandardId, standards]);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
  
    console.log("Form submission started", {
      title,
      domainId: selectedDomainId,
      standardId: selectedStandardId,
      indicatorId: selectedIndicatorId,
      type: evidenceType,
      hasFile: !!file,
      url,
    });
  
    // Validation
    if (!title || !selectedDomainId || !selectedStandardId) {
      const errorMsg = locale === "ar"
        ? "يرجى ملء جميع الحقول المطلوبة"
        : "Please fill all required fields";
      setError(errorMsg);
      setLoading(false);
      console.error("Validation failed: Missing required fields");
      return;
    }
  
    if (evidenceType === "FILE" && !file) {
      const errorMsg = locale === "ar"
        ? "يرجى اختيار ملف"
        : "Please select a file";
      setError(errorMsg);
      setLoading(false);
      console.error("Validation failed: No file selected");
      return;
    }
  
    if (evidenceType === "LINK" && !url) {
      const errorMsg = locale === "ar"
        ? "يرجى إدخال رابط"
        : "Please enter a URL";
      setError(errorMsg);
      setLoading(false);
      console.error("Validation failed: No URL provided");
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("domainId", selectedDomainId);
      formData.append("standardId", selectedStandardId);
      //formData.append("indicatorId", selectedIndicatorId);
      formData.append("type", evidenceType);
  
      if (evidenceType === "FILE" && file) {
        formData.append("file", file);
        console.log("File added to formData:", file.name, file.size, "bytes");
      } else if (evidenceType === "LINK") {
        formData.append("url", url);
        console.log("URL added to formData:", url);
      }
  
      console.log("Sending request to /api/evidence/upload");
  
      const response = await fetch("/api/evidence/upload", {
        method: "POST",
        body: formData,
      });
  
      console.log("Response status:", response.status, response.statusText);
  
      const data = await response.json();
      console.log("Response data:", data);
  
      if (!response.ok) {
        const errorMsg = data.error || "Failed to upload evidence";
        console.error("Upload failed:", errorMsg);
        throw new Error(errorMsg);
      }
  
      // Success!
      console.log("Upload successful! Evidence ID:", data.evidence?.id);
      
      // Show success message briefly before redirect
      const successMsg = locale === "ar"
        ? "تم رفع الدليل بنجاح!"
        : "Evidence uploaded successfully!";
      
      // You could add a success state here if you want to show a message
      // For now, we'll just redirect
      {success && (
        <div className="rounded-lg bg-green-50 p-4 text-sm text-green-600 dark:bg-green-900/20 dark:text-green-400">
          {locale === "ar" ? "تم رفع الدليل بنجاح!" : "Evidence uploaded successfully!"}
        </div>
      )}
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
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          {t("upload.title")}
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          {t("upload.subtitle")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            {t("upload.fields.title")} *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-slate-100"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            {t("upload.fields.description")}
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-slate-100"
          />
        </div>

        {/* Axis */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            {t("upload.fields.axis")} *
          </label>
          <select
            value={selectedAxisId}
            onChange={(e) => setSelectedAxisId(e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-slate-100"
            required
          >
            <option value="">
              {locale === "ar" ? "اختر المحور" : "Select Axis"}
            </option>
            {axes.map((axis) => (
              <option key={axis.id} value={axis.id}>
                {locale === "ar" ? axis.nameAr : axis.nameEn}
              </option>
            ))}
          </select>
          {selectedAxis && (
            <div className="mt-2 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <Sun className="h-4 w-4" />
              <span>
                {locale === "ar"
                  ? `المحور: ${selectedAxis.nameAr}`
                  : `Axis: ${selectedAxis.nameEn}`}
              </span>
            </div>
          )}
        </div>

        {/* Domain */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            {t("upload.fields.domain")} *
          </label>
          <select
            value={selectedDomainId}
            onChange={(e) => setSelectedDomainId(e.target.value)}
            disabled={!selectedAxisId}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 disabled:bg-slate-100 disabled:text-slate-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-slate-100 dark:disabled:bg-gray-700"
            required
          >
            <option value="">
              {locale === "ar"
                ? selectedAxisId
                  ? "اختر المجال"
                  : "اختر المحور أولاً"
                : selectedAxisId
                ? "Select Domain"
                : "Select Axis first"}
            </option>
            {domains.map((domain) => (
              <option key={domain.id} value={domain.id}>
                {locale === "ar" ? domain.nameAr : domain.nameEn}
              </option>
            ))}
          </select>
          {selectedDomain && (
            <div className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <FolderOpen className="h-4 w-4" />
                <span>
                  {locale === "ar"
                    ? `المجال: ${selectedDomain.nameAr}`
                    : `Domain: ${selectedDomain.nameEn}`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Sun className="h-4 w-4" />
                <span>
                  {locale === "ar"
                    ? `المحور: ${selectedDomain.axis.nameAr}`
                    : `Axis: ${selectedDomain.axis.nameEn}`}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Standard */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            {t("upload.fields.standard")} *
          </label>
          <select
            value={selectedStandardId}
            onChange={(e) => setSelectedStandardId(e.target.value)}
            disabled={!selectedDomainId}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 disabled:bg-slate-100 disabled:text-slate-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-slate-100 dark:disabled:bg-gray-700"
            required
          >
            <option value="">
              {locale === "ar"
                ? selectedDomainId
                  ? "اختر المعيار"
                  : "اختر المجال أولاً"
                : selectedDomainId
                ? "Select Standard"
                : "Select Domain first"}
            </option>
            {standards.map((standard) => (
              <option key={standard.id} value={standard.id}>
                {locale === "ar" ? standard.nameAr : standard.nameEn}
              </option>
            ))}
          </select>
          {selectedStandard && (
            <div className="mt-2 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <FileText className="h-4 w-4" />
              <span>
                {locale === "ar"
                  ? `المعيار: ${selectedStandard.nameAr}`
                  : `Standard: ${selectedStandard.nameEn}`}
              </span>
            </div>
          )}
        </div>

        {/* Indicator */}
        //TODO: Add indicator selection

        {/* Evidence Type Toggle */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {t("upload.fields.evidenceMethod")}
          </label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => {
                setEvidenceType("FILE");
                setUrl("");
              }}
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 font-medium transition-colors ${
                evidenceType === "FILE"
                  ? "border-primary bg-primary text-white dark:bg-primary-light"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-gray-600 dark:bg-gray-800 dark:text-slate-300 dark:hover:bg-gray-700"
              }`}
            >
              <UploadIcon className="h-5 w-5" />
              {t("upload.actions.uploadFile")}
            </button>
            <button
              type="button"
              onClick={() => {
                setEvidenceType("LINK");
                setFile(null);
              }}
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 font-medium transition-colors ${
                evidenceType === "LINK"
                  ? "border-primary bg-primary text-white dark:bg-primary-light"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-gray-600 dark:bg-gray-800 dark:text-slate-300 dark:hover:bg-gray-700"
              }`}
            >
              <LinkIcon className="h-5 w-5" />
              {t("upload.actions.enterLink")}
            </button>
          </div>
        </div>

        {/* File Upload */}
        {evidenceType === "FILE" && (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              {t("upload.fields.file")} * (PDF, Images, Video - Max 50MB)
            </label>
            <div
              {...getRootProps()}
              className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                isDragActive
                  ? "border-primary bg-primary/5 dark:bg-primary/10"
                  : "border-slate-300 hover:border-primary dark:border-gray-600"
              }`}
            >
              <input {...getInputProps()} />
              <div className="flex justify-center mb-2">
                <Monitor className="h-10 w-10 text-slate-400" />
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {isDragActive
                  ? locale === "ar"
                    ? "أسقط الملف هنا"
                    : "Drop the file here"
                  : locale === "ar"
                  ? "اسحب الملف هنا أو اضغط للاختيار"
                  : "Drag the file here or click to choose"}
              </p>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                PDF, Images, Video up to 50MB
              </p>
              {file && (
                <div className="mt-4 rounded-md bg-slate-100 p-2 text-sm dark:bg-gray-700">
                  {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </div>
              )}
            </div>
          </div>
        )}

        {/* URL Input */}
        {evidenceType === "LINK" && (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              {t("upload.fields.url")} *
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-slate-100"
              required={evidenceType === "LINK"}
            />
          </div>
        )}

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-md bg-primary px-6 py-3 font-medium text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50 dark:bg-primary-light"
          >
            {loading
              ? locale === "ar"
                ? "جاري الرفع..."
                : "Uploading..."
              : t("actions.save")}
          </button>
          <button
            type="button"
            onClick={() => router.push(`/${locale}/dashboard`)}
            className="rounded-md border border-slate-300 px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-50 dark:border-gray-600 dark:text-slate-300 dark:hover:bg-gray-700"
          >
            {t("actions.cancel")}
          </button>
        </div>
      </form>
    </div>
  );
}