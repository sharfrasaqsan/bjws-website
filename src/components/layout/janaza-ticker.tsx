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
  Clock,
  AlertCircle,
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
            {/* Backdrop with deep blur */}
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
              onClick={() => setActiveModalNotice(null)}
              aria-hidden="true"
            />

            {/* Centered Modal Container */}
            <div className="animate-in zoom-in-95 relative z-10 my-auto w-full max-w-xl transform overflow-hidden rounded-3xl border border-stone-200/90 bg-white text-stone-900 shadow-2xl duration-200 dark:border-emerald-950/80 dark:bg-[#0c1811] dark:text-stone-100">
              {/* Luminous Top Gold Accent Bar */}
              <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500" />

              {/* Modal Hero Header with Islamic Accent & Badges */}
              <div className="relative overflow-hidden bg-gradient-to-br from-[#021a10] via-[#093522] to-[#041a10] p-6 text-white sm:p-7">
                {/* Background Lattice */}
                <IslamicPattern
                  opacity={0.06}
                  className="pointer-events-none text-amber-400"
                />

                <div className="relative z-10">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold tracking-wider uppercase shadow-xs ${
                          activeModalNotice.title
                            .toLowerCase()
                            .includes("janaza") ||
                          activeModalNotice.title.includes("ஜனாஸா") ||
                          activeModalNotice.title.includes("ජනාසා") ||
                          activeModalNotice.body
                            .toLowerCase()
                            .includes("janaza") ||
                          activeModalNotice.body.includes("ஜனாஸா")
                            ? "bg-red-500/25 text-red-200 ring-1 ring-red-400/40"
                            : "bg-amber-400/25 text-amber-200 ring-1 ring-amber-300/40"
                        }`}
                      >
                        {activeModalNotice.title
                          .toLowerCase()
                          .includes("janaza") ||
                        activeModalNotice.title.includes("ஜனாஸா") ||
                        activeModalNotice.title.includes("ජනාසා") ||
                        activeModalNotice.body
                          .toLowerCase()
                          .includes("janaza") ||
                        activeModalNotice.body.includes("ஜனாஸா") ? (
                          <AlertCircle className="h-3.5 w-3.5 text-red-300" />
                        ) : (
                          <Megaphone className="h-3.5 w-3.5 text-amber-300" />
                        )}
                        <span>
                          {activeModalNotice.title
                            .toLowerCase()
                            .includes("janaza") ||
                          activeModalNotice.title.includes("ஜனாஸா") ||
                          activeModalNotice.title.includes("ජනාසා") ||
                          activeModalNotice.body
                            .toLowerCase()
                            .includes("janaza") ||
                          activeModalNotice.body.includes("ஜனாஸா")
                            ? "Janaza Alert"
                            : "Official Society Notice"}
                        </span>
                      </span>

                      <span className="rounded-full bg-white/10 px-2.5 py-0.5 font-mono text-[11px] font-bold text-amber-200 uppercase ring-1 ring-white/15">
                        {activeModalNotice.locale}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveModalNotice(null)}
                      aria-label="Close notice details"
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white/80 transition-all hover:bg-white/20 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Title */}
                  <h3
                    id="notice-modal-title"
                    className="font-display mt-4 text-xl leading-tight font-bold tracking-tight text-white sm:text-2xl"
                  >
                    {activeModalNotice.title}
                  </h3>

                  {/* Date Metadata Badges */}
                  <div className="mt-3.5 flex flex-wrap items-center gap-3 font-mono text-xs text-amber-200/90">
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-white/10 px-2 py-0.5">
                      <Calendar className="h-3.5 w-3.5 text-amber-300" />
                      <span>
                        Published:{" "}
                        {activeModalNotice.published_at
                          ? formatAdminDate(activeModalNotice.published_at)
                          : ""}
                      </span>
                    </span>

                    {activeModalNotice.updated_at &&
                      activeModalNotice.updated_at.slice(0, 10) !==
                        activeModalNotice.published_at.slice(0, 10) && (
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-white/10 px-2 py-0.5 text-amber-100/80">
                          <Clock className="h-3.5 w-3.5 text-amber-300" />
                          <span>
                            Updated:{" "}
                            {formatAdminDate(activeModalNotice.updated_at)}
                          </span>
                        </span>
                      )}
                  </div>
                </div>
              </div>

              {/* Modal Body Scroll Area */}
              <div className="max-h-[55vh] space-y-4 overflow-y-auto p-6 sm:p-7">
                {/* Emergency Funeral Banner if Janaza */}
                {(activeModalNotice.title.toLowerCase().includes("janaza") ||
                  activeModalNotice.title.includes("ஜனாஸா") ||
                  activeModalNotice.title.includes("ජනාසා") ||
                  activeModalNotice.body.toLowerCase().includes("janaza") ||
                  activeModalNotice.body.includes("ஜனாஸா")) && (
                  <div className="flex flex-col gap-3 rounded-2xl border border-red-500/25 bg-gradient-to-r from-red-50 via-amber-50 to-emerald-50/50 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-red-500/30 dark:from-red-950/30 dark:via-amber-950/20 dark:to-emerald-950/20">
                    <div>
                      <p className="text-[11px] font-bold tracking-wider text-red-800 uppercase dark:text-red-300">
                        24/7 Funeral Emergency Hotline
                      </p>
                      <p className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                        Immediate burial coordination across Sri Lanka
                      </p>
                    </div>
                    <a
                      href="tel:+94776227323"
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition hover:bg-red-700"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      <span>+94 77 622 7323</span>
                    </a>
                  </div>
                )}

                {/* Formatted Notice Text */}
                <div className="rounded-2xl border border-stone-200/80 bg-[#faf8f5] p-5 text-sm leading-relaxed whitespace-pre-line text-stone-800 shadow-2xs sm:text-[15px] dark:border-emerald-950/80 dark:bg-[#07170f] dark:text-stone-200">
                  {activeModalNotice.body}
                </div>

                {/* Verified Organization Signoff */}
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-stone-200/80 bg-stone-50 px-4 py-3 text-xs text-stone-600 dark:border-emerald-950 dark:bg-[#041a10] dark:text-stone-400">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="font-semibold text-stone-900 dark:text-stone-200">
                      Buhary Janaza Welfare Society (BJWS)
                    </span>
                    <span className="hidden text-[11px] text-stone-500 sm:inline dark:text-stone-400">
                      • Reg: DS/TH/SS/VSSO/2023/01
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-stone-500 dark:text-stone-400">
                    Mullipothana, Sri Lanka
                  </span>
                </div>
              </div>

              {/* Quick Actions Footer */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-stone-200/80 bg-stone-50 px-6 py-4 dark:border-emerald-950/80 dark:bg-[#06160e]">
                <div className="flex items-center gap-2">
                  <a
                    href={`https://api.whatsapp.com/send?text=${whatsappShareText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#25D366] px-3.5 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-[#20ba59]"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    <span>Share on WhatsApp</span>
                  </a>

                  <a
                    href="tel:+94776227323"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs font-bold text-stone-800 shadow-2xs transition hover:bg-stone-100 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-100"
                  >
                    <Phone className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                    <span>Hotline</span>
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href="/notices"
                    onClick={() => setActiveModalNotice(null)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 underline hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
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
