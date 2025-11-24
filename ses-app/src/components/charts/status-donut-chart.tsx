"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useTranslation } from "@/lib/i18n/client";
import type { Locale } from "@/lib/i18n/config";

type StatusDonutChartProps = {
    data: {
        name: string;
        value: number;
        color: string;
    }[];
    locale: Locale;
};

export function StatusDonutChart({ data, locale }: StatusDonutChartProps) {
    const { t } = useTranslation("common");

    const COLORS = data.map((item) => item.color);

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="flex items-center gap-2">
                        <div
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: payload[0].payload.color }}
                        />
                        <span className="text-sm font-medium">{payload[0].name}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                        {locale === "ar" ? "العدد:" : "Count:"} {payload[0].value}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        formatter={(value) => <span className="text-sm text-muted-foreground mx-2">{value}</span>}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
