"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import type {Locale} from "@/lib/i18n/config";

type LoginFormProps = {
    locale: Locale;
};

export function LoginForm({ locale }: LoginFormProps) {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try { 
            const result = await signIn("credentials" , {
                email, password , redirect: false,
            });

            if (result?.error) {
                setError(locale === "ar" ? "البريد الإلكتروني أو كلمة المرور غير صحيحة" : "Invalid email or password");
                setLoading(false);
                return;
            }

            //Success- redirect to dashboard
            router.push(`/${locale}/dashboard`);
            router.refresh();

        } catch (error) {
            setError(locale === "ar" ? "حدث خطأ أثناء تسجيل الدخول" : "An error occurred during login");
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {error && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                {error}
                </div>
            )}
    
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    {locale === "ar" ? "البريد الإلكتروني" : "Email"}
                </label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@ses.com"
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-slate-100"
                    required
                />
            </div>
    
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    {locale === "ar" ? "كلمة المرور" : "Password"}
                </label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-slate-100"
                    required
                />
            </div>
    
            <button type="submit"  disabled={loading} className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50 dark:bg-primary-light dark:hover:bg-primary">
                {loading ? locale === "ar" ? "جاري تسجيل الدخول..." : "Logging in..." : locale === "ar"? "دخول": "Login"}
            </button>
        </form>
    );
}