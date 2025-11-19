import { notFound, redirect } from "next/navigation";
import { defaultLocale, type Locale } from "@/lib/i18n/config";
import { resolveLocale } from "@/lib/i18n/utils";
import { requireSystemManager } from "@/lib/auth/session";
import { AuthenticatedLayout } from "@/components/layouts/authenticated-layout";
import { EvidenceReviewList } from "@/components/evidence-review-list";

type ReviewPageProps = {
  params: Promise<{ locale?: string }>;
};

export default async function ReviewPage({ params }: ReviewPageProps) {
  const { locale: rawLocale } = await params;
  let locale: Locale = defaultLocale;

  try {
    locale = resolveLocale(rawLocale);
  } catch {
    return notFound();
  }

  let user;
  try {
    user = await requireSystemManager();
  } catch {
    redirect(`/${locale}/login?callbackUrl=/${locale}/review`);
  }

  return (
    <AuthenticatedLayout locale={locale} userName={user.name} userRole={user.role}>
      <EvidenceReviewList locale={locale} />
    </AuthenticatedLayout>
  );
}