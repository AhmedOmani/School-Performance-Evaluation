import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { Providers }  from "@/components/providers/session-provider";
import {ThemeProvider} from "@/components/providers/theme-provider";
import { TranslationProvider}  from "@/components/providers/translation-provider";
import { defaultLocale , type Locale } from "@/lib/i18n/config";
import { getServerTranslation } from "@/lib/i18n/server";
import { resolveLocale } from "@/lib/i18n/utils"
import "../globals.css";

type LocaleLayoutProps = {
    children: ReactNode;
    params: Promise<{ locale?: string }>;
};

export async function generateStaticParams() {
    return [{locale:"end"} , {locale:  "ar"}];
};

export default async function LocaleLayout({children , params}: LocaleLayoutProps) {
    const { locale: rawLocale} = await params;
    let locale: Locale = defaultLocale;

    try {
        locale = resolveLocale(rawLocale);
    } catch {
        return notFound();
    }
    
    const {t, resources} = await getServerTranslation(locale , "common");
    const dir = locale === "ar" ? "rtl" : "ltr";

    return (
        <html lang={locale} dir={dir} suppressHydrationWarning>
            <body>
                <Providers>
                    <TranslationProvider locale={locale} resources={resources}>
                        <ThemeProvider>{children}</ThemeProvider>
                    </TranslationProvider>
                </Providers>
            </body>
        </html>
    );
}