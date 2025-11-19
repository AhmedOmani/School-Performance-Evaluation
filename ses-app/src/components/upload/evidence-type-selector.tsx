"use client";

import { Upload as UploadIcon, Link as LinkIcon } from "lucide-react";
import { useTranslation } from "@/lib/i18n/client";
import { cn } from "@/lib/utils";

type EvidenceType = "FILE" | "LINK";

interface EvidenceTypeSelectorProps {
    value: EvidenceType;
    onChange: (value: EvidenceType) => void;
}

export function EvidenceTypeSelector({ value, onChange }: EvidenceTypeSelectorProps) {
    const { t } = useTranslation("common");

    return (
        <div className="grid grid-cols-2 gap-4">
            <button
                type="button"
                onClick={() => onChange("FILE")}
                className={cn(
                    "flex flex-col items-center justify-center gap-3 rounded-xl border-2 p-6 transition-all hover:bg-accent hover:text-accent-foreground",
                    value === "FILE"
                        ? "border-primary bg-primary/5 text-primary ring-2 ring-primary ring-offset-2"
                        : "border-muted bg-card text-muted-foreground"
                )}
            >
                <div className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-full transition-colors",
                    value === "FILE" ? "bg-primary text-primary-foreground" : "bg-muted"
                )}>
                    <UploadIcon className="h-6 w-6" />
                </div>
                <span className="font-medium">{t("upload.actions.uploadFile")}</span>
            </button>

            <button
                type="button"
                onClick={() => onChange("LINK")}
                className={cn(
                    "flex flex-col items-center justify-center gap-3 rounded-xl border-2 p-6 transition-all hover:bg-accent hover:text-accent-foreground",
                    value === "LINK"
                        ? "border-primary bg-primary/5 text-primary ring-2 ring-primary ring-offset-2"
                        : "border-muted bg-card text-muted-foreground"
                )}
            >
                <div className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-full transition-colors",
                    value === "LINK" ? "bg-primary text-primary-foreground" : "bg-muted"
                )}>
                    <LinkIcon className="h-6 w-6" />
                </div>
                <span className="font-medium">{t("upload.actions.enterLink")}</span>
            </button>
        </div>
    );
}
