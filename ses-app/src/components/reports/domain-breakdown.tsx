"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3 } from "lucide-react";
import { useTranslation } from "@/lib/i18n/client";
import type { Locale } from "@/lib/i18n/config";

type DomainStat = {
    domainId: string;
    nameEn: string;
    nameAr: string;
    count: number;
};

type DomainBreakdownProps = {
    locale: Locale;
    data: DomainStat[];
};

export function DomainBreakdown({ locale, data }: DomainBreakdownProps) {
    const { t } = useTranslation("common");

    return (
        <Card className="col-span-3 shadow-md border-primary/5 bg-card/50 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                    <BarChart3 className="h-5 w-5" />
                    {locale === "ar" ? "الأدلة حسب المجال" : "Evidence by Domain"}
                </CardTitle>
                <CardDescription>
                    {locale === "ar"
                        ? "توزيع الأدلة حسب المجالات"
                        : "Evidence distribution by domains"}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {data.map((item) => (
                        <div
                            key={item.domainId}
                            className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-background/50 hover:bg-accent/50 transition-colors group"
                        >
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                                    {locale === "ar" ? item.nameAr : item.nameEn}
                                </p>
                            </div>
                            <Badge variant="outline" className="text-sm px-3 py-1 bg-primary/5 text-primary border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                {item.count}
                            </Badge>
                        </div>
                    ))}
                    {data.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                            {locale === "ar" ? "لا توجد بيانات متاحة" : "No data available"}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

