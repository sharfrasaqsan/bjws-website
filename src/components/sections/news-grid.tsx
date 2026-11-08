"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { type Article } from "@/content/news";
import { formatAdminDate } from "@/lib/utils";
import {
  Search,
  Calendar,
  Clock,
  ArrowRight,
  Tag,
  BookOpen,
} from "lucide-react";
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
        a.categoryLabel[locale as "en" | "ta" | "si"] ||
          a.categoryLabel.en ||
          a.category
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
    selectedCategory === "all" &&
    !searchQuery.trim() &&
    filteredArticles.length > 0
      ? filteredArticles[0]
      : null;

  const remainingArticles = featuredArticle
    ? filteredArticles.slice(1)
    : filteredArticles;

  return (
    <div className="space-y-10">
      {/* Search and Category Filters Strip */}
      <div className="flex flex-col items-stretch justify-between gap-4 border-b border-[#e6e4dc] pb-6 sm:flex-row sm:items-center">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            aria-pressed={selectedCategory === "all"}
            className={`cursor-pointer rounded-full px-4 py-1.5 text-xs font-semibold shadow-2xs transition-all ${
              selectedCategory === "all"
                ? "bg-[#124d34] text-white shadow-xs"
                : "bg-surface text-text-muted hover:text-text hover:bg-muted border-border border"
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
                className={`cursor-pointer rounded-full px-4 py-1.5 text-xs font-semibold shadow-2xs transition-all ${
                  isSelected
                    ? "bg-[#124d34] text-white shadow-xs"
                    : "bg-surface text-text-muted hover:text-text hover:bg-muted border-border border"
                }`}
              >
                {cat.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full shrink-0 sm:w-72">
          <Search className="text-text-muted absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={translations.searchPlaceholder}
            className="border-border bg-surface text-text placeholder:text-text-muted/70 focus:border-primary focus:ring-primary w-full rounded-full border py-2 pr-4 pl-10 text-xs shadow-2xs focus:ring-1 focus:outline-none sm:text-sm"
          />
        </div>
      </div>

      {/* Featured Primary Article (Hero Card) */}
      {featuredArticle && (
        <ScrollReveal variant="fade-up">
          <article className="group bg-surface hover:border-primary/40 relative overflow-hidden rounded-3xl border border-[#e6e4dc] shadow-md transition-all duration-300 hover:shadow-xl">
            <div className="grid grid-cols-1 items-center lg:grid-cols-12">
              {/* Visual Media */}
              <div className="bg-muted relative aspect-[16/10] w-full overflow-hidden sm:aspect-[16/9] lg:col-span-7">
                <Image
                  src={featuredArticle.image_url}
                  alt={featuredArticle.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent lg:hidden" />
                <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-[#062115]/90 px-3 py-1 font-serif text-[10px] font-bold tracking-wider text-[#d4af37] uppercase ring-1 ring-[#c99a45]/40 backdrop-blur-xs">
                  <Tag className="h-3 w-3" />
                  <span>
                    {featuredArticle.categoryLabel[
                      locale as "en" | "ta" | "si"
                    ] || featuredArticle.categoryLabel.en}
                  </span>
                </span>
              </div>

              {/* Narrative Content */}
              <div className="flex flex-col justify-between space-y-4 p-6 sm:p-8 lg:col-span-5 lg:p-10">
                <div className="space-y-3">
                  <div className="text-text-muted flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-[#c99a45]" />
                      {formatAdminDate(featuredArticle.published_at)}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-[#c99a45]" />
                      {featuredArticle.read_time_minutes}{" "}
                      {translations.readTime}
                    </span>
                  </div>

                  <Link href={`/${locale}/news/${featuredArticle.slug}`}>
                    <h2 className="font-display text-text group-hover:text-primary text-xl leading-snug font-bold tracking-tight transition-colors sm:text-2xl lg:text-3xl">
                      {featuredArticle.title}
                    </h2>
                  </Link>

                  <p className="text-text-muted line-clamp-3 text-xs leading-relaxed sm:text-sm">
                    {featuredArticle.excerpt}
                  </p>
                </div>

                <div className="pt-2">
                  <Link
                    href={`/${locale}/news/${featuredArticle.slug}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#124d34] px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#0b2e1e] sm:text-sm"
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
        <ScrollRevealGroup
          staggerMs={60}
          className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8"
        >
          {remainingArticles.map((article) => {
            const catLabel =
              article.categoryLabel[locale as "en" | "ta" | "si"] ||
              article.categoryLabel.en;

            return (
              <article
                key={article.id}
                className="group bg-surface hover:border-primary/40 flex h-full flex-1 flex-col justify-between overflow-hidden rounded-3xl border border-[#e6e4dc] shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg"
              >
                {/* Photo Header */}
                <div className="bg-muted relative aspect-[16/10] shrink-0 overflow-hidden">
                  <Image
                    src={article.image_url}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 rounded-md bg-[#062115]/90 px-2.5 py-1 text-[10px] font-bold tracking-wider text-[#d4af37] uppercase ring-1 ring-[#c99a45]/30 backdrop-blur-xs">
                    {catLabel}
                  </span>
                </div>

                {/* Body Content */}
                <div className="flex flex-1 flex-col justify-between space-y-4 p-5 sm:p-6">
                  <div className="flex flex-1 flex-col space-y-2.5">
                    <div className="text-text-muted flex items-center gap-2.5 text-[11px]">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-[#c99a45]" />
                        {formatAdminDate(article.published_at)}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="text-text-muted h-3 w-3" />
                        {article.read_time_minutes} {translations.readTime}
                      </span>
                    </div>

                    <Link href={`/${locale}/news/${article.slug}`}>
                      <h3 className="font-display text-text group-hover:text-primary line-clamp-2 flex min-h-[3.25rem] items-center text-base leading-snug font-bold transition-colors sm:text-lg">
                        {article.title}
                      </h3>
                    </Link>

                    <p className="text-text-muted line-clamp-3 min-h-[3.75rem] flex-1 text-xs leading-relaxed sm:text-sm">
                      {article.excerpt}
                    </p>
                  </div>

                  <div className="border-border mt-auto border-t pt-3">
                    <Link
                      href={`/${locale}/news/${article.slug}`}
                      className="text-primary hover:text-primary-hover group/link inline-flex items-center gap-1.5 text-xs font-bold transition-colors sm:text-sm"
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
        <div className="border-border text-text-muted bg-surface rounded-2xl border border-dashed p-12 text-center">
          <BookOpen className="mx-auto mb-2 h-8 w-8 text-[#c99a45] opacity-80" />
          <p className="text-text text-sm font-semibold">
            {translations.noArticles}
          </p>
        </div>
      ) : null}
    </div>
  );
}
