"use client";

import { Upload as UploadIcon, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui";
import { useTranslation } from "@/lib/i18n/client";

type EvidenceTypeToggleProps = {
  evidenceType: "FILE" | "LINK";
  onTypeChange: (type: "FILE" | "LINK") => void;
};

export function EvidenceTypeToggle({
  evidenceType,
  onTypeChange,
}: EvidenceTypeToggleProps) {
  const { t } = useTranslation("common");

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
        {t("upload.fields.evidenceMethod")}
      </label>
      <div className="flex gap-4">
        <Button
          type="button"
          variant={evidenceType === "FILE" ? "default" : "outline"}
          className="flex-1"
          onClick={() => onTypeChange("FILE")}
        >
          <UploadIcon className="h-5 w-5" />
          {t("upload.actions.uploadFile")}
        </Button>
        <Button
          type="button"
          variant={evidenceType === "LINK" ? "default" : "outline"}
          className="flex-1"
          onClick={() => onTypeChange("LINK")}
        >
          <LinkIcon className="h-5 w-5" />
          {t("upload.actions.enterLink")}
        </Button>
      </div>
    </div>
  );
}

