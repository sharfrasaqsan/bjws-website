/**
 * Gallery Manifest for Buhary Janaza Welfare Society (BJWS)
 *
 * PRIVACY & CONSENT POLICY RULE:
 * -------------------------------------------------------------
 * Every photo in this manifest MUST have an `approved: boolean` flag.
 * Only images with `approved: true` will be rendered on the website.
 *
 * Strict Privacy Guidelines:
 * 1. Photos depicting identifiable community members, grieving family members,
 *    women, or children require documented explicit consent before `approved`
 *    can be set to true.
 * 2. Funeral preparation, ghusl, or shrouding photos must never show the deceased
 *    or infringe upon privacy and dignity; only general educational workshops
 *    with consenting attendees may be approved.
 * 3. Any unapproved or pending-verification photo remains omitted from public views.
 */

export type GalleryCategory =
  | "cemetery-shramadana"
  | "ghusl-kafan"
  | "iftar-functions"
  | "water-concrete"
  | "livelihood-project"
  | "cemetery-road";

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

export const GALLERY_CATEGORIES: GalleryCategoryMeta[] = [
  {
    key: "cemetery-shramadana",
    titleKey: "categoryCemeteryShramadana",
    descriptionKey: "categoryCemeteryShramadanaDesc",
  },
  {
    key: "ghusl-kafan",
    titleKey: "categoryGhuslKafan",
    descriptionKey: "categoryGhuslKafanDesc",
  },
  {
    key: "iftar-functions",
    titleKey: "categoryIftarFunctions",
    descriptionKey: "categoryIftarFunctionsDesc",
  },
  {
    key: "water-concrete",
    titleKey: "categoryWaterConcrete",
    descriptionKey: "categoryWaterConcreteDesc",
  },
  {
    key: "livelihood-project",
    titleKey: "categoryLivelihood",
    descriptionKey: "categoryLivelihoodDesc",
  },
  {
    key: "cemetery-road",
    titleKey: "categoryCemeteryRoad",
    descriptionKey: "categoryCemeteryRoadDesc",
  },
];

// Universal compact blur placeholder for fast LQIP
const DEFAULT_BLUR =
  "data:image/webp;base64,UklGRmYAAABXRUJQVlA4IFoAAAAwAQCdASoQAAoAAkA4JaQAA3AE/u8AAA==";

