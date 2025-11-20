"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "@/lib/i18n/client";
import {
  Search,

  Download,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  FileText,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import type { Locale } from "@/lib/i18n/config";

type Axis = {
  id: string;
  nameEn: string;
  nameAr: string;
}

type Domain = {
  id: string;
  nameEn: string;
  nameAr: string;
  axis: Axis;
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
        setError(error instanceof Error ? error.message : locale === "ar" ? "فشل تحميل الأدلة" : "Failed to load evidence");
      } finally {
        setLoading(false);
      }
    };
    fetchEvidence();
  }, [statusFilter, domainFilter, page, locale]);

  //Handle download/view
  const handleDownload = async (evidenceId: string) => {
    try {
      const response = await fetch(`/api/evidence/${evidenceId}/download`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get download URL");
      }
      window.open(data.downloadUrl, "_blank");
    } catch (err) {
      alert(err instanceof Error ? err.message : locale === "ar" ? "فشل فتح الملف" : "Failed to open file");
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

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "APPROVED": return "success";
      case "REJECTED": return "destructive";
      case "UNDER_REVIEW": return "warning";
      default: return "secondary";
    }
  };

  const getStatusText = (status: string) => {
    if (locale === "ar") {
      switch (status) {
        case "APPROVED": return "معتمد";
        case "REJECTED": return "مرفوض";
        case "UNDER_REVIEW": return "قيد المراجعة";
        default: return status;
      }
    } else {
      switch (status) {
        case "APPROVED": return "Approved";
        case "REJECTED": return "Rejected";
        case "UNDER_REVIEW": return "Under Review";
        default: return status;
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{t("navigation.evidence")}</h1>
        <p className="text-muted-foreground">
          {locale === "ar"
            ? "عرض وإدارة جميع الأدلة المرفوعة"
            : "View and manage all uploaded evidence"}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">
            {locale === "ar" ? "تصفية البحث" : "Filter & Search"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>{locale === "ar" ? "بحث" : "Search"}</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={locale === "ar" ? "ابحث في العنوان..." : "Search by title..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>{locale === "ar" ? "الحالة" : "Status"}</Label>
              <Select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">{locale === "ar" ? "جميع الحالات" : "All Statuses"}</option>
                <option value="UNDER_REVIEW">{locale === "ar" ? "قيد المراجعة" : "Under Review"}</option>
                <option value="APPROVED">{locale === "ar" ? "معتمد" : "Approved"}</option>
                <option value="REJECTED">{locale === "ar" ? "مرفوض" : "Rejected"}</option>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{locale === "ar" ? "المجال" : "Domain"}</Label>
              <Select
                value={domainFilter}
                onChange={(e) => {
                  setDomainFitler(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">{locale === "ar" ? "جميع المجالات" : "All Domains"}</option>
                {domains.map((domain) => (
                  <option key={domain.id} value={domain.id}>
                    {locale === "ar" ? domain.nameAr : domain.nameEn}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}


      {loading ? (
        <div className="flex h-40 items-center justify-center text-muted-foreground border rounded-md bg-card">
          {locale === "ar" ? "جاري التحميل..." : "Loading..."}
        </div>
      ) : filteredEvidence.length === 0 ? (
        <div className="flex h-40 flex-col items-center justify-center gap-2 text-muted-foreground border rounded-md bg-card">
          <FileText className="h-8 w-8 opacity-50" />
          <p>{locale === "ar" ? "لا توجد أدلة" : "No evidence found"}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvidence.map((item) => (
            <Card key={item.id} className="flex flex-col h-full hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start gap-2 mb-2">
                  <CardTitle className="text-lg font-semibold line-clamp-1" title={item.title}>
                    {item.title}
                  </CardTitle>
                  <Badge variant={getStatusVariant(item.status)} className="shrink-0">
                    {getStatusText(item.status)}
                  </Badge>
                </div>
                {item.description && (
                  <CardDescription className="line-clamp-2" title={item.description}>
                    {item.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="flex-1 space-y-4">

                <div className="space-y-1">
                  <div className="text-xs font-medium text-muted-foreground">
                    {locale === "ar" ? "المحور" : "Axis"}
                  </div>
                  <div className="text-sm font-medium">
                    {locale === "ar" ? item.domain.axis.nameAr : item.domain.axis.nameEn}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-medium text-muted-foreground">
                    {locale === "ar" ? "المجال" : "Domain"}
                  </div>
                  <div className="text-sm font-medium">
                    {locale === "ar" ? item.domain.nameAr : item.domain.nameEn}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-medium text-muted-foreground">
                    {locale === "ar" ? "المعيار" : "Standard"}
                  </div>
                  <div className="text-sm">
                    <span className="inline-block bg-muted px-1.5 py-0.5 rounded text-xs font-mono mr-2">
                      {item.standard.code}
                    </span>
                    {locale === "ar" ? item.standard.nameAr : item.standard.nameEn}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {new Date(item.submittedAt).toLocaleDateString(locale === "ar" ? "ar-SA-u-ca-gregory" : "en-US")}
                  </span>
                  <span className="font-medium truncate max-w-[120px]" title={item.submittedBy.name}>
                    {item.submittedBy.name}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(item.id)}
                  className="w-full gap-2"
                >
                  {item.type === "FILE" ? <Download className="h-4 w-4" /> : <ExternalLink className="h-4 w-4" />}
                  {item.type === "FILE"
                    ? locale === "ar" ? "تحميل الملف" : "Download File"
                    : locale === "ar" ? "فتح الرابط" : "Open Link"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between p-4 border-t bg-card rounded-md border">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            {locale === "ar" ? "السابق" : "Previous"}
          </Button>
          <span className="text-sm text-muted-foreground">
            {locale === "ar" ? "صفحة" : "Page"} {page} {locale === "ar" ? "من" : "of"} {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="gap-1"
          >
            {locale === "ar" ? "التالي" : "Next"}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}