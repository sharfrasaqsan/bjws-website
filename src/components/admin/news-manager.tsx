"use client";

import * as React from "react";
import { useState, useTransition } from "react";
import Link from "next/link";
import { type Article } from "@/content/news";
import {
  createArticleAction,
  updateArticleAction,
  deleteArticleAction,
  toggleArticlePublishAction,
} from "@/lib/admin-actions";
import { formatAdminDate } from "@/lib/utils";
import {
  Newspaper,
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  Clock,
  Globe,
  Tag,
  X,
  Eye,
  EyeOff,
  Calendar,
} from "lucide-react";

interface NewsManagerProps {
  initialArticles: Article[];
}

const PRESET_IMAGES = [
  { label: "Cemetery Shramadhana 01", url: "/images/gallery/shramadana-01.webp" },
  { label: "Cemetery Shramadhana 02", url: "/images/gallery/shramadana-02.webp" },
  { label: "Ghusl Training 01", url: "/images/gallery/ghusl-01.webp" },
  { label: "Ghusl Training 02", url: "/images/gallery/ghusl-02.webp" },
  { label: "Dry Ration Distribution", url: "/images/gallery/iftar-01.webp" },
  { label: "Community Welfare Aid", url: "/images/gallery/iftar-02.webp" },
  { label: "Livelihood & Support", url: "/images/gallery/livelihood-01.webp" },
  { label: "Cemetery Access Road", url: "/images/gallery/cemetery-road-01.webp" },
];

