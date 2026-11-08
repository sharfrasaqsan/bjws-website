"use client";

import * as React from "react";
import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  type GalleryImage,
  formatCategoryLabel,
} from "@/content/gallery";
import {
  createGalleryImageAction,
  updateGalleryImageAction,
  deleteGalleryImageAction,
  toggleGalleryApprovalAction,
  renameGalleryCategoryAction,
} from "@/lib/admin-actions";
import {
  Image as ImageIcon,
  CheckCircle2,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  MapPin,
  ShieldAlert,
  X,
  Lock,
  UploadCloud,
  Tags,
} from "lucide-react";
import { BatchGalleryUploader } from "@/components/admin/batch-gallery-uploader";
import { SingleImageDropzone } from "@/components/admin/single-image-dropzone";

interface GalleryManagerProps {
  initialImages: GalleryImage[];
}

export function GalleryManager({ initialImages }: GalleryManagerProps) {
  const router = useRouter();
  const [images, setImages] = useState<GalleryImage[]>(initialImages);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [approvalFilter, setApprovalFilter] = useState<"all" | "approved" | "unapproved">("all");
  const [isPending, startTransition] = useTransition();

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isBatchOpen, setIsBatchOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Photo state separated for create and edit to guarantee no cross-contamination
  const [createPhotoUrl, setCreatePhotoUrl] = useState<string>("");
  const [editPhotoUrl, setEditPhotoUrl] = useState<string>("");

  // Dynamic Category creation state
  const [isCreateCustomCategory, setIsCreateCustomCategory] = useState(false);
  const [createCustomCategoryInput, setCreateCustomCategoryInput] = useState("");
  const [isEditCustomCategory, setIsEditCustomCategory] = useState(false);
  const [editCustomCategoryInput, setEditCustomCategoryInput] = useState("");

  // Category Manager Modal state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategoryKey, setEditingCategoryKey] = useState<string | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState("");
  const [categoryActionMessage, setCategoryActionMessage] = useState<{
    text: string;
    isError?: boolean;
  } | null>(null);

  // Dynamic unique categories list with counts
  const allCategories = React.useMemo(() => {
    const countMap: Record<string, number> = {};
    images.forEach((img) => {
      if (img.category) {
        countMap[img.category] = (countMap[img.category] || 0) + 1;
      }
    });

    const list: Array<{ key: string; label: string; count: number }> = [];
    const seen = new Set<string>();

    images.forEach((img) => {
      if (img.category && !seen.has(img.category)) {
        seen.add(img.category);
        list.push({
          key: img.category,
          label: formatCategoryLabel(img.category),
          count: countMap[img.category] || 0,
        });
      }
    });

    return list;
  }, [images]);

  // Counts
  const totalCount = images.length;
  const approvedCount = images.filter((img) => img.approved).length;
  const unapprovedCount = images.filter((img) => !img.approved).length;

  const filteredImages = images.filter((img) => {
    const matchesCat =
      categoryFilter === "all" || img.category === categoryFilter;
    const matchesApproval =
      approvalFilter === "all" ||
      (approvalFilter === "approved" && img.approved) ||
      (approvalFilter === "unapproved" && !img.approved);

    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCat && matchesApproval;

    const matchesQuery =
      img.captionKey.toLowerCase().includes(q) ||
      img.location.toLowerCase().includes(q) ||
      img.category.toLowerCase().includes(q);

    return matchesCat && matchesApproval && matchesQuery;
  });

  const handleToggleApproval = (image: GalleryImage) => {
    startTransition(async () => {
      try {
        await toggleGalleryApprovalAction(image.id, image.approved);
        setImages((prev) =>
          prev.map((i) =>
            i.id === image.id ? { ...i, approved: !i.approved } : i
          )
        );
        router.refresh();
      } catch (err) {
        console.error("Failed to toggle approval:", err);
      }
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      try {
        await deleteGalleryImageAction(id);
        setImages((prev) => prev.filter((i) => i.id !== id));
        setDeleteConfirmId(null);
        router.refresh();
      } catch (err) {
        console.error("Failed to delete gallery image:", err);
      }
    });
  };

  const handleCreateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    const formData = new FormData(e.currentTarget);
    const rawPhoto = createPhotoUrl.trim();
    if (!rawPhoto) {
      setFormError("Please upload a photo or enter an image URL.");
      return;
    }
    formData.set("src", rawPhoto);

    if (isCreateCustomCategory && createCustomCategoryInput.trim()) {
      const slug = createCustomCategoryInput
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      formData.set("category", slug || "general");
    }

    startTransition(async () => {
      const res = await createGalleryImageAction(null, formData);
      if (res?.error) {
        setFormError(res.error);
      } else {
        setIsCreateOpen(false);
        setCreatePhotoUrl("");
        window.location.reload();
      }
    });
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    const formData = new FormData(e.currentTarget);
    const rawPhoto = editPhotoUrl.trim() || (formData.get("src") as string)?.trim();
    if (rawPhoto) {
      formData.set("src", rawPhoto);
    }

    if (isEditCustomCategory && editCustomCategoryInput.trim()) {
      const slug = editCustomCategoryInput
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      formData.set("category", slug || "general");
    }

    startTransition(async () => {
      const res = await updateGalleryImageAction(null, formData);
      if (res?.error) {
        setFormError(res.error);
      } else {
        setEditingImage(null);
        setEditPhotoUrl("");
        window.location.reload();
      }
    });
  };

  const handleSaveCategoryRename = async (oldCategory: string) => {
    if (!editingCategoryName.trim()) return;
    const cleanNew = editingCategoryName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    if (cleanNew === oldCategory) {
      setEditingCategoryKey(null);
      return;
    }

    startTransition(async () => {
      const res = await renameGalleryCategoryAction(oldCategory, editingCategoryName);
      if (res?.error) {
        setCategoryActionMessage({ text: res.error, isError: true });
      } else {
        // Update local state immediately
        setImages((prev) =>
          prev.map((img) =>
            img.category === oldCategory ? { ...img, category: cleanNew } : img
          )
        );
        setEditingCategoryKey(null);
        setEditingCategoryName("");
        setCategoryActionMessage({
          text: `Renamed album category to "${editingCategoryName}" (${res.updatedCount || 0} photos updated).`,
          isError: false,
        });
        router.refresh();
      }
    });
  };

  const openEditModal = (image: GalleryImage) => {
    setEditingImage(image);
    setEditPhotoUrl(image.src);
    setIsEditCustomCategory(false);
    setEditCustomCategoryInput("");
    setFormError(null);
  };

  const closeEditModal = () => {
    setEditingImage(null);
    setEditPhotoUrl("");
    setFormError(null);
  };

  const openCreateModal = () => {
    setIsCreateOpen(true);
    setCreatePhotoUrl("");
    setIsCreateCustomCategory(allCategories.length === 0);
    setCreateCustomCategoryInput("");
    setFormError(null);
  };

  const closeCreateModal = () => {
    setIsCreateOpen(false);
    setCreatePhotoUrl("");
    setFormError(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-surface p-4 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Total Cataloged Photos
            </div>
            <div className="mt-1 font-display text-2xl font-bold text-primary">
              {totalCount}
            </div>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ImageIcon className="h-5 w-5 text-primary" />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-4 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#166534]">
              Approved & Publicly Live
            </div>
            <div className="mt-1 font-display text-2xl font-bold text-[#166534]">
              {approvedCount}
            </div>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#22c55e]/15 text-[#166534]">
            <CheckCircle2 className="h-5 w-5 text-[#166534]" />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-4 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#9f1239]">
              Pending / Restricted / Hidden
            </div>
            <div className="mt-1 font-display text-2xl font-bold text-[#9f1239]">
              {unapprovedCount}
            </div>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f43f5e]/15 text-[#9f1239]">
            <Lock className="h-5 w-5 text-[#9f1239]" />
          </div>
        </div>
      </div>

      {/* Filter and Action Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-4 shadow-2xs">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by caption, location, year, or consent notes..."
            className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2.5 text-xs sm:text-sm text-text placeholder:text-text-muted/70 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="inline-flex rounded-xl bg-background border border-border p-1">
            <button
              type="button"
              onClick={() => setApprovalFilter("all")}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                approvalFilter === "all"
                  ? "bg-primary text-white shadow-xs"
                  : "text-text-muted hover:text-text"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setApprovalFilter("approved")}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                approvalFilter === "approved"
                  ? "bg-primary text-white shadow-xs"
                  : "text-text-muted hover:text-text"
              }`}
            >
              Approved
            </button>
            <button
              type="button"
              onClick={() => setApprovalFilter("unapproved")}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                approvalFilter === "unapproved"
                  ? "bg-primary text-white shadow-xs"
                  : "text-text-muted hover:text-text"
              }`}
            >
              Restricted
            </button>
          </div>

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-text focus:border-primary focus:outline-none"
          >
            <option value="all">All Photo Albums</option>
            {allCategories.map((cat) => (
              <option key={cat.key} value={cat.key}>
                {cat.label}
              </option>
            ))}
          </select>

          {/* Batch Upload, Add & Edit Categories Buttons */}
          <button
            type="button"
            onClick={() => {
              setIsCategoryModalOpen(true);
              setCategoryActionMessage(null);
              setEditingCategoryKey(null);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background hover:bg-surface px-4 py-2 text-xs font-semibold text-text shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            <Tags className="h-4 w-4 text-[#124d34]" />
            <span>Edit Categories ({allCategories.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setIsBatchOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#124d34] hover:bg-[#0b2e1e] text-white px-4 py-2 text-xs font-semibold shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            <UploadCloud className="h-4 w-4 text-[#d4af37]" />
            <span>Batch Upload Photos</span>
          </button>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background hover:bg-surface px-4 py-2 text-xs font-semibold text-text shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            <Plus className="h-4 w-4 text-primary" />
            <span>Add Single Photo</span>
          </button>
        </div>
      </div>

      {/* Gallery Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredImages.map((img) => {
          const isApproved = img.approved;

          return (
            <div
              key={img.id}
              className={`group relative rounded-2xl border bg-surface overflow-hidden transition-all shadow-2xs hover:shadow-md flex flex-col justify-between ${
                isApproved
                  ? "border-border hover:border-primary/40"
                  : "border-rose-300 bg-rose-50/20 dark:border-rose-900/40"
              }`}
            >
              <div>
                {/* Image Banner */}
                <div className="relative aspect-[16/10] w-full bg-black/5 overflow-hidden">
                  <Image
                    src={img.src}
                    alt={img.captionKey}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-102"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />

                  {/* Approval State Badge */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold shadow-xs backdrop-blur-md ${
                        isApproved
                          ? "bg-emerald-600/90 text-white"
                          : "bg-rose-600/90 text-white"
                      }`}
                    >
                      {isApproved ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Approved & Live</span>
                        </>
                      ) : (
                        <>
                          <Lock className="h-3.5 w-3.5" />
                          <span>Hidden / Consent Pending</span>
                        </>
                      )}
                    </span>
                  </div>

                  {/* Category Pill */}
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex rounded-lg bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-md">
                      {img.category}
                    </span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-4 space-y-2">
                  <h3 className="font-display text-sm font-bold text-text line-clamp-2">
                    {img.captionKey}
                  </h3>

                  <div className="flex items-center gap-1 text-xs text-text-muted">
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span className="truncate max-w-[200px]">{img.location}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="p-4 pt-0 border-t border-border mt-3 flex items-center justify-between gap-2">
                {/* 1-Click Approval Toggle */}
                <button
                  type="button"
                  onClick={() => handleToggleApproval(img)}
                  disabled={isPending}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                    isApproved
                      ? "bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/60 dark:text-rose-300"
                      : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300"
                  }`}
                  title={isApproved ? "Revoke Approval & Hide" : "Approve Photo for Public Site"}
                >
                  {isApproved ? (
                    <>
                      <EyeOff className="h-3.5 w-3.5" />
                      <span>Revoke Approval</span>
                    </>
                  ) : (
                    <>
                      <Eye className="h-3.5 w-3.5" />
                      <span>Approve Live</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEditModal(img)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-text-muted hover:border-primary hover:text-primary transition-colors"
                    title="Edit Photo Details"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(img.id)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-rose-500 hover:bg-rose-50 hover:border-rose-200 transition-colors"
                    title="Delete Photo"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredImages.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-border p-12 text-center bg-surface">
            <ImageIcon className="mx-auto h-10 w-10 text-text-muted/60" />
            <h3 className="mt-3 font-display text-base font-bold text-text">
              {totalCount === 0 ? "No Photos in Registry Yet" : "No Photos Found"}
            </h3>
            <p className="mt-1 text-xs text-text-muted max-w-md mx-auto">
              {totalCount === 0
                ? "Your society gallery is currently empty. Start documenting community shramadhana drives, ghusl programs, and welfare activities."
                : "Try adjusting your search query or album category filter."}
            </p>
            {totalCount === 0 && (
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsBatchOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#124d34] hover:bg-[#0b2e1e] text-white px-5 py-2.5 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  <UploadCloud className="h-4 w-4 text-[#d4af37]" />
                  <span>Batch Upload (50+ Photos)</span>
                </button>
                <button
                  type="button"
                  onClick={openCreateModal}
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-background hover:bg-surface px-5 py-2.5 text-xs font-semibold text-text shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="h-4 w-4 text-primary" />
                  <span>Add Single Photo</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* CREATE PHOTO MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl border border-border bg-surface p-6 sm:p-8 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={closeCreateModal}
              className="absolute right-5 top-5 rounded-full p-2 text-text-muted hover:bg-background hover:text-text"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-border pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Plus className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold text-text">
                  Add New Gallery Photo
                </h2>
                <p className="text-xs text-text-muted">
                  Upload or link a verified society event photo with privacy consent.
                </p>
              </div>
            </div>

            {formError && (
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-rose-50 dark:bg-rose-950 p-3 text-xs font-semibold text-rose-700 dark:text-rose-300">
                <ShieldAlert className="h-4 w-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="mt-6 space-y-4">
              {/* Photo Selector with Drag & Drop */}
              <SingleImageDropzone
                name="src"
                value={createPhotoUrl}
                onChange={(url) => setCreatePhotoUrl(url)}
                folder="gallery"
                label="Photo Upload *"
                helperText="Drag & drop a photo from your computer/phone or click to browse. Automatically optimized to WebP."
              />

              {/* Caption */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">
                  Photo Caption / Description *
                </label>
                <input
                  type="text"
                  name="caption"
                  required
                  placeholder="e.g. Mahallah Cemetery Shramadana volunteer restoration drive"
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs sm:text-sm text-text focus:border-primary focus:outline-none"
                />
              </div>

              {/* Category & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-text-muted">
                      Album Category *
                    </label>
                    {allCategories.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsCreateCustomCategory(!isCreateCustomCategory);
                          setCreateCustomCategoryInput("");
                        }}
                        className="text-[11px] font-semibold text-primary hover:underline cursor-pointer"
                      >
                        {isCreateCustomCategory ? "Choose Existing" : "+ New Category"}
                      </button>
                    )}
                  </div>
                  {isCreateCustomCategory || allCategories.length === 0 ? (
                    <input
                      type="text"
                      value={createCustomCategoryInput}
                      onChange={(e) => setCreateCustomCategoryInput(e.target.value)}
                      placeholder="e.g. Ramadan Relief 2026"
                      required
                      className="w-full rounded-xl border border-primary bg-background px-3 py-2 text-xs text-text focus:border-primary focus:outline-none"
                    />
                  ) : (
                    <select
                      name="category"
                      required
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-text focus:border-primary focus:outline-none"
                    >
                      {allCategories.map((cat) => (
                        <option key={cat.key} value={cat.key}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    required
                    defaultValue="Mullipothana"
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-text focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* Compliance & Approval Checkbox */}
              <div className="space-y-2 pt-2 border-t border-border">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="create-approved"
                    name="approved"
                    defaultChecked
                    className="rounded border-border text-primary focus:ring-primary"
                  />
                  <label
                    htmlFor="create-approved"
                    className="text-xs font-semibold text-text cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Approve for immediate public display on website</span>
                  </label>
                </div>
                <p className="text-[11px] text-text-muted pl-6">
                  Uncheck this if the photo is awaiting consent verification or should remain restricted to administrative archives.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={closeCreateModal}
                  className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-text hover:bg-background"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-xl bg-[#0b2e1e] hover:bg-[#124d34] px-5 py-2 text-xs font-semibold text-white shadow-xs transition-colors disabled:opacity-50"
                >
                  {isPending ? "Saving..." : "Add to Gallery"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PHOTO MODAL */}
      {editingImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl border border-border bg-surface p-6 sm:p-8 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={closeEditModal}
              className="absolute right-5 top-5 rounded-full p-2 text-text-muted hover:bg-background hover:text-text"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-border pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Edit2 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold text-text">
                  Edit Gallery Photo Details
                </h2>
                <p className="text-xs text-text-muted">
                  Update caption, category, consent notes, or approval status.
                </p>
              </div>
            </div>

            {formError && (
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-rose-50 dark:bg-rose-950 p-3 text-xs font-semibold text-rose-700 dark:text-rose-300">
                <ShieldAlert className="h-4 w-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="mt-6 space-y-4">
              <input type="hidden" name="id" value={editingImage.id} />

              {/* Photo Preview & Dropzone */}
              <div>
                <SingleImageDropzone
                  name="src"
                  value={editPhotoUrl || editingImage.src}
                  onChange={(url) => setEditPhotoUrl(url)}
                  folder="gallery"
                  label="Update Photo"
                  helperText="Drop a replacement photo or click to browse. Automatically converts to WebP."
                />
              </div>

              {/* Caption */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">
                  Photo Caption / Description *
                </label>
                <input
                  type="text"
                  name="caption"
                  required
                  defaultValue={editingImage.captionKey}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs sm:text-sm text-text focus:border-primary focus:outline-none"
                />
              </div>

              {/* Category & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-text-muted">
                      Album Category *
                    </label>
                    {allCategories.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          const nextState = !isEditCustomCategory;
                          setIsEditCustomCategory(nextState);
                          setEditCustomCategoryInput(
                            nextState
                              ? editingImage.category
                                  .replace(/-/g, " ")
                                  .replace(/\b\w/g, (c) => c.toUpperCase())
                              : ""
                          );
                        }}
                        className="text-[11px] font-semibold text-primary hover:underline cursor-pointer"
                      >
                        {isEditCustomCategory ? "Choose From List" : "+ New / Custom Category"}
                      </button>
                    )}
                  </div>
                  {isEditCustomCategory || allCategories.length === 0 ? (
                    <input
                      type="text"
                      name="category"
                      value={editCustomCategoryInput}
                      onChange={(e) => setEditCustomCategoryInput(e.target.value)}
                      placeholder="e.g. Ramadan Relief 2026"
                      required
                      className="w-full rounded-xl border border-primary bg-background px-3 py-2 text-xs text-text focus:border-primary focus:outline-none"
                    />
                  ) : (
                    <select
                      name="category"
                      required
                      defaultValue={editingImage.category}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-text focus:border-primary focus:outline-none"
                    >
                      {allCategories.map((cat) => (
                        <option key={cat.key} value={cat.key}>
                          {cat.label} ({cat.count})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    required
                    defaultValue={editingImage.location}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-text focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* Compliance & Approval Checkbox */}
              <div className="space-y-2 pt-2 border-t border-border">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="edit-approved"
                    name="approved"
                    defaultChecked={editingImage.approved}
                    className="rounded border-border text-primary focus:ring-primary"
                  />
                  <label
                    htmlFor="edit-approved"
                    className="text-xs font-semibold text-text cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Approved for immediate public display on website</span>
                  </label>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-text hover:bg-background"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-xl bg-[#0b2e1e] hover:bg-[#124d34] px-5 py-2 text-xs font-semibold text-white shadow-xs transition-colors disabled:opacity-50"
                >
                  {isPending ? "Saving..." : "Update Photo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-border bg-surface p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950">
              <Trash2 className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-display text-lg font-bold text-text">
              Confirm Photo Deletion
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-text-muted leading-relaxed">
              Are you sure you want to permanently remove this image from the society gallery registry?
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-text hover:bg-background"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={isPending}
                className="rounded-xl bg-rose-600 hover:bg-rose-700 px-5 py-2 text-xs font-semibold text-white shadow-xs transition-colors disabled:opacity-50"
              >
                {isPending ? "Deleting..." : "Delete Photo"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MANAGE / EDIT ALBUM CATEGORIES MODAL */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl border border-border bg-surface p-6 sm:p-8 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => {
                setIsCategoryModalOpen(false);
                setEditingCategoryKey(null);
                setCategoryActionMessage(null);
              }}
              className="absolute right-5 top-5 rounded-full p-2 text-text-muted hover:bg-background hover:text-text cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-border pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Tags className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold text-text">
                  Edit Album Categories
                </h2>
                <p className="text-xs text-text-muted">
                  View all photo albums, check photo counts, and rename categories across all photos in one click.
                </p>
              </div>
            </div>

            {categoryActionMessage && (
              <div
                className={`mt-4 flex items-center gap-2 rounded-xl p-3 text-xs font-semibold ${
                  categoryActionMessage.isError
                    ? "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                    : "bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                }`}
              >
                {categoryActionMessage.isError ? (
                  <ShieldAlert className="h-4 w-4 shrink-0" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                )}
                <span>{categoryActionMessage.text}</span>
              </div>
            )}

            <div className="mt-6 space-y-3">
              {allCategories.length === 0 ? (
                <div className="text-center py-8 text-xs text-text-muted">
                  No categories found. Upload photos to generate albums.
                </div>
              ) : (
                allCategories.map((cat) => {
                  const isEditingThis = editingCategoryKey === cat.key;

                  return (
                    <div
                      key={cat.key}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl border border-border bg-background transition-colors hover:border-primary/30"
                    >
                      {isEditingThis ? (
                        <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                          <input
                            type="text"
                            value={editingCategoryName}
                            onChange={(e) => setEditingCategoryName(e.target.value)}
                            placeholder="New category name..."
                            autoFocus
                            className="flex-1 rounded-xl border border-primary bg-surface px-3 py-1.5 text-xs text-text focus:outline-none"
                          />
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              disabled={isPending || !editingCategoryName.trim()}
                              onClick={() => handleSaveCategoryRename(cat.key)}
                              className="rounded-xl bg-[#0b2e1e] hover:bg-[#124d34] px-3.5 py-1.5 text-xs font-semibold text-white transition-colors disabled:opacity-50 cursor-pointer"
                            >
                              {isPending ? "Saving..." : "Save"}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingCategoryKey(null);
                                setEditingCategoryName("");
                              }}
                              className="rounded-xl border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text hover:bg-background cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs">
                              <Tags className="h-4 w-4" />
                            </span>
                            <div>
                              <div className="text-xs sm:text-sm font-bold text-text">
                                {cat.label}
                              </div>
                              <div className="text-[11px] font-mono text-text-muted">
                                slug: {cat.key}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="rounded-full bg-surface border border-border px-2.5 py-1 text-[11px] font-semibold text-text-muted">
                              {cat.count} {cat.count === 1 ? "photo" : "photos"}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingCategoryKey(cat.key);
                                setEditingCategoryName(cat.label);
                                setCategoryActionMessage(null);
                              }}
                              className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface hover:bg-background px-2.5 py-1 text-xs font-semibold text-text transition-colors cursor-pointer"
                            >
                              <Edit2 className="h-3.5 w-3.5 text-primary" />
                              <span>Rename</span>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-border flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setIsCategoryModalOpen(false);
                  setEditingCategoryKey(null);
                }}
                className="rounded-xl bg-[#0b2e1e] hover:bg-[#124d34] text-white px-5 py-2 text-xs font-semibold transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BATCH UPLOADER MODAL */}
      <BatchGalleryUploader
        isOpen={isBatchOpen}
        onClose={() => setIsBatchOpen(false)}
        existingCategories={allCategories}
        onSuccess={() => {
          setIsBatchOpen(false);
          window.location.reload();
        }}
      />
    </div>
  );
}
