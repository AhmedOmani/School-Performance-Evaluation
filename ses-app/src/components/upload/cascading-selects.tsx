"use client";

import { useState, useEffect } from "react";
import { Sun, FolderOpen, FileText } from "lucide-react";
import { useTranslation } from "@/lib/i18n/client";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/config";
import type { Axis } from "@prisma/client";

// Types for fetched data
type Domain = {
    id: string;
    nameEn: string;
    nameAr: string;
    axis: { id: string; nameEn: string; nameAr: string };
};

type Standard = {
    id: string;
    nameEn: string;
    nameAr: string;
    domain: { id: string; nameEn: string; nameAr: string };
};

interface CascadingSelectsProps {
    locale: Locale;
    axes: Axis[];
    selectedAxisId: string;
    selectedDomainId: string;
    selectedStandardId: string;
    onAxisChange: (id: string) => void;
    onDomainChange: (id: string) => void;
    onStandardChange: (id: string) => void;
}

export function CascadingSelects({
    locale,
    axes,
    selectedAxisId,
    selectedDomainId,
    selectedStandardId,
    onAxisChange,
    onDomainChange,
    onStandardChange,
}: CascadingSelectsProps) {
    const { t } = useTranslation("common");

    const [domains, setDomains] = useState<Domain[]>([]);
    const [standards, setStandards] = useState<Standard[]>([]);

    // Fetch domains when axis changes
    useEffect(() => {
        if (selectedAxisId) {
            fetch(`/api/domains?axisId=${selectedAxisId}`)
                .then((res) => res.json())
                .then((data) => setDomains(data.domains || []))
                .catch((err) => console.error("Error fetching domains:", err));
        } else {
            setDomains([]);
        }
    }, [selectedAxisId]);

    // Fetch standards when domain changes
    useEffect(() => {
        if (selectedDomainId) {
            fetch(`/api/standards?domainId=${selectedDomainId}`)
                .then((res) => res.json())
                .then((data) => setStandards(data.standards || []))
                .catch((err) => console.error("Error fetching standards:", err));
        } else {
            setStandards([]);
        }
    }, [selectedDomainId]);

    // Helper to get name based on locale
    const getName = (item: { nameEn: string; nameAr: string } | undefined) => {
        if (!item) return "";
        return locale === "ar" ? item.nameAr : item.nameEn;
    };

    const selectedAxis = axes.find((a) => a.id === selectedAxisId);
    const selectedDomain = domains.find((d) => d.id === selectedDomainId);
    const selectedStandard = standards.find((s) => s.id === selectedStandardId);

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6">
                {/* Axis Select */}
                <div className="space-y-2">
                    <Label>{t("upload.fields.axis")} <span className="text-destructive">*</span></Label>
                    <Select
                        value={selectedAxisId}
                        onChange={(e) => onAxisChange(e.target.value)}
                    >
                        <option value="">{locale === "ar" ? "اختر المحور" : "Select Axis"}</option>
                        {axes.map((axis) => (
                            <option key={axis.id} value={axis.id}>
                                {getName(axis)}
                            </option>
                        ))}
                    </Select>
                </div>

                {/* Domain Select */}
                <div className="space-y-2">
                    <Label>{t("upload.fields.domain")} <span className="text-destructive">*</span></Label>
                    <Select
                        value={selectedDomainId}
                        onChange={(e) => onDomainChange(e.target.value)}
                        disabled={!selectedAxisId}
                    >
                        <option value="">
                            {locale === "ar"
                                ? selectedAxisId ? "اختر المجال" : "اختر المحور أولاً"
                                : selectedAxisId ? "Select Domain" : "Select Axis first"}
                        </option>
                        {domains.map((domain) => (
                            <option key={domain.id} value={domain.id}>
                                {getName(domain)}
                            </option>
                        ))}
                    </Select>
                </div>

                {/* Standard Select */}
                <div className="space-y-2">
                    <Label>{t("upload.fields.standard")} <span className="text-destructive">*</span></Label>
                    <Select
                        value={selectedStandardId}
                        onChange={(e) => onStandardChange(e.target.value)}
                        disabled={!selectedDomainId}
                    >
                        <option value="">
                            {locale === "ar"
                                ? selectedDomainId ? "اختر المعيار" : "اختر المجال أولاً"
                                : selectedDomainId ? "Select Standard" : "Select Domain first"}
                        </option>
                        {standards.map((standard) => (
                            <option key={standard.id} value={standard.id}>
                                {getName(standard)}
                            </option>
                        ))}
                    </Select>
                </div>
            </div>

            {/* Summary Card */}
            <div className="hidden md:block">
                <Card className="h-full bg-muted/50">
                    <CardContent className="pt-6 space-y-4">
                        <h3 className="font-medium text-muted-foreground">
                            {locale === "ar" ? "ملخص الاختيار" : "Selection Summary"}
                        </h3>

                        <div className="space-y-4">
                            <div className={cn("flex gap-3 transition-opacity", selectedAxis ? "opacity-100" : "opacity-30")}>
                                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                    <Sun className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        {t("upload.fields.axis")}
                                    </p>
                                    <p className="font-medium">{selectedAxis ? getName(selectedAxis) : "—"}</p>
                                </div>
                            </div>

                            <div className={cn("flex gap-3 transition-opacity", selectedDomain ? "opacity-100" : "opacity-30")}>
                                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                                    <FolderOpen className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        {t("upload.fields.domain")}
                                    </p>
                                    <p className="font-medium">{selectedDomain ? getName(selectedDomain) : "—"}</p>
                                </div>
                            </div>

                            <div className={cn("flex gap-3 transition-opacity", selectedStandard ? "opacity-100" : "opacity-30")}>
                                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                    <FileText className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        {t("upload.fields.standard")}
                                    </p>
                                    <p className="font-medium">{selectedStandard ? getName(selectedStandard) : "—"}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
