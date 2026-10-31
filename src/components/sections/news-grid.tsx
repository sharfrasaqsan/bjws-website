"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { type Article } from "@/content/news";
import { formatAdminDate } from "@/lib/utils";
import { Search, Calendar, Clock, ArrowRight, Tag, BookOpen } from "lucide-react";
import { ScrollReveal, ScrollRevealGroup } from "@/components/ui/scroll-reveal";

interface NewsGridProps {
  articles: Article[];
  locale: string;
  translations: {
    searchPlaceholder: string;
    filterAll: string;
    readMore: string;
    readTime: string;
    publishedOn: string;
    noArticles: string;
  };
}

export function NewsGrid({ articles, locale, translations }: NewsGridProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  const categories = React.useMemo(() => {
    const map = new Map<string, string>();
    articles.forEach((a) => {
      map.set(
        a.category,
        a.categoryLabel[locale as "en" | "ta" | "si"] || a.categoryLabel.en || a.category
      );
    });
    return Array.from(map.entries()).map(([key, label]) => ({ key, label }));
  }, [articles, locale]);

  const filteredArticles = React.useMemo(() => {
    return articles.filter((a) => {
      const matchesCat =
        selectedCategory === "all" || a.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCat;

      return (
        matchesCat &&
        (a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.author.toLowerCase().includes(q))
      );
    });
  }, [articles, selectedCategory, searchQuery]);

  // Featured article is the first item if no search/filter active
  const featuredArticle =
    selectedCategory === "all" && !searchQuery.trim() && filteredArticles.length > 0
      ? filteredArticles[0]
      : null;

  const remainingArticles = featuredArticle
    ? filteredArticles.slice(1)
    : filteredArticles;

  return (
    <div className="space-y-10">
      {/* Search and Category Filters Strip */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-[#e6e4dc] pb-6">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            aria-pressed={selectedCategory === "all"}
            className={`cursor-pointer rounded-full px-4 py-1.5 text-xs font-semibold transition-all shadow-2xs ${
              selectedCategory === "all"
                ? "bg-[#124d34] text-white shadow-xs"
                : "bg-surface text-text-muted hover:text-text hover:bg-muted border border-border"
            }`}
          >
            {translations.filterAll} ({articles.length})
          </button>
          {categories.map((cat) => {
            const count = articles.filter((a) => a.category === cat.key).length;
            const isSelected = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setSelectedCategory(cat.key)}
                aria-pressed={isSelected}
                className={`cursor-pointer rounded-full px-4 py-1.5 text-xs font-semibold transition-all shadow-2xs ${
                  isSelected
                    ? "bg-[#124d34] text-white shadow-xs"
                    : "bg-surface text-text-muted hover:text-text hover:bg-muted border border-border"
                }`}
              >
                {cat.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72 shrink-0">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={translations.searchPlaceholder}
            className="w-full rounded-full border border-border bg-surface pl-10 pr-4 py-2 text-xs sm:text-sm text-text placeholder:text-text-muted/70 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
          />
        </div>
      </div>

      {/* Featured Primary Article (Hero Card) */}
      {featuredArticle && (
        <ScrollReveal variant="fade-up">
          <article className="group relative overflow-hidden rounded-3xl border border-[#e6e4dc] bg-surface shadow-md transition-all duration-300 hover:border-primary/40 hover:shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
              {/* Visual Media */}
              <div className="lg:col-span-7 relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-muted">
                <Image
                  src={featuredArticle.image_url}
                  alt={featuredArticle.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent lg:hidden pointer-events-none" />
                <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-[#062115]/90 px-3 py-1 font-serif text-[10px] font-bold tracking-wider uppercase text-[#d4af37] ring-1 ring-[#c99a45]/40 backdrop-blur-xs">
                  <Tag className="h-3 w-3" />
                  <span>
                    {featuredArticle.categoryLabel[locale as "en" | "ta" | "si"] ||
                      featuredArticle.categoryLabel.en}
                  </span>
                </span>
              </div>

              {/* Narrative Content */}
              <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs text-text-muted">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-[#c99a45]" />
                      {formatAdminDate(featuredArticle.published_at)}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-[#c99a45]" />
                      {featuredArticle.read_time_minutes} {translations.readTime}
                    </span>
                  </div>

                  <Link href={`/${locale}/news/${featuredArticle.slug}`}>
                    <h2 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-text group-hover:text-primary transition-colors leading-snug">
                      {featuredArticle.title}
                    </h2>
                  </Link>

                  <p className="text-xs sm:text-sm text-text-muted leading-relaxed line-clamp-3">
                    {featuredArticle.excerpt}
                  </p>
                </div>

                <div className="pt-2">
                  <Link
                    href={`/${locale}/news/${featuredArticle.slug}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#124d34] hover:bg-[#0b2e1e] text-white px-5 py-2.5 text-xs sm:text-sm font-bold shadow-xs transition-all duration-200 hover:-translate-y-0.5"
                  >
                    <span>{translations.readMore}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </article>
        </ScrollReveal>
      )}

      {/* Grid of Remaining Articles */}
      {remainingArticles.length > 0 ? (
        <ScrollRevealGroup staggerMs={60} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {remainingArticles.map((article) => {
            const catLabel =
              article.categoryLabel[locale as "en" | "ta" | "si"] ||
              article.categoryLabel.en;

            return (
              <article
                key={article.id}
                className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-[#e6e4dc] bg-surface shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-lg"
              >
                {/* Photo Header */}
                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                  <Image
                    src={article.image_url}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  <span className="absolute top-3 left-3 rounded-md bg-[#062115]/90 text-[#d4af37] text-[10px] font-bold px-2.5 py-1 uppercase tracking-wider backdrop-blur-xs ring-1 ring-[#c99a45]/30">
                    {catLabel}
                  </span>
                </div>

                {/* Body Content */}
                <div className="p-5 sm:p-6 flex flex-1 flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2.5 text-[11px] text-text-muted">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-[#c99a45]" />
                        {formatAdminDate(article.published_at)}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-text-muted" />
                        {article.read_time_minutes} {translations.readTime}
                      </span>
                    </div>

                    <Link href={`/${locale}/news/${article.slug}`}>
                      <h3 className="font-display text-base sm:text-lg font-bold text-text group-hover:text-primary transition-colors leading-snug line-clamp-2">
                        {article.title}
                      </h3>
                    </Link>

                    <p className="text-xs sm:text-sm text-text-muted leading-relaxed line-clamp-3">
                      {article.excerpt}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-border">
                    <Link
                      href={`/${locale}/news/${article.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-primary hover:text-primary-hover group/link transition-colors"
                    >
                      <span>{translations.readMore}</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </ScrollRevealGroup>
      ) : !featuredArticle ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center text-text-muted bg-surface">
          <BookOpen className="h-8 w-8 mx-auto text-[#c99a45] mb-2 opacity-80" />
          <p className="text-sm font-semibold text-text">{translations.noArticles}</p>
        </div>
      ) : null}
    </div>
  );
}

