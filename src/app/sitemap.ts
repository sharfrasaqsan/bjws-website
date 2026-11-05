import type { MetadataRoute } from "next";
import { SITE_URL, LOCALES, DEFAULT_LOCALE } from "@/lib/seo";
import { SEED_ARTICLES } from "@/content/news";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/about",
    "/team",
    "/services",
    "/news",
    "/achievements",
    "/gallery",
    "/membership",
    "/donate",
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

  // Include dynamic news articles for maximum search discoverability
  const addedSlugs = new Set<string>();
  for (const article of SEED_ARTICLES) {
    if (!article.is_published || addedSlugs.has(article.slug)) continue;
    addedSlugs.add(article.slug);

    const articleRoute = `/news/${article.slug}`;

    for (const locale of LOCALES) {
      const languagesMap: Record<string, string> = {
        "x-default": `${SITE_URL}/${DEFAULT_LOCALE}${articleRoute}`,
      };

      for (const loc of LOCALES) {
        languagesMap[loc] = `${SITE_URL}/${loc}${articleRoute}`;
      }

      sitemapEntries.push({
        url: `${SITE_URL}/${locale}${articleRoute}`,
        lastModified: article.published_at || currentDate,
        changeFrequency: "monthly",
        priority: 0.75,
        alternates: {
          languages: languagesMap,
        },
      });
    }
  }

  // Admin routes and verification endpoints are strictly excluded from sitemap
  return sitemapEntries;
}
