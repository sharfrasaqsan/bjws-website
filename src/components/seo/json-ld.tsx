import * as React from "react";
import { SITE_URL } from "@/lib/seo";

interface JsonLdProps {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * Schema.org Organization (NGO) metadata for Buhary Janaza Welfare Society.
 */
export function getOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "NGO",
    "@id": `${SITE_URL}/#organization`,
    name: "Buhary Janaza (Funeral) Welfare Society",
    alternateName: [
      "BJWS",
      "புகாரி ஜனாஸா நலன்புரிச் சங்கம்",
      "බුහාරි ජනාසා සුබසාධන සංගමය",
    ],
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/brand/logo.svg`,
      width: 512,
      height: 512,
    },
    image: `${SITE_URL}/api/og`,
    description:
      "A registered community welfare society in Mullipothanai, Sri Lanka (Reg: DS/TH/SS/VSSO/2023/01), providing 24/7 funeral management, cemetery maintenance, dry ration aid, and community workshops.",
    foundingDate: "2023",
    taxID: "DS/TH/SS/VSSO/2023/01",
    email: "mbjwsociety@gmail.com",
    telephone: ["+94753738349", "+94772782829", "+94756510050", "+94776227323"],
    address: {
      "@type": "PostalAddress",
      streetAddress: "95th Buhary Jummah Mosque, Kandy Road",
      addressLocality: "Mullipothanai",
      addressRegion: "Eastern Province",
      postalCode: "31232",
      addressCountry: "LK",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 8.4833,
      longitude: 81.1167,
    },
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Mullipothanai, Thampalakamam, Eastern Province, Sri Lanka",
    },
    sameAs: [],
  };
}

/**
 * Schema.org BreadcrumbList for hierarchical inner pages.
 */
export function getBreadcrumbJsonLd(
  breadcrumbs: Array<{ name: string; path?: string }>,
  locale: string
) {
  const itemListElement = breadcrumbs.map((crumb, index) => {
    const itemUrl = crumb.path
      ? `${SITE_URL}/${locale}${crumb.path === "/" ? "" : crumb.path}`
      : undefined;

    return {
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      ...(itemUrl ? { item: itemUrl } : {}),
    };
  });

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement,
  };
}

/**
 * Schema.org Service schemas for BJWS humanitarian programs.
 */
export function getServicesJsonLd(locale: string) {
  const provider = {
    "@type": "NGO",
    name: "Buhary Janaza Welfare Society",
    url: `${SITE_URL}/${locale}`,
  };

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: [
      {
        "@type": "Service",
        name: "24/7 Janaza & Funeral Assistance",
        description:
          "Complete Islamic funeral arrangement, Ghusl (washing), Kafan (shroud), ambulance transport, and burial coordination.",
        provider,
        areaServed: "Mullipothanai, Eastern Province, Sri Lanka",
        serviceType: "Funeral Services",
      },
      {
        "@type": "Service",
        name: "Cemetery Maintenance & Renovation",
        description:
          "Seasonal shramadhana clean-ups, road access construction, ground leveling, boundary walling, and water infrastructure.",
        provider,
        areaServed: "Mullipothanai Cemetery",
        serviceType: "Community Maintenance",
      },
      {
        "@type": "Service",
        name: "Monthly Dry Ration Distribution",
        description:
          "Targeted humanitarian food relief packs distributed to verified low-income households, widows, and vulnerable community families.",
        provider,
        areaServed: "Mullipothanai",
        serviceType: "Humanitarian Aid",
      },
      {
        "@type": "Service",
        name: "Community Awareness & Youth Training",
        description:
          "Practical janaza procedure workshops, ghusl training for youth volunteers, and welfare seminars.",
        provider,
        areaServed: "Mullipothanai",
        serviceType: "Community Education",
      },
    ],
  };
}

/**
 * Schema.org ContactPage structured data.
 */
export function getContactPageJsonLd(locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Buhary Janaza Welfare Society",
    url: `${SITE_URL}/${locale}/contact`,
    description:
      "Emergency 24/7 funeral assistance numbers and office inquiries for Buhary Janaza Welfare Society, Mullipothanai, Sri Lanka.",
    mainEntity: {
      "@type": "NGO",
      name: "Buhary Janaza Welfare Society",
      telephone: "+94753738349",
      email: "mbjwsociety@gmail.com",
      address: {
        "@type": "PostalAddress",
        streetAddress: "95th Buhary Jummah Mosque, Kandy Road",
        addressLocality: "Mullipothanai",
        addressCountry: "LK",
      },
    },
  };
}

/**
 * Schema.org AboutPage structured data.
 */
export function getAboutPageJsonLd(locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About Buhary Janaza Welfare Society",
    url: `${SITE_URL}/${locale}/about`,
    description:
      "Mission, vision, history, and executive committee structure of the Buhary Janaza Welfare Society in Mullipothanai.",
    mainEntity: {
      "@type": "NGO",
      name: "Buhary Janaza Welfare Society",
      foundingDate: "2023",
      taxID: "DS/TH/SS/VSSO/2023/01",
    },
  };
}
