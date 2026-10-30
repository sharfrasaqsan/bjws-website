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

  // STRICT POLICY: Only load approved images from manifest
  const approvedImages = getApprovedGalleryImages();

  // Prepare localized categories mapping
  const categoriesMap: Record<string, string> = {};
  for (const cat of GALLERY_CATEGORIES) {
    categoriesMap[cat.key] = t(cat.titleKey);
  }

  // Prepare localized captions and alt texts
  const captionsMap: Record<string, string> = {};
  for (const img of approvedImages) {
    captionsMap[img.captionKey] = t(img.captionKey);
    captionsMap[img.altKey] = t(img.altKey);
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
        imageSrc="/images/gallery/iftar-01.webp"
        imageAlt="BJWS Photo Gallery Documentation"
        breadcrumbs={[
          { label: tCommon("home"), href: "/" },
          { label: t("breadcrumbs") },
        ]}
      />

      <div className="py-12 sm:py-16">
        <Container size="xl">

          {/* Privacy & Consent Notice Banner */}
          <div className="bg-surface border-border mb-10 flex items-start gap-3.5 rounded-xl border p-5 shadow-2xs sm:p-6">
            <div
              className="text-primary mt-0.5 shrink-0 rounded-lg bg-[#e8f3ee] p-2"
              aria-hidden="true"
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
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <div className="space-y-1">
              <h2 className="text-text text-sm font-bold">
                {t("privacyNoticeTitle")}
              </h2>
              <p className="text-text-muted text-xs leading-relaxed sm:text-sm">
                {t("privacyNoticeDesc")}
              </p>
            </div>
          </div>

          {/* Gallery Grid & Filter Tabs */}
          <GalleryGrid images={approvedImages} translations={translations} />
        </Container>
      </div>
    </>
  );
}
