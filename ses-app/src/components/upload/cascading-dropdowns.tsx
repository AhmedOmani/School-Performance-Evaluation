"use client";

import { useEffect, useState } from "react";
import { Sun, FolderOpen, FileText } from "lucide-react";
import { Select, Label } from "@/components/ui";
import type { Locale } from "@/lib/i18n/config";
import type { Axis } from "@prisma/client";

type Domain = {
  id: string;
  nameEn: string;
  nameAr: string;
  axis: {
    id: string;
    nameEn: string;
    nameAr: string;
  };
};

type Standard = {
  id: string;
  code: string;
  nameEn: string;
  nameAr: string;
  domain: {
    id: string;
    nameEn: string;
    nameAr: string;
  };
};

type Indicator = {
  id: string;
  code: string;
  descriptionEn: string | null;
  descriptionAr: string | null;
  standard: {
    id: string;
    code: string;
    nameEn: string;
    nameAr: string;
  };
};

type CascadingDropdownsProps = {
  locale: Locale;
  axes: Axis[];
  selectedAxisId: string;
  selectedDomainId: string;
  selectedStandardId: string;
  onAxisChange: (axisId: string) => void;
  onDomainChange: (domainId: string) => void;
  onStandardChange: (standardId: string) => void;
};

export function CascadingDropdowns({
  locale,
  axes,
  selectedAxisId,
  selectedDomainId,
  selectedStandardId,
  onAxisChange,
  onDomainChange,
  onStandardChange,
}: CascadingDropdownsProps) {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [standards, setStandards] = useState<Standard[]>([]);
  const [indicators, setIndicators] = useState<Indicator[]>([]);

  const selectedAxis = axes.find((a) => a.id === selectedAxisId);
  const selectedDomain = domains.find((d) => d.id === selectedDomainId);
  const selectedStandard = standards.find((s) => s.id === selectedStandardId);

  // Fetch domains when axis is selected
  useEffect(() => {
    if (selectedAxisId) {
      fetch(`/api/domains?axisId=${selectedAxisId}`)
        .then(async (res) => {
          if (!res.ok) {
            const text = await res.text();
            throw new Error(`Failed to fetch domains: ${res.status} ${text.substring(0, 100)}`);
          }
          return res.json();
        })
        .then((data) => {
          setDomains(data.domains || []);
          onDomainChange("");
          setStandards([]);
          onStandardChange("");
          setIndicators([]);
        })
        .catch((err) => {
          console.error("Error fetching domains:", err);
          setDomains([]);
        });
    } else {
      setDomains([]);
    }
  }, [selectedAxisId, onDomainChange, onStandardChange]);

  // Fetch standards when domain is selected
  useEffect(() => {
    if (selectedDomainId) {
      fetch(`/api/standards?domainId=${selectedDomainId}`)
        .then(async (res) => {
          if (!res.ok) {
            const text = await res.text();
            throw new Error(`Failed to fetch standards: ${res.status} ${text.substring(0, 100)}`);
          }
          return res.json();
        })
        .then((data) => {
          setStandards(data.standards || []);
          onStandardChange("");
          setIndicators([]);
        })
        .catch((err) => {
          console.error("Error fetching standards:", err);
          setStandards([]);
        });
    } else {
      setStandards([]);
    }
  }, [selectedDomainId, onStandardChange]);

  // Fetch indicators when standard is selected
  useEffect(() => {
    if (selectedStandardId) {
      fetch(`/api/indicators?standardId=${selectedStandardId}`)
        .then(async (res) => {
          if (!res.ok) {
            const text = await res.text();
            throw new Error(`Failed to fetch indicators: ${res.status} ${text.substring(0, 100)}`);
          }
          return res.json();
        })
        .then((data) => {
          setIndicators(data.indicators || []);
        })
        .catch((err) => {
          console.error("Error fetching indicators:", err);
          setIndicators([]);
        });
    } else {
      setIndicators([]);
    }
  }, [selectedStandardId]);

  return (
    <div className="space-y-6">
      {/* Axis */}
      <div>
        <Label className="mb-2 block">
          {locale === "ar" ? "المحور" : "Axis"} *
        </Label>
        <Select
          value={selectedAxisId}
          onChange={(e) => onAxisChange(e.target.value)}
          required
        >
          <option value="">
            {locale === "ar" ? "اختر المحور" : "Select Axis"}
          </option>
          {axes.map((axis) => (
            <option key={axis.id} value={axis.id}>
              {locale === "ar" ? axis.nameAr : axis.nameEn}
            </option>
          ))}
        </Select>
        {selectedAxis && (
          <div className="mt-2 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <Sun className="h-4 w-4" />
            <span>
              {locale === "ar"
                ? `المحور: ${selectedAxis.nameAr}`
                : `Axis: ${selectedAxis.nameEn}`}
            </span>
          </div>
        )}
      </div>

      {/* Domain */}
      <div>
        <Label className="mb-2 block">
          {locale === "ar" ? "المجال" : "Domain"} *
        </Label>
        <Select
          value={selectedDomainId}
          onChange={(e) => onDomainChange(e.target.value)}
          disabled={!selectedAxisId}
          required
        >
          <option value="">
            {locale === "ar"
              ? selectedAxisId
                ? "اختر المجال"
                : "اختر المحور أولاً"
              : selectedAxisId
                ? "Select Domain"
                : "Select Axis first"}
          </option>
          {domains.map((domain) => (
            <option key={domain.id} value={domain.id}>
              {locale === "ar" ? domain.nameAr : domain.nameEn}
            </option>
          ))}
        </Select>
        {selectedDomain && (
          <div className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              <span>
                {locale === "ar"
                  ? `المجال: ${selectedDomain.nameAr}`
                  : `Domain: ${selectedDomain.nameEn}`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4" />
              <span>
                {locale === "ar"
                  ? `المحور: ${selectedDomain.axis.nameAr}`
                  : `Axis: ${selectedDomain.axis.nameEn}`}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Standard */}
      <div>
        <Label className="mb-2 block">
          {locale === "ar" ? "المعيار" : "Standard"} *
        </Label>
        <Select
          value={selectedStandardId}
          onChange={(e) => onStandardChange(e.target.value)}
          disabled={!selectedDomainId}
          required
        >
          <option value="">
            {locale === "ar"
              ? selectedDomainId
                ? "اختر المعيار"
                : "اختر المجال أولاً"
              : selectedDomainId
                ? "Select Standard"
                : "Select Domain first"}
          </option>
          {standards.map((standard) => (
            <option key={standard.id} value={standard.id}>
              {locale === "ar" ? standard.nameAr : standard.nameEn}
            </option>
          ))}
        </Select>
        {selectedStandard && (
          <div className="mt-2 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <FileText className="h-4 w-4" />
            <span>
              {locale === "ar"
                ? `المعيار: ${selectedStandard.nameAr}`
                : `Standard: ${selectedStandard.nameEn}`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

