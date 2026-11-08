import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/layout/page-header";
import { GalleryGrid } from "@/components/sections/gallery-grid";
import {
  getApprovedGalleryImages,
  type GalleryImage,
  type GalleryCategory,
  DEFAULT_BLUR,
  formatCategoryLabel,
} from "@/content/gallery";
import { createPublicClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { buildPageMetadata } from "@/lib/seo";
import { JsonLd, getBreadcrumbJsonLd } from "@/components/seo/json-ld";
import { ShieldCheck } from "lucide-react";
import { getSiteAssets } from "@/content/site-assets";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "galleryPage" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  return buildPageMetadata({
    title: `${t("pageTitle")} | ${tCommon("societyShort")}`,
    description: t("subtitle"),
    path: "/gallery",
    locale,
  });
}

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("galleryPage");
  const tCommon = await getTranslations("common");
  const assets = getSiteAssets();

  // Load approved images from Supabase or fallback manifest
  let approvedImages: GalleryImage[] = [];

  if (isSupabaseConfigured()) {
    try {
      const supabase = createPublicClient();
      const { data, error } = await supabase
        .from("gallery_images")
        .select("*")
        .eq("approved", true)
        .order("created_at", { ascending: false });

      if (!error && data) {
        approvedImages = data.map((d) => ({
          id: d.id,
          src: d.src,
          captionKey: d.caption,
          altKey: d.caption,
          category: (d.category as GalleryCategory) || "cemetery-shramadana",
          date: d.date,
          location: d.location,
          width: 1200,
          height: 800,
          blurDataURL: DEFAULT_BLUR,
          approved: d.approved,
          consentNotes: d.consent_notes || undefined,
        }));
      }
    } catch (err) {
      console.warn("Supabase fetch gallery images warning:", err);
      approvedImages = getApprovedGalleryImages();
    }
  } else {
    approvedImages = getApprovedGalleryImages();
  }

  // Prepare categories mapping from approved images
  const categoriesMap: Record<string, string> = {};
  for (const img of approvedImages) {
    if (img.category && !categoriesMap[img.category]) {
      categoriesMap[img.category] = formatCategoryLabel(img.category);
    }
  }

  // Prepare captions and alt texts directly (no need for ta/si translations for photo names)
  const captionsMap: Record<string, string> = {};
  for (const img of approvedImages) {
    captionsMap[img.captionKey] = img.captionKey;
    captionsMap[img.altKey] = img.altKey;
  }

  const translations = {
    allCategory: t("allCategory"),
    categories: categoriesMap,
    captions: captionsMap,
    viewInLightbox: t("viewInLightbox"),
    noPhotosTitle: t("noPhotosTitle"),
    noPhotosDesc: t("noPhotosDesc"),
    noPhotosCategoryTitle: t("noPhotosCategoryTitle"),
    noPhotosCategoryDesc: t("noPhotosCategoryDesc"),
    viewAllPhotos: t("viewAllPhotos"),
    seeMorePhotos: t("seeMorePhotos"),
    allPhotosLoaded: t("allPhotosLoaded"),
  };

  return (
    <>
      <JsonLd
        data={getBreadcrumbJsonLd(
          [
            { name: tCommon("home"), path: "/" },
            { name: t("breadcrumbs"), path: "/gallery" },
          ],
          locale
        )}
      />
      <PageHeader
        title={t("pageTitle")}
        subtitle={t("subtitle")}
        eyebrow={t("eyebrow")}
        imageSrc={assets.headerGallery || "/images/gallery/iftar-01.webp"}
        imageAlt="BJWS Photo Gallery Documentation"
        breadcrumbs={[
          { label: tCommon("home"), href: "/" },
          { label: t("breadcrumbs") },
        ]}
      />

      <div className="bg-[#fbfaf6] py-12 sm:py-20">
        <Container size="xl">
          {/* Gallery Grid & Filter Tabs */}
          <GalleryGrid images={approvedImages} translations={translations} />

          {/* Subtle Community Dignity Assurance Note */}
          <div className="mt-16 border-t border-[#e6e4dc] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6b7280]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#124d34] shrink-0" />
              <span>{t("privacyNoticeTitle")} &mdash; {t("privacyNoticeDesc")}</span>
            </div>
            <span className="text-[11px] font-mono text-[#9ca3af] shrink-0">
              Buhary Janaza Welfare Society Visual Documentation
            </span>
          </div>
        </Container>
      </div>
    </>
  );
}
