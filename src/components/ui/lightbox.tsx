"use client";

import * as React from "react";
import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { type GalleryImage } from "@/content/gallery";
import { formatGoogleDriveImageUrl } from "@/lib/utils";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  Tag,
  Sparkles,
} from "lucide-react";

interface LightboxProps {
  images: GalleryImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
  getCaption: (key: string) => string;
  getCategoryTitle: (cat: string) => string;
}

export function Lightbox({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
  getCaption,
  getCategoryTitle,
}: LightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const activeThumbnailRef = useRef<HTMLButtonElement>(null);
  const activeImage = images[currentIndex];

  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [showThumbnails, setShowThumbnails] = useState<boolean>(true);

  // Touch swipe tracking
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const touchEndY = useRef<number>(0);

  const handleNext = useCallback(() => {
    setZoomLevel(1);
    onNavigate((currentIndex + 1) % images.length);
  }, [currentIndex, images.length, onNavigate]);

  const handlePrev = useCallback(() => {
    setZoomLevel(1);
    onNavigate((currentIndex - 1 + images.length) % images.length);
  }, [currentIndex, images.length, onNavigate]);

  const toggleZoom = useCallback(() => {
    setZoomLevel((prev) => (prev === 1 ? 2 : prev === 2 ? 1 : 1));
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      dialogRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  }, []);

  const handleCopyLink = useCallback(async () => {
    if (!activeImage) return;
    const url = formatGoogleDriveImageUrl(activeImage.src);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy image link:", url);
    }
  }, [activeImage]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "+" || e.key === "=" || e.key.toLowerCase() === "z") {
        e.preventDefault();
        toggleZoom();
      } else if (e.key === "-") {
        e.preventDefault();
        setZoomLevel(1);
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, handleNext, handlePrev, toggleZoom]);

  // Scroll active thumbnail into view
  useEffect(() => {
    if (activeThumbnailRef.current) {
      activeThumbnailRef.current.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [currentIndex]);

  // Reset zoom when active index changes (recommended React render-phase state adjustment)
  const [prevIndex, setPrevIndex] = useState(currentIndex);
  if (prevIndex !== currentIndex) {
    setPrevIndex(currentIndex);
    setZoomLevel(1);
  }

  // Touch Swipe Handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
    touchEndY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    const diffX = touchStartX.current - touchEndX.current;
    const diffY = touchStartY.current - touchEndY.current;

    // Horizontal swipe threshold 50px
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
      if (diffX > 0) {
        handleNext(); // Swiped left -> show next
      } else {
        handlePrev(); // Swiped right -> show prev
      }
    } else if (diffY < -80 && Math.abs(diffX) < 50) {
      // Swiped down -> close
      onClose();
    }
  };

  if (!isOpen || !activeImage) return null;

  const formattedSrc = formatGoogleDriveImageUrl(activeImage.src);
  const caption = getCaption(activeImage.captionKey);
  const categoryTitle = getCategoryTitle(activeImage.category);

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Image Preview Lightbox"
      className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-md select-none animate-in fade-in duration-200"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* TOP HEADER CONTROLS BAR */}
      <header className="relative z-20 flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 border-b border-white/10 bg-black/40 backdrop-blur-md text-white">
        {/* Category Badge & Image Counter */}
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#124d34] text-[#d4af37] px-3 py-1 font-serif text-xs font-bold border border-[#c99a45]/30 shadow-xs">
            <Tag className="h-3 w-3" />
            <span>{categoryTitle}</span>
          </span>

          <span className="font-mono text-xs text-white/70">
            {currentIndex + 1} / {images.length}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Zoom toggle button */}
          <button
            type="button"
            onClick={toggleZoom}
            aria-label={zoomLevel > 1 ? "Zoom Out" : "Zoom In"}
            title={zoomLevel > 1 ? "Zoom Out (or press -)" : "Zoom In (or press +)"}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
          >
            {zoomLevel > 1 ? (
              <ZoomOut className="h-4 w-4" />
            ) : (
              <ZoomIn className="h-4 w-4" />
            )}
          </button>

          {/* Fullscreen toggle button */}
          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            className="hidden sm:flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </button>

          {/* Copy link button */}
          <button
            type="button"
            onClick={handleCopyLink}
            aria-label="Copy image link"
            title="Copy image link"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
          >
            {copied ? (
              <Check className="h-4 w-4 text-emerald-400" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Lightbox"
            title="Close (Esc)"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 hover:bg-red-600/80 text-white transition-all ml-1 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* MAIN VIEWPORT DISPLAY AREA */}
      <main
        className="relative flex-1 flex items-center justify-center overflow-hidden p-2 sm:p-6"
        onClick={() => {
          if (zoomLevel > 1) setZoomLevel(1);
        }}
      >
        {/* Floating Prev Button */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            aria-label="Previous Image"
            title="Previous (Left Arrow)"
            className="absolute left-2 sm:left-6 z-20 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-black/60 hover:bg-[#124d34] text-white backdrop-blur-md border border-white/15 shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}

        {/* Central High-Res Photo Container */}
        <div
          className="relative max-h-[72vh] sm:max-h-[78vh] w-full h-full flex items-center justify-center transition-transform duration-300 ease-out cursor-zoom-in"
          style={{
            transform: `scale(${zoomLevel})`,
            cursor: zoomLevel > 1 ? "zoom-out" : "zoom-in",
          }}
          onDoubleClick={(e) => {
            e.stopPropagation();
            toggleZoom();
          }}
        >
          <Image
            src={formattedSrc}
            alt={caption}
            fill
            priority
            unoptimized={formattedSrc.includes("googleusercontent.com")}
            sizes="(max-width: 1280px) 100vw, 1600px"
            className="object-contain"
          />
        </div>

        {/* Floating Next Button */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            aria-label="Next Image"
            title="Next (Right Arrow)"
            className="absolute right-2 sm:right-6 z-20 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-black/60 hover:bg-[#124d34] text-white backdrop-blur-md border border-white/15 shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        )}
      </main>

      {/* BOTTOM CAPTION BAR */}
      <footer className="relative z-20 px-4 py-3 sm:px-6 bg-black/50 backdrop-blur-md border-t border-white/10 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 max-w-5xl mx-auto">
          <div className="space-y-0.5">
            <h3 className="font-serif text-sm sm:text-base font-semibold text-white drop-shadow-sm line-clamp-2">
              {caption}
            </h3>
            <p className="text-xs text-[#d4af37] font-medium flex items-center gap-1.5">
              <Sparkles className="h-3 w-3" />
              <span>Buhary Janaza Welfare Society Official Archive</span>
            </p>
          </div>

          {images.length > 1 && (
            <button
              type="button"
              onClick={() => setShowThumbnails((p) => !p)}
              className="self-start sm:self-auto text-[11px] font-semibold text-white/70 hover:text-white underline underline-offset-2 cursor-pointer transition-colors"
            >
              {showThumbnails ? "Hide Thumbnails" : "Show Thumbnails"}
            </button>
          )}
        </div>

        {/* BOTTOM THUMBNAIL CAROUSEL STRIP */}
        {showThumbnails && images.length > 1 && (
          <div className="max-w-5xl mx-auto pt-1 pb-1">
            <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-thin scrollbar-thumb-white/20">
              {images.map((img, idx) => {
                const isSelected = idx === currentIndex;
                const thumbUrl = formatGoogleDriveImageUrl(img.src);
                return (
                  <button
                    key={img.id || idx}
                    ref={isSelected ? activeThumbnailRef : null}
                    type="button"
                    onClick={() => {
                      setZoomLevel(1);
                      onNavigate(idx);
                    }}
                    aria-label={`Jump to photo ${idx + 1}`}
                    className={`relative h-12 w-16 sm:h-14 sm:w-20 shrink-0 rounded-lg overflow-hidden transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "ring-2 ring-[#c99a45] scale-105 opacity-100 shadow-md"
                        : "opacity-40 hover:opacity-85 border border-white/20"
                    }`}
                  >
                    <Image
                      src={thumbUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      unoptimized={thumbUrl.includes("googleusercontent.com")}
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </footer>
    </div>
  );
}
