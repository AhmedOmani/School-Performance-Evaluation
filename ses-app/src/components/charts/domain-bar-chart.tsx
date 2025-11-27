"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";
import { useTranslation } from "@/lib/i18n/client";
import type { Locale } from "@/lib/i18n/config";

type DomainBarChartProps = {
    data: {
        name: string | undefined;
        count: number;
    }[];
    locale: Locale;
};

export function DomainBarChart({ data, locale }: DomainBarChartProps) {
    const { t } = useTranslation("common");

    // Custom Tooltip
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <p className="text-sm font-medium">{label}</p>
                    <p className="text-sm text-primary">
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
                <BarChart
                    data={data}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
                    <XAxis
                        dataKey="name"
                        stroke="#888888"
                        fontSize={14}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => (value.length > 20 ? `${value.substring(0, 20)}...` : value)}
                    />
                    <YAxis
                        stroke="#888888"
                        fontSize={14}
                        tickLine={false}
                        axisLine={false}
                        allowDecimals={false}
                        tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={40}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill="hsl(var(--primary))" />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
