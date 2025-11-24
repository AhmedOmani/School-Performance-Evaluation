"use client";

import { Button } from "@/components/ui/button";
import { FileSpreadsheet } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "@/lib/i18n/client";
import type { Locale } from "@/lib/i18n/config";

type ExportButtonProps = {
    locale: Locale;
};

export function ExportButton({ locale }: ExportButtonProps) {
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation("common");

    const handleExport = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/reports/export");

            if (!response.ok) {
                throw new Error("Failed to export");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `evidence-report-${new Date().toISOString().split('T')[0]}.xlsx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error("Export failed:", error);
            alert(locale === "ar" ? "فشل تصدير التقرير" : "Failed to export report");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            onClick={handleExport}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white gap-2 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
        >
            <FileSpreadsheet className="h-4 w-4" />
            {loading
                ? (locale === "ar" ? "جاري التصدير..." : "Exporting...")
                : (locale === "ar" ? "تصدير Excel" : "Export Excel")
            }
        </Button>
    );
}
