"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import Image from "next/image";
import { IslamicPattern } from "@/components/ui/islamic-pattern";
import { formatAdminDate } from "@/lib/utils";
import type { NoticeRecord } from "@/content/notices";
import {
  Megaphone,
  Calendar,
  Clock,
  Share2,
  Copy,
  Check,
  Maximize2,
  X,
  Search,
  ShieldCheck,
} from "lucide-react";

interface NoticesListViewProps {
  notices: NoticeRecord[];
  locale: string;
  translations: {
    badge: string;
    publishedOn: string;
    updatedOn: string;
    shareWhatsApp: string;
    noNotices: string;
    societyName: string;
    location: string;
  };
}

export function NoticesListView({
  notices,
  locale,
  translations,
}: NoticesListViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<{
    url: string;
    title: string;
  } | null>(null);

  // Filter notices based on search query
  const filteredNotices = useMemo(() => {
    if (!searchQuery.trim()) return notices;
    const q = searchQuery.toLowerCase().trim();
    return notices.filter(
      (n) =>
        n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q)
    );
  }, [notices, searchQuery]);

  // Copy notice text to clipboard with feedback
  const handleCopy = async (notice: NoticeRecord) => {
    const textToCopy = `${notice.title}\n\n${notice.body}\n\n— Buhary Janaza Welfare Society (BJWS)\nhttps://bjws.org/${locale}/notices`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedId(notice.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Counter Controls */}
      {notices.length > 0 && (
        <div className="flex flex-col gap-3 rounded-2xl border border-stone-200/90 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between dark:border-emerald-950/80 dark:bg-[#0c1811]">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                locale === "ta"
                  ? "அறிவித்தல்களைத் தேடுங்கள்..."
                  : locale === "si"
                    ? "නිවේදන සොයන්න..."
                    : "Search notices & circulars..."
              }
              className="w-full rounded-xl border border-stone-200 bg-stone-50/70 py-2.5 pr-4 pl-10 text-xs text-stone-900 transition-colors placeholder:text-stone-400 focus:border-emerald-600 focus:bg-white focus:outline-none sm:text-sm dark:border-emerald-900/60 dark:bg-[#06140e] dark:text-stone-100"
            />
          </div>

          <div className="flex items-center gap-2 self-end text-xs font-semibold text-stone-500 sm:self-center dark:text-stone-400">
            <span className="font-mono text-emerald-800 dark:text-emerald-400">
              {filteredNotices.length}
            </span>
            <span>{filteredNotices.length === 1 ? "Notice" : "Notices"}</span>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="ml-1 text-xs text-amber-700 underline hover:text-amber-800 dark:text-amber-400"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}

      {/* Notices Grid or Empty State */}
      {filteredNotices.length === 0 ? (
        <div className="rounded-3xl border border-stone-200 bg-white p-12 text-center dark:border-emerald-950 dark:bg-[#0f1d16]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
            <Megaphone className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-base font-bold text-stone-900 dark:text-white">
            {searchQuery
              ? "No matching notices found."
              : translations.noNotices}
          </h3>
          <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
            {translations.societyName} • {translations.location}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {filteredNotices.map((notice) => {
            const publishedDate = notice.published_at
              ? formatAdminDate(notice.published_at)
              : "";
            const updatedDate = notice.updated_at
              ? formatAdminDate(notice.updated_at)
              : "";
            const isUpdated =
              notice.updated_at &&
              notice.updated_at.slice(0, 10) !==
                notice.published_at.slice(0, 10);

            const encodedWhatsAppText = encodeURIComponent(
              `*${notice.title}*\n\n${notice.body}\n\n— *Buhary Janaza Welfare Society (BJWS)*\nhttps://bjws.org/${locale}/notices`
            );

            const isCopied = copiedId === notice.id;

            return (
              <article
                key={notice.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-stone-200/90 bg-white shadow-sm transition-all duration-300 hover:border-amber-400/60 hover:shadow-xl dark:border-emerald-950/80 dark:bg-[#0d1c15] dark:hover:border-amber-400/40"
              >
                {/* Luminous Gold Top Rim Line */}
                <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-amber-300 to-emerald-600" />

                {/* Subtle Islamic Lattice Pattern */}
                <IslamicPattern
                  opacity={0.03}
                  className="pointer-events-none text-emerald-900 dark:text-amber-400"
                />

                <div className="relative z-10 p-6 sm:p-7">
                  {/* Top Header Badge & Dates */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-4 dark:border-emerald-950">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-gradient-to-r from-amber-50 to-amber-100/70 px-3 py-1 text-xs font-bold text-amber-950 shadow-2xs dark:border-amber-400/30 dark:from-amber-950/50 dark:to-amber-900/30 dark:text-amber-200">
                        <Megaphone className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                        <span>{translations.badge}</span>
                      </span>

                      <span className="rounded-full bg-stone-100 px-2 py-0.5 font-mono text-[11px] font-bold text-stone-600 uppercase dark:bg-emerald-950/80 dark:text-stone-300">
                        {notice.locale.toUpperCase()}
                      </span>
                    </div>

                    {/* Published & Updated Dates */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                      <span className="inline-flex items-center gap-1 font-mono">
                        <Calendar className="h-3.5 w-3.5 text-amber-600/80 dark:text-amber-400/80" />
                        <span>
                          {translations.publishedOn}: {publishedDate}
                        </span>
                      </span>

                      {isUpdated && (
                        <span className="inline-flex items-center gap-1 font-mono text-emerald-800 dark:text-emerald-400">
                          <Clock className="h-3.5 w-3.5" />
                          <span>
                            {translations.updatedOn}: {updatedDate}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Notice Flyer / Circular Image Banner (if available) */}
                  {notice.image_url && (
                    <div className="group/img relative mt-4 overflow-hidden rounded-2xl border border-stone-200 bg-stone-100 shadow-2xs dark:border-emerald-950 dark:bg-black/40">
                      <div className="relative aspect-[16/9] w-full">
                        <Image
                          src={notice.image_url}
                          alt={notice.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover/img:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 580px"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setLightboxImage({
                            url: notice.image_url!,
                            title: notice.title,
                          })
                        }
                        className="absolute right-3 bottom-3 inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-black/75 px-3 py-1.5 text-xs font-semibold text-white shadow-md backdrop-blur-md transition-all hover:bg-black"
                      >
                        <Maximize2 className="h-3.5 w-3.5 text-amber-400" />
                        <span>View Flyer</span>
                      </button>
                    </div>
                  )}

                  {/* Notice Title */}
                  <h2 className="font-display mt-4 text-lg leading-snug font-bold text-stone-900 transition-colors group-hover:text-emerald-800 sm:text-xl dark:text-white dark:group-hover:text-amber-300">
                    {notice.title}
                  </h2>

                  {/* Notice Body */}
                  <div className="mt-3.5 text-xs leading-relaxed whitespace-pre-line text-stone-700 sm:text-sm dark:text-stone-300">
                    {notice.body}
                  </div>
                </div>

                {/* Bottom Verified Authority Footer & Actions */}
                <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-t border-stone-100 bg-stone-50/70 px-6 py-4 dark:border-emerald-950/80 dark:bg-[#07160f]">
                  <div className="flex items-center gap-2 text-[11px] font-medium text-stone-600 dark:text-stone-400">
                    <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <span>BJWS Official Dispatch</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Copy Notice Button */}
                    <button
                      type="button"
                      onClick={() => handleCopy(notice)}
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 shadow-2xs transition-colors hover:bg-stone-100 dark:border-emerald-900/60 dark:bg-emerald-950/50 dark:text-stone-300 dark:hover:bg-emerald-900/50"
                      title="Copy notice text"
                    >
                      {isCopied ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                          <span className="text-emerald-700 dark:text-emerald-400">
                            Copied!
                          </span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5 text-stone-500" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    {/* WhatsApp Share Button */}
                    <a
                      href={`https://api.whatsapp.com/send?text=${encodedWhatsAppText}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#25D366] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition-colors hover:bg-[#20ba59]"
                    >
                      <Share2 className="h-3.5 w-3.5" />
                      <span>{translations.shareWhatsApp}</span>
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Image Lightbox Modal */}
      {lightboxImage && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
          onClick={() => setLightboxImage(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxImage(null)}
            className="absolute top-5 right-5 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/40"
            aria-label="Close flyer preview"
          >
            <X className="h-6 w-6" />
          </button>
          <div
            className="relative max-h-[90vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightboxImage.url}
              alt={lightboxImage.title}
              className="max-h-[85vh] max-w-[85vw] rounded-2xl object-contain shadow-2xl"
            />
            <p className="mt-3 text-center text-xs font-semibold text-white/90">
              {lightboxImage.title}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
