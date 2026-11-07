"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Pause, Play, Sparkles } from "lucide-react";
import { formatGoogleDriveImageUrl } from "@/lib/utils";

export interface HeroSlide {
  src: string;
  alt: string;
  label?: string;
}

export const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    src: "/images/hero/hero-banner-1-updated.webp",
    alt: "Buhary Janaza Welfare Society Official Community Services & Funeral Care, Mullipothana",
    label: "Official Society",
  },
  {
    src: "/images/hero/hero-banner-2-updated.webp",
    alt: "24/7 Dignified Islamic Janaza, Washing, Shrouding & Funeral Assistance Services",
    label: "24/7 Janaza Care",
  },
  {
    src: "/images/hero/hero-banner-3-updated.webp",
    alt: "Mahallah Cemetery Grounds Preservation, Landscaping and Cleanliness Upkeep",
    label: "Cemetery Upkeep",
  },
  {
    src: "/images/hero/hero-banner-4-updated.webp",
    alt: "Community Shramadana Cleanliness and Youth Volunteering Campaigns",
    label: "Community Shramadana",
  },
  {
    src: "/images/hero/hero-banner-5-updated.webp",
    alt: "Essential Needs Food Packs & Ongoing Welfare Relief for Vulnerable Families",
    label: "Welfare & Relief",
  },
  {
    src: "/images/hero/hero-banner-6-updated.webp",
    alt: "Youth Sunnah Ghusl, Kafan & Funeral Awareness Educational Workshops",
    label: "Sunnah Workshops",
  },
  {
    src: "/images/hero/hero-banner-7-updated.webp",
    alt: "Kafalah Orphan Care and Vulnerable Household Sustenance Sponsorship",
    label: "Kafalah Sponsorship",
  },
];

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
  slides = DEFAULT_HERO_SLIDES,
  intervalMs = 5000,
  className = "",
}: HeroSlideshowProps) {
  const activeSlides = slides && slides.length > 0 ? slides : DEFAULT_HERO_SLIDES;
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const [touchStart, setTouchStart] = React.useState<number | null>(null);

  const total = activeSlides.length;

  const goToNext = React.useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const goToPrev = React.useCallback(() => {
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
              isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
            aria-hidden={!isActive}
          >
            <div
              className={`relative h-full w-full transition-transform duration-[6500ms] ease-out will-change-transform ${
                isActive ? "scale-106" : "scale-100"
              }`}
            >
              <Image
                src={formatGoogleDriveImageUrl(slide.src)}
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
      <div className="absolute inset-0 z-15 bg-gradient-to-t sm:bg-gradient-to-r from-[#04190f]/85 via-[#062416]/50 to-[#04190f]/15 pointer-events-none" />

      {/* Bottom blend: smoothly merges the image bottom into the overlapping card section */}
      <div className="absolute inset-x-0 bottom-0 h-44 z-15 bg-gradient-to-t from-[#072115] via-[#072115]/50 to-transparent pointer-events-none" />

      {/* Ambient radial vignette for subtle cinematic depth */}
      <div className="absolute inset-0 z-15 bg-radial-at-c from-transparent via-transparent to-black/20 pointer-events-none" />

      {/* 3. Floating Modern Glassmorphism Micro-Controls */}
      <div className="absolute bottom-28 sm:bottom-32 lg:bottom-36 right-4 sm:right-8 lg:right-12 z-25 flex flex-col items-end gap-2">
        {/* Floating Slide Tag Badge */}
        {currentSlide.label && (
          <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-black/45 backdrop-blur-md border border-white/20 px-3 py-1 text-[11px] font-semibold text-[#d4af37] shadow-lg animate-in fade-in duration-300">
            <Sparkles className="h-3 w-3 text-[#d4af37]" />
            <span>{currentSlide.label}</span>
          </div>
        )}

        {/* Control Pill (Counter, 7 Segmented Progress Bars, and Chevrons) */}
        <div className="flex items-center gap-3 bg-black/45 backdrop-blur-md px-3.5 py-2 rounded-full border border-white/20 shadow-2xl">
          {/* Slide Counter */}
          <span className="font-mono text-[11px] font-bold tracking-wider text-[#d4af37] pl-1">
            {String(currentIndex + 1).padStart(2, "0")}
            <span className="text-white/40 font-normal mx-1">/</span>
            {String(total).padStart(2, "0")}
          </span>

          {/* 7 Segmented Progress Bars */}
          <div className="flex items-center gap-1.5" role="tablist" aria-label="Slideshow indicators">
            {activeSlides.map((_, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  className={`relative h-1.5 rounded-full transition-all duration-300 overflow-hidden cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#d4af37] ${
                    isActive
                      ? "w-7 sm:w-9 bg-white/25"
                      : "w-2.5 sm:w-3.5 bg-white/30 hover:bg-white/50"
                  }`}
                  title={`Go to slide ${idx + 1}`}
                  role="tab"
                  aria-selected={isActive}
                >
                  {isActive && (
                    <span
                      key={`progress-${currentIndex}-${isPaused}`}
                      className="absolute inset-0 bg-[#d4af37] rounded-full origin-left"
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
          <div className="flex items-center gap-1 pl-1 border-l border-white/20">
            <button
              type="button"
              onClick={goToPrev}
              className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
              title="Previous slide"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setIsPaused((prev) => !prev)}
              className="p-1 rounded-full text-white/80 hover:text-[#d4af37] hover:bg-white/15 transition-colors cursor-pointer"
              title={isPaused ? "Play slideshow" : "Pause slideshow"}
              aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
            >
              {isPaused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
            </button>

            <button
              type="button"
              onClick={goToNext}
              className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
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
