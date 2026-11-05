import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const disallowPatterns = [
    "/admin",
    "/admin/*",
    "/api/*",
    "/verify",
    "/verify/*",
    "/*/verify/*",
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: disallowPatterns,
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: disallowPatterns,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
