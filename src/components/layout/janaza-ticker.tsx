"use client";

import * as React from "react";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useTranslations, useLocale } from "next-intl";
import { IslamicPattern } from "@/components/ui/islamic-pattern";
import { formatAdminDate } from "@/lib/utils";
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
} from "lucide-react";

export interface NoticeItem {
  id: string;
  title: string;
  body: string;
  locale: string;
  published_at: string;
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

  // If dismissed, show a minimal, elegant re-open pill so users don't lose emergency notices
  if (isDismissed) {
    return (
      <div className="relative z-30 border-b border-[#c99a45]/20 bg-[#062115] px-4 py-1 text-center">
        <button
          onClick={() => setIsDismissed(false)}
          className="inline-flex cursor-pointer items-center gap-1.5 text-[11px] font-semibold text-[#c99a45] transition-colors hover:text-[#f5eedf]"
        >
          <Bell className="h-3 w-3 animate-bounce" />
          <span>
            {t("janazaNotice")} ({totalNotices})
          </span>
          <span className="ml-1 underline">Show</span>
        </button>
      </div>
    );
  }

  // Safe index within bounds (avoids redundant setState in effect)
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

  return (
    <>
      <div
        role="region"
        aria-label={t("janazaNotice")}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className={`relative z-30 border-y border-[#c99a45]/30 bg-gradient-to-r from-[#041a10] via-[#092e1e] to-[#041a10] text-[#e8f3ee] shadow-sm transition-all ${
          className || ""
        }`}
      >
        {/* Subtle Islamic Lattice Background */}
        <IslamicPattern
          opacity={0.035}
          className="pointer-events-none text-[#c99a45]"
        />

        <div className="relative mx-auto max-w-7xl px-2.5 sm:px-6 lg:px-8">
          <div className="flex min-h-[40px] items-center justify-between gap-2 py-1 text-xs sm:min-h-[42px] sm:gap-3 sm:py-1.5">
            {/* Left: Pulsing Beacon & Institutional Category Badge */}
            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5">
              <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
                <span
                  className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 motion-reduce:hidden ${
                    isJanazaUrgent ? "bg-amber-400" : "bg-emerald-400"
                  }`}
                />
                <span
                  className={`relative inline-flex h-2 w-2 rounded-full sm:h-2.5 sm:w-2.5 ${
                    isJanazaUrgent ? "bg-[#c99a45]" : "bg-emerald-500"
                  }`}
                />
              </span>

              <span
                className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-serif text-[10px] font-bold tracking-wider uppercase shadow-2xs sm:gap-1.5 sm:px-2.5 ${
                  isJanazaUrgent
                    ? "bg-[#c99a45] text-[#041a10] ring-1 ring-[#c99a45]/40"
                    : "bg-[#14553a] text-white ring-1 ring-[#c99a45]/30"
                }`}
              >
                {isJanazaUrgent ? (
                  <Bell className="h-3 w-3 shrink-0" aria-hidden="true" />
                ) : (
                  <Megaphone
                    className="h-3 w-3 shrink-0 text-[#c99a45]"
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
                            : "Janaza Notice"}
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

            {/* Center: Notice Content with Smooth Fade & Modal Trigger */}
            <div className="min-w-0 flex-1">
              <button
                type="button"
                onClick={() => setActiveModalNotice(currentNotice)}
                className="group flex w-full cursor-pointer items-center text-left transition-colors focus-visible:ring-1 focus-visible:ring-[#c99a45] focus-visible:outline-none"
                title={currentNotice.title}
              >
                <div className="flex min-w-0 flex-1 items-baseline gap-2 truncate">
                  <span className="truncate text-xs font-semibold text-white group-hover:text-[#f5eedf] group-hover:underline sm:text-sm">
                    {currentNotice.title}
                  </span>

                  {formattedDate && (
                    <span className="hidden shrink-0 text-[11px] font-normal text-[#a7c5b6] md:inline">
                      ({formattedDate})
                    </span>
                  )}

                  {currentNotice.body && (
                    <span className="hidden truncate text-[11px] font-normal text-[#d1fae5]/70 lg:inline">
                      — {currentNotice.body.replace(/\n+/g, " ").slice(0, 80)}
                      ...
                    </span>
                  )}
                </div>
              </button>
            </div>

            {/* Right: Controls (Pagination, View Action, Close) */}
            <div className="flex shrink-0 items-center gap-1 sm:gap-2">
              {/* Carousel Pagination Arrows (if > 1 notice) */}
              {totalNotices > 1 && (
                <div className="flex items-center gap-0.5 border-r border-[#1a432f] pr-1 text-[10px] text-[#a7c5b6] sm:gap-1 sm:pr-1.5">
                  <span className="font-mono text-[10px] font-bold text-[#c99a45]">
                    {currentIndex + 1}/{totalNotices}
                  </span>
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={handlePrev}
                      aria-label="Previous Notice"
                      className="cursor-pointer rounded p-0.5 text-[#a7c5b6] transition-colors hover:bg-[#124d34] hover:text-white"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      aria-label="Next Notice"
                      className="cursor-pointer rounded p-0.5 text-[#a7c5b6] transition-colors hover:bg-[#124d34] hover:text-white"
                    >
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* View Full Notice Button */}
              <button
                type="button"
                onClick={() => setActiveModalNotice(currentNotice)}
                className="inline-flex cursor-pointer items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-bold text-[#c99a45] transition-colors hover:text-white hover:underline focus-visible:ring-1 focus-visible:ring-[#c99a45] focus-visible:outline-none sm:px-2"
              >
                <span className="hidden sm:inline">{t("viewNotice")}</span>
                <ArrowRight className="h-3 w-3" aria-hidden="true" />
              </button>

              {/* Dismiss Button */}
              <button
                type="button"
                onClick={() => setIsDismissed(true)}
                aria-label="Dismiss notice bar"
                className="cursor-pointer rounded p-1 text-[#a7c5b6] transition-colors hover:bg-[#124d34] hover:text-white focus-visible:ring-1 focus-visible:ring-[#c99a45] focus-visible:outline-none"
                title="Dismiss"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
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
              className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
              onClick={() => setActiveModalNotice(null)}
              aria-hidden="true"
            />

            {/* Centered Modal Container */}
            <div className="animate-in zoom-in-95 relative z-10 my-auto w-full max-w-lg transform overflow-hidden rounded-2xl border border-t-4 border-[#e6e4dc] border-t-[#c99a45] bg-white p-6 text-[#1c2420] shadow-2xl duration-200 sm:p-7">
              {/* Modal Header */}
              <div className="flex items-start justify-between gap-4 border-b border-[#e6e4dc] pb-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e8f3ee] text-[#124d34] ring-1 ring-[#c99a45]/30">
                    <Megaphone className="h-5 w-5 text-[#c99a45]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-serif text-[11px] font-bold tracking-wider text-[#8b651e] uppercase">
                        Official Society Bulletin
                      </span>
                      <span className="py-0.2 rounded bg-[#f5eedf] px-1.5 font-mono text-[10px] text-[#8b651e] uppercase">
                        {activeModalNotice.locale}
                      </span>
                    </div>
                    <h3
                      id="notice-modal-title"
                      className="mt-0.5 font-serif text-lg leading-snug font-bold text-[#0b2e1e] sm:text-xl"
                    >
                      {activeModalNotice.title}
                    </h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveModalNotice(null)}
                  aria-label="Close notice details"
                  className="cursor-pointer rounded-lg p-1.5 text-[#6b7280] transition-colors hover:bg-[#f3f1ea] hover:text-[#1c2420]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="py-4 text-xs leading-relaxed whitespace-pre-wrap text-[#374151] sm:text-sm">
                {activeModalNotice.body}
              </div>

              {/* Verified Organization Signoff */}
              <div className="flex items-center justify-between rounded-xl border border-[#e6e4dc] bg-[#fbfaf6] p-3 text-xs text-[#4b5563]">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-[#124d34]" />
                  <span className="font-medium">
                    Buhary Janaza Welfare Society
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-[#6b7280]">
                  <Calendar className="h-3.5 w-3.5 text-[#9ca3af]" />
                  <span>
                    {activeModalNotice.published_at
                      ? formatAdminDate(activeModalNotice.published_at)
                      : ""}
                  </span>
                </div>
              </div>

              {/* Quick Actions Footer */}
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#f3f1ea] pt-4">
                <div className="flex items-center gap-2">
                  <a
                    href="tel:+94776227323"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#e6e4dc] bg-white px-3 py-1.5 text-xs font-semibold text-[#124d34] shadow-2xs hover:bg-[#fbfaf6]"
                  >
                    <Phone className="h-3.5 w-3.5 text-[#c99a45]" />
                    <span>Call 077 622 7323</span>
                  </a>
                  <a
                    href="https://wa.me/94776227323"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100"
                  >
                    <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
                    <span>WhatsApp</span>
                  </a>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveModalNotice(null)}
                  className="cursor-pointer rounded-lg bg-[#124d34] px-4 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#0b2e1e]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
