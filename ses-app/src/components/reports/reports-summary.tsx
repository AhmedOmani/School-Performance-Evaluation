"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, CheckCircle2, Clock } from "lucide-react";
import { useTranslation } from "@/lib/i18n/client";
import type { Locale } from "@/lib/i18n/config";

type ReportsSummaryProps = {
    locale: Locale;
    stats: {
        totalEvidence: number;
        approvedEvidence: number;
        underReviewEvidence: number;
    };
};

export function ReportsSummary({ locale, stats }: ReportsSummaryProps) {
    const { t } = useTranslation("common");

    return (
        <div className="grid gap-6 md:grid-cols-3 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150 fill-mode-both">
            <Card className="relative overflow-hidden border-primary/10 bg-gradient-to-br from-primary/5 to-primary/10 shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-primary/20 group">
                <div className="absolute right-2 top-2 h-20 w-20 rounded-full bg-primary/10 blur-2xl group-hover:bg-primary/20 transition-colors" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-primary">
                        {locale === "ar" ? "إجمالي الأدلة" : "Total Evidence"}
                    </CardTitle>
                    <FileText className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-foreground">{stats.totalEvidence}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        {locale === "ar" ? "جميع الأدلة المرفوعة" : "All uploaded evidence"}
                    </p>
                </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-green-500/10 bg-gradient-to-br from-green-500/5 to-green-500/10 shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-green-500/20 group">
                <div className="absolute right-2 top-2 h-20 w-20 rounded-full bg-green-500/10 blur-2xl group-hover:bg-green-500/20 transition-colors" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-green-600 dark:text-green-400">
                        {locale === "ar" ? "الأدلة المعتمدة" : "Approved Evidence"}
                    </CardTitle>
                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-green-700 dark:text-green-300">{stats.approvedEvidence}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        {locale === "ar" ? "تمت مراجعتها واعتمادها" : "Reviewed and approved"}
                    </p>
                </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-yellow-500/10 bg-gradient-to-br from-yellow-500/5 to-yellow-500/10 shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-yellow-500/20 group">
                <div className="absolute right-2 top-2 h-20 w-20 rounded-full bg-yellow-500/10 blur-2xl group-hover:bg-yellow-500/20 transition-colors" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                        {locale === "ar" ? "قيد المراجعة" : "Under Review"}
                    </CardTitle>
                    <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-yellow-700 dark:text-yellow-300">{stats.underReviewEvidence}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        {locale === "ar" ? "بانتظار المراجعة" : "Waiting for review"}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
