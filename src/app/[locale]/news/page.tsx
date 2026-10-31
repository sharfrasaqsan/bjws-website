import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/layout/page-header";
import { NewsGrid } from "@/components/sections/news-grid";
import { getArticles, type Article } from "@/content/news";
import { createPublicClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { buildPageMetadata } from "@/lib/seo";
import { JsonLd, getBreadcrumbJsonLd } from "@/components/seo/json-ld";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "newsPage" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  return buildPageMetadata({
    title: `${t("pageTitle")} | ${tCommon("societyShort")}`,
    description: t("subtitle"),
    path: "/news",
    locale,
  });
}

export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("newsPage");
  const tCommon = await getTranslations("common");

  let articles: Article[] = getArticles(locale);

  if (isSupabaseConfigured()) {
    try {
      const supabase = createPublicClient();
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("is_published", true)
        .eq("locale", locale)
        .order("published_at", { ascending: false });

      if (!error && data && data.length > 0) {
        articles = data.map((d) => ({
          id: d.id,
          slug: d.slug,
          title: d.title,
          excerpt: d.excerpt,
          content: d.content,
          category: (d.category as Article["category"]) || "general",
          categoryLabel: {
            en: d.category || "General News",
            ta: "செய்திகள்",
            si: "පුවත්",
          },
          author: d.author || "BJWS Secretariat",
          image_url: d.image_url || "/images/gallery/shramadana-01.webp",
          locale: (d.locale as "en" | "ta" | "si") || "en",
          published_at: d.published_at || d.created_at,
          is_published: true,
          read_time_minutes: Math.max(1, Math.ceil((d.content?.split(/\s+/).length || 200) / 180)),
        }));
      }
    } catch (err) {
      console.warn("Supabase articles query error, using local fallback:", err);
    }
  }

  const translations = {
    searchPlaceholder: t("searchPlaceholder"),
    filterAll: t("filterAll"),
    readMore: t("readMore"),
    readTime: t("readTime"),
    publishedOn: t("publishedOn"),
    noArticles: t("noArticles"),
  };

  return (
    <>
      <JsonLd
        data={getBreadcrumbJsonLd(
          [
            { name: tCommon("home"), path: "/" },
            { name: t("breadcrumbs"), path: "/news" },
          ],
          locale
        )}
      />
      <PageHeader
        title={t("pageTitle")}
        subtitle={t("subtitle")}
        eyebrow={tCommon("societyShort")}
        imageSrc="/images/gallery/shramadana-02.webp"
        imageAlt="BJWS News & Community Bulletin"
        breadcrumbs={[
          { label: tCommon("home"), href: "/" },
          { label: t("breadcrumbs") },
        ]}
      />

      <div className="bg-[#fbfaf6] py-16 sm:py-24">
        <Container size="xl">
          <NewsGrid
            articles={articles}
            locale={locale}
            translations={translations}
          />
        </Container>
      </div>
    </>
  );
}

