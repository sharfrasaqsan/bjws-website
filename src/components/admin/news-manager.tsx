"use client";

import * as React from "react";
import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  type Article,
  type UnifiedArticle,
  type ArticleImage,
  getUnifiedArticlesAdmin,
} from "@/content/news";
import {
  createMultilingualArticleAction,
  updateMultilingualArticleAction,
  deleteUnifiedArticleAction,
  toggleUnifiedArticlePublishAction,
} from "@/lib/admin-actions";
import { formatAdminDate } from "@/lib/utils";
import { WritingToolbar } from "@/components/admin/writing-toolbar";
import { SingleImageDropzone } from "@/components/admin/single-image-dropzone";
import {
  Newspaper,
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  Clock,
  Tag,
  X,
  Eye,
  EyeOff,
  Calendar,
  Sparkles,
  AlertCircle,
  Camera,
} from "lucide-react";

interface NewsManagerProps {
  initialArticles: Article[];
}

export function NewsManager({ initialArticles }: NewsManagerProps) {
  const [unifiedArticles, setUnifiedArticles] = useState<UnifiedArticle[]>(() =>
    getUnifiedArticlesAdmin(initialArticles)
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isPending, startTransition] = useTransition();

  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<UnifiedArticle | null>(
    null
  );
  const [deleteConfirmSlug, setDeleteConfirmSlug] = useState<string | null>(
    null
  );
  const [formError, setFormError] = useState<string | null>(null);

  // Active form language tab
  const [activeFormTab, setActiveFormTab] = useState<"ta" | "en" | "si">("ta");

  // Card preview language selector per baseSlug
  const [cardPreviewLang, setCardPreviewLang] = useState<
    Record<string, "ta" | "en" | "si">
  >({});

  // Controlled form state for create
  const [createFields, setCreateFields] = useState({
    title_ta: "",
    excerpt_ta: "",
    content_ta: "",
    title_en: "",
    excerpt_en: "",
    content_en: "",
    title_si: "",
    excerpt_si: "",
    content_si: "",
    slug: "",
    category: "general" as Article["category"],
    author: "BJWS Editorial Board",
    image_url: "",
    is_published: true,
    published_at: "",
  });

  // Controlled form state for edit
  const [editFields, setEditFields] = useState({
    title_ta: "",
    excerpt_ta: "",
    content_ta: "",
    title_en: "",
    excerpt_en: "",
    content_en: "",
    title_si: "",
    excerpt_si: "",
    content_si: "",
    category: "general" as Article["category"],
    author: "BJWS Editorial Board",
    image_url: "",
    is_published: true,
    published_at: "",
    updated_at: "",
  });

  // Gallery state for related internal images with alt text
  const [createGallery, setCreateGallery] = useState<ArticleImage[]>([]);
  const [editGallery, setEditGallery] = useState<ArticleImage[]>([]);

  // Textarea references for the writing toolbars
  const createContentTaRef = React.useRef<HTMLTextAreaElement>(null);
  const createContentEnRef = React.useRef<HTMLTextAreaElement>(null);
  const createContentSiRef = React.useRef<HTMLTextAreaElement>(null);

  const editContentTaRef = React.useRef<HTMLTextAreaElement>(null);
  const editContentEnRef = React.useRef<HTMLTextAreaElement>(null);
  const editContentSiRef = React.useRef<HTMLTextAreaElement>(null);

  const handleOpenEdit = (art: UnifiedArticle) => {
    setFormError(null);
    setEditingArticle(art);
    setEditFields({
      title_ta: art.translations.ta?.title || "",
      excerpt_ta: art.translations.ta?.excerpt || "",
      content_ta: art.translations.ta?.content || "",
      title_en: art.translations.en?.title || "",
      excerpt_en: art.translations.en?.excerpt || "",
      content_en: art.translations.en?.content || "",
      title_si: art.translations.si?.title || "",
      excerpt_si: art.translations.si?.excerpt || "",
      content_si: art.translations.si?.content || "",
      category: art.category,
      author: art.author,
      image_url: art.image_url,
      is_published: art.is_published,
      published_at: art.published_at ? art.published_at.slice(0, 10) : "",
      updated_at: art.updated_at ? art.updated_at.slice(0, 10) : "",
    });
    const initialGallery =
      art.gallery ||
      art.translations.en?.gallery ||
      art.translations.ta?.gallery ||
      art.translations.si?.gallery ||
      [];
    setEditGallery(initialGallery);

    if (art.translations.ta?.title) setActiveFormTab("ta");
    else if (art.translations.en?.title) setActiveFormTab("en");
    else if (art.translations.si?.title) setActiveFormTab("si");
    else setActiveFormTab("ta");
  };

  const handleAddInternalImage = (isEdit: boolean) => {
    const newItem: ArticleImage = {
      url: "",
      alt: "",
      caption: "",
    };
    if (isEdit) {
      setEditGallery((prev) => [...prev, newItem]);
    } else {
      setCreateGallery((prev) => [...prev, newItem]);
    }
  };

  const handleUpdateInternalImage = (
    isEdit: boolean,
    index: number,
    field: keyof ArticleImage,
    value: string
  ) => {
    const setter = isEdit ? setEditGallery : setCreateGallery;
    setter((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleRemoveInternalImage = (isEdit: boolean, index: number) => {
    const setter = isEdit ? setEditGallery : setCreateGallery;
    setter((prev) => prev.filter((_, i) => i !== index));
  };

  const handleInsertImageToContent = (img: ArticleImage, isEdit: boolean) => {
    if (!img.url) return;
    const markdown = `\n![${img.alt || "Article illustration"}](${img.url})\n`;
    if (isEdit) {
      if (activeFormTab === "ta") {
        setEditFields((p) => ({ ...p, content_ta: p.content_ta + markdown }));
      } else if (activeFormTab === "en") {
        setEditFields((p) => ({ ...p, content_en: p.content_en + markdown }));
      } else {
        setEditFields((p) => ({ ...p, content_si: p.content_si + markdown }));
      }
    } else {
      if (activeFormTab === "ta") {
        setCreateFields((p) => ({ ...p, content_ta: p.content_ta + markdown }));
      } else if (activeFormTab === "en") {
        setCreateFields((p) => ({ ...p, content_en: p.content_en + markdown }));
      } else {
        setCreateFields((p) => ({ ...p, content_si: p.content_si + markdown }));
      }
    }
  };

  const filteredArticles = unifiedArticles.filter((art) => {
    const matchesCat =
      categoryFilter === "all" || art.category === categoryFilter;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCat;

    const matchesEn =
      art.translations.en?.title.toLowerCase().includes(q) ||
      art.translations.en?.content.toLowerCase().includes(q);
    const matchesTa =
      art.translations.ta?.title.toLowerCase().includes(q) ||
      art.translations.ta?.content.toLowerCase().includes(q);
    const matchesSi =
      art.translations.si?.title.toLowerCase().includes(q) ||
      art.translations.si?.content.toLowerCase().includes(q);

    return (
      matchesCat &&
      (matchesEn ||
        matchesTa ||
        matchesSi ||
        art.author.toLowerCase().includes(q) ||
        art.baseSlug.toLowerCase().includes(q))
    );
  });

  const handleTogglePublish = (article: UnifiedArticle) => {
    startTransition(async () => {
      try {
        await toggleUnifiedArticlePublishAction(
          article.baseSlug,
          article.is_published
        );
        setUnifiedArticles((prev) =>
          prev.map((a) =>
            a.baseSlug === article.baseSlug
              ? {
                  ...a,
                  is_published: !a.is_published,
                  translations: Object.fromEntries(
                    Object.entries(a.translations).map(([k, v]) => [
                      k,
                      v ? { ...v, is_published: !a.is_published } : v,
                    ])
                  ),
                }
              : a
          )
        );
      } catch (err) {
        console.error("Failed to toggle publish status:", err);
      }
    });
  };

  const handleDelete = (baseSlug: string) => {
    startTransition(async () => {
      try {
        await deleteUnifiedArticleAction(baseSlug);
        setUnifiedArticles((prev) =>
          prev.filter((a) => a.baseSlug !== baseSlug)
        );
        setDeleteConfirmSlug(null);
      } catch (err) {
        console.error("Failed to delete article:", err);
      }
    });
  };

  const openCreateModal = () => {
    setFormError(null);
    setCreateFields({
      title_ta: "",
      excerpt_ta: "",
      content_ta: "",
      title_en: "",
      excerpt_en: "",
      content_en: "",
      title_si: "",
      excerpt_si: "",
      content_si: "",
      slug: "",
      category: "general" as Article["category"],
      author: "BJWS Editorial Board",
      image_url: "",
      is_published: true,
      published_at: "",
    });
    setCreateGallery([]);
    setIsCreateOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateOpen(false);
    setCreateFields({
      title_ta: "",
      excerpt_ta: "",
      content_ta: "",
      title_en: "",
      excerpt_en: "",
      content_en: "",
      title_si: "",
      excerpt_si: "",
      content_si: "",
      slug: "",
      category: "general" as Article["category"],
      author: "BJWS Editorial Board",
      image_url: "",
      is_published: true,
      published_at: "",
    });
    setCreateGallery([]);
    setFormError(null);
  };

  const closeEditModal = () => {
    setEditingArticle(null);
    setEditGallery([]);
    setFormError(null);
  };

  const handleCreateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    const formData = new FormData(e.currentTarget);

    // Guarantee all multilingual fields from React state are reliably present in formData
    formData.set("title_ta", createFields.title_ta.trim());
    formData.set("excerpt_ta", createFields.excerpt_ta.trim());
    formData.set("content_ta", createFields.content_ta.trim());

    formData.set("title_en", createFields.title_en.trim());
    formData.set("excerpt_en", createFields.excerpt_en.trim());
    formData.set("content_en", createFields.content_en.trim());

    formData.set("title_si", createFields.title_si.trim());
    formData.set("excerpt_si", createFields.excerpt_si.trim());
    formData.set("content_si", createFields.content_si.trim());

    formData.set("slug", createFields.slug.trim());
    formData.set("category", createFields.category);
    formData.set("author", createFields.author.trim());
    formData.set("published_at", createFields.published_at.trim());
    if (createFields.is_published) {
      formData.set("is_published", "on");
    } else {
      formData.delete("is_published");
    }
    formData.set("image_url", createFields.image_url.trim());
    formData.set("gallery", JSON.stringify(createGallery));

    startTransition(async () => {
      const res = await createMultilingualArticleAction(null, formData);
      if (res?.error) {
        setFormError(res.error);
      } else {
        closeCreateModal();
        window.location.reload();
      }
    });
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingArticle) return;
    setFormError(null);
    const formData = new FormData(e.currentTarget);

    // Guarantee all multilingual fields from React state are reliably present in formData
    formData.set("title_ta", editFields.title_ta.trim());
    formData.set("excerpt_ta", editFields.excerpt_ta.trim());
    formData.set("content_ta", editFields.content_ta.trim());

    formData.set("title_en", editFields.title_en.trim());
    formData.set("excerpt_en", editFields.excerpt_en.trim());
    formData.set("content_en", editFields.content_en.trim());

    formData.set("title_si", editFields.title_si.trim());
    formData.set("excerpt_si", editFields.excerpt_si.trim());
    formData.set("content_si", editFields.content_si.trim());

    formData.set("category", editFields.category);
    formData.set("author", editFields.author.trim());
    formData.set("published_at", editFields.published_at.trim());
    formData.set("updated_at", editFields.updated_at.trim());
    if (editFields.is_published) {
      formData.set("is_published", "on");
    } else {
      formData.delete("is_published");
    }
    formData.set("image_url", editFields.image_url.trim());
    formData.set("gallery", JSON.stringify(editGallery));

    startTransition(async () => {
      const res = await updateMultilingualArticleAction(
        editingArticle.baseSlug,
        null,
        formData
      );
      if (res?.error) {
        setFormError(res.error);
      } else {
        closeEditModal();
        window.location.reload();
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col items-stretch justify-between gap-4 rounded-2xl border border-[#e6e4dc] bg-white p-4 shadow-xs sm:flex-row sm:items-center">
        {/* Search & Category Filter */}
        <div className="flex flex-1 flex-wrap items-center gap-2.5">
          <div className="relative min-w-[200px] flex-1">
            <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" />
            <input
              type="search"
              placeholder="Search news by title, content or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-[#e6e4dc] bg-[#fbfaf6] py-2 pr-4 pl-9 text-xs text-[#1c2420] focus:border-[#124d34] focus:bg-white focus:outline-none sm:text-sm"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-[#e6e4dc] bg-[#fbfaf6] px-3 py-2 text-xs font-medium text-[#1c2420] focus:border-[#124d34] focus:bg-white focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="cemetery">Cemetery Care</option>
            <option value="welfare">Welfare Relief</option>
            <option value="sunnah">Sunnah Education</option>
            <option value="announcements">Announcements</option>
            <option value="general">General News</option>
          </select>
        </div>

        {/* Create Button */}
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#124d34] px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:-translate-y-0.5 hover:bg-[#0b2e1e] sm:text-sm"
        >
          <Plus className="h-4 w-4 text-[#c99a45]" />
          <span>Publish Article (All Languages)</span>
        </button>
      </div>

      {/* Publications Count & Status Pill */}
      <div className="flex items-center justify-between px-1 text-xs text-[#6b7280]">
        <span>
          Showing <strong>{filteredArticles.length}</strong> of{" "}
          <strong>{unifiedArticles.length}</strong> publications
        </span>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            {unifiedArticles.filter((a) => a.is_published).length} Published
          </span>
          <span className="inline-flex items-center gap-1.5 text-amber-700">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            {unifiedArticles.filter((a) => !a.is_published).length} Drafts
          </span>
        </div>
      </div>

      {/* Articles Grid / List */}
      <div className="space-y-4">
        {filteredArticles.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#e6e4dc] bg-white p-12 text-center text-[#6b7280]">
            <Newspaper className="mx-auto mb-2 h-8 w-8 text-[#c99a45] opacity-80" />
            <p className="text-sm font-semibold text-[#1c2420]">
              No publications found
            </p>
            <p className="mt-1 text-xs text-[#6b7280]">
              Click &quot;Publish Article (All Languages)&quot; above to create
              your first multilingual story.
            </p>
          </div>
        ) : (
          filteredArticles.map((art) => {
            const currentLang =
              cardPreviewLang[art.baseSlug] ||
              (art.translations.ta ? "ta" : art.translations.en ? "en" : "si");

            const activeTrans =
              art.translations[currentLang] ||
              (currentLang === "si"
                ? art.translations.en
                : art.translations.en || art.translations.ta);

            return (
              <div
                key={art.baseSlug}
                className="flex flex-col items-stretch gap-5 rounded-2xl border border-[#e6e4dc] bg-white p-5 shadow-xs transition-all hover:border-[#124d34]/40 hover:shadow-md md:flex-row"
              >
                {/* Thumbnail Image */}
                <div className="relative h-32 min-h-[110px] shrink-0 overflow-hidden rounded-xl border border-[#e6e4dc] bg-[#f3f1ea] md:h-auto md:w-44">
                  {art.image_url ? (
                    <Image
                      src={art.image_url}
                      alt={activeTrans?.title || "News cover"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 176px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#fbfaf6] text-[#9ca3af]">
                      <Newspaper className="h-8 w-8 text-[#124d34] opacity-40" />
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase shadow-xs ${
                        art.is_published
                          ? "bg-emerald-600 text-white"
                          : "bg-amber-600 text-white"
                      }`}
                    >
                      {art.is_published ? "Published" : "Draft"}
                    </span>
                  </div>
                </div>

                {/* Middle Column: Details & Content Preview */}
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Category */}
                    <span className="inline-flex items-center gap-1 rounded-md bg-[#e8f3ee] px-2 py-0.5 text-[11px] font-semibold text-[#124d34]">
                      <Tag className="h-3 w-3 text-[#c99a45]" />
                      <span>{art.categoryLabel?.en || art.category}</span>
                    </span>

                    {/* Language Badges */}
                    <div className="flex items-center gap-1 rounded-lg border border-[#e6e4dc] bg-[#fbfaf6] px-2 py-0.5">
                      <span className="text-[10px] font-semibold text-[#8b651e]">
                        Languages:
                      </span>
                      <span
                        className={`py-0.2 rounded px-1.5 text-[10px] font-bold ${
                          art.translations.ta
                            ? "bg-[#124d34] text-white"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        தமிழ் (TA)
                      </span>
                      <span
                        className={`py-0.2 rounded px-1.5 text-[10px] font-bold ${
                          art.translations.en
                            ? "bg-[#124d34] text-white"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        EN
                      </span>
                      <span
                        className={`py-0.2 rounded px-1.5 text-[10px] font-bold ${
                          art.translations.si
                            ? "bg-[#124d34] text-white"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        සිංහල (SI)
                      </span>
                    </div>

                    {/* Reading time */}
                    {activeTrans?.read_time_minutes && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-[#6b7280]">
                        <Clock className="h-3 w-3" />
                        <span>{activeTrans.read_time_minutes} min read</span>
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="line-clamp-1 font-serif text-base font-bold text-[#0b2e1e] sm:text-lg">
                    {activeTrans?.title ||
                      (currentLang === "si"
                        ? "සිංහල පරිවර්තනයක් තවම එකතු කර නැත (No Sinhala translation)"
                        : "Untitled Article")}
                  </h3>

                  {/* Excerpt */}
                  <p className="line-clamp-2 text-xs leading-relaxed text-[#4b5563]">
                    {activeTrans?.excerpt ||
                      (currentLang === "si"
                        ? "(මෙම ලිපිය සඳහා සිංහල පරිවර්තනයක් ලබා දී නොමැත)"
                        : "(No summary provided for this language)")}
                  </p>

                  {/* Metadata & Preview Switcher */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#f3f1ea] pt-1 text-[11px] text-[#6b7280]">
                    <div className="flex flex-wrap items-center gap-2">
                      <span>By {art.author}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-mono text-[#8b651e]">
                        <Calendar className="h-3 w-3 text-[#c99a45]" />
                        <span>
                          Published: {formatAdminDate(art.published_at)}
                        </span>
                      </span>
                      {art.updated_at && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1 font-mono text-emerald-700">
                            <Clock className="h-3 w-3 text-emerald-600" />
                            <span>
                              Updated: {formatAdminDate(art.updated_at)}
                            </span>
                          </span>
                        </>
                      )}
                      <span>•</span>
                      <span className="font-mono text-[10px] text-[#9ca3af]">
                        slug: /{art.baseSlug}
                      </span>
                    </div>

                    {/* Card preview language switcher */}
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-medium text-[#9ca3af]">
                        Preview:
                      </span>
                      {(["ta", "en", "si"] as const).map((code) => {
                        const hasTrans = Boolean(art.translations[code]);
                        const isCurrent = currentLang === code;
                        return (
                          <button
                            key={code}
                            type="button"
                            onClick={() =>
                              setCardPreviewLang((p) => ({
                                ...p,
                                [art.baseSlug]: code,
                              }))
                            }
                            className={`py-0.2 rounded px-1.5 text-[10px] font-semibold transition-all ${
                              isCurrent
                                ? "bg-[#124d34] text-white"
                                : hasTrans
                                  ? "bg-[#fbfaf6] text-[#4b5563] hover:bg-[#e6e4dc]"
                                  : "cursor-not-allowed bg-gray-100 text-gray-300"
                            }`}
                            disabled={!hasTrans}
                          >
                            {code === "ta"
                              ? "தமிழ்"
                              : code === "en"
                                ? "EN"
                                : "සිංහල"}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Right Column: Actions */}
                <div className="flex shrink-0 items-center justify-end gap-2 border-t border-[#e6e4dc] pt-3 md:flex-col md:justify-center md:border-t-0 md:border-l md:pt-0 md:pl-4">
                  {/* View on Public Site */}
                  <Link
                    href={`/${currentLang}/news/${art.translations[currentLang]?.slug || art.baseSlug}`}
                    target="_blank"
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#e6e4dc] bg-[#fbfaf6] px-3 py-1.5 text-xs font-semibold text-[#1c2420] transition-colors hover:bg-[#e6e4dc]"
                    title="View Public Article in current language"
                  >
                    <ExternalLink className="h-3.5 w-3.5 text-[#c99a45]" />
                    <span>View</span>
                  </Link>

                  {/* Edit Button */}
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(art)}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#c99a45]/40 bg-[#fbfaf6] px-3 py-1.5 text-xs font-semibold text-[#0b2e1e] transition-colors hover:bg-[#f5eedf]"
                    title="Edit article in all languages"
                  >
                    <Edit2 className="h-3.5 w-3.5 text-[#c99a45]" />
                    <span>Edit (All)</span>
                  </button>

                  {/* Toggle Publish */}
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleTogglePublish(art)}
                    className={`inline-flex cursor-pointer items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                      art.is_published
                        ? "border border-amber-500/30 bg-amber-50 text-amber-800 hover:bg-amber-100"
                        : "border border-emerald-500/30 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                    }`}
                    title={
                      art.is_published
                        ? "Unpublish all languages to Draft"
                        : "Publish all languages to Site"
                    }
                  >
                    {art.is_published ? (
                      <>
                        <EyeOff className="h-3.5 w-3.5" />
                        <span>Unpublish</span>
                      </>
                    ) : (
                      <>
                        <Eye className="h-3.5 w-3.5" />
                        <span>Publish</span>
                      </>
                    )}
                  </button>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmSlug(art.baseSlug)}
                    className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-red-200 bg-red-50 p-1.5 text-xs font-semibold text-red-700 transition-colors hover:bg-red-100"
                    title="Delete publication across all languages"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* CREATE MULTILINGUAL ARTICLE MODAL */}
      {isCreateOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-xs"
            onClick={closeCreateModal}
          />

          <div className="relative z-10 max-h-[92vh] w-full max-w-3xl space-y-6 overflow-y-auto rounded-3xl border border-[#e6e4dc] bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-center justify-between border-b border-[#e6e4dc] pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f3ee] text-[#124d34]">
                  <Newspaper className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#0b2e1e]">
                    Publish Multilingual Article
                  </h3>
                  <p className="text-xs text-[#6b7280]">
                    Create a news story or announcement in Tamil, English, and
                    Sinhala in a single submission.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeCreateModal}
                className="rounded-lg p-2 text-[#6b7280] hover:bg-[#f3f1ea]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {formError && (
              <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form
              onSubmit={handleCreateSubmit}
              className="space-y-5 text-xs sm:text-sm"
            >
              {/* Top Common Details: Category, Author, Featured Image, Slug */}
              <div className="space-y-4 rounded-2xl border border-[#e6e4dc] bg-[#fbfaf6] p-4">
                <h4 className="text-xs font-bold tracking-wider text-[#8b651e] uppercase">
                  Common Article Settings
                </h4>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-[#1c2420]">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={createFields.category}
                      onChange={(e) =>
                        setCreateFields((p) => ({
                          ...p,
                          category: e.target.value as Article["category"],
                        }))
                      }
                      className="w-full rounded-xl border border-[#e6e4dc] bg-white px-3 py-2 text-xs font-medium text-[#1c2420] focus:border-[#124d34] focus:outline-none"
                    >
                      <option value="cemetery">Cemetery Care</option>
                      <option value="welfare">Welfare Relief</option>
                      <option value="sunnah">Sunnah Education</option>
                      <option value="announcements">Announcements</option>
                      <option value="general">General News</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-[#1c2420]">
                      Author / Byline
                    </label>
                    <input
                      type="text"
                      name="author"
                      value={createFields.author}
                      onChange={(e) =>
                        setCreateFields((p) => ({
                          ...p,
                          author: e.target.value,
                        }))
                      }
                      placeholder="BJWS Editorial Board"
                      className="w-full rounded-xl border border-[#e6e4dc] bg-white px-3 py-2 text-xs text-[#1c2420] focus:border-[#124d34] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-[#1c2420]">
                      Base URL Slug (Optional)
                    </label>
                    <input
                      type="text"
                      name="slug"
                      value={createFields.slug}
                      onChange={(e) =>
                        setCreateFields((p) => ({ ...p, slug: e.target.value }))
                      }
                      placeholder="e.g. shramadhana-2026"
                      className="w-full rounded-xl border border-[#e6e4dc] bg-white px-3 py-2 text-xs text-[#1c2420] focus:border-[#124d34] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="font-semibold text-[#1c2420]">
                        Publish Date
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setCreateFields((p) => ({
                              ...p,
                              published_at: new Date()
                                .toISOString()
                                .slice(0, 10),
                            }))
                          }
                          className="text-[11px] font-semibold text-[#124d34] hover:underline"
                        >
                          Set Today
                        </button>
                        {createFields.published_at && (
                          <button
                            type="button"
                            onClick={() =>
                              setCreateFields((p) => ({
                                ...p,
                                published_at: "",
                              }))
                            }
                            className="text-[11px] font-semibold text-slate-500 hover:underline"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    </div>
                    <input
                      type="date"
                      name="published_at"
                      value={createFields.published_at}
                      onChange={(e) =>
                        setCreateFields((p) => ({
                          ...p,
                          published_at: e.target.value,
                        }))
                      }
                      className="w-full rounded-xl border border-[#e6e4dc] bg-white px-3 py-2 text-xs text-[#1c2420] focus:border-[#124d34] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <SingleImageDropzone
                    name="image_url"
                    value={createFields.image_url}
                    onChange={(url) =>
                      setCreateFields((p) => ({ ...p, image_url: url }))
                    }
                    folder="news"
                    label="Main Hero / Featured Cover Photo *"
                    helperText="Drag & drop cover photo or browse (auto-compressed to WebP)."
                  />
                </div>
              </div>

              {/* Language Navigation Tabs */}
              <div className="flex flex-wrap items-center gap-2 border-b border-[#e6e4dc] pb-3">
                {[
                  {
                    code: "ta" as const,
                    label: "Tamil (தமிழ்) - முதன்மை",
                    filled: Boolean(
                      createFields.title_ta && createFields.content_ta
                    ),
                  },
                  {
                    code: "en" as const,
                    label: "English (Official)",
                    filled: Boolean(
                      createFields.title_en && createFields.content_en
                    ),
                  },
                  {
                    code: "si" as const,
                    label: "Sinhala (සිංහල)",
                    filled: Boolean(
                      createFields.title_si && createFields.content_si
                    ),
                  },
                ].map((tab) => (
                  <button
                    type="button"
                    key={tab.code}
                    onClick={() => setActiveFormTab(tab.code)}
                    className={`inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                      activeFormTab === tab.code
                        ? "bg-[#124d34] text-white shadow-xs"
                        : "bg-[#fbfaf6] text-[#4b5563] hover:bg-[#f3f1ea]"
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`h-2 w-2 rounded-full ${
                        tab.filled ? "bg-emerald-400" : "bg-gray-300"
                      }`}
                      title={tab.filled ? "Content entered" : "Empty"}
                    />
                  </button>
                ))}
              </div>

              {/* Tamil Tab Pane */}
              <div
                className={
                  activeFormTab === "ta" ? "space-y-4" : "hidden space-y-4"
                }
              >
                <div className="space-y-1">
                  <label className="font-semibold text-[#1c2420]">
                    கட்டுரைத் தலைப்பு (Tamil Title)
                  </label>
                  <input
                    type="text"
                    name="title_ta"
                    value={createFields.title_ta}
                    onChange={(e) =>
                      setCreateFields((p) => ({
                        ...p,
                        title_ta: e.target.value,
                      }))
                    }
                    placeholder="எ.கா. முள்ளிப்பொத்தானை மையவாடி சிரமதானப் பணி..."
                    className="w-full rounded-xl border border-[#e6e4dc] bg-[#fbfaf6] px-3.5 py-2.5 text-[#1c2420] focus:border-[#124d34] focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#1c2420]">
                    சுருக்க விபரம் (Tamil Excerpt)
                  </label>
                  <textarea
                    name="excerpt_ta"
                    rows={2}
                    value={createFields.excerpt_ta}
                    onChange={(e) =>
                      setCreateFields((p) => ({
                        ...p,
                        excerpt_ta: e.target.value,
                      }))
                    }
                    placeholder="கட்டுரையின் முக்கிய சுருக்கம்..."
                    className="w-full rounded-xl border border-[#e6e4dc] bg-[#fbfaf6] px-3.5 py-2 leading-relaxed text-[#1c2420] focus:border-[#124d34] focus:bg-white focus:outline-none"
                  />
                </div>

                <WritingToolbar
                  textareaRef={createContentTaRef}
                  value={createFields.content_ta}
                  onChange={(val) =>
                    setCreateFields((p) => ({ ...p, content_ta: val }))
                  }
                  internalImages={createGallery}
                  label="முழு விபரம்"
                  languageLabel="Tamil Full Content"
                  name="content_ta"
                  placeholder="முழுமையான செய்தி அல்லது கட்டுரையை இங்கே பதிவிடவும்..."
                />
              </div>

              {/* English Tab Pane */}
              <div
                className={
                  activeFormTab === "en" ? "space-y-4" : "hidden space-y-4"
                }
              >
                <div className="space-y-1">
                  <label className="font-semibold text-[#1c2420]">
                    Article Title (English)
                  </label>
                  <input
                    type="text"
                    name="title_en"
                    value={createFields.title_en}
                    onChange={(e) =>
                      setCreateFields((p) => ({
                        ...p,
                        title_en: e.target.value,
                      }))
                    }
                    placeholder="e.g. Annual Mahallah Cemetery Shramadhana Successfully Completed"
                    className="w-full rounded-xl border border-[#e6e4dc] bg-[#fbfaf6] px-3.5 py-2.5 text-[#1c2420] focus:border-[#124d34] focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#1c2420]">
                    Short Excerpt (English Summary)
                  </label>
                  <textarea
                    name="excerpt_en"
                    rows={2}
                    value={createFields.excerpt_en}
                    onChange={(e) =>
                      setCreateFields((p) => ({
                        ...p,
                        excerpt_en: e.target.value,
                      }))
                    }
                    placeholder="One or two sentences summarizing the article..."
                    className="w-full rounded-xl border border-[#e6e4dc] bg-[#fbfaf6] px-3.5 py-2 leading-relaxed text-[#1c2420] focus:border-[#124d34] focus:bg-white focus:outline-none"
                  />
                </div>

                <WritingToolbar
                  textareaRef={createContentEnRef}
                  value={createFields.content_en}
                  onChange={(val) =>
                    setCreateFields((p) => ({ ...p, content_en: val }))
                  }
                  internalImages={createGallery}
                  label="Full Content"
                  languageLabel="English"
                  name="content_en"
                  placeholder="Write the full news story or announcement in English..."
                />
              </div>

              {/* Sinhala Tab Pane */}
              <div
                className={
                  activeFormTab === "si" ? "space-y-4" : "hidden space-y-4"
                }
              >
                <div className="space-y-1">
                  <label className="font-semibold text-[#1c2420]">
                    ලිපි මාතෘකාව (Sinhala Title)
                  </label>
                  <input
                    type="text"
                    name="title_si"
                    value={createFields.title_si}
                    onChange={(e) =>
                      setCreateFields((p) => ({
                        ...p,
                        title_si: e.target.value,
                      }))
                    }
                    placeholder="ලිපි මාතෘකාව ඇතුළත් කරන්න..."
                    className="w-full rounded-xl border border-[#e6e4dc] bg-[#fbfaf6] px-3.5 py-2.5 text-[#1c2420] focus:border-[#124d34] focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#1c2420]">
                    කෙටි විස්තරය (Sinhala Excerpt)
                  </label>
                  <textarea
                    name="excerpt_si"
                    rows={2}
                    value={createFields.excerpt_si}
                    onChange={(e) =>
                      setCreateFields((p) => ({
                        ...p,
                        excerpt_si: e.target.value,
                      }))
                    }
                    placeholder="ලිපියේ සාරාංශය..."
                    className="w-full rounded-xl border border-[#e6e4dc] bg-[#fbfaf6] px-3.5 py-2 leading-relaxed text-[#1c2420] focus:border-[#124d34] focus:bg-white focus:outline-none"
                  />
                </div>

                <WritingToolbar
                  textareaRef={createContentSiRef}
                  value={createFields.content_si}
                  onChange={(val) =>
                    setCreateFields((p) => ({ ...p, content_si: val }))
                  }
                  internalImages={createGallery}
                  label="සම්පූර්ණ විස්තරය"
                  languageLabel="Sinhala Full Content"
                  name="content_si"
                  placeholder="සම්පූර්ණ පුවත හෝ ලිපිය මෙහි ලියන්න..."
                />
              </div>

              {/* ARTICLE MEDIA & RELATED INTERNAL IMAGES SECTION */}
              <div className="space-y-4 rounded-2xl border border-[#e6e4dc] bg-[#fbfaf6] p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0b2e1e] text-[#d4af37]">
                      <Camera className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-[#0b2e1e] sm:text-sm">
                        Related Internal Images (with Alt & Captions)
                      </h4>
                      <p className="text-text-muted text-[11px]">
                        Add extra photos for the article archive or embed them
                        into content using writing tools.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddInternalImage(false)}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#124d34] px-3 py-1.5 text-xs font-semibold text-white shadow-2xs transition-colors hover:bg-[#0b2e1e]"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Photo</span>
                  </button>
                </div>

                {createGallery.length === 0 ? (
                  <div className="text-text-muted rounded-xl border border-dashed border-[#e6e4dc] p-6 text-center text-xs">
                    No related internal images added yet. Click &quot;Add
                    Photo&quot; to include photo galleries with alt text.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {createGallery.map((img, idx) => (
                      <div
                        key={idx}
                        className="space-y-3 rounded-xl border border-[#e6e4dc] bg-white p-3 shadow-2xs"
                      >
                        <SingleImageDropzone
                          value={img.url}
                          onChange={(url) =>
                            handleUpdateInternalImage(false, idx, "url", url)
                          }
                          folder="news"
                          label={`Article Photo #${idx + 1}`}
                          helperText="Drag & drop or browse photo (auto-compressed to WebP)."
                        />

                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                          <div>
                            <label className="text-text mb-0.5 block text-[10px] font-semibold">
                              Alt Text <span className="text-red-500">*</span>:
                            </label>
                            <input
                              type="text"
                              value={img.alt}
                              onChange={(e) =>
                                handleUpdateInternalImage(
                                  false,
                                  idx,
                                  "alt",
                                  e.target.value
                                )
                              }
                              placeholder="Describe the photo for accessibility & SEO..."
                              className="w-full rounded-lg border border-[#e6e4dc] bg-[#fbfaf6] px-2.5 py-1.5 text-xs text-[#1c2420] focus:border-[#124d34] focus:bg-white focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="text-text mb-0.5 block text-[10px] font-semibold">
                              Caption (Optional):
                            </label>
                            <input
                              type="text"
                              value={img.caption || ""}
                              onChange={(e) =>
                                handleUpdateInternalImage(
                                  false,
                                  idx,
                                  "caption",
                                  e.target.value
                                )
                              }
                              placeholder="Caption..."
                              className="w-full rounded-lg border border-[#e6e4dc] bg-[#fbfaf6] px-2.5 py-1.5 text-xs text-[#1c2420] focus:border-[#124d34] focus:bg-white focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-[#f0eee6] pt-2 text-xs">
                          <button
                            type="button"
                            onClick={() =>
                              handleInsertImageToContent(img, false)
                            }
                            disabled={!img.url}
                            className="inline-flex cursor-pointer items-center gap-1 text-[11px] font-semibold text-[#124d34] hover:underline disabled:opacity-40"
                          >
                            <Sparkles className="h-3 w-3 text-[#c99a45]" />
                            <span>Insert into active content tab</span>
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveInternalImage(false, idx)
                            }
                            className="inline-flex cursor-pointer items-center gap-1 text-[11px] font-semibold text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-3 w-3" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Publish Checkbox */}
              <div className="flex items-center gap-2 border-t border-[#e6e4dc] pt-2">
                <input
                  type="checkbox"
                  id="create_is_published"
                  name="is_published"
                  defaultChecked
                  className="h-4 w-4 rounded text-[#124d34] focus:ring-[#124d34]"
                />
                <label
                  htmlFor="create_is_published"
                  className="cursor-pointer font-medium text-[#1c2420]"
                >
                  Publish immediately to public website in all provided
                  languages
                </label>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 border-t border-[#e6e4dc] pt-4">
                <button
                  type="button"
                  onClick={closeCreateModal}
                  className="rounded-xl border border-[#e6e4dc] px-4 py-2 font-medium text-[#6b7280] hover:bg-[#f3f1ea]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#124d34] px-5 py-2 font-bold text-white shadow-xs hover:bg-[#0b2e1e] disabled:opacity-50"
                >
                  <Sparkles className="h-4 w-4 text-[#c99a45]" />
                  <span>{isPending ? "Publishing..." : "Save & Publish"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MULTILINGUAL ARTICLE MODAL */}
      {editingArticle && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-xs"
            onClick={closeEditModal}
          />

          <div className="relative z-10 max-h-[92vh] w-full max-w-3xl space-y-6 overflow-y-auto rounded-3xl border border-[#c99a45] bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-center justify-between border-b border-[#e6e4dc] pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f3ee] text-[#124d34]">
                  <Edit2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#0b2e1e]">
                    Edit Multilingual Article
                  </h3>
                  <p className="text-xs text-[#6b7280]">
                    Base Slug: /{editingArticle.baseSlug}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeEditModal}
                className="rounded-lg p-2 text-[#6b7280] hover:bg-[#f3f1ea]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {formError && (
              <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form
              onSubmit={handleEditSubmit}
              className="space-y-5 text-xs sm:text-sm"
            >
              {/* Common Article Settings */}
              <div className="space-y-4 rounded-2xl border border-[#e6e4dc] bg-[#fbfaf6] p-4">
                <h4 className="text-xs font-bold tracking-wider text-[#8b651e] uppercase">
                  Common Article Settings
                </h4>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="font-semibold text-[#1c2420]">
                      Category
                    </label>
                    <select
                      name="category"
                      value={editFields.category}
                      onChange={(e) =>
                        setEditFields((p) => ({
                          ...p,
                          category: e.target.value as Article["category"],
                        }))
                      }
                      className="w-full rounded-xl border border-[#e6e4dc] bg-white px-3 py-2 text-xs font-medium text-[#1c2420] focus:border-[#124d34] focus:outline-none"
                    >
                      <option value="cemetery">Cemetery Care</option>
                      <option value="welfare">Welfare Relief</option>
                      <option value="sunnah">Sunnah Education</option>
                      <option value="announcements">Announcements</option>
                      <option value="general">General News</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-[#1c2420]">
                      Author / Byline
                    </label>
                    <input
                      type="text"
                      name="author"
                      value={editFields.author}
                      onChange={(e) =>
                        setEditFields((p) => ({ ...p, author: e.target.value }))
                      }
                      className="w-full rounded-xl border border-[#e6e4dc] bg-white px-3 py-2 text-xs text-[#1c2420] focus:border-[#124d34] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="font-semibold text-[#1c2420]">
                        Publish Date
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          setEditFields((p) => ({
                            ...p,
                            published_at: new Date().toISOString().slice(0, 10),
                          }))
                        }
                        className="text-[11px] font-semibold text-[#124d34] hover:underline"
                      >
                        Set Today
                      </button>
                    </div>
                    <input
                      type="date"
                      name="published_at"
                      value={editFields.published_at}
                      onChange={(e) =>
                        setEditFields((p) => ({
                          ...p,
                          published_at: e.target.value,
                        }))
                      }
                      className="w-full rounded-xl border border-[#e6e4dc] bg-white px-3 py-2 text-xs text-[#1c2420] focus:border-[#124d34] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="font-semibold text-[#1c2420]">
                        Last Updated Date
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setEditFields((p) => ({
                              ...p,
                              updated_at: new Date().toISOString().slice(0, 10),
                            }))
                          }
                          className="text-[11px] font-semibold text-[#124d34] hover:underline"
                        >
                          Set Today
                        </button>
                        {editFields.updated_at && (
                          <button
                            type="button"
                            onClick={() =>
                              setEditFields((p) => ({
                                ...p,
                                updated_at: "",
                              }))
                            }
                            className="text-[11px] font-semibold text-slate-500 hover:underline"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    </div>
                    <input
                      type="date"
                      name="updated_at"
                      value={editFields.updated_at}
                      onChange={(e) =>
                        setEditFields((p) => ({
                          ...p,
                          updated_at: e.target.value,
                        }))
                      }
                      className="w-full rounded-xl border border-[#e6e4dc] bg-white px-3 py-2 text-xs text-[#1c2420] focus:border-[#124d34] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <SingleImageDropzone
                    name="image_url"
                    value={editFields.image_url}
                    onChange={(url) =>
                      setEditFields((p) => ({ ...p, image_url: url }))
                    }
                    folder="news"
                    label="Main Hero / Featured Cover Photo *"
                    helperText="Drag & drop cover photo or browse (auto-compressed to WebP)."
                  />
                </div>
              </div>

              {/* Language Navigation Tabs */}
              <div className="flex flex-wrap items-center gap-2 border-b border-[#e6e4dc] pb-3">
                {[
                  {
                    code: "ta" as const,
                    label: "Tamil (தமிழ்)",
                    filled: Boolean(
                      editFields.title_ta && editFields.content_ta
                    ),
                  },
                  {
                    code: "en" as const,
                    label: "English (Official)",
                    filled: Boolean(
                      editFields.title_en && editFields.content_en
                    ),
                  },
                  {
                    code: "si" as const,
                    label: "Sinhala (සිංහල)",
                    filled: Boolean(
                      editFields.title_si && editFields.content_si
                    ),
                  },
                ].map((tab) => (
                  <button
                    type="button"
                    key={tab.code}
                    onClick={() => setActiveFormTab(tab.code)}
                    className={`inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                      activeFormTab === tab.code
                        ? "bg-[#124d34] text-white shadow-xs"
                        : "bg-[#fbfaf6] text-[#4b5563] hover:bg-[#f3f1ea]"
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`h-2 w-2 rounded-full ${
                        tab.filled ? "bg-emerald-400" : "bg-gray-300"
                      }`}
                      title={tab.filled ? "Has translation" : "Empty"}
                    />
                  </button>
                ))}
              </div>

              {/* Tamil Tab Pane */}
              <div
                className={
                  activeFormTab === "ta" ? "space-y-4" : "hidden space-y-4"
                }
              >
                <div className="space-y-1">
                  <label className="font-semibold text-[#1c2420]">
                    கட்டுரைத் தலைப்பு (Tamil Title)
                  </label>
                  <input
                    type="text"
                    name="title_ta"
                    value={editFields.title_ta}
                    onChange={(e) =>
                      setEditFields((p) => ({
                        ...p,
                        title_ta: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-[#e6e4dc] bg-[#fbfaf6] px-3.5 py-2.5 text-[#1c2420] focus:border-[#124d34] focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#1c2420]">
                    சுருக்க விபரம் (Tamil Excerpt)
                  </label>
                  <textarea
                    name="excerpt_ta"
                    rows={2}
                    value={editFields.excerpt_ta}
                    onChange={(e) =>
                      setEditFields((p) => ({
                        ...p,
                        excerpt_ta: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-[#e6e4dc] bg-[#fbfaf6] px-3.5 py-2 leading-relaxed text-[#1c2420] focus:border-[#124d34] focus:bg-white focus:outline-none"
                  />
                </div>

                <WritingToolbar
                  textareaRef={editContentTaRef}
                  value={editFields.content_ta}
                  onChange={(val) =>
                    setEditFields((p) => ({ ...p, content_ta: val }))
                  }
                  internalImages={editGallery}
                  label="முழு விபரம்"
                  languageLabel="Tamil Full Content"
                  name="content_ta"
                  placeholder="முழுமையான செய்தியை எழுதவும்..."
                />
              </div>

              {/* English Tab Pane */}
              <div
                className={
                  activeFormTab === "en" ? "space-y-4" : "hidden space-y-4"
                }
              >
                <div className="space-y-1">
                  <label className="font-semibold text-[#1c2420]">
                    Article Title (English)
                  </label>
                  <input
                    type="text"
                    name="title_en"
                    value={editFields.title_en}
                    onChange={(e) =>
                      setEditFields((p) => ({
                        ...p,
                        title_en: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-[#e6e4dc] bg-[#fbfaf6] px-3.5 py-2.5 text-[#1c2420] focus:border-[#124d34] focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#1c2420]">
                    Short Excerpt (English Summary)
                  </label>
                  <textarea
                    name="excerpt_en"
                    rows={2}
                    value={editFields.excerpt_en}
                    onChange={(e) =>
                      setEditFields((p) => ({
                        ...p,
                        excerpt_en: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-[#e6e4dc] bg-[#fbfaf6] px-3.5 py-2 leading-relaxed text-[#1c2420] focus:border-[#124d34] focus:bg-white focus:outline-none"
                  />
                </div>

                <WritingToolbar
                  textareaRef={editContentEnRef}
                  value={editFields.content_en}
                  onChange={(val) =>
                    setEditFields((p) => ({ ...p, content_en: val }))
                  }
                  internalImages={editGallery}
                  label="Full Content"
                  languageLabel="English Full Content"
                  name="content_en"
                  placeholder="Write the full news or article here..."
                />
              </div>

              {/* Sinhala Tab Pane */}
              <div
                className={
                  activeFormTab === "si" ? "space-y-4" : "hidden space-y-4"
                }
              >
                <div className="space-y-1">
                  <label className="font-semibold text-[#1c2420]">
                    ලිපි මාතෘකාව (Sinhala Title)
                  </label>
                  <input
                    type="text"
                    name="title_si"
                    value={editFields.title_si}
                    onChange={(e) =>
                      setEditFields((p) => ({
                        ...p,
                        title_si: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-[#e6e4dc] bg-[#fbfaf6] px-3.5 py-2.5 text-[#1c2420] focus:border-[#124d34] focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#1c2420]">
                    කෙටි විස්තරය (Sinhala Excerpt)
                  </label>
                  <textarea
                    name="excerpt_si"
                    rows={2}
                    value={editFields.excerpt_si}
                    onChange={(e) =>
                      setEditFields((p) => ({
                        ...p,
                        excerpt_si: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-[#e6e4dc] bg-[#fbfaf6] px-3.5 py-2 leading-relaxed text-[#1c2420] focus:border-[#124d34] focus:bg-white focus:outline-none"
                  />
                </div>

                <WritingToolbar
                  textareaRef={editContentSiRef}
                  value={editFields.content_si}
                  onChange={(val) =>
                    setEditFields((p) => ({ ...p, content_si: val }))
                  }
                  internalImages={editGallery}
                  label="සම්පූර්ණ විස්තරය"
                  languageLabel="Sinhala Full Content"
                  name="content_si"
                  placeholder="සම්පූර්ණ පුවත හෝ ලිපිය මෙහි ලියන්න..."
                />
              </div>

              {/* ARTICLE MEDIA & RELATED INTERNAL IMAGES SECTION */}
              <div className="space-y-4 rounded-2xl border border-[#e6e4dc] bg-[#fbfaf6] p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0b2e1e] text-[#d4af37]">
                      <Camera className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-[#0b2e1e] sm:text-sm">
                        Related Internal Images (with Alt & Captions)
                      </h4>
                      <p className="text-text-muted text-[11px]">
                        Add extra photos for the article archive or embed them
                        into content using writing tools.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddInternalImage(true)}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#124d34] px-3 py-1.5 text-xs font-semibold text-white shadow-2xs transition-colors hover:bg-[#0b2e1e]"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Photo</span>
                  </button>
                </div>

                {editGallery.length === 0 ? (
                  <div className="text-text-muted rounded-xl border border-dashed border-[#e6e4dc] p-6 text-center text-xs">
                    No related internal images added yet. Click &quot;Add
                    Photo&quot; to include photo galleries with alt text.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {editGallery.map((img, idx) => (
                      <div
                        key={idx}
                        className="space-y-3 rounded-xl border border-[#e6e4dc] bg-white p-3 shadow-2xs"
                      >
                        <SingleImageDropzone
                          value={img.url}
                          onChange={(url) =>
                            handleUpdateInternalImage(true, idx, "url", url)
                          }
                          folder="news"
                          label={`Article Photo #${idx + 1}`}
                          helperText="Drag & drop or browse photo (auto-compressed to WebP)."
                        />

                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                          <div>
                            <label className="text-text mb-0.5 block text-[10px] font-semibold">
                              Alt Text <span className="text-red-500">*</span>:
                            </label>
                            <input
                              type="text"
                              value={img.alt}
                              onChange={(e) =>
                                handleUpdateInternalImage(
                                  true,
                                  idx,
                                  "alt",
                                  e.target.value
                                )
                              }
                              placeholder="Describe the photo for accessibility & SEO..."
                              className="w-full rounded-lg border border-[#e6e4dc] bg-[#fbfaf6] px-2.5 py-1.5 text-xs text-[#1c2420] focus:border-[#124d34] focus:bg-white focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="text-text mb-0.5 block text-[10px] font-semibold">
                              Caption (Optional):
                            </label>
                            <input
                              type="text"
                              value={img.caption || ""}
                              onChange={(e) =>
                                handleUpdateInternalImage(
                                  true,
                                  idx,
                                  "caption",
                                  e.target.value
                                )
                              }
                              placeholder="Caption..."
                              className="w-full rounded-lg border border-[#e6e4dc] bg-[#fbfaf6] px-2.5 py-1.5 text-xs text-[#1c2420] focus:border-[#124d34] focus:bg-white focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-[#f0eee6] pt-2 text-xs">
                          <button
                            type="button"
                            onClick={() =>
                              handleInsertImageToContent(img, true)
                            }
                            disabled={!img.url}
                            className="inline-flex cursor-pointer items-center gap-1 text-[11px] font-semibold text-[#124d34] hover:underline disabled:opacity-40"
                          >
                            <Sparkles className="h-3 w-3 text-[#c99a45]" />
                            <span>Insert into active content tab</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRemoveInternalImage(true, idx)}
                            className="inline-flex cursor-pointer items-center gap-1 text-[11px] font-semibold text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-3 w-3" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Publish Checkbox */}
              <div className="flex items-center gap-2 border-t border-[#e6e4dc] pt-2">
                <input
                  type="checkbox"
                  id="edit_is_published"
                  name="is_published"
                  defaultChecked={editFields.is_published}
                  className="h-4 w-4 rounded text-[#124d34] focus:ring-[#124d34]"
                />
                <label
                  htmlFor="edit_is_published"
                  className="cursor-pointer font-medium text-[#1c2420]"
                >
                  Published and visible on public website across all languages
                </label>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 border-t border-[#e6e4dc] pt-4">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="rounded-xl border border-[#e6e4dc] px-4 py-2 font-medium text-[#6b7280] hover:bg-[#f3f1ea]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#124d34] px-5 py-2 font-bold text-white shadow-xs hover:bg-[#0b2e1e] disabled:opacity-50"
                >
                  {isPending ? "Updating..." : "Save Updates"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmSlug && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-xs"
            onClick={() => setDeleteConfirmSlug(null)}
          />

          <div className="relative z-10 w-full max-w-md space-y-4 rounded-3xl border border-[#e6e4dc] bg-white p-6 shadow-2xl">
            <h3 className="font-serif text-lg font-bold text-[#0b2e1e]">
              Delete Publication in All Languages?
            </h3>
            <p className="text-xs leading-relaxed text-[#6b7280]">
              Are you sure you want to delete this publication? This will remove
              the story across Tamil, English, and Sinhala versions permanently
              from the portal.
            </p>

            <div className="flex items-center justify-end gap-3 border-t border-[#e6e4dc] pt-4">
              <button
                type="button"
                onClick={() => setDeleteConfirmSlug(null)}
                className="rounded-xl border border-[#e6e4dc] px-4 py-2 text-xs font-semibold text-[#6b7280] hover:bg-[#f3f1ea]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={() => handleDelete(deleteConfirmSlug)}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-red-700"
              >
                {isPending ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
