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

      <div className="bg-[#fbfaf6] py-16 sm:py-24">
        <Container size="xl">
          {/* Privacy & Consent Notice Banner */}
          <div className="mb-12 flex items-start gap-4 rounded-3xl border border-[#0b2e1e]/15 bg-[#f4efe6] p-6 shadow-xs sm:p-8">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#0b2e1e] text-[#d4af37] shadow-xs"
              aria-hidden="true"
            >
              <ShieldCheck className="h-6 w-6" strokeWidth={2} />
            </div>
            <div className="space-y-1">
              <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#b8952b]">
                Community Protection & Dignity Policy
              </span>
              <h2 className="font-display text-lg font-bold text-[#0b2e1e] sm:text-xl">
                {t("privacyNoticeTitle")}
              </h2>
              <p className="text-sm leading-relaxed text-[#4b5563]">
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
