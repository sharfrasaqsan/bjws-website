"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Pause, Play, Sparkles } from "lucide-react";

export interface HeroSlide {
  src: string;
  alt: string;
  label?: string;
}

export const DEFAULT_HERO_SLIDES: HeroSlide[] = [];

interface HeroSlideshowProps {
  slides?: HeroSlide[];
  intervalMs?: number;
  className?: string;
}

/**
 * Modern Cinematic Hero Slideshow:
 * - High-visibility background imagery with sheer evergreen atmospheric scrim.
 * - Silky smooth cross-fade with gentle Ken Burns ambient zoom.
 * - 5-second automatic progression with live animated gold progress line.
 * - Interactive slide selection, touch swipe support, and pause-on-hover capability.
 * - Optimized with Next.js image priority for LCP performance and zero layout shift.
 */
export function HeroSlideshow({
  slides = [],
  intervalMs = 5000,
  className = "",
}: HeroSlideshowProps) {
  const activeSlides = slides || [];
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const [touchStart, setTouchStart] = React.useState<number | null>(null);

  const total = activeSlides.length;

  const goToNext = React.useCallback(() => {
    if (total === 0) return;
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const goToPrev = React.useCallback(() => {
    if (total === 0) return;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const goToSlide = (idx: number) => {
    setCurrentIndex(idx);
  };

  // Auto-advance timer (5 seconds)
  React.useEffect(() => {
    if (isPaused || total <= 1) return;

    const timer = setInterval(() => {
      goToNext();
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPaused, intervalMs, total, goToNext, currentIndex]);

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "ArrowLeft") goToPrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, goToPrev]);

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 50) goToNext();
    else if (diff < -50) goToPrev();
    setTouchStart(null);
  };

  if (total === 0) {
    return (
      <div
        className={`absolute inset-0 z-0 overflow-hidden bg-gradient-to-br from-[#062416] via-[#041a10] to-[#021009] ${className}`}
        aria-hidden="true"
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#04190f]/85 via-[#062416]/50 to-[#04190f]/15 sm:bg-gradient-to-r" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#072115] via-[#072115]/50 to-transparent" />
      </div>
    );
  }

  const currentSlide = activeSlides[currentIndex] || activeSlides[0];

  return (
    <div
      className={`absolute inset-0 z-0 overflow-hidden select-none ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Homepage Hero Image Slideshow"
    >
      {/* 1. Stitched Cinematic Cross-fade Layers */}
      {activeSlides.map((slide, idx) => {
        const isActive = idx === currentIndex;
        const isPriority = idx === 0;

        return (
          <div
            key={slide.src + idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive
                ? "z-10 opacity-100"
                : "pointer-events-none z-0 opacity-0"
            }`}
            aria-hidden={!isActive}
          >
            <div
              className={`relative h-full w-full transition-transform duration-[6500ms] ease-out will-change-transform ${
                isActive ? "scale-106" : "scale-100"
              }`}
            >
              <Image
                src={slide.src}
                alt={slide.alt || `BJWS Community Slide ${idx + 1}`}
                fill
                priority={isPriority}
                quality={85}
                sizes="100vw"
                className="object-cover object-center"
              />
            </div>
          </div>
        );
      })}

      {/* 2. Refined High-Visibility Evergreen Scrim Overlays */}
      {/* Directional scrim: darker on left behind the headline text, gracefully translucent on right so photos are vibrant */}
      <div className="pointer-events-none absolute inset-0 z-15 bg-gradient-to-t from-[#04190f]/85 via-[#062416]/50 to-[#04190f]/15 sm:bg-gradient-to-r" />

      {/* Bottom blend: smoothly merges the image bottom into the overlapping card section */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-15 h-44 bg-gradient-to-t from-[#072115] via-[#072115]/50 to-transparent" />

      {/* Ambient radial vignette for subtle cinematic depth */}
      <div className="bg-radial-at-c pointer-events-none absolute inset-0 z-15 from-transparent via-transparent to-black/20" />

      {/* 3. Floating Modern Glassmorphism Micro-Controls */}
      <div className="absolute right-4 bottom-28 z-25 flex flex-col items-end gap-2 sm:right-8 sm:bottom-32 lg:right-12 lg:bottom-36">
        {/* Floating Slide Tag Badge */}
        {currentSlide.label && (
          <div className="animate-in fade-in hidden items-center gap-1.5 rounded-full border border-white/20 bg-black/45 px-3 py-1 text-[11px] font-semibold text-[#d4af37] shadow-lg backdrop-blur-md duration-300 sm:inline-flex">
            <Sparkles className="h-3 w-3 text-[#d4af37]" />
            <span>{currentSlide.label}</span>
          </div>
        )}

        {/* Control Pill (Counter, 7 Segmented Progress Bars, and Chevrons) */}
        <div className="flex items-center gap-3 rounded-full border border-white/20 bg-black/45 px-3.5 py-2 shadow-2xl backdrop-blur-md">
          {/* Slide Counter */}
          <span className="pl-1 font-mono text-[11px] font-bold tracking-wider text-[#d4af37]">
            {String(currentIndex + 1).padStart(2, "0")}
            <span className="mx-1 font-normal text-white/40">/</span>
            {String(total).padStart(2, "0")}
          </span>

          {/* 7 Segmented Progress Bars */}
          <div
            className="flex items-center gap-1.5"
            role="tablist"
            aria-label="Slideshow indicators"
          >
            {activeSlides.map((_, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  className={`relative h-1.5 cursor-pointer overflow-hidden rounded-full transition-all duration-300 focus:ring-1 focus:ring-[#d4af37] focus:outline-none ${
                    isActive
                      ? "w-7 bg-white/25 sm:w-9"
                      : "w-2.5 bg-white/30 hover:bg-white/50 sm:w-3.5"
                  }`}
                  title={`Go to slide ${idx + 1}`}
                  role="tab"
                  aria-selected={isActive}
                >
                  {isActive && (
                    <span
                      key={`progress-${currentIndex}-${isPaused}`}
                      className="absolute inset-0 origin-left rounded-full bg-[#d4af37]"
                      style={{
                        animation: isPaused
                          ? "none"
                          : `heroSlideProgress ${intervalMs}ms linear forwards`,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Mini Navigation Chevrons */}
          <div className="flex items-center gap-1 border-l border-white/20 pl-1">
            <button
              type="button"
              onClick={goToPrev}
              className="cursor-pointer rounded-full p-1 text-white/80 transition-colors hover:bg-white/15 hover:text-white"
              title="Previous slide"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setIsPaused((prev) => !prev)}
              className="cursor-pointer rounded-full p-1 text-white/80 transition-colors hover:bg-white/15 hover:text-[#d4af37]"
              title={isPaused ? "Play slideshow" : "Pause slideshow"}
              aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
            >
              {isPaused ? (
                <Play className="h-3 w-3" />
              ) : (
                <Pause className="h-3 w-3" />
              )}
            </button>

            <button
              type="button"
              onClick={goToNext}
              className="cursor-pointer rounded-full p-1 text-white/80 transition-colors hover:bg-white/15 hover:text-white"
              title="Next slide"
              aria-label="Next slide"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
