"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import {
  type GalleryImage,
  type GalleryCategory,
  GALLERY_CATEGORIES,
} from "@/content/gallery";
import { ScrollRevealGroup } from "@/components/ui/scroll-reveal";
import { cn } from "@/lib/utils";
import { Tag, Eye, ChevronDown, Camera } from "lucide-react";

// Dynamically load Lightbox so initial page load JS is minimal (Lighthouse 95+ target)
const Lightbox = dynamic(
  () => import("@/components/ui/lightbox").then((mod) => mod.Lightbox),
  { ssr: false }
);

interface GalleryGridProps {
  images: GalleryImage[];
  translations: {
    allCategory: string;
    categories: Record<string, string>;
    captions: Record<string, string>;
    viewInLightbox: string;
    noPhotosTitle?: string;
    noPhotosDesc?: string;
    noPhotosCategoryTitle?: string;
    noPhotosCategoryDesc?: string;
    viewAllPhotos?: string;
  };
}

const INITIAL_COUNT = 15;
const LOAD_MORE_STEP = 15;

export function GalleryGrid({ images, translations }: GalleryGridProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<
    GalleryCategory | "all"
  >("all");
  const [visibleCount, setVisibleCount] = React.useState<number>(INITIAL_COUNT);
  const [activeImageIndex, setActiveImageIndex] = React.useState<number | null>(
    null
  );

  const filteredImages = React.useMemo(() => {
    if (selectedCategory === "all") return images;
    return images.filter((img) => img.category === selectedCategory);
  }, [images, selectedCategory]);

  const handleCategorySelect = (cat: GalleryCategory | "all") => {
    setSelectedCategory(cat);
    setVisibleCount(INITIAL_COUNT);
  };

  const visibleImages = React.useMemo(() => {
    return filteredImages.slice(0, visibleCount);
  }, [filteredImages, visibleCount]);

  const hasMore = visibleCount < filteredImages.length;
  const remainingCount = filteredImages.length - visibleCount;

  const availableCategories = React.useMemo(() => {
    const list: Array<{ key: string; title: string }> = [];
    const seen = new Set<string>();

    // 1. Built-in categories
    GALLERY_CATEGORIES.forEach((cat) => {
      seen.add(cat.key);
      list.push({
        key: cat.key,
        title:
          translations.categories[cat.key] ||
          cat.key.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      });
    });

    // 2. Any dynamically added categories in images
    images.forEach((img) => {
      if (img.category && !seen.has(img.category)) {
        seen.add(img.category);
        list.push({
          key: img.category,
          title:
            translations.categories[img.category] ||
            img.category
              .replace(/-/g, " ")
              .replace(/\b\w/g, (c) => c.toUpperCase()),
        });
      }
    });

    return list;
  }, [images, translations]);

  const getCaption = (key: string) => translations.captions[key] || key;
  const getCategoryTitle = (cat: string) => {
    const matched = availableCategories.find((c) => c.key === cat);
    return (
      matched?.title ||
      translations.categories[cat] ||
      cat.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    );
  };

  if (images.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-[#d8d5cb] bg-white p-10 sm:p-16 text-center shadow-xs my-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f3f1ea] text-[#124d34] mb-4">
          <Camera className="h-8 w-8 text-[#c99a45]" />
        </div>
        <h3 className="font-serif text-lg sm:text-xl font-bold text-[#0b2e1e]">
          {translations.noPhotosTitle || "No Photos Cataloged Yet"}
        </h3>
        <p className="mt-2 text-xs sm:text-sm text-[#6b7280] max-w-md mx-auto leading-relaxed">
          {translations.noPhotosDesc ||
            "Community welfare activities, cemetery shramadhana programs, and official society events will be photographed and documented here soon."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Category Filter Tabs & Photo Counter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#e6e4dc] pb-5">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleCategorySelect("all")}
            aria-pressed={selectedCategory === "all"}
            className={cn(
              "rounded-full px-4 py-2 text-xs font-semibold transition-all cursor-pointer shadow-2xs",
              "focus-visible:ring-2 focus-visible:ring-[#124d34] focus-visible:outline-none",
              selectedCategory === "all"
                ? "bg-[#124d34] text-white shadow-xs"
                : "bg-white text-[#4b5563] hover:text-[#0b2e1e] hover:bg-[#f3f1ea] border border-[#e6e4dc]"
            )}
          >
            {translations.allCategory}
          </button>

          {availableCategories.map((cat) => {
            const isSelected = selectedCategory === cat.key;

            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => handleCategorySelect(cat.key)}
                aria-pressed={isSelected}
                className={cn(
                  "rounded-full px-4 py-2 text-xs font-semibold transition-all cursor-pointer shadow-2xs",
                  "focus-visible:ring-2 focus-visible:ring-[#124d34] focus-visible:outline-none",
                  isSelected
                    ? "bg-[#124d34] text-white shadow-xs"
                    : "bg-white text-[#4b5563] hover:text-[#0b2e1e] hover:bg-[#f3f1ea] border border-[#e6e4dc]"
                )}
              >
                {cat.title}
              </button>
            );
          })}
        </div>

        <div className="text-xs font-medium text-[#6b7280] shrink-0">
          Showing{" "}
          <strong className="text-[#0b2e1e] font-semibold">
            {Math.min(visibleCount, filteredImages.length)}
          </strong>{" "}
          of{" "}
          <strong className="text-[#0b2e1e] font-semibold">
            {filteredImages.length}
          </strong>{" "}
          {filteredImages.length === 1 ? "photo" : "photos"}
        </div>
      </div>

      {/* Empty State when category has no photos */}
      {filteredImages.length === 0 && (
        <div className="rounded-3xl border border-dashed border-[#d8d5cb] bg-white p-10 sm:p-14 text-center shadow-xs my-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f3f1ea] text-[#124d34] mb-3">
            <Camera className="h-7 w-7 text-[#c99a45]" />
          </div>
          <h3 className="font-serif text-base sm:text-lg font-bold text-[#0b2e1e]">
            {translations.noPhotosCategoryTitle || "No Photos in This Album"}
          </h3>
          <p className="mt-1.5 text-xs sm:text-sm text-[#6b7280] max-w-md mx-auto leading-relaxed">
            {translations.noPhotosCategoryDesc ||
              "There are currently no photos uploaded under this specific album category. Select another album or return to all photos."}
          </p>
          <button
            type="button"
            onClick={() => handleCategorySelect("all")}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#124d34] hover:bg-[#0b2e1e] text-white px-5 py-2 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <span>
              {translations.viewAllPhotos ||
                translations.allCategory ||
                "View All Photos"}
            </span>
          </button>
        </div>
      )}

      {/* Image Grid with Staggered Scroll Reveal */}
      {visibleImages.length > 0 && (
        <ScrollRevealGroup
          staggerMs={40}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7"
        >
          {visibleImages.map((image, index) => {
            const caption = getCaption(image.captionKey);
            const categoryTitle = getCategoryTitle(image.category);
            const formattedSrc = image.src;

            return (
              <div
                key={image.id}
                className="group relative cursor-pointer overflow-hidden rounded-2xl bg-surface border border-[#e6e4dc] shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[#124d34]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#124d34]"
                onClick={() => setActiveImageIndex(index)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveImageIndex(index);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`${caption} - ${translations.viewInLightbox}`}
              >
                {/* Responsive Image Container (4:3 Aspect Ratio) */}
                <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
                  <Image
                    src={formattedSrc}
                    alt={getCaption(image.altKey)}
                    width={image.width}
                    height={image.height}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    placeholder="blur"
                    blurDataURL={image.blurDataURL}
                    loading={index < 3 ? "eager" : "lazy"}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Subtle vignette gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent opacity-75 group-hover:opacity-90 transition-opacity duration-300 pointer-events-none" />

                  {/* Pinned Category Tag */}
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#0b2e1e]/85 backdrop-blur-xs text-[#d4af37] px-2.5 py-1 text-[11px] font-semibold border border-[#c99a45]/30 shadow-xs">
                      <Tag className="h-3 w-3" />
                      <span>{categoryTitle}</span>
                    </span>
                  </div>

                  {/* Quick Enlarge Hover Indicator */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-xs shadow-md">
                      <Eye className="h-4 w-4" />
                    </span>
                  </div>

                  {/* Clean In-Photo Bottom Caption */}
                  <div className="absolute bottom-0 inset-x-0 p-4 text-white pointer-events-none">
                    <h3 className="font-serif text-sm sm:text-base font-semibold leading-snug line-clamp-2 drop-shadow-sm group-hover:text-[#fbfaf6] transition-colors">
                      {caption}
                    </h3>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollRevealGroup>
      )}

      {/* Load More Pagination Strip */}
      {hasMore && (
        <div className="pt-6 sm:pt-8 flex flex-col items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setVisibleCount((prev) => prev + LOAD_MORE_STEP)}
            className="group inline-flex items-center gap-2.5 rounded-full bg-[#124d34] hover:bg-[#0b2e1e] text-white px-7 py-3 text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
          >
            <span>Load More Photos</span>
            <span className="rounded-full bg-white/15 px-2 py-0.5 text-[11px] font-bold">
              +{Math.min(LOAD_MORE_STEP, remainingCount)}
            </span>
            <ChevronDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
          </button>
          <p className="text-xs text-[#6b7280]">
            Showing {Math.min(visibleCount, filteredImages.length)} of{" "}
            {filteredImages.length} photos in this album
          </p>
        </div>
      )}

      {/* All Photos Loaded Milestone */}
      {!hasMore && filteredImages.length > INITIAL_COUNT && (
        <div className="pt-6 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#f3f1ea] px-4 py-1.5 text-xs font-medium text-[#6b7280] border border-[#e6e4dc]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
            <span>All {filteredImages.length} photos loaded</span>
          </span>
        </div>
      )}

      {/* Dynamic Lightbox Modal */}
      {activeImageIndex !== null && (
        <Lightbox
          images={filteredImages}
          currentIndex={activeImageIndex}
          isOpen={activeImageIndex !== null}
          onClose={() => setActiveImageIndex(null)}
          onNavigate={(newIndex) => setActiveImageIndex(newIndex)}
          getCaption={getCaption}
          getCategoryTitle={getCategoryTitle}
        />
      )}
    </div>
  );
}
