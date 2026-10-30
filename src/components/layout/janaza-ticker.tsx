"use client";

import * as React from "react";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
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
  const [activeModalNotice, setActiveModalNotice] =
    useState<NoticeItem | null>(null);

  // Fallback verified announcements if Supabase has no records
  const fallbackNotices: Record<string, NoticeItem[]> = useMemo(
    () => ({
      ta: [
        {
          id: "seed-ta-1",
          title: "மஹல்லா மையவாடி சிரமதானப் பணி அழைப்பு",
          body: "முள்ளிப்பொத்தானை புகாரி ஜும்ஆ பள்ளிவாசல் மையவாடியை துப்புரவு செய்யும் வருடாந்த சிரமதானப் பணியில் அனைத்து இளைஞர்களையும் பொதுமக்களையும் பங்குபற்றுமாறு அன்புடன் அழைக்கின்றோம். உபகரணங்கள் மற்றும் சிற்றுண்டிகள் சங்கத்தினால் வழங்கப்படும்.\n\nகாலம்: எதிர்வரும் ஞாயிறு காலை 7:00 மணி\nஇடம்: முள்ளிப்பொத்தானை மையவாடி வளாகம்\nதொடர்புகளுக்கு: 075 373 8349",
          locale: "ta",
          published_at: "2026-03-01T08:00:00Z",
        },
        {
          id: "seed-ta-2",
          title: "2026 ஆம் ஆண்டிற்கான புதிய அங்கத்துவ பதிவு ஆரம்பம்",
          body: "எமது சங்கத்தின் மாதாந்த மற்றும் வருடாந்த நலன்புரி திட்டத்தில் இணைந்து கொள்ள விரும்பும் மஹல்லா வாசிகள் இணையத்தளம் மூலமாக அல்லது காரியாலயத்தில் விண்ணப்பிக்கலாம்.\n\nமாதாந்த சந்தா: ரூபா 200 | வருடாந்த சந்தா: ரூபா 2,400\nதொடர்புகளுக்கு: 075 373 8349",
          locale: "ta",
          published_at: "2026-02-25T10:00:00Z",
        },
      ],
      en: [
        {
          id: "seed-en-1",
          title: "Annual Cemetery Shramadhana & Grounds Maintenance Drive",
          body: "The Buhary Janaza Welfare Society warmly invites all community members and youth volunteers to take part in the upcoming cemetery clean-up drive.\n\nDate: Coming Sunday at 7:00 AM\nVenue: Mahallah Cemetery Grounds, Mullipothanai\nTools and refreshments will be provided. Hotline: 075 373 8349",
          locale: "en",
          published_at: "2026-03-01T08:00:00Z",
        },
        {
          id: "seed-en-2",
          title: "Membership Enrollment Open for 2026/2027",
          body: "Mahallah residents can now enroll under the comprehensive funeral welfare assistance scheme online or via the administrative desk.\n\nMonthly Plan: LKR 200 | Annual Plan: LKR 2,400\nHelpline: 075 373 8349",
          locale: "en",
          published_at: "2026-02-25T10:00:00Z",
        },
      ],
      si: [
        {
          id: "seed-si-1",
          title: "මහල්ල සුසාන භූමි වාර්ෂික ශ්‍රමදාන වැඩසටහන",
          body: "මුල්ලිපොத்தான බුහාරි සුසාන භූමිය පිරිසිදු කිරීමේ වාර්ෂික ශ්‍රමදාන කටයුතු සඳහා ප්‍රජාවේ සියලු දෙනාට සහභාගී වන ලෙස ගෞරවයෙන් ආරාධනා කරමු.\n\nදිනය: එළඹෙන ඉරිදා පෙ.ව. 7:00 ට\nස්ථානය: මුල්ලිපොத்தான සුසාන භූමි පරිශ්‍රය\nවිමසීම්: 075 373 8349",
          locale: "si",
          published_at: "2026-03-01T08:00:00Z",
        },
        {
          id: "seed-si-2",
          title: "2026 වසර සඳහා නව සාමාජික ලියාපදිංචිය ආරම්භයි",
          body: "අප සමිතියේ ජනාසා සුභසාධක ආවරණය ලබා ගැනීම සඳහා මාර්ගගතව හෝ ලේකම් කාර්යාලය හරහා ලියාපදිංචි විය හැක.\n\nමාසික දායකත්වය: රු. 200 | වාර්ෂික දායකත්වය: රු. 2,400\nවිමසීම්: 075 373 8349",
          locale: "si",
          published_at: "2026-02-25T10:00:00Z",
        },
      ],
    }),
    []
  );

  // Filter notices for active locale; if empty, use fallback localized notices
  const activeNotices: NoticeItem[] = useMemo(() => {
    if (notices && notices.length > 0) {
      const localized = notices.filter((n) => n.locale === locale);
      if (localized.length > 0) return localized;
      return notices;
    }
    return fallbackNotices[locale] || fallbackNotices.en;
  }, [notices, locale, fallbackNotices]);

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
      <div className="relative z-30 bg-[#062115] border-b border-[#c99a45]/20 py-1 px-4 text-center">
        <button
          onClick={() => setIsDismissed(false)}
          className="inline-flex cursor-pointer items-center gap-1.5 text-[11px] font-semibold text-[#c99a45] hover:text-[#f5eedf] transition-colors"
        >
          <Bell className="h-3 w-3 animate-bounce" />
          <span>
            {t("janazaNotice")} ({totalNotices})
          </span>
          <span className="underline ml-1">Show</span>
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

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-[42px] items-center justify-between gap-3 py-1.5 text-xs">
            {/* Left: Pulsing Beacon & Institutional Category Badge */}
            <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span
                  className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 motion-reduce:hidden ${
                    isJanazaUrgent ? "bg-amber-400" : "bg-emerald-400"
                  }`}
                />
                <span
                  className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                    isJanazaUrgent ? "bg-[#c99a45]" : "bg-emerald-500"
                  }`}
                />
              </span>

              <span
                className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-0.5 font-serif text-[10px] font-bold tracking-wider uppercase shadow-2xs ${
                  isJanazaUrgent
                    ? "bg-[#c99a45] text-[#041a10] ring-1 ring-[#c99a45]/40"
                    : "bg-[#14553a] text-white ring-1 ring-[#c99a45]/30"
                }`}
              >
                {isJanazaUrgent ? (
                  <Bell className="h-3 w-3 shrink-0" aria-hidden="true" />
                ) : (
                  <Megaphone className="h-3 w-3 shrink-0 text-[#c99a45]" aria-hidden="true" />
                )}
                <span>
                  {isJanazaUrgent
                    ? locale === "ta"
                      ? "ஜனாஸா அறிவித்தல்"
                      : locale === "si"
                        ? "ජනාසා නිවේදනය"
                        : "Janaza Notice"
                    : t("janazaNotice")}
                </span>
              </span>
            </div>

            {/* Center: Notice Content with Smooth Fade & Modal Trigger */}
            <div className="flex-1 min-w-0">
              <button
                type="button"
                onClick={() => setActiveModalNotice(currentNotice)}
                className="group flex w-full cursor-pointer items-center text-left transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#c99a45]"
                title={currentNotice.title}
              >
                <div className="flex min-w-0 flex-1 items-baseline gap-2 truncate">
                  <span className="truncate font-semibold text-white group-hover:text-[#f5eedf] group-hover:underline text-xs sm:text-sm">
                    {currentNotice.title}
                  </span>

                  {formattedDate && (
                    <span className="hidden text-[11px] font-normal text-[#a7c5b6] md:inline">
                      ({formattedDate})
                    </span>
                  )}

                  {currentNotice.body && (
                    <span className="hidden text-[11px] font-normal text-[#d1fae5]/70 lg:inline truncate">
                      — {currentNotice.body.replace(/\n+/g, " ").slice(0, 80)}...
                    </span>
                  )}
                </div>
              </button>
            </div>

            {/* Right: Controls (Pagination, View Action, Close) */}
            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
              {/* Carousel Pagination Arrows (if > 1 notice) */}
              {totalNotices > 1 && (
                <div className="flex items-center gap-1 border-r border-[#1a432f] pr-1.5 text-[10px] text-[#a7c5b6]">
                  <span className="font-mono text-[10px] font-bold text-[#c99a45]">
                    {currentIndex + 1}/{totalNotices}
                  </span>
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={handlePrev}
                      aria-label="Previous Notice"
                      className="cursor-pointer rounded p-0.5 text-[#a7c5b6] hover:bg-[#124d34] hover:text-white transition-colors"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      aria-label="Next Notice"
                      className="cursor-pointer rounded p-0.5 text-[#a7c5b6] hover:bg-[#124d34] hover:text-white transition-colors"
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
                className="inline-flex cursor-pointer items-center gap-1 rounded px-2 py-0.5 text-[11px] font-bold text-[#c99a45] hover:text-white hover:underline transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#c99a45]"
              >
                <span>{t("viewNotice")}</span>
                <ArrowRight className="h-3 w-3" aria-hidden="true" />
              </button>

              {/* Dismiss Button */}
              <button
                type="button"
                onClick={() => setIsDismissed(true)}
                aria-label="Dismiss notice bar"
                className="cursor-pointer rounded p-1 text-[#a7c5b6] hover:bg-[#124d34] hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#c99a45]"
                title="Dismiss"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Accessible Detail Modal */}
      {activeModalNotice && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="notice-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
          {/* Backdrop with blur */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity animate-in fade-in-50"
            onClick={() => setActiveModalNotice(null)}
            aria-hidden="true"
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-[#e6e4dc] border-t-4 border-t-[#c99a45] bg-white p-6 text-[#1c2420] shadow-2xl z-10 animate-in fade-in-50 zoom-in-95 sm:p-7">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-[#e6e4dc] pb-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e8f3ee] text-[#124d34] ring-1 ring-[#c99a45]/30">
                  <Megaphone className="h-5 w-5 text-[#c99a45]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-[11px] font-bold tracking-wider uppercase text-[#8b651e]">
                      Official Society Bulletin
                    </span>
                    <span className="rounded bg-[#f5eedf] px-1.5 py-0.2 font-mono text-[10px] text-[#8b651e] uppercase">
                      {activeModalNotice.locale}
                    </span>
                  </div>
                  <h3
                    id="notice-modal-title"
                    className="font-serif text-lg font-bold text-[#0b2e1e] sm:text-xl leading-snug mt-0.5"
                  >
                    {activeModalNotice.title}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveModalNotice(null)}
                aria-label="Close notice details"
                className="cursor-pointer rounded-lg p-1.5 text-[#6b7280] hover:bg-[#f3f1ea] hover:text-[#1c2420] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="py-4 text-xs sm:text-sm leading-relaxed text-[#374151] whitespace-pre-wrap">
              {activeModalNotice.body}
            </div>

            {/* Verified Organization Signoff */}
            <div className="rounded-xl border border-[#e6e4dc] bg-[#fbfaf6] p-3 text-xs text-[#4b5563] flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-[#124d34]" />
                <span className="font-medium">Buhary Janaza Welfare Society</span>
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
                  href="tel:+94753738349"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#e6e4dc] bg-white px-3 py-1.5 text-xs font-semibold text-[#124d34] shadow-2xs hover:bg-[#fbfaf6]"
                >
                  <Phone className="h-3.5 w-3.5 text-[#c99a45]" />
                  <span>Call 075 373 8349</span>
                </a>
                <a
                  href="https://wa.me/94753738349"
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
                className="cursor-pointer rounded-lg bg-[#124d34] px-4 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#0b2e1e] transition-colors"
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
