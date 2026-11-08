"use client";

import * as React from "react";
import { useState } from "react";
import Image from "next/image";
import { type ArticleImage } from "@/content/news";
import {
  Camera,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";

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

  const currentImage =
    activeModalIndex !== null ? images[activeModalIndex] : null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeModalIndex !== null) {
      setActiveModalIndex(
        (activeModalIndex - 1 + images.length) % images.length
      );
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeModalIndex !== null) {
      setActiveModalIndex((activeModalIndex + 1) % images.length);
    }
  };

  return (
    <div className="mt-10 space-y-5 border-t border-[#e6e4dc] pt-8">
      {/* Gallery Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0b2e1e] text-[#d4a359]">
            <Camera className="h-4 w-4" />
          </div>
          <h3 className="font-display text-base font-bold text-[#0b2e1e] sm:text-lg">
            {title}
          </h3>
        </div>
        <span className="text-text-muted bg-surface-muted rounded-full border border-[#e6e4dc] px-2.5 py-1 text-xs font-semibold">
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
          const formattedUrl = img.url;
          return (
            <figure
              key={idx}
              onClick={() => setActiveModalIndex(idx)}
              className="group hover:border-primary/40 flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-[#e6e4dc] bg-white shadow-2xs transition-all duration-300 hover:shadow-md"
            >
              <div className="bg-muted relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={formattedUrl}
                  alt={img.alt || `Related article photo ${idx + 1}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-transparent to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-black/40 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-xs">
                    <Eye className="h-3.5 w-3.5 text-[#d4a359]" />
                    <span>View Photo</span>
                  </span>
                </div>
              </div>

              {(img.caption || img.alt) && (
                <figcaption className="text-text-muted border-t border-[#f0eee6] bg-[#fbfaf6] p-3 text-xs leading-relaxed">
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
          className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm duration-200 sm:p-6"
          onClick={() => setActiveModalIndex(null)}
        >
          <div
            className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-emerald-900 bg-[#072115] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-emerald-950 p-4 text-white">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-[#d4a359]">
                <Sparkles className="h-3.5 w-3.5" />
                Photo {activeModalIndex + 1} of {images.length}
              </span>
              <button
                type="button"
                onClick={() => setActiveModalIndex(null)}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                title="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Image */}
            <div className="relative aspect-[16/10] w-full bg-black sm:aspect-[16/9]">
              <Image
                src={currentImage.url}
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
                    className="absolute top-1/2 left-3 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
                    title="Previous photo"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="absolute top-1/2 right-3 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
                    title="Next photo"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>

            {/* Modal Caption */}
            {(currentImage.caption || currentImage.alt) && (
              <div className="border-t border-emerald-950 bg-[#0b2e1e] p-4 text-xs text-emerald-100 sm:text-sm">
                <p className="font-medium text-white">
                  {currentImage.caption || currentImage.alt}
                </p>
                {currentImage.caption &&
                  currentImage.alt &&
                  currentImage.caption !== currentImage.alt && (
                    <p className="mt-0.5 text-[11px] text-emerald-300/70">
                      Alt: {currentImage.alt}
                    </p>
                  )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
