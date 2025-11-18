import "server-only";
import { createInstance , type TFunction } from "i18next";
import { initReactI18next } from "react-i18next/initReactI18next";
import { defaultLocale , type Locale , type Namespace } from "@/lib/i18n/config";

type TranslationResources = {
    [locale: string]: {
        [namespace: string]: Record<string, string>;
    };
};

export async function getServerTranslation(locale: Locale = defaultLocale, namespace:Namespace= "common"): Promise<{t: TFunction, resources: TranslationResources}> {
    const resourceModule = await import(
        `../../../public/locales/${locale}/${namespace}.json`
    );
    
    const translations = resourceModule.default || resourceModule;
    
    // Create an i18next instance for server-side use
    const i18nInstance = createInstance();
    await i18nInstance.use(initReactI18next).init({
        lng: locale,
        fallbackLng: defaultLocale,
        ns: [namespace],
        resources: {
            [locale]: {
                [namespace]: translations,
            },
        },
        interpolation: {
            escapeValue: false,
        },
    });

    return {
        t: i18nInstance.getFixedT(locale, namespace),
        resources: {
          [locale]: {
            [namespace]: translations,
          },
        },
    }; 
}