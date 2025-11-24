import { notFound, redirect } from "next/navigation";
import { defaultLocale, type Locale } from "@/lib/i18n/config";
import { resolveLocale } from "@/lib/i18n/utils";
import { requireAuth } from "@/lib/auth/session";
import { AuthenticatedLayout } from "@/components/layouts/authenticated-layout";
import { ReportsContent } from "@/components/reports/reports-content";

type ReportsPageProps = {
    params: Promise<{ locale?: string }>;
};

export default async function ReportsPage({ params }: ReportsPageProps) {
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
        redirect(`/${locale}/login?callbackUrl=/${locale}/reports`);
    }

    return (
        <AuthenticatedLayout locale={locale} userName={user.name} userRole={user.role}>
            <ReportsContent locale={locale} />
        </AuthenticatedLayout>
    );
}
