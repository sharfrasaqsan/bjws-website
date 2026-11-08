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
      <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden rounded-3xl border border-[#e6e4dc] bg-muted shadow-xl mb-10 group cursor-pointer"
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
          {categoryLabel && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0b2e1e]/90 text-[#d4af37] px-3 py-1 font-serif text-[10px] font-bold tracking-wider uppercase border border-[#c99a45]/30 shadow-md backdrop-blur-xs">
              <Tag className="h-3 w-3" />
              <span>{categoryLabel}</span>
            </span>
          )}

          <span className="inline-flex items-center gap-1.5 rounded-full bg-black/60 text-white/90 px-2.5 py-1 text-[11px] font-medium backdrop-blur-xs group-hover:bg-[#c99a45] group-hover:text-[#072015] transition-colors">
            <Eye className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Click to enlarge</span>
          </span>
        </div>

        {/* Bottom Caption Overlay */}
        <div className="absolute bottom-4 left-4 right-4 text-white pointer-events-none">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#d4af37]">
            <ShieldCheck className="h-4 w-4" />
            <span>Official BJWS Documentation</span>
          </div>
          {caption && (
            <p className="text-xs text-white/90 line-clamp-1 mt-0.5 font-medium">
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 sm:p-6 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative max-w-5xl w-full bg-[#072115] rounded-3xl overflow-hidden border border-emerald-900 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-emerald-950 text-white">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#d4af37]" />
                <span className="text-xs sm:text-sm font-semibold truncate max-w-md sm:max-w-xl">
                  {alt}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer shrink-0"
                title="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Full-bleed Photo */}
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-black">
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
            <div className="p-4 bg-[#0b2e1e] text-emerald-200 text-xs flex items-center justify-between border-t border-emerald-950">
              <span className="italic">{caption || alt}</span>
              <span className="text-[#d4af37] font-semibold text-[11px] shrink-0">
                Buhary Janaza Welfare Society
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

