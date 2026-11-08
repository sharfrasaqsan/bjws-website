/**
 * Core Gallery Types & Constants for Buhary Janaza Welfare Society (BJWS)
 *
 * Placed in a standalone file to ensure strictly acyclic module graphs
 * across static manifests, uploads, and UI components.
 */

export type GalleryCategory =
  | "cemetery-shramadana"
  | "water-concrete"
  | "cemetery-road"
  | "masjid-renovation"
  | "society-meetings"
  | "didwa-collection"
  | "didwa-welfare"
  | "funeral-education"
  | "education-aid"
  | "uzhiya"
  | "community-welfare"
  | "iftar"
  | (string & {});

export const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  iftar: "Iftar",
  uzhiya: "Uzhiya",
  "didwa-collection": "DIDWA Collection Campaign",
  "didwa-welfare": "DIDWA Welfare",
  "masjid-renovation": "Masjid Renewal & Renovation",
  "society-meetings": "Society Executive Meetings",
  "water-concrete": "Mosque Water & Concrete Works",
  "funeral-education": "Funeral & Janaza Education",
  "cemetery-road": "Cemetery Access Road",
  "cemetery-shramadana": "Cemetery Shramadhana",
  "education-aid": "Student Educational Aid",
  "community-welfare": "Community Welfare & Relief",
};

export function formatCategoryLabel(cat: string): string {
  if (CATEGORY_DISPLAY_NAMES[cat]) return CATEGORY_DISPLAY_NAMES[cat];
  return cat.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export interface GalleryCategoryMeta {
  key: GalleryCategory;
  titleKey: string;
  descriptionKey: string;
}

export interface GalleryImage {
  id: string;
  src: string;
  altKey: string;
  captionKey: string;
  category: GalleryCategory;
  date: string;
  location: string;
  width: number;
  height: number;
  blurDataURL: string;
  /**
   * Only images with approved: true are permitted to be rendered.
   * Requires explicit consent for photos showing identifiable persons, women, or children.
   */
  approved: boolean;
  /**
   * Optional notes on consent status for society records.
   */
  consentNotes?: string;
}

// Universal compact blur placeholder for fast LQIP
export const DEFAULT_BLUR =
  "data:image/webp;base64,UklGRmYAAABXRUJQVlA4IFoAAAAwAQCdASoQAAoAAkA4JaQAA3AE/u8AAA==";

