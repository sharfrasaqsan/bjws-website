"use client";

import * as React from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";

interface LanguageSwitcherProps {
  className?: string;
  variant?: "select" | "pills" | "topbar";
}

const languages: { code: Locale; label: string; nativeName: string }[] = [
  { code: "ta", label: "Tamil", nativeName: "தமிழ்" },
  { code: "en", label: "English", nativeName: "English" },
  { code: "si", label: "Sinhala", nativeName: "සිංහල" },
];

export function LanguageSwitcher({
  className,
  variant = "select",
}: LanguageSwitcherProps) {
  const currentLocale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  const handleLocaleChange = (newLocale: Locale) => {
    if (newLocale === currentLocale) return;

    startTransition(() => {
      // Preserves current path and search params
      router.replace(pathname, { locale: newLocale });
    });
  };

  if (variant === "topbar") {
    return (
      <div
        role="group"
        aria-label="Language selector"
        className={cn("inline-flex items-center gap-2 text-xs", className)}
      >
        <div className="flex items-center gap-1.5 text-emerald-200/80">
          <Globe className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span className="sr-only">Select Language:</span>
        </div>
        <div className="flex items-center rounded-sm bg-black/25 p-0.5 border border-emerald-800/40 text-xs">
          {languages.map((lang) => {
            const isActive = currentLocale === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                disabled={isPending}
                onClick={() => handleLocaleChange(lang.code)}
                aria-pressed={isActive}
                className={cn(
                  "px-2 py-0.5 rounded-xs transition-all font-medium text-[11px] sm:text-xs",
                  "focus-visible:ring-1 focus-visible:ring-amber-300 focus-visible:outline-none",
                  isActive
                    ? "bg-[#124d34] text-white font-semibold shadow-2xs"
                    : "text-emerald-100/75 hover:text-white hover:bg-white/10"
                )}
              >
                {lang.nativeName}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (variant === "pills") {
    return (
      <div
        role="group"
        aria-label="Language selector"
        className={cn(
          "border-border bg-surface inline-flex items-center rounded-lg border p-1 shadow-2xs",
          className
        )}
      >
        {languages.map((lang) => {
          const isActive = currentLocale === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              disabled={isPending}
              onClick={() => handleLocaleChange(lang.code)}
              aria-pressed={isActive}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium transition-colors sm:text-sm",
                "focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none",
                isActive
                  ? "bg-primary text-primary-foreground font-semibold shadow-2xs"
                  : "text-text-muted hover:text-text hover:bg-muted"
              )}
            >
              {lang.nativeName}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn("relative inline-block", className)}>
      <label htmlFor="language-select" className="sr-only">
        Select Language
      </label>
      <div className="relative">
        <select
          id="language-select"
          disabled={isPending}
          value={currentLocale}
          onChange={(e) => handleLocaleChange(e.target.value as Locale)}
          className={cn(
            "border-border bg-surface text-text h-9 cursor-pointer appearance-none rounded-md border py-1 pr-7 pl-8 text-xs font-medium shadow-2xs sm:text-sm",
            "hover:border-border-hover focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none",
            "disabled:opacity-50"
          )}
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.nativeName} ({lang.code.toUpperCase()})
            </option>
          ))}
        </select>
        {/* Globe icon */}
        <span
          className="text-text-muted pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2"
          aria-hidden="true"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-.778.099-1.533.284-2.253"
            />
          </svg>
        </span>
        {/* Chevron icon */}
        <span
          className="text-text-muted pointer-events-none absolute top-1/2 right-2 -translate-y-1/2"
          aria-hidden="true"
        >
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </div>
    </div>
  );
}
