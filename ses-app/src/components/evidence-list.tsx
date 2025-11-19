"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "@/lib/i18n/client";
import type { Locale } from "@/lib/i18n/config";

type Domain = {
    id: string;
    nameEn: string;
    nameAr: string;
}

type Standard = {
    id: string;
    code: string;
    nameEn: string;
    nameAr: string;
}

type Indicator = {
    id: string;
    code: string;
    descriptionEn: string | null;
    descriptionAr: string | null;
}

type EvidenceItem = {
    id: string;
    title: string;
    description: string | null;
    type: "FILE" | "LINK";
    status: "UNDER_REVIEW" | "APPROVED" | "REJECTED";
    submittedAt: string;
    domain: Domain;
    standard: Standard;
    indicator: Indicator | null;
    submittedBy: {
        name: string;
        email: string;
    };
};

type EvidenceListProps = {
    locale: Locale;
    domains: Domain[];
}

export function EvidenceList({ locale, domains }: EvidenceListProps) {
    const { t } = useTranslation("common");
    const router = useRouter();
    const searchParams = useSearchParams();

    //filters
    const [statusFilter, setStatusFilter] = useState<string>(searchParams.get("status") || "");
    const [domainFilter, setDomainFitler] = useState<string>(searchParams.get("domainId") || "");
    const [searchQuery, setSearchQuery] = useState<string>("");

    //Data
    const [evidence, setEvidence] = useState<EvidenceItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    //fetch evidence
    useEffect(() => {
        const fetchEvidence = async () => {
            setLoading(true);
            setError("");

            try {
                const params = new URLSearchParams();
                if (statusFilter) params.append("status", statusFilter);
                if (domainFilter) params.append("domainId" , domainFilter);
                params.append("page" , page.toString());
                params.append("limit" , "10");

                const response = await fetch(`/api/evidence?${params.toString()}`);
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.error || "Failed to fetch evidence"); 
                }

                setEvidence(data.evidence || []);
                setTotalPages(data.pagination?.totalPages || 1);
            } catch (error) {
                setError(error instanceof Error ? error.message : locale === "ar" ? "فشل تحميل الأدلة": "Failed to load evidence"); 
            } finally {
                setLoading(false);
            }
        };
        fetchEvidence();
    }, [statusFilter, domainFilter, page, locale]);

    //Handle download/view
    const handleDownload = async (evidenceId: string, type: "FILE" | "LINK") => {
        try {
            const response = await fetch(`/api/evidence/${evidenceId}/download`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to get download URL"); 
            }
            window.open(data.downloadUrl , "_blank");
        } catch (err) {
            alert(err instanceof Error ? err.message : locale === "ar"  ? "فشل فتح الملف"  : "Failed to open file");
        }
    } 

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

    const getStatusColor = (status: string) => {
        switch (status) {
          case "APPROVED":
            return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
          case "REJECTED":
            return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
          case "UNDER_REVIEW":
            return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
          default:
            return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
        }
    };

    const getStatusText = (status: string) => {
        if (locale === "ar") {
          switch (status) {
            case "APPROVED":
              return "معتمد";
            case "REJECTED":
              return "مرفوض";
            case "UNDER_REVIEW":
              return "قيد المراجعة";
            default:
              return status;
          }
        } else {
          switch (status) {
            case "APPROVED":
              return "Approved";
            case "REJECTED":
              return "Rejected";
            case "UNDER_REVIEW":
              return "Under Review";
            default:
              return status;
          }
        }
    };
    return (
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {t("navigation.evidence")}
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              {locale === "ar"
                ? "عرض وإدارة جميع الأدلة المرفوعة"
                : "View and manage all uploaded evidence"}
            </p>
          </div>
    
          {/* Filters */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
            <div className="grid gap-4 sm:grid-cols-3">
              {/* Search */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {locale === "ar" ? "بحث" : "Search"}
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    locale === "ar"
                      ? "ابحث في العنوان أو الوصف..."
                      : "Search by title or description..."
                  }
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-slate-100"
                />
              </div>
    
              {/* Status Filter */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {locale === "ar" ? "الحالة" : "Status"}
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(1);
                  }}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-slate-100"
                >
                  <option value="">
                    {locale === "ar" ? "جميع الحالات" : "All Statuses"}
                  </option>
                  <option value="UNDER_REVIEW">
                    {locale === "ar" ? "قيد المراجعة" : "Under Review"}
                  </option>
                  <option value="APPROVED">
                    {locale === "ar" ? "معتمد" : "Approved"}
                  </option>
                  <option value="REJECTED">
                    {locale === "ar" ? "مرفوض" : "Rejected"}
                  </option>
                </select>
              </div>
    
              {/* Domain Filter */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {locale === "ar" ? "المجال" : "Domain"}
                </label>
                <select
                  value={domainFilter}
                  onChange={(e) => {
                    setDomainFitler(e.target.value);
                    setPage(1);
                  }}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-slate-100"
                >
                  <option value="">
                    {locale === "ar" ? "جميع المجالات" : "All Domains"}
                  </option>
                  {domains.map((domain) => (
                    <option key={domain.id} value={domain.id}>
                      {locale === "ar" ? domain.nameAr : domain.nameEn}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
    
          {/* Error Message */}
          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}
    
          {/* Evidence Table */}
          <div className="rounded-xl border border-slate-200 bg-white dark:border-gray-700 dark:bg-gray-900">
            {loading ? (
              <div className="p-8 text-center text-slate-600 dark:text-slate-400">
                {locale === "ar" ? "جاري التحميل..." : "Loading..."}
              </div>
            ) : filteredEvidence.length === 0 ? (
              <div className="p-8 text-center text-slate-600 dark:text-slate-400">
                {locale === "ar" ? "لا توجد أدلة" : "No evidence found"}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="border-b border-slate-200 bg-slate-50 dark:border-gray-700 dark:bg-gray-800">
                        <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-700 dark:text-slate-300">
                            {locale === "ar" ? "العنوان" : "Title"}
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-700 dark:text-slate-300">
                            {locale === "ar" ? "المجال" : "Domain"}
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-700 dark:text-slate-300">
                            {locale === "ar" ? "المعيار" : "Standard"}
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-700 dark:text-slate-300">
                            {locale === "ar" ? "الحالة" : "Status"}
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-700 dark:text-slate-300">
                            {locale === "ar" ? "تاريخ الرفع" : "Submitted"}
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-slate-700 dark:text-slate-300">
                            {locale === "ar" ? "الإجراءات" : "Actions"}
                        </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-gray-700">
                        {filteredEvidence.map((item) => (
                        <tr
                            key={item.id}
                            className="hover:bg-slate-50 dark:hover:bg-gray-800"
                        >
                            <td className="px-4 py-3">
                            <div className="font-medium text-slate-900 dark:text-slate-100">
                                {item.title}
                            </div>
                            {item.description && (
                                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                {item.description.length > 50
                                    ? `${item.description.substring(0, 50)}...`
                                    : item.description}
                                </div>
                            )}
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                            {locale === "ar" ? item.domain.nameAr : item.domain.nameEn}
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                            {item.standard.code} -{" "}
                            {locale === "ar"
                                ? item.standard.nameAr
                                : item.standard.nameEn}
                            </td>
                            <td className="px-4 py-3">
                            <span
                                className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                                item.status
                                )}`}
                            >
                                {getStatusText(item.status)}
                            </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                            {new Date(item.submittedAt).toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US")}
                            </td>
                            <td className="px-4 py-3">
                            <button
                                onClick={() => handleDownload(item.id, item.type)}
                                className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-white transition hover:bg-primary-dark dark:bg-primary-light"
                            >
                                {item.type === "FILE"
                                ? locale === "ar"
                                    ? "تحميل"
                                    : "Download"
                                : locale === "ar"
                                ? "فتح"
                                : "Open"}
                            </button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
              </div>
            )}
    
            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="border-t border-slate-200 px-4 py-3 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-gray-600 dark:text-slate-300 dark:hover:bg-gray-700"
                  >
                    {locale === "ar" ? "السابق" : "Previous"}
                  </button>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {locale === "ar" ? "صفحة" : "Page"} {page} {locale === "ar" ? "من" : "of"}{" "}
                    {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-gray-600 dark:text-slate-300 dark:hover:bg-gray-700"
                  >
                    {locale === "ar" ? "التالي" : "Next"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
    );
}