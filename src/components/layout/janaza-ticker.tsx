"use client";

import * as React from "react";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useTranslations, useLocale } from "next-intl";
import { IslamicPattern } from "@/components/ui/islamic-pattern";
import { formatAdminDate } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import {
  Bell,
  Megaphone,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  X,
  Calendar,
  Phone,
  MessageCircle,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";

export interface NoticeItem {
  id: string;
  title: string;
  body: string;
  locale: string;
  published_at: string;
  updated_at?: string;
  show_on_homepage?: boolean;
}

interface JanazaTickerProps {
  notices?: NoticeItem[];
  className?: string;
}

export function JanazaTicker({ notices = [], className }: JanazaTickerProps) {
  const t = useTranslations("common");
  const locale = useLocale();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [activeModalNotice, setActiveModalNotice] = useState<NoticeItem | null>(
    null
  );

  // Lock body scroll and close on Escape key when modal is open
  useEffect(() => {
    if (!activeModalNotice) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveModalNotice(null);
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeModalNotice]);

  // Filter notices for active locale; if no exact match for this locale, use all received notices
  const activeNotices: NoticeItem[] = useMemo(() => {
    if (!notices || notices.length === 0) return [];
    const localized = notices.filter((n) => n.locale === locale);
    if (localized.length > 0) return localized;
    return notices;
  }, [notices, locale]);

  const totalNotices = activeNotices.length;

  // Auto-advance notice every 7 seconds when not paused
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalNotices);
  }, [totalNotices]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalNotices) % totalNotices);
  }, [totalNotices]);

  useEffect(() => {
    if (totalNotices <= 1 || isPaused || isDismissed) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      handleNext();
    }, 7000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [totalNotices, isPaused, isDismissed, handleNext]);

  if (totalNotices === 0) {
    return null;
  }

  // If dismissed, show a prominent, luminous gold re-open pill so users don't miss official notices
  if (isDismissed) {
    return (
      <div className="relative z-30 border-b border-amber-400/40 bg-gradient-to-r from-[#031c12] via-[#093522] to-[#031c12] px-4 py-1.5 text-center shadow-xs">
        <button
          type="button"
          onClick={() => setIsDismissed(false)}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-amber-400/50 bg-amber-400/10 px-3.5 py-0.5 text-xs font-bold text-amber-300 transition-all hover:bg-amber-400 hover:text-stone-950 hover:shadow-xs"
        >
          <Bell className="h-3.5 w-3.5 animate-bounce text-amber-400" />
          <span>
            {t("janazaNotice")} ({totalNotices})
          </span>
          <span className="py-0.2 rounded bg-amber-400 px-1.5 text-[10px] font-extrabold text-stone-950 uppercase">
            Show
          </span>
        </button>
      </div>
    );
  }

  // Safe index within bounds
  const safeIndex = currentIndex >= totalNotices ? 0 : currentIndex;
  const currentNotice = activeNotices[safeIndex] || activeNotices[0];

  // Detect if current notice is an urgent Janaza funeral notice
  const isJanazaUrgent =
    currentNotice.title.toLowerCase().includes("janaza") ||
    currentNotice.title.includes("ஜனாஸா") ||
    currentNotice.title.includes("ජනාසා") ||
    currentNotice.body.toLowerCase().includes("janaza") ||
    currentNotice.body.includes("ஜனாஸா");

  const formattedDate = currentNotice.published_at
    ? formatAdminDate(currentNotice.published_at)
    : "";

  const whatsappShareText = encodeURIComponent(
    `*${currentNotice.title}*\n\n${currentNotice.body}\n\n— *Buhary Janaza Welfare Society (BJWS)*\nhttps://bjws.org/${locale}/notices`
  );

  return (
    <>
      <div
        role="region"
        aria-label={t("janazaNotice")}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className={`relative z-30 border-y-2 border-amber-400/80 bg-gradient-to-r from-[#031910] via-[#0b3823] to-[#031910] text-[#fbfaf6] shadow-[0_4px_22px_rgba(245,158,11,0.22)] transition-all ${
          className || ""
        }`}
      >
        {/* Subtle Islamic Lattice Background Texture */}
        <IslamicPattern
          opacity={0.045}
          className="pointer-events-none text-amber-400"
        />

        {/* Ambient Top Glow Line */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-amber-300 to-transparent opacity-80" />

        <div className="relative mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <div className="flex min-h-[46px] items-center justify-between gap-2.5 py-1.5 text-xs sm:min-h-[48px] sm:gap-4 sm:py-2">
            {/* Left: Glowing Beacon & Vibrant Institutional Badge */}
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <span className="relative flex h-3 w-3 sm:h-3.5 sm:w-3.5">
                <span
                  className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 motion-reduce:hidden ${
                    isJanazaUrgent ? "bg-red-400" : "bg-amber-400"
                  }`}
                />
                <span
                  className={`relative inline-flex h-3 w-3 rounded-full shadow-sm sm:h-3.5 sm:w-3.5 ${
                    isJanazaUrgent
                      ? "bg-red-500 ring-2 ring-red-300"
                      : "bg-amber-400 ring-2 ring-amber-200"
                  }`}
                />
              </span>

              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-extrabold tracking-wide uppercase shadow-sm sm:px-3 sm:text-xs ${
                  isJanazaUrgent
                    ? "bg-gradient-to-r from-red-600 to-rose-700 text-white ring-1 ring-red-300"
                    : "bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 ring-1 ring-amber-300"
                }`}
              >
                {isJanazaUrgent ? (
                  <Bell className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                ) : (
                  <Megaphone
                    className="h-3.5 w-3.5 shrink-0 text-stone-950"
                    aria-hidden="true"
                  />
                )}
                <span>
                  {isJanazaUrgent ? (
                    <>
                      <span className="sm:hidden">
                        {locale === "ta"
                          ? "ஜனாஸா"
                          : locale === "si"
                            ? "ජනාසා"
                            : "Janaza"}
                      </span>
                      <span className="hidden sm:inline">
                        {locale === "ta"
                          ? "ஜனாஸா அறிவித்தல்"
                          : locale === "si"
                            ? "ජනාසා නිවේදනය"
                            : "Janaza Alert"}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="sm:hidden">
                        {locale === "ta"
                          ? "அறிவித்தல்"
                          : locale === "si"
                            ? "නිවේදනය"
                            : "Notice"}
                      </span>
                      <span className="hidden sm:inline">
                        {t("janazaNotice")}
                      </span>
                    </>
                  )}
                </span>
              </span>
            </div>

            {/* Center: Notice Content with High Contrast Text */}
            <div className="min-w-0 flex-1">
              <button
                type="button"
                onClick={() => setActiveModalNotice(currentNotice)}
                className="group flex w-full cursor-pointer items-center text-left transition-colors focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none"
                title={currentNotice.title}
              >
                <div className="flex min-w-0 flex-1 items-baseline gap-2 truncate">
                  <span className="truncate text-xs font-bold text-white transition group-hover:text-amber-300 sm:text-sm md:text-[15px]">
                    {currentNotice.title}
                  </span>

                  {formattedDate && (
                    <span className="hidden shrink-0 rounded-sm bg-white/10 px-1.5 py-0.5 font-mono text-[11px] text-amber-200 md:inline">
                      {formattedDate}
                    </span>
                  )}

                  {currentNotice.body && (
                    <span className="hidden truncate text-xs text-emerald-100/75 lg:inline">
                      — {currentNotice.body.replace(/\n+/g, " ").slice(0, 90)}
                      ...
                    </span>
                  )}
                </div>
              </button>
            </div>

            {/* Right: Action Button & Controls */}
            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5">
              {/* Carousel Pagination Arrows (if > 1 notice) */}
              {totalNotices > 1 && (
                <div className="flex items-center gap-1 rounded-full border border-white/15 bg-black/20 px-2 py-0.5 text-[11px] text-amber-200">
                  <span className="font-mono text-[11px] font-bold text-amber-400">
                    {currentIndex + 1}/{totalNotices}
                  </span>
                  <div className="flex items-center gap-0.5">
                    <button
                      type="button"
                      onClick={handlePrev}
                      aria-label="Previous Notice"
                      className="cursor-pointer rounded-full p-0.5 text-amber-200 transition hover:bg-white/20 hover:text-white"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      aria-label="Next Notice"
                      className="cursor-pointer rounded-full p-0.5 text-amber-200 transition hover:bg-white/20 hover:text-white"
                    >
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Eye-catching "View Notice" Action Pill Button */}
              <button
                type="button"
                onClick={() => setActiveModalNotice(currentNotice)}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-amber-400 px-3 py-1 text-xs font-extrabold text-stone-950 shadow-md transition-all hover:scale-105 hover:bg-amber-300 focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:outline-none sm:px-3.5"
              >
                <span>{t("viewNotice")}</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>

              {/* Link to all notices */}
              <Link
                href="/notices"
                className="hidden items-center gap-1 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-semibold text-white transition hover:bg-white/20 sm:inline-flex"
                title="View All Notices"
              >
                <span>All</span>
                <ExternalLink className="h-3 w-3" />
              </Link>

              {/* Dismiss Button */}
              <button
                type="button"
                onClick={() => setIsDismissed(true)}
                aria-label="Dismiss notice bar"
                className="cursor-pointer rounded-full p-1 text-stone-300 transition hover:bg-white/15 hover:text-white focus-visible:ring-1 focus-visible:ring-amber-400 focus-visible:outline-none"
                title="Dismiss"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Accessible Detail Modal portaled directly to document.body for true screen centering */}
      {typeof document !== "undefined" &&
        activeModalNotice &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="notice-modal-title"
            className="animate-in fade-in-50 fixed inset-0 z-[100] flex min-h-screen items-center justify-center overflow-y-auto p-4 duration-200 sm:p-6"
          >
            {/* Backdrop with blur */}
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
              onClick={() => setActiveModalNotice(null)}
              aria-hidden="true"
            />

            {/* Centered Modal Container */}
            <div className="animate-in zoom-in-95 relative z-10 my-auto w-full max-w-lg transform overflow-hidden rounded-3xl border border-t-4 border-stone-200/90 border-t-amber-500 bg-white p-6 text-stone-900 shadow-2xl duration-200 sm:p-8 dark:border-emerald-950 dark:border-t-amber-400 dark:bg-[#0f1d16] dark:text-stone-100">
              {/* Modal Header */}
              <div className="flex items-start justify-between gap-4 border-b border-stone-100 pb-4 dark:border-emerald-950">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-800">
                    <Megaphone className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-serif text-[11px] font-bold tracking-wider text-amber-800 uppercase dark:text-amber-300">
                        Official Society Bulletin
                      </span>
                      <span className="rounded bg-stone-100 px-1.5 py-0.5 font-mono text-[10px] text-stone-700 uppercase dark:bg-emerald-950 dark:text-emerald-200">
                        {activeModalNotice.locale}
                      </span>
                    </div>
                    <h3
                      id="notice-modal-title"
                      className="font-display mt-1 text-lg leading-snug font-bold text-stone-900 sm:text-xl dark:text-white"
                    >
                      {activeModalNotice.title}
                    </h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveModalNotice(null)}
                  aria-label="Close notice details"
                  className="cursor-pointer rounded-lg p-1.5 text-stone-500 transition hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-emerald-950 dark:hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="py-5 text-xs leading-relaxed whitespace-pre-wrap text-stone-700 sm:text-sm dark:text-stone-300">
                {activeModalNotice.body}
              </div>

              {/* Verified Organization Signoff & Date */}
              <div className="flex items-center justify-between rounded-xl border border-stone-200/80 bg-stone-50 p-3.5 text-xs text-stone-600 dark:border-emerald-950 dark:bg-[#062115] dark:text-stone-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
                  <span className="font-semibold text-stone-900 dark:text-stone-200">
                    Buhary Janaza Welfare Society
                  </span>
                </div>
                <div className="flex items-center gap-1 font-mono text-[11px]">
                  <Calendar className="h-3.5 w-3.5 text-stone-400" />
                  <span>
                    {activeModalNotice.published_at
                      ? formatAdminDate(activeModalNotice.published_at)
                      : ""}
                  </span>
                </div>
              </div>

              {/* Quick Actions Footer */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-stone-100 pt-4 dark:border-emerald-950">
                <div className="flex items-center gap-2">
                  <a
                    href="tel:+94774835530"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-800 shadow-2xs hover:bg-stone-50 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200 dark:hover:bg-emerald-900/60"
                  >
                    <Phone className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                    <span>077 483 5530</span>
                  </a>

                  <a
                    href={`https://api.whatsapp.com/send?text=${whatsappShareText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200"
                  >
                    <MessageCircle className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>WhatsApp</span>
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href="/notices"
                    onClick={() => setActiveModalNotice(null)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 underline hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
                  >
                    <span>All Notices</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => setActiveModalNotice(null)}
                    className="cursor-pointer rounded-xl bg-[#124d34] px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-[#0b2e1e] dark:bg-emerald-700 dark:hover:bg-emerald-600"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
