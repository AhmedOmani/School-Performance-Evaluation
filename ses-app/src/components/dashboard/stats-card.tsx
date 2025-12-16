import { Card, CardContent } from "@/components/ui";
import type { ReactNode } from "react";

type StatsCardProps = {
  title: string;
  value: number;
  icon: ReactNode;
  iconBgColor: string;
  iconColor: string;
  borderColor: string;
  textColor: string;
};

export function StatsCard({
  title,
  value,
  icon,
  iconBgColor,
  iconColor,
  borderColor,
  textColor,
}: StatsCardProps) {
  return (
    <Card className={`border-2 ${borderColor} transition-shadow hover:shadow-md`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
              {title}
            </p>
            <p className={`mt-2 text-3xl font-bold ${textColor}`}>
              {value.toLocaleString()}
            </p>
          </div>
          <div className={`rounded-full ${iconBgColor} p-3`}>
            <div className={iconColor}>{icon}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

