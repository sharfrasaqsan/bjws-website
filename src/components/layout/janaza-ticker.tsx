"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { IslamicPattern } from "@/components/ui/islamic-pattern";
import { Bell, ArrowRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NoticeItem {
  id: string;
  title: string;
  body: string;
  locale: string;
  published_at: string;
}

interface JanazaTickerProps {
  notices: NoticeItem[];
  className?: string;
}

export function JanazaTicker({ notices, className }: JanazaTickerProps) {
  const t = useTranslations("common");
  const locale = useLocale();
  const [isDismissed, setIsDismissed] = React.useState(false);
  const [activeModalNotice, setActiveModalNotice] =
    React.useState<NoticeItem | null>(null);

  // Filter notices for current locale, fallback to all published if none matching
  const relevantNotices = React.useMemo(() => {
    if (!notices || notices.length === 0) return [];
    const localized = notices.filter((n) => n.locale === locale);
    return localized.length > 0 ? localized : notices;
  }, [notices, locale]);

  // If dismissed or no notices, hide completely
  if (isDismissed || relevantNotices.length === 0) {
    return null;
  }

  const latestNotice = relevantNotices[0];

  return (
    <>
      <div
        role="region"
        aria-label={t("janazaNotice")}
        className={cn(
          "relative overflow-hidden bg-[#0a2719] text-emerald-100 border-b border-emerald-950/70 shadow-2xs",
          "transition-all duration-200",
          className
        )}
      >
        {/* Subtle Islamic lattice background */}
        <IslamicPattern
          opacity={0.04}
          className="text-emerald-300 pointer-events-none"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-[38px] items-center justify-between gap-3 py-1.5 text-xs">
            {/* Left: Live pulsing indicator & Badge */}
            <div className="flex items-center gap-2.5 shrink-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75 motion-reduce:hidden" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
              </span>
              <span className="inline-flex items-center gap-1 rounded bg-[#c99a45] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#072015] shadow-2xs">
                <Bell className="h-3 w-3 shrink-0" aria-hidden="true" />
                <span>{t("janazaNotice")}</span>
              </span>
            </div>

            {/* Center: Title & Excerpt */}
            <div className="flex-1 min-w-0 truncate text-emerald-100/90 font-medium">
              <button
                type="button"
                onClick={() => setActiveModalNotice(latestNotice)}
                className="text-left truncate hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-300 rounded transition-colors"
                title={latestNotice.title}
              >
                <span className="font-semibold text-white">
                  {latestNotice.title}
                </span>
                {latestNotice.body && (
                  <span className="hidden md:inline text-emerald-200/70 ml-2">
                    — {latestNotice.body.slice(0, 90)}
                    {latestNotice.body.length > 90 ? "..." : ""}
                  </span>
                )}
              </button>
            </div>

            {/* Right: Action link & dismiss button */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setActiveModalNotice(latestNotice)}
                className="inline-flex items-center gap-1 font-semibold text-amber-300 hover:text-amber-200 hover:underline transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-300 rounded px-1.5 py-0.5"
              >
                <span>{t("viewNotice")}</span>
                <ArrowRight className="h-3 w-3" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={() => setIsDismissed(true)}
                aria-label="Dismiss notice"
                className="rounded p-1 text-emerald-300/60 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-300"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Accessible Detail Modal if clicked */}
      {activeModalNotice && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="notice-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setActiveModalNotice(null)}
            aria-hidden="true"
          />

          {/* Modal Card */}
          <div className="relative w-full max-w-lg rounded-xl bg-surface border border-border shadow-2xl overflow-hidden p-6 text-foreground z-10 animate-in fade-in-50 zoom-in-95">
            <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-[#124d34]">
                  <Bell className="h-4 w-4" />
                </span>
                <div>
                  <span className="text-[11px] font-bold tracking-wider uppercase text-[#c99a45]">
                    {t("janazaNotice")}
                  </span>
                  <h3
                    id="notice-modal-title"
                    className="text-base sm:text-lg font-bold text-foreground leading-snug"
                  >
                    {activeModalNotice.title}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalNotice(null)}
                aria-label="Close notice details"
                className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="py-4 text-sm text-text-muted leading-relaxed whitespace-pre-wrap">
              {activeModalNotice.body}
            </div>

            <div className="border-t border-border pt-4 flex items-center justify-between text-xs text-text-muted">
              <span>
                {activeModalNotice.published_at
                  ? new Date(activeModalNotice.published_at).toLocaleDateString()
                  : ""}
              </span>
              <button
                type="button"
                onClick={() => setActiveModalNotice(null)}
                className="bg-[#124d34] hover:bg-[#0b2e1e] text-white font-medium px-4 py-1.5 rounded-md text-xs transition-colors shadow-2xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