export const GALLERY_MANIFEST: GalleryImage[] = [
  // 1. Cemetery Shramadana
  {
    id: "shramadana-01",
    src: "/images/gallery/shramadana-01.webp",
    altKey: "photoShramadana1Alt",
    captionKey: "photoShramadana1Caption",
    category: "cemetery-shramadana",
    date: "2024",
    location: "Mahallah Cemetery, Mullipothanai",
    width: 1200,
    height: 800,
    blurDataURL: DEFAULT_BLUR,
    approved: true,
    consentNotes: "Public voluntary community shramadhana activity.",
  },
  {
    id: "shramadana-02",
    src: "/images/gallery/shramadana-02.webp",
    altKey: "photoShramadana2Alt",
    captionKey: "photoShramadana2Caption",
    category: "cemetery-shramadana",
    date: "2024",
    location: "Mahallah Cemetery, Mullipothanai",
    width: 1200,
    height: 800,
    blurDataURL: DEFAULT_BLUR,
    approved: true,
    consentNotes: "Public landscape cleaning documentation.",
  },

  // 2. Ghusl and Kafan Programme
  {
    id: "ghusl-01",
    src: "/images/gallery/ghusl-01.webp",
    altKey: "photoGhusl1Alt",
    captionKey: "photoGhusl1Caption",
    category: "ghusl-kafan",
    date: "2024",
    location: "Buhary Jummah Mosque",
    width: 1200,
    height: 800,
    blurDataURL: DEFAULT_BLUR,
    approved: true,
    consentNotes: "Volunteer educational demonstration.",
  },
  {
    id: "ghusl-02",
    src: "/images/gallery/ghusl-02.webp",
    altKey: "photoGhusl2Alt",
    captionKey: "photoGhusl2Caption",
    category: "ghusl-kafan",
    date: "2024",
    location: "Jamiya Mosque, Mullipothanai",
    width: 1200,
    height: 800,
    blurDataURL: DEFAULT_BLUR,
    approved: true,
    consentNotes: "Educational seminar for registered youth volunteers.",
  },

  // 3. Iftar Functions
  {
    id: "iftar-01",
    src: "/images/gallery/iftar-01.webp",
    altKey: "photoIftar1Alt",
    captionKey: "photoIftar1Caption",
    category: "iftar-functions",
    date: "2024",
    location: "Muhaideen Mosque, Mullipothanai",
    width: 1200,
    height: 800,
    blurDataURL: DEFAULT_BLUR,
    approved: true,
    consentNotes: "Community Iftar gathering event.",
  },
  {
    id: "iftar-02",
    src: "/images/gallery/iftar-02.webp",
    altKey: "photoIftar2Alt",
    captionKey: "photoIftar2Caption",
    category: "iftar-functions",
    date: "2024",
    location: "Jamiya Mosque, Mullipothanai",
    width: 1200,
    height: 800,
    blurDataURL: DEFAULT_BLUR,
    approved: true,
    consentNotes: "Dry ration and Iftar meal distribution.",
  },

  // 4. Mosque Water and Concrete Work
  {
    id: "water-concrete-01",
    src: "/images/gallery/water-concrete-01.webp",
    altKey: "photoWaterConcrete1Alt",
    captionKey: "photoWaterConcrete1Caption",
    category: "water-concrete",
    date: "2024",
    location: "Buhary Mosque Premises",
    width: 1200,
    height: 800,
    blurDataURL: DEFAULT_BLUR,
    approved: true,
    consentNotes: "Infrastructure development documentation.",
  },

  // 5. Livelihood Project
  {
    id: "livelihood-01",
    src: "/images/gallery/livelihood-01.webp",
    altKey: "photoLivelihood1Alt",
    captionKey: "photoLivelihood1Caption",
    category: "livelihood-project",
    date: "2024",
    location: "Mullipothanai Mahallah",
    width: 1200,
    height: 800,
    blurDataURL: DEFAULT_BLUR,
    approved: true,
    consentNotes: "Welfare livelihood assistance project.",
  },

  // 6. Cemetery Road Project
  {
    id: "cemetery-road-01",
    src: "/images/gallery/cemetery-road-01.webp",
    altKey: "photoCemeteryRoad1Alt",
    captionKey: "photoCemeteryRoad1Caption",
    category: "cemetery-road",
    date: "2024",
    location: "Cemetery Access Road",
    width: 1200,
    height: 800,
    blurDataURL: DEFAULT_BLUR,
    approved: true,
    consentNotes: "Access road civil works documentation.",
  },

  // 7. Example Unapproved Image (MUST NEVER BE RENDERED)
  {
    id: "unapproved-sample",
    src: "/images/gallery/unapproved-sample.webp",
    altKey: "photoUnapprovedAlt",
    captionKey: "photoUnapprovedCaption",
    category: "cemetery-shramadana",
    date: "2024",
    location: "Pending Consent",
    width: 1200,
    height: 800,
    blurDataURL: DEFAULT_BLUR,
    approved: false, // RULE TEST: strict filtering ensures this is omitted
    consentNotes: "Awaiting explicit written consent from family members.",
  },
];

/**
 * Returns strictly approved gallery images in compliance with the Privacy & Consent Policy.
 */
export function getApprovedGalleryImages(): GalleryImage[] {
  return GALLERY_MANIFEST.filter((item) => item.approved === true);
}

/**
 * Returns approved gallery images for a specific category.
 */
export function getApprovedGalleryByCategory(
  category: GalleryCategory
): GalleryImage[] {
  return GALLERY_MANIFEST.filter(
    (item) => item.approved === true && item.category === category
  );
}
