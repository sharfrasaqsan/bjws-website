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
import { cn, formatGoogleDriveImageUrl } from "@/lib/utils";
import { Tag, Eye } from "lucide-react";

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
  };
}

export function GalleryGrid({ images, translations }: GalleryGridProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<
    GalleryCategory | "all"
  >("all");
  const [activeImageIndex, setActiveImageIndex] = React.useState<number | null>(
    null
  );

  const filteredImages = React.useMemo(() => {
    if (selectedCategory === "all") return images;
    return images.filter((img) => img.category === selectedCategory);
  }, [images, selectedCategory]);

  const getCaption = (key: string) => translations.captions[key] || key;
  const getCategoryTitle = (cat: string) => translations.categories[cat] || cat;

  return (
    <div className="space-y-8">
      {/* Category Filter Tabs & Photo Counter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#e6e4dc] pb-5">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
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

          {GALLERY_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.key;

            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setSelectedCategory(cat.key)}
                aria-pressed={isSelected}
                className={cn(
                  "rounded-full px-4 py-2 text-xs font-semibold transition-all cursor-pointer shadow-2xs",
                  "focus-visible:ring-2 focus-visible:ring-[#124d34] focus-visible:outline-none",
                  isSelected
                    ? "bg-[#124d34] text-white shadow-xs"
                    : "bg-white text-[#4b5563] hover:text-[#0b2e1e] hover:bg-[#f3f1ea] border border-[#e6e4dc]"
                )}
              >
                {getCategoryTitle(cat.key)}
              </button>
            );
          })}
        </div>

        <div className="text-xs font-medium text-[#6b7280] shrink-0">
          Showing <strong className="text-[#0b2e1e] font-semibold">{filteredImages.length}</strong> {filteredImages.length === 1 ? "photo" : "photos"}
        </div>
      </div>

      {/* Image Grid with Staggered Scroll Reveal */}
      <ScrollRevealGroup
        staggerMs={40}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7"
      >
        {filteredImages.map((image, index) => {
          const caption = getCaption(image.captionKey);
          const categoryTitle = getCategoryTitle(image.category);
          const formattedSrc = formatGoogleDriveImageUrl(image.src);

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
                  unoptimized={formattedSrc.includes("googleusercontent.com")}
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
