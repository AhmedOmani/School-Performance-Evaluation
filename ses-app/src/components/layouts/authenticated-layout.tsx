"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import NextImage from "next/image";
import {
  LayoutDashboard,
  Upload,
  FolderOpen,
  FileText,
  Users,
  Menu,
  X,
  CheckCircle2
} from "lucide-react";
import { LanguageSwitch } from "@/components/language-switch";
import { ThemeToggle } from "@/components/theme-toggle";
import { LogoutButton } from "@/components/logout-button";
import { useTranslation } from "@/lib/i18n/client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/config";

type AuthenticatedLayoutProps = {
  children: React.ReactNode;
  locale: Locale;
  userName?: string;
  userRole?: string;
};

export function AuthenticatedLayout({ children, locale, userName, userRole }: AuthenticatedLayoutProps) {
  const { t } = useTranslation("common");
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const navItems = [
    {
      href: `/${locale}/dashboard`,
      icon: LayoutDashboard,
      label: t("navigation.dashboard"),
    },
    {
      href: `/${locale}/upload`,
      icon: Upload,
      label: t("navigation.upload"),
    },
    {
      href: `/${locale}/evidence`,
      icon: FolderOpen,
      label: t("navigation.evidence"),
    },
    ...(userRole === "SYSTEM_MANAGER" ? [{
      href: `/${locale}/review`,
      icon: CheckCircle2,
      label: locale === "ar" ? "مراجعة" : "Review",
    }] : []),
    {
      href: `/${locale}/reports`,
      icon: FileText,
      label: t("navigation.reports"),
    },
    {
      href: `/${locale}/users`,
      icon: Users,
      label: t("navigation.users"),
    },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 z-50 w-72 border-r bg-card transition-transform duration-300 ease-in-out lg:translate-x-0",
          locale === "ar" ? "right-0 border-l border-r-0" : "left-0",
          isMobileMenuOpen
            ? "translate-x-0"
            : locale === "ar" ? "translate-x-full" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar Header */}
          <div className="flex h-16 items-center justify-between px-6 border-b">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-1- overflow-hidden rounded-full">
                <NextImage
                  src="/logo.png"
                  alt="School Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-lg font-bold tracking-tight text-primary">
                {locale === "ar" ? "العهد الحديث" : "Modern Era"}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="border-t p-4">
            <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                {userName ? userName.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {userName || "User"}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {userRole === "SYSTEM_MANAGER" ? "Admin" : "User"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={cn(
          "flex-1 transition-all duration-300",
          locale === "ar" ? "lg:mr-72" : "lg:ml-72"
        )}
      >
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold md:text-xl">
              {navItems.find(item => isActive(item.href))?.label || "Dashboard"}
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <ThemeToggle />
            <LanguageSwitch currentLocale={locale} />
            <Separator orientation="vertical" className="h-6 mx-2" />
            <LogoutButton locale={locale} />
          </div>
        </header>

        {/* Page Content */}
        <main className="container mx-auto max-w-7xl p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}