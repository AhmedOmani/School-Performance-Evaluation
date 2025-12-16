"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "@/lib/i18n/client";
import { Card, CardContent, useToast } from "@/components/ui";
import { FilterBar } from "./evidence/filter-bar";
import { EvidenceTable } from "./evidence/evidence-table";
import { PaginationControls } from "./evidence/pagination-controls";
import type { Locale } from "@/lib/i18n/config";

type Domain = {
  id: string;
  nameEn: string;
  nameAr: string;
};

type EvidenceItem = {
  id: string;
  title: string;
  description: string | null;
  type: "FILE" | "LINK";
  status: "UNDER_REVIEW" | "APPROVED" | "REJECTED";
  submittedAt: string;
  domain: Domain;
  standard: {
    id: string;
    code: string;
    nameEn: string;
    nameAr: string;
  };
};

type EvidenceListProps = {
  locale: Locale;
  domains: Domain[];
};

export function EvidenceList({ locale, domains }: EvidenceListProps) {
  const { t } = useTranslation("common");
  const { addToast } = useToast();
  const searchParams = useSearchParams();

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>(
    searchParams.get("status") || ""
  );
  const [domainFilter, setDomainFilter] = useState<string>(
    searchParams.get("domainId") || ""
  );
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Data
  const [evidence, setEvidence] = useState<EvidenceItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch evidence
  useEffect(() => {
    const fetchEvidence = async () => {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams();
        if (statusFilter) params.append("status", statusFilter);
        if (domainFilter) params.append("domainId", domainFilter);
        params.append("page", page.toString());
        params.append("limit", "10");

        const response = await fetch(`/api/evidence?${params.toString()}`);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch evidence");
        }

        setEvidence(data.evidence || []);
        setTotalPages(data.pagination?.totalPages || 1);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : locale === "ar"
            ? "فشل تحميل الأدلة"
            : "Failed to load evidence"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchEvidence();
  }, [statusFilter, domainFilter, page, locale]);

  // Handle download/view
  const handleDownload = async (evidenceId: string, type: "FILE" | "LINK") => {
    try {
      const response = await fetch(`/api/evidence/${evidenceId}/download`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get download URL");
      }
      window.open(data.downloadUrl, "_blank");
      addToast({
        type: "success",
        title: locale === "ar" ? "تم الفتح" : "Opened",
        description:
          locale === "ar"
            ? "تم فتح الملف بنجاح"
            : "File opened successfully",
      });
    } catch (err) {
      addToast({
        type: "error",
        title: locale === "ar" ? "فشل الفتح" : "Failed to Open",
        description:
          err instanceof Error
            ? err.message
            : locale === "ar"
            ? "فشل فتح الملف"
            : "Failed to open file",
      });
    }
  };

  // Filter evidence by search query
  const filteredEvidence = evidence.filter((item) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query) ||
      (locale === "ar" ? item.domain.nameAr : item.domain.nameEn)
        .toLowerCase()
        .includes(query)
    );
  });

  return (
    <div className="space-y-8 py-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {t("navigation.evidence")}
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          {locale === "ar"
            ? "عرض وإدارة جميع الأدلة المرفوعة"
            : "View and manage all uploaded evidence"}
        </p>
      </div>

      {/* Filters */}
      <FilterBar
        locale={locale}
        domains={domains}
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        domainFilter={domainFilter}
        onSearchChange={setSearchQuery}
        onStatusChange={(status) => {
          setStatusFilter(status);
          setPage(1);
        }}
        onDomainChange={(domainId) => {
          setDomainFilter(domainId);
          setPage(1);
        }}
      />

      {/* Error Message */}
      {error && (
        <Card>
          <CardContent className="p-4">
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Evidence Table */}
      <div>
        <EvidenceTable
          locale={locale}
          evidence={filteredEvidence}
          loading={loading}
          onDownload={handleDownload}
        />
        <PaginationControls
          locale={locale}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
