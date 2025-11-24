"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/lib/i18n/client";
import { ReportsSummary } from "@/components/reports/reports-summary";
import { DomainBreakdown } from "@/components/reports/domain-breakdown";
import { ExportButton } from "@/components/reports/export-button";
import { Locale } from "@/lib/i18n/config";
import { FileText } from "lucide-react";

type Stats = {
    totalEvidence: number;
    approvedEvidence: number;
    underReviewEvidence: number;
    evidenceByDomain: {
        domainId: string;
        nameEn: string;
        nameAr: string;
        count: number;
    }[];
};

type ReportsContentProps = {
    locale: Locale;
};

export function ReportsContent({ locale }: ReportsContentProps) {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation("common");

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch("/api/reports/stats");
                if (!response.ok) throw new Error("Failed to fetch stats");
                const data = await response.json();
                setStats(data);
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="flex h-[50vh] flex-col items-center justify-center gap-4 text-muted-foreground">
                <FileText className="h-12 w-12 opacity-20" />
                <p>{locale === "ar" ? "فشل تحميل التقرير" : "Failed to load report"}</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
                        <span className="bg-gradient-to-r from-primary via-blue-600 to-accent bg-clip-text text-transparent animate-gradient bg-300%">
                            {locale === "ar" ? "التقارير" : "Reports"}
                        </span>
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        {locale === "ar"
                            ? "تقارير شاملة عن الأدلة والإحصائيات"
                            : "Comprehensive reports on evidence and statistics"}
                    </p>
                </div>
                <ExportButton locale={locale} />
            </div>

            <ReportsSummary locale={locale} stats={stats} />

            <div className="grid gap-4">
                <DomainBreakdown locale={locale} data={stats.evidenceByDomain} />
            </div>
        </div>
    );
}
