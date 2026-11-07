"use client";

import * as React from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { Globe, Loader2 } from "lucide-react";

interface LanguageSwitcherProps {
  className?: string;
  variant?: "select" | "pills" | "topbar";
}

const languages: { code: Locale; label: string; nativeName: string }[] = [
  { code: "en", label: "English", nativeName: "English" },
  { code: "ta", label: "Tamil", nativeName: "தமிழ்" },
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
  const [pendingLocale, setPendingLocale] = React.useState<Locale | null>(null);

  // Derive active transition state without triggering cascading renders in effects
  const isSwitching = isPending && pendingLocale !== null && pendingLocale !== currentLocale;
  const activePendingLocale = isSwitching ? pendingLocale : null;

  // Aggressively prefetch other locales on idle so language switching is near-instant
  React.useEffect(() => {
    languages.forEach((lang) => {
      if (lang.code !== currentLocale) {
        try {
          router.prefetch(pathname, { locale: lang.code });
        } catch {
          // Ignore prefetch failures in development/unsupported environments
        }
      }
    });
  }, [currentLocale, pathname, router]);

  const handleLocaleChange = (newLocale: Locale) => {
    if (newLocale === currentLocale || isSwitching) return;

    setPendingLocale(newLocale);
    startTransition(() => {
      // Preserves current path and search params with seamless replacement
      router.replace(pathname, { locale: newLocale });
    });
  };

  const handleMouseEnter = (langCode: Locale) => {
    if (langCode !== currentLocale) {
      try {
        router.prefetch(pathname, { locale: langCode });
      } catch {
        // no-op
      }
    }
  };

  const switchingText =
    activePendingLocale === "ta"
      ? "மாற்றப்படுகிறது..."
      : activePendingLocale === "si"
      ? "මාරු වෙමින් පවතී..."
      : "Switching...";

  return (
    <>
      {/* Top screen visual progress bar when transition is active */}
      {isSwitching && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none"
        >
          <div className="h-1 bg-gradient-to-r from-[#c99a45] via-emerald-400 to-[#c99a45] animate-pulse shadow-md" />
        </div>
      )}

      {variant === "topbar" && (
        <div
          role="group"
          aria-label="Language selector"
          className={cn("inline-flex items-center gap-1 sm:gap-2 text-xs", className)}
        >
          <div className="flex items-center gap-1.5 text-emerald-200/80">
            {isSwitching ? (
              <Loader2
                className="h-3.5 w-3.5 shrink-0 animate-spin text-[#d4af37]"
                aria-hidden="true"
              />
            ) : (
              <Globe className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            )}
            <span className="sr-only">Select Language:</span>
          </div>

          <div className="flex items-center rounded-sm bg-black/25 p-0.5 border border-emerald-800/40 text-xs">
            {languages.map((lang) => {
              const isActive = currentLocale === lang.code;
              const isTarget = isSwitching && activePendingLocale === lang.code;

              return (
                <button
                  key={lang.code}
                  type="button"
                  disabled={isSwitching}
                  onClick={() => handleLocaleChange(lang.code)}
                  onMouseEnter={() => handleMouseEnter(lang.code)}
                  onFocus={() => handleMouseEnter(lang.code)}
                  aria-pressed={isActive}
                  aria-busy={isTarget}
                  className={cn(
                    "relative px-1.5 sm:px-2 py-0.5 rounded-xs transition-all font-medium text-[10px] sm:text-xs inline-flex items-center gap-1",
                    "focus-visible:ring-1 focus-visible:ring-amber-300 focus-visible:outline-none cursor-pointer",
                    isActive
                      ? "bg-[#124d34] text-white font-semibold shadow-2xs"
                      : isTarget
                      ? "bg-[#124d34]/90 text-amber-200 ring-1 ring-amber-400/60 font-semibold"
                      : "text-emerald-100/75 hover:text-white hover:bg-white/10",
                    isSwitching && !isTarget && !isActive && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {isTarget && (
                    <Loader2 className="h-2.5 w-2.5 animate-spin text-[#d4af37] shrink-0" />
                  )}
                  <span className="sm:hidden">{lang.code.toUpperCase()}</span>
                  <span className="hidden sm:inline">{lang.nativeName}</span>
                </button>
              );
            })}
          </div>

          {/* Quick confirmation text */}
          {isSwitching && (
            <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-semibold text-[#d4af37] animate-pulse">
              <span>{switchingText}</span>
            </span>
          )}
        </div>
      )}

      {variant === "pills" && (
        <div className="space-y-1.5 w-full">
          <div
            role="group"
            aria-label="Language selector"
            className={cn(
              "border-border bg-surface grid grid-cols-3 gap-1 rounded-lg border p-1 shadow-2xs w-full",
              className
            )}
          >
            {languages.map((lang) => {
              const isActive = currentLocale === lang.code;
              const isTarget = isSwitching && activePendingLocale === lang.code;

              return (
                <button
                  key={lang.code}
                  type="button"
                  disabled={isSwitching}
                  onClick={() => handleLocaleChange(lang.code)}
                  onMouseEnter={() => handleMouseEnter(lang.code)}
                  onFocus={() => handleMouseEnter(lang.code)}
                  aria-pressed={isActive}
                  aria-busy={isTarget}
                  className={cn(
                    "rounded-md px-1 py-1.5 text-center text-xs font-medium transition-colors sm:text-sm inline-flex items-center justify-center gap-1.5 cursor-pointer",
                    "focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none",
                    isActive
                      ? "bg-primary text-primary-foreground font-semibold shadow-2xs"
                      : isTarget
                      ? "bg-primary/80 text-primary-foreground ring-1 ring-[#c99a45] font-semibold"
                      : "text-text-muted hover:text-text hover:bg-muted",
                    isSwitching && !isTarget && !isActive && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {isTarget && (
                    <Loader2 className="h-3 w-3 animate-spin text-amber-200 shrink-0" />
                  )}
                  <span>{lang.nativeName}</span>
                </button>
              );
            })}
          </div>

          {isSwitching && (
            <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-primary animate-pulse py-0.5">
              <Loader2 className="h-3 w-3 animate-spin text-[#c99a45]" />
              <span>{switchingText}</span>
            </div>
          )}
        </div>
      )}

      {variant === "select" && (
        <div className={cn("relative inline-block", className)}>
          <label htmlFor="language-select" className="sr-only">
            Select Language
          </label>
          <div className="relative">
            <select
              id="language-select"
              disabled={isSwitching}
              value={isSwitching && activePendingLocale ? activePendingLocale : currentLocale}
              onChange={(e) => handleLocaleChange(e.target.value as Locale)}
              className={cn(
                "border-border bg-surface text-text h-9 cursor-pointer appearance-none rounded-md border py-1 pr-7 pl-8 text-xs font-medium shadow-2xs sm:text-sm",
                "hover:border-border-hover focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none",
                "disabled:opacity-75"
              )}
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.nativeName} ({lang.code.toUpperCase()})
                </option>
              ))}
            </select>
            {/* Globe or Spinner icon */}
            <span
              className="text-text-muted pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2"
              aria-hidden="true"
            >
              {isSwitching ? (
                <Loader2 className="h-4 w-4 animate-spin text-[#c99a45]" />
              ) : (
                <Globe className="h-4 w-4" />
              )}
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
      )}
    </>
  );
}
