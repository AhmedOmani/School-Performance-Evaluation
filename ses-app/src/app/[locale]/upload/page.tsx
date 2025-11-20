import { notFound, redirect } from "next/navigation";
import { defaultLocale, type Locale } from "@/lib/i18n/config";
import { resolveLocale } from "@/lib/i18n/utils";
import { requireAuth } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { AuthenticatedLayout } from "@/components/layouts/authenticated-layout";
import { UploadEvidenceForm } from "@/components/upload-evidence-form";

type UploadPageProps = {
    params: Promise<{ locale?: string }>;
}

export default async function UploadPage({ params }: UploadPageProps) {
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
        redirect(`/${locale}/login?callbackUrl=/${locale}/upload`);
    }

    const axes = await prisma.axis.findMany({
        orderBy: {
            nameEn: "asc"
        },
    });

    return (
        <AuthenticatedLayout locale={locale} userName={user.name} userRole={user.role}>
            <UploadEvidenceForm locale={locale} axes={axes} />
        </AuthenticatedLayout>
    )
}
