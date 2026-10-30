import type { MetadataRoute } from "next";
import { SITE_URL, LOCALES, DEFAULT_LOCALE } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/about",
    "/services",
    "/achievements",
    "/gallery",
    "/membership",
    "/reports",
    "/contact",
    "/privacy",
  ];

  const currentDate = new Date().toISOString();
  const sitemapEntries: MetadataRoute.Sitemap = [];

  for (const route of routes) {
    const cleanRoute = route === "" ? "" : route;

    for (const locale of LOCALES) {
      const languagesMap: Record<string, string> = {
        "x-default": `${SITE_URL}/${DEFAULT_LOCALE}${cleanRoute}`,
      };

      for (const loc of LOCALES) {
        languagesMap[loc] = `${SITE_URL}/${loc}${cleanRoute}`;
      }

      sitemapEntries.push({
        url: `${SITE_URL}/${locale}${cleanRoute}`,
        lastModified: currentDate,
        changeFrequency:
          cleanRoute === "" || cleanRoute === "/reports"
            ? "weekly"
            : cleanRoute === "/services" || cleanRoute === "/membership"
              ? "monthly"
              : "yearly",
        priority:
          cleanRoute === ""
            ? 1.0
            : cleanRoute === "/services" || cleanRoute === "/membership"
              ? 0.9
              : cleanRoute === "/contact" || cleanRoute === "/reports"
                ? 0.8
                : 0.7,
        alternates: {
          languages: languagesMap,
        },
      });
    }
  }

  // Admin routes are strictly excluded
  return sitemapEntries;
}
