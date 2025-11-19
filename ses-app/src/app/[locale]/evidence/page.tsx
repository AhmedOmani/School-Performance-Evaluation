import { notFound, redirect } from "next/navigation";
import { defaultLocale, type Locale } from "@/lib/i18n/config";
import { resolveLocale } from "@/lib/i18n/utils";
import { requireAuth } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { AuthenticatedLayout } from "@/components/layouts/authenticated-layout";
import { EvidenceList } from "@/components/evidence-list";

type EvidencePageProps = {
  params: Promise<{ locale?: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function EvidencePage({params,searchParams}: EvidencePageProps) {
    const { locale: rawLocale } = await params;
    let locale: Locale = defaultLocale;

    try {
        locale = resolveLocale(rawLocale);
    } catch {
        return notFound();
    }

    let user;
    try {
        user = await requireAuth();
    } catch {
        redirect(`/${locale}/login?callbackUrl=/${locale}/evidence`);
    }

    const domains = await prisma.domain.findMany({
        select: {
            id: true,
            nameEn: true,
            nameAr: true,
        },
        orderBy: {
            nameEn: "asc",
        },
    });

    return (
        <AuthenticatedLayout locale={locale} userName={user.name}>
            <EvidenceList locale={locale} domains={domains} />
        </AuthenticatedLayout>
    );
}