import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Container } from "@/components/ui/container";
import {
  getArticleBySlug,
  getArticles,
  SEED_ARTICLES,
  type Article,
} from "@/content/news";
import { createPublicClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { buildPageMetadata, SITE_URL } from "@/lib/seo";
import { JsonLd, getBreadcrumbJsonLd } from "@/components/seo/json-ld";
import { formatAdminDate } from "@/lib/utils";
import { IslamicPattern } from "@/components/ui/islamic-pattern";
import {
  Calendar,
  Clock,
  ArrowLeft,
  ArrowRight,
  Share2,
  Tag,
  CheckCircle2,
  MessageCircle,
} from "lucide-react";

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
  let article = getArticleBySlug(slug, locale);

  if (!article && isSupabaseConfigured()) {
    try {
      const supabase = createPublicClient();
      const { data } = await supabase
        .from("articles")
        .select("*")
        .eq("slug", slug)
        .single();
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
          image_url: data.image_url || "/images/gallery/shramadana-01.webp",
          locale: (data.locale as "en" | "ta" | "si") || "en",
          published_at: data.published_at,
          is_published: data.is_published,
          read_time_minutes: Math.max(1, Math.ceil((data.content?.split(/\s+/).length || 200) / 180)),
        };
      }
    } catch {
      // fallback
    }
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

  let article = getArticleBySlug(slug, locale);

  if (!article && isSupabaseConfigured()) {
    try {
      const supabase = createPublicClient();
      const { data } = await supabase
        .from("articles")
        .select("*")
        .eq("slug", slug)
        .single();
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
          image_url: data.image_url || "/images/gallery/shramadana-01.webp",
          locale: (data.locale as "en" | "ta" | "si") || "en",
          published_at: data.published_at,
          is_published: data.is_published,
          read_time_minutes: Math.max(1, Math.ceil((data.content?.split(/\s+/).length || 200) / 180)),
        };
      }
    } catch {
      // fallback
    }
  }

  if (!article) {
    notFound();
  }

  const relatedArticles = getArticles(locale)
    .filter((a) => a.slug !== article.slug)
    .slice(0, 3);

  const currentUrl = `${SITE_URL}/${locale}/news/${article.slug}`;

  // JSON-LD NewsArticle Structured Data
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    image: [article.image_url.startsWith("http") ? article.image_url : `${SITE_URL}${article.image_url}`],
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
        url: `${SITE_URL}/image/bjws logo.webp`,
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
      <section className="relative overflow-hidden bg-[#072115] text-white py-12 sm:py-16 lg:py-20 border-b border-emerald-950">
        <IslamicPattern
          opacity={0.05}
          className="pointer-events-none text-[#d4af37]"
        />

        <Container size="md" className="relative z-10">
          {/* Back Button */}
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-200/80 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>{t("backToNews")}</span>
          </Link>

          {/* Category & Status */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#c99a45] px-3 py-1 font-serif text-[10px] font-bold tracking-wider uppercase text-[#062115] shadow-xs">
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
              <span>{article.read_time_minutes} {t("readTime")}</span>
            </span>
          </div>

          {/* Article Display Headline */}
          <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            {article.title}
          </h1>

          {/* Author Byline */}
          <div className="mt-6 flex items-center gap-3 text-xs text-emerald-200/80 border-t border-emerald-800/40 pt-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#c99a45] text-[#062115] font-bold text-xs">
              BJWS
            </div>
            <div>
              <span className="font-semibold text-white block">{article.author}</span>
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
          {/* Featured Image */}
          <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden rounded-3xl border border-[#e6e4dc] bg-muted shadow-lg mb-10">
            <Image
              src={article.image_url}
              alt={article.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 800px"
              className="object-cover object-center"
            />
          </div>

          {/* Article Body */}
          <div className="rounded-3xl border border-[#e6e4dc] bg-surface p-6 sm:p-10 lg:p-12 shadow-xs space-y-6">
            {/* Lead Excerpt */}
            <p className="text-base sm:text-lg font-medium text-primary leading-relaxed border-l-4 border-[#c99a45] pl-4 italic bg-[#fbfaf6] p-3 rounded-r-xl">
              &ldquo;{article.excerpt}&rdquo;
            </p>

            {/* Formatted Content Paragraphs */}
            <div className="space-y-4 text-sm sm:text-base text-text leading-relaxed font-sans">
              {article.content.split("\n\n").map((block, idx) => {
                const trimmed = block.trim();
                if (!trimmed) return null;

                // Markdown-like subheadings (###)
                if (trimmed.startsWith("### ")) {
                  return (
                    <h2
                      key={idx}
                      className="font-display text-xl sm:text-2xl font-bold text-[#0b2e1e] pt-4 tracking-tight"
                    >
                      {trimmed.replace("### ", "")}
                    </h2>
                  );
                }

                // Markdown-like bullet lists (1. or -)
                if (trimmed.includes("\n1. ") || trimmed.startsWith("1. ") || trimmed.startsWith("- ")) {
                  const lines = trimmed.split("\n");
                  return (
                    <ul key={idx} className="space-y-2 py-2">
                      {lines.map((l, lIdx) => (
                        <li key={lIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-text leading-relaxed">
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-[#c99a45] mt-0.5" />
                          <span>{l.replace(/^[0-9]+\.\s+|^-\s+/, "")}</span>
                        </li>
                      ))}
                    </ul>
                  );
                }

                return (
                  <p key={idx} className="text-text/90">
                    {trimmed}
                  </p>
                );
              })}
            </div>

            {/* Social Share Strip */}
            <div className="border-t border-border pt-6 mt-8 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-text-muted">
                <Share2 className="h-4 w-4 text-[#c99a45]" />
                <span>{t("shareArticle")}</span>
              </div>

              <div className="flex items-center gap-2">
                {/* WhatsApp Share */}
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    `${article.title} - Read more on BJWS: ${currentUrl}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-600/30 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 transition-colors"
                >
                  <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
                  <span>WhatsApp</span>
                </a>

                {/* Facebook Share */}
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    currentUrl
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface hover:bg-muted px-3 py-1.5 text-xs font-semibold text-text transition-colors"
                >
                  <span>Facebook</span>
                </a>
              </div>
            </div>
          </div>

          {/* Related Articles Strip */}
          {relatedArticles.length > 0 && (
            <div className="mt-16 space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-display text-lg sm:text-xl font-bold text-text">
                  {t("relatedTitle")}
                </h3>
                <Link
                  href="/news"
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  <span>View All</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {relatedArticles.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/news/${rel.slug}`}
                    className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-surface p-4 shadow-xs transition-all hover:border-primary/40 hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-muted mb-3">
                      <Image
                        src={rel.image_url}
                        alt={rel.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="space-y-1 flex-1 flex flex-col justify-between">
                      <span className="text-[10px] font-bold text-[#c99a45] uppercase tracking-wider">
                        {rel.categoryLabel[locale as "en" | "ta" | "si"] || rel.categoryLabel.en}
                      </span>
                      <h4 className="font-display text-xs sm:text-sm font-bold text-text group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                        {rel.title}
                      </h4>
                      <span className="text-[10px] text-text-muted block pt-1">
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
