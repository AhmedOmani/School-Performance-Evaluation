import { Label } from "@/components/ui";
import type { ReactNode } from "react";

type FormFieldProps = {
  label: string;
  required?: boolean;
  children: ReactNode;
  error?: string;
};

export function FormField({ label, required, children, error }: FormFieldProps) {
  return (
    <div>
      <Label className="mb-2 block">
        {label} {required && <span className="text-error">*</span>}
      </Label>
      {children}
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
    </div>
  );
}