export function NewsManager({ initialArticles }: NewsManagerProps) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isPending, startTransition] = useTransition();

  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form error states
  const [formError, setFormError] = useState<string | null>(null);

  const filteredArticles = articles.filter((art) => {
    const matchesCat =
      categoryFilter === "all" || art.category === categoryFilter;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCat;
    return (
      matchesCat &&
      (art.title.toLowerCase().includes(q) ||
        art.content.toLowerCase().includes(q) ||
        art.author.toLowerCase().includes(q) ||
        art.slug.toLowerCase().includes(q))
    );
  });

  const handleTogglePublish = (article: Article) => {
    startTransition(async () => {
      try {
        await toggleArticlePublishAction(article.id, article.is_published);
        setArticles((prev) =>
          prev.map((a) =>
            a.id === article.id ? { ...a, is_published: !a.is_published } : a
          )
        );
      } catch (err) {
        console.error("Failed to toggle publish status:", err);
      }
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      try {
        await deleteArticleAction(id);
        setArticles((prev) => prev.filter((a) => a.id !== id));
        setDeleteConfirmId(null);
      } catch (err) {
        console.error("Failed to delete article:", err);
      }
    });
  };

  const handleCreateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await createArticleAction(null, formData);
      if (res?.error) {
        setFormError(res.error);
      } else {
        setIsCreateOpen(false);
        // Refresh local list
        window.location.reload();
      }
    });
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await updateArticleAction(null, formData);
      if (res?.error) {
        setFormError(res.error);
      } else {
        setEditingArticle(null);
        window.location.reload();
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-surface p-4 rounded-2xl border border-border shadow-xs">
        {/* Search & Category Filter */}
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <input
              type="search"
              placeholder="Search news by title or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-border bg-[#fbfaf6] dark:bg-muted focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-border bg-[#fbfaf6] dark:bg-muted px-3 py-2 text-xs font-medium text-text focus:outline-none focus:ring-1 focus:ring-primary"
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
          onClick={() => {
            setFormError(null);
            setIsCreateOpen(true);
          }}
          className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-xl bg-[#124d34] px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs transition-all hover:bg-[#0b2e1e] hover:-translate-y-0.5"
        >
          <Plus className="h-4 w-4" />
          <span>Create Article</span>
        </button>
      </div>

      {/* Articles Count & Status Pill */}
      <div className="flex items-center justify-between text-xs text-text-muted px-1">
        <span>
          Showing <strong>{filteredArticles.length}</strong> of{" "}
          <strong>{articles.length}</strong> articles
        </span>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            {articles.filter((a) => a.is_published).length} Published
          </span>
          <span className="inline-flex items-center gap-1.5 text-amber-700 dark:text-amber-400">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            {articles.filter((a) => !a.is_published).length} Drafts
          </span>
        </div>
      </div>

      {/* Articles Grid / List */}
      <div className="space-y-4">
        {filteredArticles.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center text-text-muted bg-surface">
            <Newspaper className="h-8 w-8 mx-auto text-[#c99a45] mb-2 opacity-80" />
            <p className="text-sm font-semibold text-text">No articles found</p>
            <p className="text-xs text-text-muted mt-1">
              Click &quot;Create Article&quot; above to publish your first announcement or report.
            </p>
          </div>
        ) : (
          filteredArticles.map((art) => (
            <div
              key={art.id}
              className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl border border-border bg-surface shadow-xs transition-all hover:border-primary/40 hover:shadow-md"
            >
              {/* Left Column: Title, Excerpt, Metadata */}
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Status Pill */}
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                      art.is_published
                        ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
                        : "bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-500/30"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        art.is_published ? "bg-emerald-500" : "bg-amber-500"
                      }`}
                    />
                    {art.is_published ? "Published" : "Draft"}
                  </span>

                  {/* Category */}
                  <span className="inline-flex items-center gap-1 rounded-md bg-[#e8f3ee] px-2 py-0.5 text-[11px] font-semibold text-primary">
                    <Tag className="h-3 w-3" />
                    <span>{art.categoryLabel?.en || art.category}</span>
                  </span>

                  {/* Locale badge */}
                  <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold uppercase rounded bg-muted px-1.5 py-0.5 text-text-muted">
                    <Globe className="h-3 w-3" />
                    <span>{art.locale}</span>
                  </span>

                  {/* Reading Time */}
                  <span className="inline-flex items-center gap-1 text-[11px] text-text-muted">
                    <Clock className="h-3 w-3" />
                    <span>{art.read_time_minutes} min read</span>
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-display text-base sm:text-lg font-bold text-text hover:text-primary transition-colors">
                  {art.title}
                </h3>

                {/* Excerpt */}
                <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">
                  {art.excerpt}
                </p>

                {/* Author & Published Date */}
                <div className="flex items-center gap-3 text-[11px] text-text-muted/80">
                  <span>By {art.author}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-[#c99a45]" />
                    {formatAdminDate(art.published_at)}
                  </span>
                  <span>•</span>
                  <span className="font-mono text-[10px] text-text-muted">
                    slug: /{art.slug}
                  </span>
                </div>
              </div>

              {/* Right Column: Actions */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-center pt-2 md:pt-0 border-t md:border-t-0 border-border w-full md:w-auto justify-end">
                {/* View on Public Site */}
                <Link
                  href={`/${art.locale}/news/${art.slug}`}
                  target="_blank"
                  className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface hover:bg-muted p-2 text-xs font-medium text-text-muted hover:text-text transition-colors"
                  title="View Public Article"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-[#c99a45]" />
                  <span className="hidden sm:inline">View</span>
                </Link>

                {/* Toggle Publish */}
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleTogglePublish(art)}
                  className={`inline-flex cursor-pointer items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                    art.is_published
                      ? "border border-amber-500/30 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100"
                      : "border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100"
                  }`}
                  title={art.is_published ? "Unpublish to Draft" : "Publish to Site"}
                >
                  {art.is_published ? (
                    <>
                      <EyeOff className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Unpublish</span>
                    </>
                  ) : (
                    <>
                      <Eye className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Publish</span>
                    </>
                  )}
                </button>

                {/* Edit */}
                <button
                  type="button"
                  onClick={() => {
                    setFormError(null);
                    setEditingArticle(art);
                  }}
                  className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-border bg-surface hover:bg-muted p-2 text-xs font-semibold text-text transition-colors"
                  title="Edit Article"
                >
                  <Edit2 className="h-3.5 w-3.5 text-primary" />
                  <span className="hidden sm:inline">Edit</span>
                </button>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(art.id)}
                  className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 p-2 text-xs font-semibold text-red-700 dark:text-red-300 transition-colors"
                  title="Delete Article"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* CREATE ARTICLE MODAL */}
      {isCreateOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-xs"
            onClick={() => setIsCreateOpen(false)}
          />

          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-surface p-6 sm:p-8 shadow-2xl z-10 space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f3ee] text-primary">
                  <Newspaper className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-text">
                    Create New Article
                  </h3>
                  <p className="text-xs text-text-muted">
                    Publish an announcement, shramadhana report, or religious guideline.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="rounded-lg p-2 text-text-muted hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 text-xs rounded-lg bg-red-50 text-red-700 border border-red-200">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs sm:text-sm">
              {/* Title */}
              <div className="space-y-1">
                <label className="font-semibold text-text">Article Title *</label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. Annual Cemetery Shramadhana Successfully Completed"
                  className="w-full rounded-xl border border-border bg-[#fbfaf6] dark:bg-muted px-3.5 py-2.5 text-text focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Slug (Optional) & Category & Locale */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-text">Custom Slug</label>
                  <input
                    type="text"
                    name="slug"
                    placeholder="annual-shramadhana-2026"
                    className="w-full rounded-xl border border-border bg-[#fbfaf6] dark:bg-muted px-3 py-2 text-text focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-text">Category</label>
                  <select
                    name="category"
                    className="w-full rounded-xl border border-border bg-[#fbfaf6] dark:bg-muted px-3 py-2 text-text focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="cemetery">Cemetery Care</option>
                    <option value="welfare">Welfare Relief</option>
                    <option value="sunnah">Sunnah Education</option>
                    <option value="announcements">Announcements</option>
                    <option value="general">General</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-text">Language</label>
                  <select
                    name="locale"
                    className="w-full rounded-xl border border-border bg-[#fbfaf6] dark:bg-muted px-3 py-2 text-text focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="en">English (en)</option>
                    <option value="ta">Tamil (ta)</option>
                    <option value="si">Sinhala (si)</option>
                  </select>
                </div>
              </div>

              {/* Author */}
              <div className="space-y-1">
                <label className="font-semibold text-text">Author / Byline</label>
                <input
                  type="text"
                  name="author"
                  defaultValue="BJWS Media Secretariat"
                  className="w-full rounded-xl border border-border bg-[#fbfaf6] dark:bg-muted px-3.5 py-2 text-text focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Featured Image Preset Selector */}
              <div className="space-y-1">
                <label className="font-semibold text-text">Featured Image</label>
                <select
                  name="image_url"
                  className="w-full rounded-xl border border-border bg-[#fbfaf6] dark:bg-muted px-3 py-2 text-text focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {PRESET_IMAGES.map((img) => (
                    <option key={img.url} value={img.url}>
                      {img.label} ({img.url})
                    </option>
                  ))}
                </select>
              </div>

              {/* Short Excerpt */}
              <div className="space-y-1">
                <label className="font-semibold text-text">Short Excerpt (Summary)</label>
                <textarea
                  name="excerpt"
                  rows={2}
                  placeholder="One or two sentences summarizing the article..."
                  className="w-full rounded-xl border border-border bg-[#fbfaf6] dark:bg-muted px-3.5 py-2 text-text focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed"
                />
              </div>

              {/* Full Content */}
              <div className="space-y-1">
                <label className="font-semibold text-text">Article Content *</label>
                <textarea
                  name="content"
                  rows={7}
                  required
                  placeholder="Write the full news story or announcement here..."
                  className="w-full rounded-xl border border-border bg-[#fbfaf6] dark:bg-muted px-3.5 py-2.5 text-text focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed font-sans"
                />
              </div>

              {/* Publish Checkbox */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="create_is_published"
                  name="is_published"
                  defaultChecked
                  className="h-4 w-4 rounded text-primary focus:ring-primary"
                />
                <label htmlFor="create_is_published" className="font-medium text-text cursor-pointer">
                  Publish immediately on public website
                </label>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="rounded-xl border border-border px-4 py-2 font-medium text-text-muted hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#124d34] px-5 py-2 font-bold text-white hover:bg-[#0b2e1e] shadow-xs"
                >
                  {isPending ? "Creating..." : "Save & Publish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT ARTICLE MODAL */}
      {editingArticle && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-xs"
            onClick={() => setEditingArticle(null)}
          />

          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-surface p-6 sm:p-8 shadow-2xl z-10 space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f3ee] text-primary">
                  <Edit2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-text">
                    Edit Article
                  </h3>
                  <p className="text-xs text-text-muted">
                    Update title, content, or publication status.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingArticle(null)}
                className="rounded-lg p-2 text-text-muted hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 text-xs rounded-lg bg-red-50 text-red-700 border border-red-200">
                {formError}
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs sm:text-sm">
              <input type="hidden" name="id" value={editingArticle.id} />

              {/* Title */}
              <div className="space-y-1">
                <label className="font-semibold text-text">Article Title *</label>
                <input
                  type="text"
                  name="title"
                  required
                  defaultValue={editingArticle.title}
                  className="w-full rounded-xl border border-border bg-[#fbfaf6] dark:bg-muted px-3.5 py-2.5 text-text focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Slug, Category, Locale */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-text">Slug</label>
                  <input
                    type="text"
                    name="slug"
                    defaultValue={editingArticle.slug}
                    className="w-full rounded-xl border border-border bg-[#fbfaf6] dark:bg-muted px-3 py-2 text-text focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-text">Category</label>
                  <select
                    name="category"
                    defaultValue={editingArticle.category}
                    className="w-full rounded-xl border border-border bg-[#fbfaf6] dark:bg-muted px-3 py-2 text-text focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="cemetery">Cemetery Care</option>
                    <option value="welfare">Welfare Relief</option>
                    <option value="sunnah">Sunnah Education</option>
                    <option value="announcements">Announcements</option>
                    <option value="general">General</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-text">Language</label>
                  <select
                    name="locale"
                    defaultValue={editingArticle.locale}
                    className="w-full rounded-xl border border-border bg-[#fbfaf6] dark:bg-muted px-3 py-2 text-text focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="en">English (en)</option>
                    <option value="ta">Tamil (ta)</option>
                    <option value="si">Sinhala (si)</option>
                  </select>
                </div>
              </div>

              {/* Author */}
              <div className="space-y-1">
                <label className="font-semibold text-text">Author / Byline</label>
                <input
                  type="text"
                  name="author"
                  defaultValue={editingArticle.author}
                  className="w-full rounded-xl border border-border bg-[#fbfaf6] dark:bg-muted px-3.5 py-2 text-text focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Featured Image */}
              <div className="space-y-1">
                <label className="font-semibold text-text">Featured Image</label>
                <select
                  name="image_url"
                  defaultValue={editingArticle.image_url}
                  className="w-full rounded-xl border border-border bg-[#fbfaf6] dark:bg-muted px-3 py-2 text-text focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {PRESET_IMAGES.map((img) => (
                    <option key={img.url} value={img.url}>
                      {img.label} ({img.url})
                    </option>
                  ))}
                </select>
              </div>

              {/* Short Excerpt */}
              <div className="space-y-1">
                <label className="font-semibold text-text">Short Excerpt (Summary)</label>
                <textarea
                  name="excerpt"
                  rows={2}
                  defaultValue={editingArticle.excerpt}
                  className="w-full rounded-xl border border-border bg-[#fbfaf6] dark:bg-muted px-3.5 py-2 text-text focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed"
                />
              </div>

              {/* Full Content */}
              <div className="space-y-1">
                <label className="font-semibold text-text">Article Content *</label>
                <textarea
                  name="content"
                  rows={8}
                  required
                  defaultValue={editingArticle.content}
                  className="w-full rounded-xl border border-border bg-[#fbfaf6] dark:bg-muted px-3.5 py-2.5 text-text focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed font-sans"
                />
              </div>

              {/* Publish Checkbox */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="edit_is_published"
                  name="is_published"
                  defaultChecked={editingArticle.is_published}
                  className="h-4 w-4 rounded text-primary focus:ring-primary"
                />
                <label htmlFor="edit_is_published" className="font-medium text-text cursor-pointer">
                  Published and visible on public website
                </label>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setEditingArticle(null)}
                  className="rounded-xl border border-border px-4 py-2 font-medium text-text-muted hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#124d34] px-5 py-2 font-bold text-white hover:bg-[#0b2e1e] shadow-xs"
                >
                  {isPending ? "Updating..." : "Update Article"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-xs"
            onClick={() => setDeleteConfirmId(null)}
          />

          <div className="relative w-full max-w-md rounded-3xl border border-border bg-surface p-6 shadow-2xl z-10 space-y-4">
            <h3 className="font-display text-lg font-bold text-text">
              Delete Article?
            </h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Are you sure you want to delete this article? This action cannot be undone and will remove it from the public news portal immediately.
            </p>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-text-muted hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={() => handleDelete(deleteConfirmId)}
                className="rounded-xl bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-xs font-bold shadow-xs"
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
