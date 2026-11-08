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
        className={`bg-surface my-8 overflow-hidden rounded-2xl border border-[#e6e4dc] shadow-md ${className}`}
      >
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="bg-muted group relative block aspect-[16/10] w-full cursor-pointer overflow-hidden border-0 p-0 text-left focus:ring-2 focus:ring-[#c99a45] focus:outline-hidden"
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
          <div className="absolute inset-0 bg-black/10 opacity-0 transition-opacity group-hover:opacity-100" />

          {/* Top-Right Pill Badge */}
          <div className="absolute top-3 right-3 opacity-0 transition-opacity group-hover:opacity-100">
            <span className="inline-flex items-center gap-1 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white shadow-xs backdrop-blur-xs">
              <ZoomIn className="h-3.5 w-3.5 text-[#d4af37]" />
              <span>Enlarge</span>
            </span>
          </div>
        </button>

        {alt && (
          <figcaption className="text-text-muted border-t border-[#f0eee6] bg-[#fbfaf6] p-3 text-center text-xs italic">
            {alt}
          </figcaption>
        )}
      </figure>

      {/* Lightbox Preview Modal */}
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
                  {alt || "Article illustration"}
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

            {/* Photo Preview */}
            <div className="relative aspect-[16/10] w-full bg-black sm:aspect-[16/9]">
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
              <div className="border-t border-emerald-950 bg-[#05180f] p-4 text-center text-xs font-medium text-emerald-200/80">
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
