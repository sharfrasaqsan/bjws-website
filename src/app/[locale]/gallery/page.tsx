import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/layout/page-header";
import { GalleryGrid } from "@/components/sections/gallery-grid";
import {
  getApprovedGalleryImages,
  GALLERY_CATEGORIES,
} from "@/content/gallery";
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

  // STRICT POLICY: Only load approved images from manifest
  const approvedImages = getApprovedGalleryImages();

  // Prepare localized categories mapping
  const categoriesMap: Record<string, string> = {};
  for (const cat of GALLERY_CATEGORIES) {
    categoriesMap[cat.key] = t(cat.titleKey);
  }

  // Prepare localized captions and alt texts safely
  const captionsMap: Record<string, string> = {};
  for (const img of approvedImages) {
    try {
      captionsMap[img.captionKey] = t.has(img.captionKey)
        ? t(img.captionKey)
        : img.captionKey;
    } catch {
      captionsMap[img.captionKey] = img.captionKey;
    }
    try {
      captionsMap[img.altKey] = t.has(img.altKey) ? t(img.altKey) : img.altKey;
    } catch {
      captionsMap[img.altKey] = img.altKey;
    }
  }

  const translations = {
    allCategory: t("allCategory"),
    categories: categoriesMap,
    captions: captionsMap,
    viewInLightbox: t("viewInLightbox"),
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
