"use client";

import * as React from "react";
import { useState } from "react";
import Image from "next/image";
import { type ArticleImage } from "@/content/news";
import { formatGoogleDriveImageUrl } from "@/lib/utils";
import { Camera, Eye, X, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

interface ArticleGalleryProps {
  images: ArticleImage[];
  title?: string;
}

export function ArticleGallery({
  images,
  title = "Article Media & Related Photos",
}: ArticleGalleryProps) {
  const [activeModalIndex, setActiveModalIndex] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  const currentImage = activeModalIndex !== null ? images[activeModalIndex] : null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeModalIndex !== null) {
      setActiveModalIndex((activeModalIndex - 1 + images.length) % images.length);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeModalIndex !== null) {
      setActiveModalIndex((activeModalIndex + 1) % images.length);
    }
  };

  return (
    <div className="mt-10 pt-8 border-t border-[#e6e4dc] space-y-5">
      {/* Gallery Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0b2e1e] text-[#d4a359]">
            <Camera className="h-4 w-4" />
          </div>
          <h3 className="font-display text-base sm:text-lg font-bold text-[#0b2e1e]">
            {title}
          </h3>
        </div>
        <span className="text-xs font-semibold text-text-muted bg-surface-muted px-2.5 py-1 rounded-full border border-[#e6e4dc]">
          {images.length} {images.length === 1 ? "Photo" : "Photos"}
        </span>
      </div>

      {/* Responsive Gallery Grid */}
      <div
        className={`grid gap-4 ${
          images.length === 1
            ? "grid-cols-1"
            : images.length === 2
            ? "grid-cols-1 sm:grid-cols-2"
            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        }`}
      >
        {images.map((img, idx) => {
          const formattedUrl = formatGoogleDriveImageUrl(img.url);
          return (
            <figure
              key={idx}
              onClick={() => setActiveModalIndex(idx)}
              className="group cursor-pointer overflow-hidden rounded-2xl border border-[#e6e4dc] bg-white shadow-2xs hover:shadow-md hover:border-primary/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                <Image
                  src={formattedUrl}
                  alt={img.alt || `Related article photo ${idx + 1}`}
                  fill
                  unoptimized={formattedUrl.includes("googleusercontent.com")}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-black/40 px-2.5 py-1 rounded-md backdrop-blur-xs">
                    <Eye className="h-3.5 w-3.5 text-[#d4a359]" />
                    <span>View Photo</span>
                  </span>
                </div>
              </div>

              {(img.caption || img.alt) && (
                <figcaption className="p-3 text-xs text-text-muted leading-relaxed border-t border-[#f0eee6] bg-[#fbfaf6]">
                  {img.caption || img.alt}
                </figcaption>
              )}
            </figure>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {currentImage && activeModalIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 sm:p-6 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setActiveModalIndex(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-[#072115] rounded-3xl overflow-hidden border border-emerald-900 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-emerald-950 text-white">
              <span className="text-xs font-semibold text-[#d4a359] flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                Photo {activeModalIndex + 1} of {images.length}
              </span>
              <button
                type="button"
                onClick={() => setActiveModalIndex(null)}
                className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                title="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Image */}
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-black">
              <Image
                src={formatGoogleDriveImageUrl(currentImage.url)}
                alt={currentImage.alt || "BJWS Article Photo"}
                fill
                unoptimized
                sizes="(max-width: 1024px) 100vw, 1000px"
                className="object-contain"
              />

              {/* Prev / Next controls */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors cursor-pointer"
                    title="Previous photo"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors cursor-pointer"
                    title="Next photo"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>

            {/* Modal Caption */}
            {(currentImage.caption || currentImage.alt) && (
              <div className="p-4 bg-[#0b2e1e] text-emerald-100 text-xs sm:text-sm border-t border-emerald-950">
                <p className="font-medium text-white">{currentImage.caption || currentImage.alt}</p>
                {currentImage.caption && currentImage.alt && currentImage.caption !== currentImage.alt && (
                  <p className="text-[11px] text-emerald-300/70 mt-0.5">Alt: {currentImage.alt}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

