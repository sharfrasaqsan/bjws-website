"use client";

import * as React from "react";
import {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { IslamicPattern } from "@/components/ui/islamic-pattern";
import { formatAdminDate } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import {
  Bell,
  Megaphone,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Minus,
  ArrowRight,
  X,
  Calendar,
  Clock,
  Phone,
  MessageCircle,
  ShieldCheck,
  Maximize2,
} from "lucide-react";

export interface NoticeItem {
  id: string;
  title: string;
  body: string;
  locale: string;
  published_at: string;
  updated_at?: string;
  show_on_homepage?: boolean;
  image_url?: string;
}

interface JanazaTickerProps {
  notices?: NoticeItem[];
  className?: string;
}

function subscribeMobile(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mql = window.matchMedia("(max-width: 767px)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getMobileSnapshot() {
  return typeof window !== "undefined"
    ? window.matchMedia("(max-width: 767px)").matches
    : false;
}

function getServerSnapshot() {
  return false;
}

export function JanazaTicker({ notices = [], className }: JanazaTickerProps) {
  const locale = useLocale();
  const pathname = usePathname();

  // Hide the floating notice popup ONLY when user enters the notices page
  const isNoticesPage = pathname?.includes("/notices");

  // React 19 sync store: detects mobile viewport without cascading render warnings
  const isMobile = useSyncExternalStore(
    subscribeMobile,
    getMobileSnapshot,
    getServerSnapshot
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [userExpanded, setUserExpanded] = useState<boolean | null>(null);
  const [activeModalNotice, setActiveModalNotice] = useState<NoticeItem | null>(
    null
  );
  const [isImageLightboxOpen, setIsImageLightboxOpen] = useState(false);

  // On desktop: default to expanded. On mobile: default to compact capsule pill
  const isExpanded = userExpanded !== null ? userExpanded : !isMobile;

  // Auto-collapse on scroll down so site reading is never obstructed
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setUserExpanded(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll and close on Escape key when modal is open
  useEffect(() => {
    if (!activeModalNotice) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isImageLightboxOpen) {
          setIsImageLightboxOpen(false);
        } else {
          setActiveModalNotice(null);
        }
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeModalNotice, isImageLightboxOpen]);

  // Filter notices for active locale (fallback to all received notices)
  // Constraint: Maximum 3 notices are shown in the homepage widget
  const activeNotices: NoticeItem[] = useMemo(() => {
    if (!notices || notices.length === 0) return [];
    const localized = notices.filter(
      (n) =>
        n.locale === locale &&
        (n.show_on_homepage === undefined || n.show_on_homepage === true)
    );
    const list =
      localized.length > 0
        ? localized
        : notices.filter(
            (n) =>
              n.show_on_homepage === undefined || n.show_on_homepage === true
          );
    // Limit to max 3 notices on homepage
    return list.slice(0, 3);
  }, [notices, locale]);

  const totalNotices = activeNotices.length;

  // Auto-advance notice every 8 seconds when not paused
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalNotices);
  }, [totalNotices]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalNotices) % totalNotices);
  }, [totalNotices]);

  useEffect(() => {
    if (totalNotices <= 1 || isPaused || !isExpanded) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      handleNext();
    }, 8000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [totalNotices, isPaused, isExpanded, handleNext]);

  // When visiting the notices page, or if no notices exist, hide popup
  if (isNoticesPage || totalNotices === 0) {
    return null;
  }

  // Safe index within bounds
  const safeIndex = currentIndex >= totalNotices ? 0 : currentIndex;
  const currentNotice = activeNotices[safeIndex] || activeNotices[0];

  const formattedDate = currentNotice.published_at
    ? formatAdminDate(currentNotice.published_at)
    : "";

  const whatsappShareText = encodeURIComponent(
    `*${currentNotice.title}*\n\n${currentNotice.body}\n\n— *Buhary Janaza Welfare Society (BJWS)*\nhttps://bjws.org/${locale}/notices`
  );

  const noticeBadgeText =
    locale === "ta"
      ? "அதிகாரபூர்வ அறிவித்தல்"
      : locale === "si"
        ? "නිල නිවේදනය"
        : "Official Notice";

  return (
    <>
      {/* Mobile Backdrop to dismiss card when tapping outside on phone */}
      {isExpanded && isMobile && (
        <div
          className="backdrop-blur-2xs fixed inset-0 z-30 bg-black/40 duration-200 md:hidden"
          onClick={() => setUserExpanded(false)}
          aria-hidden="true"
        />
      )}

      {/* 1. MINIMIZED FLOATING CAPSULE PILL (Default on mobile, ultra-compact) */}
      {!isExpanded ? (
        <div className="animate-in fade-in fixed right-4 bottom-20 z-40 duration-200 md:right-6 md:bottom-6">
          <button
            type="button"
            onClick={() => setUserExpanded(true)}
            className="group relative flex max-w-[340px] cursor-pointer items-center gap-2 rounded-full border border-amber-400/60 bg-[#062115]/95 px-3.5 py-2 text-white shadow-2xl backdrop-blur-xl transition-all hover:scale-105 hover:border-amber-300 sm:gap-2.5 sm:px-4 sm:py-2.5"
            title="Expand Notice"
          >
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-400" />
            </span>

            <Bell className="h-3.5 w-3.5 shrink-0 text-amber-300 transition-transform group-hover:rotate-12" />

            <span className="shrink-0 text-[11px] font-bold text-amber-200 sm:text-xs">
              {noticeBadgeText}{" "}
              <span className="font-mono text-amber-300/80">
                ({safeIndex + 1}/{totalNotices})
              </span>
            </span>

            <span className="hidden max-w-[140px] truncate text-xs text-emerald-100/80 sm:inline">
              {currentNotice.title}
            </span>

            <ChevronUp className="h-3.5 w-3.5 shrink-0 text-amber-300 transition-transform group-hover:-translate-y-0.5" />
          </button>
        </div>
      ) : (
        /* 2. EXPANDED FLOATING DYNAMIC ISLAND CARD (Default on desktop, opens on mobile tap) */
        <aside
          role="region"
          aria-label={noticeBadgeText}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className={`animate-in fade-in slide-in-from-bottom-5 fixed right-4 bottom-20 z-40 max-h-[82vh] w-[calc(100vw-2rem)] max-w-sm overflow-y-auto duration-300 sm:w-[380px] md:right-6 md:bottom-6 ${
            className || ""
          }`}
        >
          <div className="relative overflow-hidden rounded-3xl border border-amber-400/40 bg-gradient-to-br from-[#062115]/98 via-[#093522]/98 to-[#041a10]/98 p-4 text-white shadow-[0_16px_40px_rgba(0,0,0,0.55)] ring-1 ring-white/10 backdrop-blur-2xl sm:p-5">
            {/* Subtle Islamic Lattice Pattern */}
            <IslamicPattern
              opacity={0.045}
              className="pointer-events-none text-amber-400"
            />

            {/* Glowing Golden Top Rim Line */}
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

            {/* Top Header Bar */}
            <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                {/* Pulsing Beacon Dot */}
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-400" />
                </span>

                {/* Badge Label */}
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/40 bg-amber-400/20 px-2.5 py-0.5 text-[10px] font-extrabold tracking-wider text-amber-300 uppercase">
                  <Megaphone className="h-2.5 w-2.5 text-amber-300" />
                  <span>{noticeBadgeText}</span>
                </span>

                {/* Notice Counter */}
                {totalNotices > 1 && (
                  <span className="font-mono text-[10px] font-semibold text-emerald-200/70">
                    {safeIndex + 1}/{totalNotices}
                  </span>
                )}
              </div>

              {/* Navigation & Window Controls */}
              <div className="flex items-center gap-1">
                {totalNotices > 1 && (
                  <div className="mr-1 flex items-center gap-0.5 border-r border-white/10 pr-1">
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="cursor-pointer rounded-md p-1 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                      aria-label="Previous notice"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="cursor-pointer rounded-md p-1 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                      aria-label="Next notice"
                    >
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setUserExpanded(false)}
                  className="cursor-pointer rounded-md p-1 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                  title="Minimize"
                  aria-label="Minimize notice"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setUserExpanded(false)}
                  className="cursor-pointer rounded-md p-1 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                  title="Minimize"
                  aria-label="Close notice card"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Middle Card: Title, Body Snippet, Optional Thumbnail & Date */}
            <div className="pt-3 pb-3">
              <button
                type="button"
                onClick={() => setActiveModalNotice(currentNotice)}
                className="group flex w-full cursor-pointer items-start gap-3 text-left"
              >
                {/* Optional Notice Image Thumbnail */}
                {currentNotice.image_url && (
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-amber-400/40 bg-black/40">
                    <Image
                      src={currentNotice.image_url}
                      alt={currentNotice.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      sizes="56px"
                    />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <h4 className="font-display line-clamp-2 text-sm leading-snug font-bold text-white transition-colors group-hover:text-amber-300 sm:text-base">
                    {currentNotice.title}
                  </h4>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-emerald-100/75">
                    {currentNotice.body}
                  </p>
                </div>
              </button>

              {formattedDate && (
                <div className="mt-2.5 flex items-center gap-1.5 font-mono text-[11px] text-amber-300/80">
                  <Calendar className="h-3 w-3 text-amber-400" />
                  <span>{formattedDate}</span>
                </div>
              )}
            </div>

            {/* Bottom Row: Actions */}
            <div className="flex items-center justify-between gap-2 border-t border-white/10 pt-3">
              <button
                type="button"
                onClick={() => setActiveModalNotice(currentNotice)}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-3.5 py-1.5 text-xs font-bold text-stone-950 shadow-xs transition hover:from-amber-300 hover:to-amber-400"
              >
                <span>
                  {locale === "ta"
                    ? "முழு விபரம்"
                    : locale === "si"
                      ? "සම්පූර්ණ විස්තරය"
                      : "Read Notice"}
                </span>
                <ArrowRight className="h-3 w-3" />
              </button>

              <div className="flex items-center gap-2">
                <a
                  href={`https://api.whatsapp.com/send?text=${whatsappShareText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Share on WhatsApp"
                  className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[#25D366]/20 text-[#25D366] transition-colors hover:bg-[#25D366] hover:text-white"
                  aria-label="Share notice on WhatsApp"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                </a>

                <Link
                  href="/notices"
                  className="text-[11px] font-semibold text-emerald-300 underline transition-colors hover:text-white"
                >
                  {locale === "ta"
                    ? "அனைத்தும்"
                    : locale === "si"
                      ? "සියල්ල"
                      : "All Notices"}
                </Link>
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* 3. FULL NOTICE DETAIL MODAL (Opens when clicking Read Notice) */}
      {activeModalNotice &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="notice-modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          >
            {/* Backdrop Blur */}
            <div
              className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity duration-200"
              onClick={() => {
                setIsImageLightboxOpen(false);
                setActiveModalNotice(null);
              }}
              aria-hidden="true"
            />

            {/* Modal Dialog Card */}
            <div className="animate-in fade-in zoom-in-95 relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl border border-amber-400/50 bg-gradient-to-b from-white via-white to-stone-50 shadow-2xl transition-all duration-200 dark:from-[#0a1e14] dark:via-[#091a11] dark:to-[#05110b]">
              {/* Top Islamic Pattern Header */}
              <div className="relative overflow-hidden border-b border-amber-400/40 bg-gradient-to-r from-[#031c12] via-[#093522] to-[#031c12] p-6 text-white sm:p-7">
                <IslamicPattern
                  opacity={0.06}
                  className="pointer-events-none text-amber-300"
                />

                <div className="relative z-10">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/25 px-3 py-1 text-xs font-extrabold tracking-wider text-amber-200 uppercase shadow-xs ring-1 ring-amber-300/40">
                        <Megaphone className="h-3.5 w-3.5 text-amber-300" />
                        <span>{noticeBadgeText}</span>
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
                {/* Notice Image Flyer (if attached) */}
                {activeModalNotice.image_url && (
                  <div className="group relative overflow-hidden rounded-2xl border border-stone-200 bg-stone-100 shadow-sm dark:border-emerald-950 dark:bg-black/50">
                    <div className="relative aspect-[16/9] max-h-72 w-full">
                      <Image
                        src={activeModalNotice.image_url}
                        alt={activeModalNotice.title}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 672px"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsImageLightboxOpen(true)}
                      className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-xl bg-black/70 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md transition-opacity hover:bg-black/90"
                    >
                      <Maximize2 className="h-3.5 w-3.5" />
                      <span>View Full Image</span>
                    </button>
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
                </div>
              </div>
            </div>

            {/* Optional Full Image Lightbox */}
            {isImageLightboxOpen && activeModalNotice.image_url && (
              <div
                className="fixed inset-0 z-60 flex items-center justify-center bg-black/90 p-4"
                onClick={() => setIsImageLightboxOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setIsImageLightboxOpen(false)}
                  className="absolute top-5 right-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/40"
                  aria-label="Close image lightbox"
                >
                  <X className="h-6 w-6" />
                </button>
                <div
                  className="relative max-h-[90vh] max-w-[90vw]"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activeModalNotice.image_url}
                    alt={activeModalNotice.title}
                    className="max-h-[85vh] max-w-[85vw] rounded-2xl object-contain shadow-2xl"
                  />
                </div>
              </div>
            )}
          </div>,
          document.body
        )}
    </>
  );
}
