import type { Metadata } from "next";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://bjws.org";

export const LOCALES = ["ta", "en", "si"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "ta";

// BCP 47 locale mappings for Open Graph and metadata
export const OG_LOCALES: Record<Locale, string> = {
  ta: "ta_LK",
  en: "en_LK",
  si: "si_LK",
};

interface SeoOptions {
  title: string;
  description: string;
  path: string;
  locale: string;
  ogType?: "website" | "article";
  publishedTime?: string;
  keywords?: string[];
  noIndex?: boolean;
}

/**
 * Builds complete, standards-compliant Next.js Metadata with:
 * - Canonical URL
 * - hreflang alternates for ta, en, si, and x-default
 * - Open Graph tags and dynamic og:image
 * - Twitter summary_large_image card
 */
export function buildPageMetadata({
  title,
  description,
  path,
  locale,
  ogType = "website",
  publishedTime,
  keywords,
  noIndex = false,
}: SeoOptions): Metadata {
  const cleanPath =
    path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  const canonicalUrl = `${SITE_URL}/${locale}${cleanPath}`;

  // Build hreflang alternates for all supported languages
  const languageAlternates: Record<string, string> = {
    "x-default": `${SITE_URL}/${DEFAULT_LOCALE}${cleanPath}`,
    ta: `${SITE_URL}/ta${cleanPath}`,
    en: `${SITE_URL}/en${cleanPath}`,
    si: `${SITE_URL}/si${cleanPath}`,
    "ta-LK": `${SITE_URL}/ta${cleanPath}`,
    "en-LK": `${SITE_URL}/en${cleanPath}`,
    "si-LK": `${SITE_URL}/si${cleanPath}`,
  };

  const currentOgLocale = OG_LOCALES[locale as Locale] || "ta_LK";
  const alternateOgLocales = Object.values(OG_LOCALES).filter(
    (l) => l !== currentOgLocale
  );

  // Dynamic Open Graph image generated via /api/og
  const ogImageUrl = `${SITE_URL}/api/og?title=${encodeURIComponent(
    title
  )}&locale=${encodeURIComponent(locale)}`;

  const defaultKeywords = [
    "Buhary Janaza Welfare Society",
    "BJWS",
    "Janaza Services Sri Lanka",
    "Mullipothana Muslim Community",
    "Buhary Jummah Mosque",
    "Muslim Funeral Welfare",
    "Ghusl and Kafan Mullipothana",
    "Cemetery Maintenance",
    "Thambalagamuwa Welfare",
    "Trincomalee Muslim Society",
    "புகாரி ஜனாஸா நலன்புரிச் சங்கம்",
    "முள்ளிப்பொத்தானை",
    "ஜனாஸா நலன்புரி",
  ];

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    keywords: keywords ? [...keywords, ...defaultKeywords] : defaultKeywords,
    alternates: {
      canonical: canonicalUrl,
      languages: languageAlternates,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Buhary Janaza Welfare Society (BJWS)",
      locale: currentOgLocale,
      alternateLocale: alternateOgLocales,
      type: ogType,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${title} - Buhary Janaza Welfare Society`,
          type: "image/png",
        },
      ],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}
