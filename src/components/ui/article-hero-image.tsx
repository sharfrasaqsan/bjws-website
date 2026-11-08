"use client";

import * as React from "react";
import { useState } from "react";
import Image from "next/image";
import { Eye, X, Sparkles, Tag, ShieldCheck } from "lucide-react";

interface ArticleHeroImageProps {
  src: string;
  alt: string;
  categoryLabel?: string;
  caption?: string;
  priority?: boolean;
}

export function ArticleHeroImage({
  src,
  alt,
  categoryLabel,
  caption,
  priority = true,
}: ArticleHeroImageProps) {
  const [isOpen, setIsOpen] = useState(false);
  const formattedUrl = src;

  return (
    <>
      <div
        className="bg-muted group relative mb-10 aspect-[16/10] w-full cursor-pointer overflow-hidden rounded-3xl border border-[#e6e4dc] shadow-xl sm:aspect-[16/9]"
        onClick={() => setIsOpen(true)}
      >
        <Image
          src={formattedUrl}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 1024px) 100vw, 850px"
          className="object-cover object-center transition-transform duration-700 group-hover:scale-103"
        />

        {/* Cinematic gradient overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Top Badges */}
        <div className="pointer-events-none absolute top-4 right-4 left-4 flex items-center justify-between">
          {categoryLabel && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#c99a45]/30 bg-[#0b2e1e]/90 px-3 py-1 font-serif text-[10px] font-bold tracking-wider text-[#d4af37] uppercase shadow-md backdrop-blur-xs">
              <Tag className="h-3 w-3" />
              <span>{categoryLabel}</span>
            </span>
          )}

          <span className="inline-flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-medium text-white/90 backdrop-blur-xs transition-colors group-hover:bg-[#c99a45] group-hover:text-[#072015]">
            <Eye className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Click to enlarge</span>
          </span>
        </div>

        {/* Bottom Caption Overlay */}
        <div className="pointer-events-none absolute right-4 bottom-4 left-4 text-white">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#d4af37]">
            <ShieldCheck className="h-4 w-4" />
            <span>Official BJWS Documentation</span>
          </div>
          {caption && (
            <p className="mt-0.5 line-clamp-1 text-xs font-medium text-white/90">
              {caption}
            </p>
          )}
        </div>
      </div>

      {/* Lightbox Preview */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-md duration-200 sm:p-6"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-emerald-900 bg-[#072115] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-emerald-950 p-4 text-white">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#d4af37]" />
                <span className="max-w-md truncate text-xs font-semibold sm:max-w-xl sm:text-sm">
                  {alt}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                title="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Full-bleed Photo */}
            <div className="relative aspect-[16/10] w-full bg-black sm:aspect-[16/9]">
              <Image
                src={formattedUrl}
                alt={alt}
                fill
                unoptimized
                sizes="100vw"
                className="object-contain"
              />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-emerald-950 bg-[#0b2e1e] p-4 text-xs text-emerald-200">
              <span className="italic">{caption || alt}</span>
              <span className="shrink-0 text-[11px] font-semibold text-[#d4af37]">
                Buhary Janaza Welfare Society
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
