"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import {
  type GalleryImage,
  type GalleryCategory,
  GALLERY_CATEGORIES,
} from "@/content/gallery";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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
    <div>
      {/* Category Filter Tabs */}
      <div className="border-border mb-8 flex flex-wrap items-center gap-2 border-b pb-4 sm:mb-10">
        <button
          type="button"
          onClick={() => setSelectedCategory("all")}
          aria-pressed={selectedCategory === "all"}
          className={cn(
            "rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors sm:text-sm",
            "focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none",
            selectedCategory === "all"
              ? "bg-primary text-primary-foreground font-semibold shadow-2xs"
              : "bg-surface text-text-muted hover:text-text hover:bg-muted border-border border"
          )}
        >
          {translations.allCategory} ({images.length})
        </button>

        {GALLERY_CATEGORIES.map((cat) => {
          const count = images.filter((img) => img.category === cat.key).length;
          const isSelected = selectedCategory === cat.key;

          return (
            <button
              key={cat.key}
              type="button"
              onClick={() => setSelectedCategory(cat.key)}
              aria-pressed={isSelected}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors sm:text-sm",
                "focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none",
                isSelected
                  ? "bg-primary text-primary-foreground font-semibold shadow-2xs"
                  : "bg-surface text-text-muted hover:text-text hover:bg-muted border-border border"
              )}
            >
              {getCategoryTitle(cat.key)} ({count})
            </button>
          );
        })}
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredImages.map((image, index) => {
          return (
            <Card
              key={image.id}
              className={cn(
                "group cursor-pointer overflow-hidden transition-all duration-200",
                "hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-md"
              )}
              onClick={() => setActiveImageIndex(index)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActiveImageIndex(index);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`${getCaption(image.captionKey)} - ${translations.viewInLightbox}`}
            >
              {/* Responsive Image Container */}
              <div className="bg-surface-muted relative aspect-4/3 overflow-hidden">
                <Image
                  src={image.src}
                  alt={getCaption(image.altKey)}
                  width={image.width}
                  height={image.height}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  placeholder="blur"
                  blurDataURL={image.blurDataURL}
                  loading={index < 3 ? "eager" : "lazy"}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-103 motion-reduce:transition-none"
                />

                {/* Badge Overlay */}
                <div className="absolute top-3 left-3">
                  <Badge
                    variant="primary"
                    size="sm"
                    className="shadow-xs backdrop-blur-xs"
                  >
                    {getCategoryTitle(image.category)}
                  </Badge>
                </div>

                {/* Expand Overlay Icon */}
                <div className="bg-primary/20 absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="bg-surface text-primary rounded-full p-2.5 shadow-md">
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
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                      />
                    </svg>
                  </span>
                </div>
              </div>

              {/* Card Meta Content */}
              <CardHeader className="p-4 sm:p-5">
                <CardTitle
                  as="h3"
                  className="group-hover:text-primary line-clamp-1 text-base transition-colors"
                >
                  {getCaption(image.captionKey)}
                </CardTitle>
                <CardDescription className="flex items-center justify-between pt-1 text-xs">
                  <span>{image.location}</span>
                  <span className="font-mono">{image.date}</span>
                </CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </div>

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
