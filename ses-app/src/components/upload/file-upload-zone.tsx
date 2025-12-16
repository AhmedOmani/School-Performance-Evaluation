"use client";

import { useDropzone } from "react-dropzone";
import { Upload, File } from "lucide-react";
import { Card, CardContent } from "@/components/ui";
import type { Locale } from "@/lib/i18n/config";

type FileUploadZoneProps = {
  locale: Locale;
  file: File | null;
  onFileSelect: (file: File) => void;
  onError: (error: string) => void;
};

export function FileUploadZone({
  locale,
  file,
  onFileSelect,
  onError,
}: FileUploadZoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
      "video/*": [".mp4", ".avi", ".mov", ".wmv"],
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    onDropRejected: (rejectedFiles) => {
      const rejection = rejectedFiles[0];
      if (rejection.errors[0]?.code === "file-too-large") {
        onError(
          locale === "ar"
            ? "حجم الملف يتجاوز 50 ميجابايت"
            : "File size exceeds 50MB"
        );
      } else {
        onError(
          locale === "ar"
            ? "نوع الملف غير مدعوم"
            : "File type not supported"
        );
      }
    },
  });

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
        {locale === "ar" ? "الملف" : "File"} * (PDF, Images, Video - Max 50MB)
      </label>
      <Card
        {...getRootProps()}
        className={`cursor-pointer border-2 border-dashed transition-colors ${
          isDragActive
            ? "border-primary bg-primary/5 dark:bg-primary/10"
            : "border-slate-300 hover:border-primary dark:border-gray-600"
        }`}
      >
        <CardContent className="p-8 text-center">
          <input {...getInputProps()} />
          <div className="mb-4 flex justify-center">
            {file ? (
              <File className="h-10 w-10 text-primary" />
            ) : (
              <Upload className="h-10 w-10 text-slate-400" />
            )}
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
        </CardContent>
      </Card>
    </div>
  );
}

