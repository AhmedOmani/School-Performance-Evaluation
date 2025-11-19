"use client";

import { useDropzone } from "react-dropzone";
import { Monitor, File as FileIcon, X } from "lucide-react";
import { useTranslation } from "@/lib/i18n/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n/config";

interface FileUploadZoneProps {
    locale: Locale;
    file: File | null;
    onFileChange: (file: File | null) => void;
    error?: string;
}

export function FileUploadZone({ locale, file, onFileChange, error }: FileUploadZoneProps) {
    const { t } = useTranslation("common");

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            "application/pdf": [".pdf"],
            "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
            "video/*": [".mp4", ".avi", ".mov", ".wmv"],
        },
        maxSize: 50 * 1024 * 1024, // 50MB
        onDrop: (acceptedFiles) => {
            if (acceptedFiles.length > 0) {
                onFileChange(acceptedFiles[0]);
            }
        },
        disabled: !!file,
    });

    if (file) {
        return (
            <div className="relative overflow-hidden rounded-xl border bg-card p-8 transition-all">
                <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <FileIcon className="h-8 w-8" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h4 className="truncate text-lg font-medium text-foreground">
                            {file.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onFileChange(null)}
                        className="h-10 w-10 text-muted-foreground hover:text-destructive"
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div
            {...getRootProps()}
            className={cn(
                "group relative cursor-pointer overflow-hidden rounded-xl border-2 border-dashed p-12 text-center transition-all hover:border-primary hover:bg-accent/50",
                isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
                error ? "border-destructive/50 bg-destructive/5" : ""
            )}
        >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-4">
                <div className={cn(
                    "flex h-20 w-20 items-center justify-center rounded-full transition-colors",
                    isDragActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                )}>
                    <Monitor className="h-10 w-10" />
                </div>
                <div className="space-y-1">
                    <p className="text-lg font-medium text-foreground">
                        {isDragActive
                            ? locale === "ar"
                                ? "أسقط الملف هنا"
                                : "Drop the file here"
                            : locale === "ar"
                                ? "اسحب الملف هنا أو اضغط للاختيار"
                                : "Drag the file here or click to choose"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        PDF, Images, Video (Max 50MB)
                    </p>
                </div>
            </div>
        </div>
    );
}
