"use client";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";

type LogoutButtonProps = {
    locale: Locale;
};

export function LogoutButton({ locale }: LogoutButtonProps) {
    const router = useRouter();

    const handleLogout = async () => {
        await signOut({ redirect: false });
        router.push(`/${locale}`);
        router.refresh();
    };
    
    return (
        <button onClick={handleLogout} className="rounded-md border border-red-300 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20">
            {locale === "ar" ? "تسجيل الخروج" : "Logout"}
        </button>
    );
}