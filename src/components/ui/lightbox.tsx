"use client";

import * as React from "react";
import Image from "next/image";
import { type GalleryImage } from "@/content/gallery";
import { Badge } from "./badge";
import { cn } from "@/lib/utils";

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
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);
  const activeImage = images[currentIndex];

  const handleNext = React.useCallback(() => {
    onNavigate((currentIndex + 1) % images.length);
  }, [currentIndex, images.length, onNavigate]);

  const handlePrev = React.useCallback(() => {
    onNavigate((currentIndex - 1 + images.length) % images.length);
  }, [currentIndex, images.length, onNavigate]);

  // Keyboard navigation & Focus trapping
  React.useEffect(() => {
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
      } else if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", handleKeyDown);
    const timer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timer);
    };
  }, [isOpen, onClose, handleNext, handlePrev]);

  if (!isOpen || !activeImage) return null;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Image Preview Lightbox"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Main Lightbox Modal */}
      <div className="bg-surface border-border relative z-10 flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border p-4 shadow-2xl sm:p-6">
        {/* Header Controls */}
        <div className="border-border flex items-center justify-between border-b pb-3 text-sm">
          <div className="flex items-center gap-2.5">
            <Badge variant="primary" size="sm">
              {getCategoryTitle(activeImage.category)}
            </Badge>
            <span className="text-text-muted font-mono text-xs">
              {currentIndex + 1} / {images.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-text-muted hidden text-xs sm:inline">
              Use Esc to close, Arrow keys to navigate
            </span>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Close Lightbox"
              className="text-text hover:bg-muted focus-visible:ring-ring rounded-lg p-1.5 focus-visible:ring-2 focus-visible:outline-none"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Image Display Area */}
        <div className="relative my-3 flex min-h-[280px] flex-1 items-center justify-center overflow-hidden rounded-xl bg-black/5 sm:min-h-[460px]">
          <Image
            src={activeImage.src}
            alt={getCaption(activeImage.captionKey)}
            width={activeImage.width}
            height={activeImage.height}
            placeholder="blur"
            blurDataURL={activeImage.blurDataURL}
            className="max-h-[65vh] w-auto max-w-full rounded-lg object-contain"
            priority
          />

          {/* Previous Button */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous Image"
              className={cn(
                "bg-surface/90 text-text border-border absolute top-1/2 left-2 -translate-y-1/2 rounded-full border p-2.5 shadow-md",
                "hover:bg-surface focus-visible:ring-ring transition-all hover:scale-105 focus-visible:ring-2 focus-visible:outline-none active:scale-95"
              )}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}

          {/* Next Button */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next Image"
              className={cn(
                "bg-surface/90 text-text border-border absolute top-1/2 right-2 -translate-y-1/2 rounded-full border p-2.5 shadow-md",
                "hover:bg-surface focus-visible:ring-ring transition-all hover:scale-105 focus-visible:ring-2 focus-visible:outline-none active:scale-95"
              )}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Footer Details */}
        <div className="border-border text-text-muted flex flex-col justify-between gap-2 border-t pt-2 text-xs sm:flex-row sm:items-center">
          <p className="text-text text-sm font-medium">
            {getCaption(activeImage.captionKey)}
          </p>
          <div className="flex shrink-0 items-center gap-3">
            <span>{activeImage.location}</span>
            <span>•</span>
            <span>{activeImage.date}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
