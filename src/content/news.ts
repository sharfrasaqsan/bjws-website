export interface ArticleImage {
  url: string;
  alt: string;
  caption?: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: "cemetery" | "welfare" | "sunnah" | "announcements" | "general";
  categoryLabel: {
    en: string;
    ta: string;
    si: string;
  };
  author: string;
  image_url: string;
  gallery?: ArticleImage[];
  locale: "en" | "ta" | "si";
  published_at: string;
  updated_at?: string;
  is_published: boolean;
  read_time_minutes: number;
}

export interface UnifiedArticle {
  baseId: string;
  baseSlug: string;
  category: Article["category"];
  categoryLabel: {
    en: string;
    ta: string;
    si: string;
  };
  author: string;
  image_url: string;
  gallery?: ArticleImage[];
  published_at: string;
  updated_at?: string;
  is_published: boolean;
  translations: {
    en?: Article;
    ta?: Article;
    si?: Article;
  };
}

export const SEED_ARTICLES: Article[] = [];

declare global {
  var __articlesStore: Article[] | undefined;
}

// In-memory persistent storage for server actions (starts empty, no fallback articles)
globalThis.__articlesStore = [];
let liveArticlesStore: Article[] = globalThis.__articlesStore;

export function getArticles(
  locale: string = "en",
  includeDrafts: boolean = false
): Article[] {
  let list = liveArticlesStore;
  if (!includeDrafts) {
    list = list.filter((a) => a.is_published);
  }

  const localized = list.filter((a) => a.locale === locale);
  if (localized.length > 0) {
    return localized.sort(
      (a, b) =>
        new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
    );
  }

  // Fallback to English articles if active locale has no entries
  return list
    .filter((a) => a.locale === "en")
    .sort(
      (a, b) =>
        new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
    );
}

export function getAllArticlesAdmin(): Article[] {
  return [...liveArticlesStore].sort(
    (a, b) =>
      new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
  );
}

export function extractBaseSlug(slug: string): string {
  return slug.replace(/-(ta|si|en)$/, "");
}

export function extractBaseId(id: string): string {
  return id.replace(/-(ta|si|en)$/, "");
}

export function getUnifiedArticlesAdmin(
  articlesList?: Article[]
): UnifiedArticle[] {
  const source = articlesList || liveArticlesStore;
  const map = new Map<string, UnifiedArticle>();

  for (const art of source) {
    const baseSlug = extractBaseSlug(art.slug);
    const baseId = extractBaseId(art.id);
    const key = baseSlug || baseId;

    if (!map.has(key)) {
      map.set(key, {
        baseId,
        baseSlug,
        category: art.category,
        categoryLabel: art.categoryLabel,
        author: art.author,
        image_url: art.image_url,
        gallery: art.gallery,
        published_at: art.published_at,
        updated_at: art.updated_at,
        is_published: art.is_published,
        translations: {},
      });
    }

    const entry = map.get(key)!;
    entry.translations[art.locale] = art;
    if (art.gallery && !entry.gallery) {
      entry.gallery = art.gallery;
    }
    if (art.is_published) {
      entry.is_published = true;
    }
  }

  return Array.from(map.values()).sort(
    (a, b) =>
      new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
  );
}

export function getArticleBySlug(
  slug: string,
  locale: string = "en"
): Article | undefined {
  const cleanSlug = decodeURIComponent(slug).toLowerCase();
  const base = extractBaseSlug(cleanSlug);

  // 1. Direct match with requested locale
  let match = liveArticlesStore.find(
    (a) => a.slug.toLowerCase() === cleanSlug && a.locale === locale
  );
  if (match) return match;

  // 2. Base slug match with requested locale
  match = liveArticlesStore.find(
    (a) => extractBaseSlug(a.slug.toLowerCase()) === base && a.locale === locale
  );
  if (match) return match;

  // 3. Exact slug match only if matching requested locale or English (never cross-pollinate Tamil into Sinhala)
  if (locale !== "si") {
    match = liveArticlesStore.find(
      (a) =>
        a.slug.toLowerCase() === cleanSlug &&
        (a.locale === locale || a.locale === "en")
    );
    if (match) return match;
  }

  // 4. Base slug with English fallback (safe universal fallback)
  match = liveArticlesStore.find(
    (a) => extractBaseSlug(a.slug.toLowerCase()) === base && a.locale === "en"
  );
  if (match) return match;

  // 5. For non-Sinhala routes only, any matching base slug
  if (locale !== "si") {
    return liveArticlesStore.find(
      (a) => extractBaseSlug(a.slug.toLowerCase()) === base
    );
  }

  return undefined;
}

export function addArticleStore(article: Article): void {
  liveArticlesStore = [article, ...liveArticlesStore];
  globalThis.__articlesStore = liveArticlesStore;
}

export function addUnifiedArticleStore(articles: Article[]): void {
  liveArticlesStore = [...articles, ...liveArticlesStore];
  globalThis.__articlesStore = liveArticlesStore;
}

export function updateArticleStore(
  id: string,
  updates: Partial<Article>
): boolean {
  const index = liveArticlesStore.findIndex((a) => a.id === id);
  if (index === -1) return false;

  liveArticlesStore[index] = {
    ...liveArticlesStore[index],
    ...updates,
  };
  globalThis.__articlesStore = liveArticlesStore;
  return true;
}

export function updateUnifiedArticleStore(
  baseSlug: string,
  commonUpdates: Partial<Article>,
  translationUpdates?: Partial<
    Record<
      "en" | "ta" | "si",
      { title: string; excerpt: string; content: string }
    >
  >
): boolean {
  const normalizedBase = extractBaseSlug(baseSlug);
  let updatedAny = false;

  liveArticlesStore = liveArticlesStore.map((art) => {
    if (extractBaseSlug(art.slug) === normalizedBase) {
      updatedAny = true;
      const langUpdate = translationUpdates
        ? translationUpdates[art.locale]
        : undefined;
      return {
        ...art,
        ...commonUpdates,
        ...(langUpdate
          ? {
              title: langUpdate.title,
              excerpt: langUpdate.excerpt,
              content: langUpdate.content,
              read_time_minutes: Math.max(
                1,
                Math.ceil((langUpdate.content.split(/\s+/).length || 200) / 180)
              ),
            }
          : {}),
      };
    }
    return art;
  });

  globalThis.__articlesStore = liveArticlesStore;
  return updatedAny;
}

export function deleteArticleStore(id: string): boolean {
  const initialLen = liveArticlesStore.length;
  liveArticlesStore = liveArticlesStore.filter((a) => a.id !== id);
  globalThis.__articlesStore = liveArticlesStore;
  return liveArticlesStore.length < initialLen;
}

export function deleteUnifiedArticleStore(baseSlug: string): boolean {
  const normalizedBase = extractBaseSlug(baseSlug);
  const initialLen = liveArticlesStore.length;
  liveArticlesStore = liveArticlesStore.filter(
    (a) => extractBaseSlug(a.slug) !== normalizedBase
  );
  globalThis.__articlesStore = liveArticlesStore;
  return liveArticlesStore.length < initialLen;
}

export function toggleUnifiedArticlePublishStore(
  baseSlug: string,
  newState: boolean
): boolean {
  const normalizedBase = extractBaseSlug(baseSlug);
  let updated = false;
  liveArticlesStore = liveArticlesStore.map((art) => {
    if (extractBaseSlug(art.slug) === normalizedBase) {
      updated = true;
      return { ...art, is_published: newState };
    }
    return art;
  });
  globalThis.__articlesStore = liveArticlesStore;
  return updated;
}
