"use client";
import { cn } from "@/lib/utils";

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
  AlertCircle,
  Layers,
  LayoutGrid,
  Flag,
  Calendar,
  User,
  Trash2,
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
  const [deletingId, setDeletingId] = useState<string | null>(null);
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

  const handleDelete = async (evidenceId: string) => {
    if (!confirm(locale === "ar" ? "هل أنت متأكد من حذف هذا الدليل؟" : "Are you sure you want to delete this evidence?")) {
      return;
    }

    setDeletingId(evidenceId);
    try {
      const response = await fetch(`/api/evidence/${evidenceId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete evidence");
      }

      setEvidence((prev) => prev.filter((item) => item.id !== evidenceId));
    } catch (err) {
      alert(err instanceof Error ? err.message : locale === "ar" ? "فشل حذف الدليل" : "Failed to delete evidence");
    } finally {
      setDeletingId(null);
    }
  };

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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          <span className="bg-gradient-to-r from-primary via-blue-600 to-accent bg-clip-text text-transparent animate-gradient bg-300%">
            {t("navigation.evidence")}
          </span>
        </h1>
        <p className="text-lg text-muted-foreground">
          {locale === "ar"
            ? "عرض وإدارة جميع الأدلة المرفوعة"
            : "View and manage all uploaded evidence"}
        </p>
      </div>

      <Card className="border-primary/10 bg-card/50 backdrop-blur-sm shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-medium flex items-center gap-2 text-primary">
            <Search className="h-5 w-5" />
            {locale === "ar" ? "تصفية البحث" : "Filter & Search"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label>{locale === "ar" ? "بحث" : "Search"}</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={locale === "ar" ? "ابحث في العنوان..." : "Search by title..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 border-primary/20 focus-visible:ring-primary/30"
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
                className="border-primary/20 focus-visible:ring-primary/30"
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
                className="border-primary/20 focus-visible:ring-primary/30"
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
        <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive flex items-center gap-2 border border-destructive/20">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}


      {loading ? (
        <div className="flex h-40 items-center justify-center text-muted-foreground border rounded-md bg-card/50 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p>{locale === "ar" ? "جاري التحميل..." : "Loading..."}</p>
          </div>
        </div>
      ) : filteredEvidence.length === 0 ? (
        <div className="flex h-60 flex-col items-center justify-center gap-4 text-muted-foreground border rounded-md bg-card/50 backdrop-blur-sm border-dashed border-primary/20">
          <div className="rounded-full bg-primary/10 p-4">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <p className="text-lg font-medium">{locale === "ar" ? "لا توجد أدلة" : "No evidence found"}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both">
          {filteredEvidence.map((item) => (
            <Card key={item.id} className="group relative overflow-hidden border-primary/10 bg-card transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              {/* Gradient Top Strip */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-blue-500 to-accent opacity-80 group-hover:opacity-100 transition-opacity animate-gradient bg-300%" />

              <CardHeader className="pb-3 pt-6">
                <div className="flex justify-between items-start gap-3 mb-2">
                  <CardTitle className="text-lg font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2" title={item.title}>
                    {item.title}
                  </CardTitle>
                  <Badge variant={getStatusVariant(item.status) as any} className="shrink-0 shadow-sm px-2.5 py-0.5 text-xs font-semibold">
                    {getStatusText(item.status)}
                  </Badge>
                </div>
                {item.description && (
                  <CardDescription className="line-clamp-2 text-sm mt-1" title={item.description}>
                    {item.description}
                  </CardDescription>
                )}
              </CardHeader>

              <CardContent className="space-y-4 pb-4">
                <div className="grid gap-3">
                  {/* Axis */}
                  <div className="flex items-start gap-3 p-2 rounded-lg bg-secondary/30 group-hover:bg-secondary/50 transition-colors">
                    <div className="mt-0.5 p-1.5 rounded-md bg-primary/10 text-primary shrink-0">
                      <Layers className="h-4 w-4" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        {locale === "ar" ? "المحور" : "Axis"}
                      </p>
                      <p className="text-sm font-medium text-foreground leading-tight">
                        {locale === "ar" ? item.domain.axis.nameAr : item.domain.axis.nameEn}
                      </p>
                    </div>
                  </div>

                  {/* Domain */}
                  <div className="flex items-start gap-3 p-2 rounded-lg bg-secondary/30 group-hover:bg-secondary/50 transition-colors">
                    <div className="mt-0.5 p-1.5 rounded-md bg-blue-500/10 text-blue-600 shrink-0">
                      <LayoutGrid className="h-4 w-4" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        {locale === "ar" ? "المجال" : "Domain"}
                      </p>
                      <p className="text-sm font-medium text-foreground leading-tight">
                        {locale === "ar" ? item.domain.nameAr : item.domain.nameEn}
                      </p>
                    </div>
                  </div>

                  {/* Standard */}
                  <div className="flex items-start gap-3 p-2 rounded-lg bg-secondary/30 group-hover:bg-secondary/50 transition-colors">
                    <div className="mt-0.5 p-1.5 rounded-md bg-accent/10 text-accent shrink-0">
                      <Flag className="h-4 w-4" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        {locale === "ar" ? "المعيار" : "Standard"}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono text-[10px] px-1.5 py-0 h-5 border-primary/20 text-primary bg-primary/5">
                          {item.standard.code}
                        </Badge>
                        <p className="text-sm font-medium text-foreground leading-tight line-clamp-1">
                          {locale === "ar" ? item.standard.nameAr : item.standard.nameEn}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-2 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5" title={new Date(item.submittedAt).toLocaleString(locale === "ar" ? "ar-SA" : "en-US")}>
                    <Calendar className="h-3.5 w-3.5 text-primary/60" />
                    <span>
                      {new Date(item.submittedAt).toLocaleDateString(locale === "ar" ? "ar-SA-u-ca-gregory" : "en-US")}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 max-w-[140px]" title={item.submittedBy.name}>
                    <User className="h-3.5 w-3.5 text-primary/60" />
                    <span className="truncate font-medium">
                      {item.submittedBy.name}
                    </span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-0 pb-5 px-5 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(item.id)}
                  className="w-full gap-2 h-10 border-primary/20 hover:bg-gradient-to-r hover:from-primary hover:to-blue-600 hover:text-white hover:border-transparent transition-all duration-300 group/btn shadow-sm"
                >
                  {item.type === "FILE" ? (
                    <Download className="h-4 w-4 group-hover/btn:animate-bounce" />
                  ) : (
                    <ExternalLink className="h-4 w-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                  )}
                  <span className="font-semibold">
                    {item.type === "FILE"
                      ? locale === "ar" ? "تحميل الملف" : "Download File"
                      : locale === "ar" ? "فتح الرابط" : "Open Link"}
                  </span>
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(item.id)}
                  disabled={deletingId === item.id}
                  className="gap-2 h-10 shadow-sm hover:bg-red-600 transition-colors"
                >
                  {deletingId === item.id ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  <span className="font-semibold hidden sm:inline">
                    {locale === "ar" ? "حذف" : "Delete"}
                  </span>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between p-4 border-t bg-card/50 backdrop-blur-sm rounded-md border border-primary/10">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="gap-1 hover:bg-primary/5 hover:text-primary hover:border-primary/30"
          >
            <ChevronLeft className="h-4 w-4" />
            {locale === "ar" ? "السابق" : "Previous"}
          </Button>
          <span className="text-sm font-medium text-foreground">
            {locale === "ar" ? "صفحة" : "Page"} <span className="text-primary">{page}</span> {locale === "ar" ? "من" : "of"} {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="gap-1 hover:bg-primary/5 hover:text-primary hover:border-primary/30"
          >
            {locale === "ar" ? "التالي" : "Next"}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}