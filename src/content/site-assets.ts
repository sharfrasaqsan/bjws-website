import { formatGoogleDriveImageUrl } from "@/lib/utils";

export interface SiteAssetConfig {
  // Global & Brand
  logo: string;

  // Homepage
  heroBg: string;
  aboutGhusl: string;
  aboutWater: string;
  cemeteryVolunteers: string;

  // Core Services
  serviceFuneralAssistance: string;
  serviceCemeteryMaintenance: string;
  serviceReliefWelfare: string;
  serviceSunnahEducation: string;
  serviceShramadanaCampaigns: string;
  serviceOrphanCare: string;
  serviceDisasterRelief: string;

  // About Page
  aboutCommunity: string;
  aboutHistoryWater: string;

  // Page Headers
  headerAbout: string;
  headerServices: string;
  headerAchievements: string;
  headerContact: string;
  headerDonate: string;
  headerGallery: string;
  headerMembership: string;
  headerNews: string;
  headerReports: string;
  headerTeam: string;
  headerPrivacy: string;

  // Homepage Gallery Showcase Strip
  galleryPreview1: string;
  galleryPreview2: string;
  galleryPreview3: string;
  galleryPreview4: string;
  galleryPreview5: string;
}

export const DEFAULT_SITE_ASSETS: SiteAssetConfig = {
  logo: "/images/bjws logo.webp",
  heroBg: "/images/gallery/shramadana-01.webp",
  aboutGhusl: "/images/gallery/ghusl-01.webp",
  aboutWater: "/images/gallery/water-concrete-01.webp",
  cemeteryVolunteers: "/images/gallery/shramadana-01.webp",
  serviceFuneralAssistance: "/images/gallery/ghusl-02.webp",
  serviceCemeteryMaintenance: "/images/gallery/shramadana-02.webp",
  serviceReliefWelfare: "/images/gallery/iftar-01.webp",
  serviceSunnahEducation: "/images/gallery/ghusl-01.webp",
  serviceShramadanaCampaigns: "/images/gallery/shramadana-01.webp",
  serviceOrphanCare: "/images/gallery/livelihood-01.webp",
  serviceDisasterRelief: "/images/gallery/water-concrete-01.webp",
  aboutCommunity: "/images/gallery/shramadana-01.webp",
  aboutHistoryWater: "/images/gallery/water-concrete-01.webp",
  headerAbout: "/images/gallery/ghusl-01.webp",
  headerServices: "/images/gallery/ghusl-02.webp",
  headerAchievements: "/images/gallery/shramadana-02.webp",
  headerContact: "/images/gallery/cemetery-road-01.webp",
  headerDonate: "/images/gallery/iftar-01.webp",
  headerGallery: "/images/gallery/iftar-01.webp",
  headerMembership: "/images/gallery/shramadana-01.webp",
  headerNews: "/images/gallery/shramadana-02.webp",
  headerReports: "/images/gallery/shramadana-02.webp",
  headerTeam: "/images/gallery/shramadana-01.webp",
  headerPrivacy: "/images/gallery/shramadana-01.webp",
  galleryPreview1: "/images/gallery/cemetery-road-01.webp",
  galleryPreview2: "/images/gallery/ghusl-01.webp",
  galleryPreview3: "/images/gallery/water-concrete-01.webp",
  galleryPreview4: "/images/gallery/iftar-01.webp",
  galleryPreview5: "/images/gallery/shramadana-02.webp",
};

export function getSiteAssets(): SiteAssetConfig {
  const formatted = {} as SiteAssetConfig;
  for (const [key, val] of Object.entries(DEFAULT_SITE_ASSETS)) {
    formatted[key as keyof SiteAssetConfig] = formatGoogleDriveImageUrl(val as string);
  }
  return formatted;
}
