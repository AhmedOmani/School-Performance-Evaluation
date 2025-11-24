import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { Providers } from "@/components/providers/session-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { TranslationProvider } from "@/components/providers/translation-provider";
import { defaultLocale, type Locale } from "@/lib/i18n/config";
import { getServerTranslation } from "@/lib/i18n/server";
import { resolveLocale } from "@/lib/i18n/utils"
import "../globals.css";

type LocaleLayoutProps = {
    children: ReactNode;
    params: Promise<{ locale?: string }>;
};

export async function generateStaticParams() {
    return [{ locale: "end" }, { locale: "ar" }];
};

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
    const { locale: rawLocale } = await params;
    let locale: Locale = defaultLocale;

    try {
        locale = resolveLocale(rawLocale);
    } catch {
        return notFound();
    }

    const { resources } = await getServerTranslation(locale, "common");
    const dir = locale === "ar" ? "rtl" : "ltr";

    return (
        <html lang={locale} dir={dir} suppressHydrationWarning>
            <body className="relative min-h-screen bg-background font-sans antialiased overflow-x-hidden">
                <Providers>
                    <TranslationProvider locale={locale} resources={resources}>
                        <ThemeProvider>
                            {/* Background Orbs */}
                            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
                                <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] rounded-full bg-accent/5 blur-[120px]" />
                                <div className="absolute bottom-[-10%] left-[20%] w-[35%] h-[35%] rounded-full bg-blue-400/5 blur-[120px]" />
                            </div>
                            {children}
                        </ThemeProvider>
                    </TranslationProvider>
                </Providers>
            </body>
        </html>
    );
}