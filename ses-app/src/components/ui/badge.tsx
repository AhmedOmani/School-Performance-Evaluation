import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-white hover:bg-primary-dark dark:bg-primary-light",
        secondary:
          "border-transparent bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-gray-700 dark:text-slate-100",
        destructive:
          "border-transparent bg-error text-white hover:bg-red-600 dark:bg-red-700",
        outline:
          "text-slate-950 border-slate-200 dark:text-slate-50 dark:border-slate-800",
        success:
          "border-transparent bg-success text-white hover:bg-emerald-600 dark:bg-emerald-700",
        warning:
          "border-transparent bg-warning text-white hover:bg-amber-600 dark:bg-amber-700",
        approved:
          "border-transparent bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
        rejected:
          "border-transparent bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
        "under-review":
          "border-transparent bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

