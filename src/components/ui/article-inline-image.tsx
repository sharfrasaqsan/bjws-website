"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { X, Sparkles, ZoomIn } from "lucide-react";

interface ArticleInlineImageProps {
  src: string;
  alt?: string;
  className?: string;
}

export function ArticleInlineImage({
  src,
  alt = "",
  className = "",
}: ArticleInlineImageProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Close modal on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (!src) return null;

  return (
    <>
      <figure
        className={`my-8 overflow-hidden rounded-2xl border border-[#e6e4dc] bg-surface shadow-md ${className}`}
      >
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="relative aspect-[16/10] w-full overflow-hidden bg-muted cursor-pointer group text-left block border-0 p-0 focus:outline-hidden focus:ring-2 focus:ring-[#c99a45]"
          aria-label={alt ? `Enlarge photo: ${alt}` : "Enlarge photo"}
        >
          <Image
            src={src}
            alt={alt || "BJWS Article Illustration"}
            fill
            sizes="(max-width: 1024px) 100vw, 850px"
            className="object-cover object-center transition-transform duration-500 group-hover:scale-103"
          />

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Top-Right Pill Badge */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="inline-flex items-center gap-1 rounded-full bg-black/70 text-white px-3 py-1 text-xs font-medium backdrop-blur-xs shadow-xs">
              <ZoomIn className="h-3.5 w-3.5 text-[#d4af37]" />
              <span>Enlarge</span>
            </span>
          </div>
        </button>

        {alt && (
          <figcaption className="p-3 text-center text-xs text-text-muted bg-[#fbfaf6] border-t border-[#f0eee6] italic">
            {alt}
          </figcaption>
        )}
      </figure>

      {/* Lightbox Preview Modal */}
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
                  {alt || "Article illustration"}
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

            {/* Photo Preview */}
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-black">
              <Image
                src={src}
                alt={alt || "BJWS Article Illustration"}
                fill
                className="object-contain"
                sizes="(max-width: 1280px) 100vw, 1200px"
              />
            </div>

            {/* Caption Footer */}
            {alt && (
              <div className="p-4 bg-[#05180f] border-t border-emerald-950 text-center text-xs text-emerald-200/80 font-medium">
                {alt}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default ArticleInlineImage;
