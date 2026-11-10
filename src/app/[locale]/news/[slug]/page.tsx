import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

import { notFound } from "next/navigation";
import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Container } from "@/components/ui/container";
import {
  getArticleBySlug,
  getArticles,
  extractBaseSlug,
  SEED_ARTICLES,
  type Article,
} from "@/content/news";
import {
  createPublicClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import { buildPageMetadata, SITE_URL } from "@/lib/seo";
import { JsonLd, getBreadcrumbJsonLd } from "@/components/seo/json-ld";
import { formatAdminDate } from "@/lib/utils";
import { IslamicPattern } from "@/components/ui/islamic-pattern";
import { Calendar, Clock, ArrowLeft, ArrowRight, Tag } from "lucide-react";
import { ArticleHeroImage } from "@/components/ui/article-hero-image";
import { RichArticleContent } from "@/components/ui/rich-article-content";
import { ArticleGallery } from "@/components/ui/article-gallery";
import { ShareButtons } from "@/components/ui/share-buttons";

interface ArticleDetailPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  const locales = ["en", "ta", "si"];

  for (const locale of locales) {
    for (const article of SEED_ARTICLES) {
      params.push({
        locale,
        slug: article.slug,
      });
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: ArticleDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  let article: Article | null = null;

  if (isSupabaseConfigured()) {
    try {
      const supabase = createPublicClient();
      const cleanSlug = decodeURIComponent(slug).toLowerCase();
      const baseSlug = extractBaseSlug(cleanSlug);
      const targetSlug = locale === "en" ? baseSlug : `${baseSlug}-${locale}`;

      // 1. Try exact target slug for current locale
      let { data } = await supabase
        .from("articles")
        .select("*")
        .eq("slug", targetSlug)
        .eq("locale", locale)
        .maybeSingle();

      // 2. If not found, try raw cleanSlug with matching locale
      if (!data) {
        const res = await supabase
          .from("articles")
          .select("*")
          .eq("slug", cleanSlug)
          .eq("locale", locale)
          .maybeSingle();
        data = res.data;
      }

      // 3. Fallback: try English translation (never fallback to Tamil when locale === "si")
      if (!data) {
        const res = await supabase
          .from("articles")
          .select("*")
          .eq("slug", baseSlug)
          .eq("locale", "en")
          .maybeSingle();
        data = res.data;
      }

      // 4. For non-Sinhala routes only, try raw slug
      if (!data && locale !== "si") {
        const res = await supabase
          .from("articles")
          .select("*")
          .eq("slug", cleanSlug)
          .maybeSingle();
        data = res.data;
      }

      if (data) {
        article = {
          id: data.id,
          slug: data.slug,
          title: data.title,
          excerpt: data.excerpt,
          content: data.content,
          category: (data.category as Article["category"]) || "general",
          categoryLabel: { en: data.category, ta: "செய்திகள்", si: "පුවත්" },
          author: data.author || "BJWS Secretariat",
          image_url:
            data.image_url ||
            "/images/gallery/home-service-community-shramadana-campaigns.webp",
          locale: (data.locale as "en" | "ta" | "si") || "en",
          published_at: data.published_at,
          is_published: data.is_published,
          read_time_minutes: Math.max(
            1,
            Math.ceil((data.content?.split(/\s+/).length || 200) / 180)
          ),
        };
      }
    } catch {
      // fallback handled below
    }
  }

  if (!article && !isSupabaseConfigured()) {
    article = getArticleBySlug(slug, locale) || null;
  }

  if (!article) {
    return {
      title: "Article Not Found | BJWS",
    };
  }

  const tCommon = await getTranslations({ locale, namespace: "common" });

  return buildPageMetadata({
    title: `${article.title} | ${tCommon("societyShort")}`,
    description: article.excerpt,
    path: `/news/${article.slug}`,
    locale,
    ogType: "article",
    publishedTime: article.published_at,
  });
}

export default async function ArticleDetailPage({
  params,
}: ArticleDetailPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("newsPage");
  const tCommon = await getTranslations("common");

  let article: Article | null = null;

  if (isSupabaseConfigured()) {
    try {
      const supabase = createPublicClient();
      const cleanSlug = decodeURIComponent(slug).toLowerCase();
      const baseSlug = extractBaseSlug(cleanSlug);
      const targetSlug = locale === "en" ? baseSlug : `${baseSlug}-${locale}`;

      // 1. Try exact target slug for current locale
      let { data } = await supabase
        .from("articles")
        .select("*")
        .eq("slug", targetSlug)
        .eq("locale", locale)
        .maybeSingle();

      // 2. If not found, try raw cleanSlug with matching locale
      if (!data) {
        const res = await supabase
          .from("articles")
          .select("*")
          .eq("slug", cleanSlug)
          .eq("locale", locale)
          .maybeSingle();
        data = res.data;
      }

      // 3. Fallback: try English translation (never fallback to Tamil when locale === "si")
      if (!data) {
        const res = await supabase
          .from("articles")
          .select("*")
          .eq("slug", baseSlug)
          .eq("locale", "en")
          .maybeSingle();
        data = res.data;
      }

      // 4. For non-Sinhala routes only, try raw slug
      if (!data && locale !== "si") {
        const res = await supabase
          .from("articles")
          .select("*")
          .eq("slug", cleanSlug)
          .maybeSingle();
        data = res.data;
      }

      if (data) {
        article = {
          id: data.id,
          slug: data.slug,
          title: data.title,
          excerpt: data.excerpt,
          content: data.content,
          category: (data.category as Article["category"]) || "general",
          categoryLabel: { en: data.category, ta: "செய்திகள்", si: "පුවත්" },
          author: data.author || "BJWS Secretariat",
          image_url:
            data.image_url ||
            "/images/gallery/home-service-community-shramadana-campaigns.webp",
          locale: (data.locale as "en" | "ta" | "si") || "en",
          published_at: data.published_at,
          is_published: data.is_published,
          read_time_minutes: Math.max(
            1,
            Math.ceil((data.content?.split(/\s+/).length || 200) / 180)
          ),
        };
      }
    } catch {
      // fallback handled below
    }
  }

  if (!article && !isSupabaseConfigured()) {
    article = getArticleBySlug(slug, locale) || null;
  }

  if (!article) {
    notFound();
  }

  let relatedArticles: Article[] = [];
  if (isSupabaseConfigured()) {
    try {
      const supabase = createPublicClient();
      const { data } = await supabase
        .from("articles")
        .select("*")
        .eq("is_published", true)
        .eq("locale", locale)
        .neq("slug", article.slug)
        .order("published_at", { ascending: false })
        .limit(3);

      if (data) {
        relatedArticles = data.map((d) => ({
          id: d.id,
          slug: d.slug,
          title: d.title,
          excerpt: d.excerpt,
          content: d.content,
          category: (d.category as Article["category"]) || "general",
          categoryLabel: { en: d.category, ta: "செய்திகள்", si: "පුවත්" },
          author: d.author || "BJWS Secretariat",
          image_url:
            d.image_url ||
            "/images/gallery/home-service-community-shramadana-campaigns.webp",
          locale: (d.locale as "en" | "ta" | "si") || "en",
          published_at: d.published_at,
          is_published: d.is_published,
          read_time_minutes: Math.max(
            1,
            Math.ceil((d.content?.split(/\s+/).length || 200) / 180)
          ),
        }));
      }
    } catch {
      relatedArticles = [];
    }
  } else {
    relatedArticles = getArticles(locale)
      .filter((a) => a.slug !== article.slug)
      .slice(0, 3);
  }

  const currentUrl = `${SITE_URL}/${locale}/news/${article.slug}`;

  // JSON-LD NewsArticle Structured Data
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    image: [
      article.image_url.startsWith("http")
        ? article.image_url
        : `${SITE_URL}${article.image_url}`,
    ],
    datePublished: article.published_at,
    dateModified: article.published_at,
    author: {
      "@type": "Organization",
      name: article.author,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Buhary Janaza Welfare Society",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/bjws logo.webp`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": currentUrl,
    },
  };

  const catLabel =
    article.categoryLabel[locale as "en" | "ta" | "si"] ||
    article.categoryLabel.en ||
    article.category;

  return (
    <>
      <JsonLd
        data={getBreadcrumbJsonLd(
          [
            { name: tCommon("home"), path: "/" },
            { name: t("breadcrumbs"), path: "/news" },
            { name: article.title, path: `/news/${article.slug}` },
          ],
          locale
        )}
      />
      <JsonLd data={articleJsonLd} />

      {/* Editorial Header Section */}
      <section className="relative overflow-hidden border-b border-emerald-950 bg-[#072115] py-12 text-white sm:py-16 lg:py-20">
        <IslamicPattern
          opacity={0.05}
          className="pointer-events-none text-[#d4af37]"
        />

        <Container size="md" className="relative z-10">
          {/* Back Button */}
          <Link
            href="/news"
            className="group mb-6 inline-flex items-center gap-2 text-xs font-semibold text-emerald-200/80 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>{t("backToNews")}</span>
          </Link>

          {/* Category & Status */}
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#c99a45] px-3 py-1 font-serif text-[10px] font-bold tracking-wider text-[#062115] uppercase shadow-xs">
              <Tag className="h-3 w-3" />
              <span>{catLabel}</span>
            </span>

            <span className="inline-flex items-center gap-1 text-xs text-emerald-200/70">
              <Calendar className="h-3.5 w-3.5 text-[#d4af37]" />
              <span>{formatAdminDate(article.published_at)}</span>
            </span>

            <span className="text-emerald-700">•</span>

            <span className="inline-flex items-center gap-1 text-xs text-emerald-200/70">
              <Clock className="h-3.5 w-3.5" />
              <span>
                {article.read_time_minutes} {t("readTime")}
              </span>
            </span>
          </div>

          {/* Article Display Headline */}
          <h1 className="font-display text-2xl leading-tight font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            {article.title}
          </h1>

          {/* Author Byline */}
          <div className="mt-6 flex items-center gap-3 border-t border-emerald-800/40 pt-4 text-xs text-emerald-200/80">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#c99a45] text-xs font-bold text-[#062115]">
              BJWS
            </div>
            <div>
              <span className="block font-semibold text-white">
                {article.author}
              </span>
              <span className="text-[11px] text-emerald-300/70">
                Official Society Documentation
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* Main Article Content & Media */}
      <div className="bg-[#fbfaf6] py-12 sm:py-16">
        <Container size="md">
          {/* Main Hero Image */}
          <ArticleHeroImage
            src={article.image_url}
            alt={article.title}
            categoryLabel={catLabel}
            caption={`Photo documentation for ${article.title}`}
            priority={true}
          />

          {/* Article Body Container */}
          <div className="bg-surface space-y-6 rounded-3xl border border-[#e6e4dc] p-6 shadow-xs sm:p-10 lg:p-12">
            {/* Lead Excerpt */}
            <p className="rounded-r-2xl border-l-4 border-[#c99a45] bg-[#fbfaf6] p-4 pl-4 text-base leading-relaxed font-medium text-[#0b2e1e] italic shadow-2xs sm:text-lg">
              &ldquo;{article.excerpt}&rdquo;
            </p>

            {/* Rich Article Content with Full Formatting Support */}
            <RichArticleContent content={article.content} />

            {/* Article Internal Media Gallery */}
            {article.gallery && article.gallery.length > 0 && (
              <ArticleGallery
                images={article.gallery}
                title="Related Photos & Field Documentation"
              />
            )}

            {/* Interactive Working Share Buttons Strip */}
            <ShareButtons
              title={article.title}
              excerpt={article.excerpt}
              label={t("shareArticle")}
            />
          </div>

          {/* Related Articles Strip */}
          {relatedArticles.length > 0 && (
            <div className="mt-16 space-y-6">
              <div className="border-border flex items-center justify-between border-b pb-3">
                <h3 className="font-display text-text text-lg font-bold sm:text-xl">
                  {t("relatedTitle")}
                </h3>
                <Link
                  href="/news"
                  className="text-primary flex items-center gap-1 text-xs font-semibold hover:underline"
                >
                  <span>View All</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                {relatedArticles.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/news/${rel.slug}`}
                    className="group border-border bg-surface hover:border-primary/40 flex flex-col justify-between overflow-hidden rounded-2xl border p-4 shadow-xs transition-all hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="bg-muted relative mb-3 aspect-[16/10] overflow-hidden rounded-xl">
                      <Image
                        src={rel.image_url}
                        alt={rel.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between space-y-1">
                      <span className="text-[10px] font-bold tracking-wider text-[#c99a45] uppercase">
                        {rel.categoryLabel[locale as "en" | "ta" | "si"] ||
                          rel.categoryLabel.en}
                      </span>
                      <h4 className="font-display text-text group-hover:text-primary line-clamp-2 text-xs leading-snug font-bold transition-colors sm:text-sm">
                        {rel.title}
                      </h4>
                      <span className="text-text-muted block pt-1 text-[10px]">
                        {formatAdminDate(rel.published_at)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </Container>
      </div>
    </>
  );
}
