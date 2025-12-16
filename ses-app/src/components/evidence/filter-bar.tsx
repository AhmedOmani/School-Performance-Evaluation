"use client";

import { Input, Label, Select, Card, CardContent } from "@/components/ui";
import type { Locale } from "@/lib/i18n/config";

type Domain = {
  id: string;
  nameEn: string;
  nameAr: string;
};

type FilterBarProps = {
  locale: Locale;
  domains: Domain[];
  searchQuery: string;
  statusFilter: string;
  domainFilter: string;
  onSearchChange: (query: string) => void;
  onStatusChange: (status: string) => void;
  onDomainChange: (domainId: string) => void;
};

export function FilterBar({
  locale,
  domains,
  searchQuery,
  statusFilter,
  domainFilter,
  onSearchChange,
  onStatusChange,
  onDomainChange,
}: FilterBarProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid gap-4 sm:grid-cols-3">
          {/* Search */}
          <div>
            <Label className="mb-2 block">
              {locale === "ar" ? "بحث" : "Search"}
            </Label>
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={
                locale === "ar"
                  ? "ابحث في العنوان أو الوصف..."
                  : "Search by title or description..."
              }
            />
          </div>

          {/* Status Filter */}
          <div>
            <Label className="mb-2 block">
              {locale === "ar" ? "الحالة" : "Status"}
            </Label>
            <Select
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value)}
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
            </Select>
          </div>

          {/* Domain Filter */}
          <div>
            <Label className="mb-2 block">
              {locale === "ar" ? "المجال" : "Domain"}
            </Label>
            <Select
              value={domainFilter}
              onChange={(e) => onDomainChange(e.target.value)}
            >
              <option value="">
                {locale === "ar" ? "جميع المجالات" : "All Domains"}
              </option>
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
  );
}

