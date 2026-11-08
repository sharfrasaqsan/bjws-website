"use client";

import * as React from "react";
import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { type GalleryImage, formatCategoryLabel } from "@/content/gallery";
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
  const [approvalFilter, setApprovalFilter] = useState<
    "all" | "approved" | "unapproved"
  >("all");
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
  const [createCustomCategoryInput, setCreateCustomCategoryInput] =
    useState("");
  const [isEditCustomCategory, setIsEditCustomCategory] = useState(false);
  const [editCustomCategoryInput, setEditCustomCategoryInput] = useState("");

  // Category Manager Modal state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategoryKey, setEditingCategoryKey] = useState<string | null>(
    null
  );
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
    const rawPhoto =
      editPhotoUrl.trim() || (formData.get("src") as string)?.trim();
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
      const res = await renameGalleryCategoryAction(
        oldCategory,
        editingCategoryName
      );
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="border-border bg-surface flex items-center justify-between rounded-2xl border p-4 shadow-2xs">
          <div>
            <div className="text-text-muted text-xs font-semibold tracking-wider uppercase">
              Total Cataloged Photos
            </div>
            <div className="font-display text-primary mt-1 text-2xl font-bold">
              {totalCount}
            </div>
          </div>
          <div className="bg-primary/10 text-primary flex h-11 w-11 items-center justify-center rounded-xl">
            <ImageIcon className="text-primary h-5 w-5" />
          </div>
        </div>

        <div className="border-border bg-surface flex items-center justify-between rounded-2xl border p-4 shadow-2xs">
          <div>
            <div className="text-xs font-semibold tracking-wider text-[#166534] uppercase">
              Approved & Publicly Live
            </div>
            <div className="font-display mt-1 text-2xl font-bold text-[#166534]">
              {approvedCount}
            </div>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#22c55e]/15 text-[#166534]">
            <CheckCircle2 className="h-5 w-5 text-[#166534]" />
          </div>
        </div>

        <div className="border-border bg-surface flex items-center justify-between rounded-2xl border p-4 shadow-2xs">
          <div>
            <div className="text-xs font-semibold tracking-wider text-[#9f1239] uppercase">
              Pending / Restricted / Hidden
            </div>
            <div className="font-display mt-1 text-2xl font-bold text-[#9f1239]">
              {unapprovedCount}
            </div>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f43f5e]/15 text-[#9f1239]">
            <Lock className="h-5 w-5 text-[#9f1239]" />
          </div>
        </div>
      </div>

      {/* Filter and Action Bar */}
      <div className="border-border bg-surface flex flex-col items-stretch justify-between gap-4 rounded-2xl border p-4 shadow-2xs md:flex-row md:items-center">
        {/* Search Input */}
        <div className="relative min-w-[220px] flex-1">
          <Search className="text-text-muted absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by caption, location, year, or consent notes..."
            className="border-border bg-background text-text placeholder:text-text-muted/70 focus:border-primary focus:ring-primary w-full rounded-xl border py-2.5 pr-4 pl-10 text-xs focus:ring-1 focus:outline-none sm:text-sm"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="bg-background border-border inline-flex rounded-xl border p-1">
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
            className="border-border bg-background text-text focus:border-primary rounded-xl border px-3 py-2 text-xs font-semibold focus:outline-none"
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
            className="border-border bg-background hover:bg-surface text-text inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-semibold shadow-xs transition-colors"
          >
            <Tags className="h-4 w-4 text-[#124d34]" />
            <span>Edit Categories ({allCategories.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setIsBatchOpen(true)}
            className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl bg-[#124d34] px-4 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#0b2e1e]"
          >
            <UploadCloud className="h-4 w-4 text-[#d4af37]" />
            <span>Batch Upload Photos</span>
          </button>

          <button
            type="button"
            onClick={openCreateModal}
            className="border-border bg-background hover:bg-surface text-text inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="text-primary h-4 w-4" />
            <span>Add Single Photo</span>
          </button>
        </div>
      </div>

      {/* Gallery Cards Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredImages.map((img) => {
          const isApproved = img.approved;

          return (
            <div
              key={img.id}
              className={`group bg-surface relative flex flex-col justify-between overflow-hidden rounded-2xl border shadow-2xs transition-all hover:shadow-md ${
                isApproved
                  ? "border-border hover:border-primary/40"
                  : "border-rose-300 bg-rose-50/20 dark:border-rose-900/40"
              }`}
            >
              <div>
                {/* Image Banner */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/5">
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
                <div className="space-y-2 p-4">
                  <h3 className="font-display text-text line-clamp-2 text-sm font-bold">
                    {img.captionKey}
                  </h3>

                  <div className="text-text-muted flex items-center gap-1 text-xs">
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span className="max-w-[200px] truncate">
                      {img.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="border-border mt-3 flex items-center justify-between gap-2 border-t p-4 pt-0">
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
                  title={
                    isApproved
                      ? "Revoke Approval & Hide"
                      : "Approve Photo for Public Site"
                  }
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
                    className="border-border bg-background text-text-muted hover:border-primary hover:text-primary inline-flex h-8 w-8 items-center justify-center rounded-lg border transition-colors"
                    title="Edit Photo Details"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(img.id)}
                    className="border-border bg-background inline-flex h-8 w-8 items-center justify-center rounded-lg border text-rose-500 transition-colors hover:border-rose-200 hover:bg-rose-50"
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
          <div className="border-border bg-surface col-span-full rounded-2xl border border-dashed p-12 text-center">
            <ImageIcon className="text-text-muted/60 mx-auto h-10 w-10" />
            <h3 className="font-display text-text mt-3 text-base font-bold">
              {totalCount === 0
                ? "No Photos in Registry Yet"
                : "No Photos Found"}
            </h3>
            <p className="text-text-muted mx-auto mt-1 max-w-md text-xs">
              {totalCount === 0
                ? "Your society gallery is currently empty. Start documenting community shramadhana drives, ghusl programs, and welfare activities."
                : "Try adjusting your search query or album category filter."}
            </p>
            {totalCount === 0 && (
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsBatchOpen(true)}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#124d34] px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#0b2e1e]"
                >
                  <UploadCloud className="h-4 w-4 text-[#d4af37]" />
                  <span>Batch Upload (50+ Photos)</span>
                </button>
                <button
                  type="button"
                  onClick={openCreateModal}
                  className="border-border bg-background hover:bg-surface text-text inline-flex cursor-pointer items-center gap-2 rounded-xl border px-5 py-2.5 text-xs font-semibold shadow-xs transition-colors"
                >
                  <Plus className="text-primary h-4 w-4" />
                  <span>Add Single Photo</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* CREATE PHOTO MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-xs">
          <div className="border-border bg-surface relative my-8 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border p-6 shadow-2xl sm:p-8">
            <button
              type="button"
              onClick={closeCreateModal}
              className="text-text-muted hover:bg-background hover:text-text absolute top-5 right-5 rounded-full p-2"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="border-border flex items-center gap-3 border-b pb-4">
              <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-xl">
                <Plus className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display text-text text-xl font-bold">
                  Add New Gallery Photo
                </h2>
                <p className="text-text-muted text-xs">
                  Upload or link a verified society event photo with privacy
                  consent.
                </p>
              </div>
            </div>

            {formError && (
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-700 dark:bg-rose-950 dark:text-rose-300">
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
                <label className="text-text-muted mb-1 block text-xs font-bold tracking-wider uppercase">
                  Photo Caption / Description *
                </label>
                <input
                  type="text"
                  name="caption"
                  required
                  placeholder="e.g. Mahallah Cemetery Shramadana volunteer restoration drive"
                  className="border-border bg-background text-text focus:border-primary w-full rounded-xl border px-3.5 py-2.5 text-xs focus:outline-none sm:text-sm"
                />
              </div>

              {/* Category & Location */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <label className="text-text-muted block text-xs font-bold tracking-wider uppercase">
                      Album Category *
                    </label>
                    {allCategories.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsCreateCustomCategory(!isCreateCustomCategory);
                          setCreateCustomCategoryInput("");
                        }}
                        className="text-primary cursor-pointer text-[11px] font-semibold hover:underline"
                      >
                        {isCreateCustomCategory
                          ? "Choose Existing"
                          : "+ New Category"}
                      </button>
                    )}
                  </div>
                  {isCreateCustomCategory || allCategories.length === 0 ? (
                    <input
                      type="text"
                      value={createCustomCategoryInput}
                      onChange={(e) =>
                        setCreateCustomCategoryInput(e.target.value)
                      }
                      placeholder="e.g. Ramadan Relief 2026"
                      required
                      className="border-primary bg-background text-text focus:border-primary w-full rounded-xl border px-3 py-2 text-xs focus:outline-none"
                    />
                  ) : (
                    <select
                      name="category"
                      required
                      className="border-border bg-background text-text focus:border-primary w-full rounded-xl border px-3 py-2 text-xs focus:outline-none"
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
                  <label className="text-text-muted mb-1 block text-xs font-bold tracking-wider uppercase">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    required
                    defaultValue="Mullipothana"
                    className="border-border bg-background text-text focus:border-primary w-full rounded-xl border px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
              </div>

              {/* Compliance & Approval Checkbox */}
              <div className="border-border space-y-2 border-t pt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="create-approved"
                    name="approved"
                    defaultChecked
                    className="border-border text-primary focus:ring-primary rounded"
                  />
                  <label
                    htmlFor="create-approved"
                    className="text-text flex cursor-pointer items-center gap-1.5 text-xs font-semibold"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Approve for immediate public display on website</span>
                  </label>
                </div>
                <p className="text-text-muted pl-6 text-[11px]">
                  Uncheck this if the photo is awaiting consent verification or
                  should remain restricted to administrative archives.
                </p>
              </div>

              {/* Buttons */}
              <div className="border-border flex items-center justify-end gap-3 border-t pt-4">
                <button
                  type="button"
                  onClick={closeCreateModal}
                  className="border-border text-text hover:bg-background rounded-xl border px-4 py-2 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-xl bg-[#0b2e1e] px-5 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#124d34] disabled:opacity-50"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-xs">
          <div className="border-border bg-surface relative my-8 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border p-6 shadow-2xl sm:p-8">
            <button
              type="button"
              onClick={closeEditModal}
              className="text-text-muted hover:bg-background hover:text-text absolute top-5 right-5 rounded-full p-2"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="border-border flex items-center gap-3 border-b pb-4">
              <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-xl">
                <Edit2 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display text-text text-xl font-bold">
                  Edit Gallery Photo Details
                </h2>
                <p className="text-text-muted text-xs">
                  Update caption, category, consent notes, or approval status.
                </p>
              </div>
            </div>

            {formError && (
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-700 dark:bg-rose-950 dark:text-rose-300">
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
                <label className="text-text-muted mb-1 block text-xs font-bold tracking-wider uppercase">
                  Photo Caption / Description *
                </label>
                <input
                  type="text"
                  name="caption"
                  required
                  defaultValue={editingImage.captionKey}
                  className="border-border bg-background text-text focus:border-primary w-full rounded-xl border px-3.5 py-2.5 text-xs focus:outline-none sm:text-sm"
                />
              </div>

              {/* Category & Location */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <label className="text-text-muted block text-xs font-bold tracking-wider uppercase">
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
                        className="text-primary cursor-pointer text-[11px] font-semibold hover:underline"
                      >
                        {isEditCustomCategory
                          ? "Choose From List"
                          : "+ New / Custom Category"}
                      </button>
                    )}
                  </div>
                  {isEditCustomCategory || allCategories.length === 0 ? (
                    <input
                      type="text"
                      name="category"
                      value={editCustomCategoryInput}
                      onChange={(e) =>
                        setEditCustomCategoryInput(e.target.value)
                      }
                      placeholder="e.g. Ramadan Relief 2026"
                      required
                      className="border-primary bg-background text-text focus:border-primary w-full rounded-xl border px-3 py-2 text-xs focus:outline-none"
                    />
                  ) : (
                    <select
                      name="category"
                      required
                      defaultValue={editingImage.category}
                      className="border-border bg-background text-text focus:border-primary w-full rounded-xl border px-3 py-2 text-xs focus:outline-none"
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
                  <label className="text-text-muted mb-1 block text-xs font-bold tracking-wider uppercase">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    required
                    defaultValue={editingImage.location}
                    className="border-border bg-background text-text focus:border-primary w-full rounded-xl border px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
              </div>

              {/* Compliance & Approval Checkbox */}
              <div className="border-border space-y-2 border-t pt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="edit-approved"
                    name="approved"
                    defaultChecked={editingImage.approved}
                    className="border-border text-primary focus:ring-primary rounded"
                  />
                  <label
                    htmlFor="edit-approved"
                    className="text-text flex cursor-pointer items-center gap-1.5 text-xs font-semibold"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>
                      Approved for immediate public display on website
                    </span>
                  </label>
                </div>
              </div>

              {/* Buttons */}
              <div className="border-border flex items-center justify-end gap-3 border-t pt-4">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="border-border text-text hover:bg-background rounded-xl border px-4 py-2 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-xl bg-[#0b2e1e] px-5 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#124d34] disabled:opacity-50"
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
          <div className="border-border bg-surface w-full max-w-md rounded-3xl border p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950">
              <Trash2 className="h-6 w-6" />
            </div>
            <h3 className="font-display text-text mt-4 text-lg font-bold">
              Confirm Photo Deletion
            </h3>
            <p className="text-text-muted mt-2 text-xs leading-relaxed sm:text-sm">
              Are you sure you want to permanently remove this image from the
              society gallery registry?
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="border-border text-text hover:bg-background rounded-xl border px-4 py-2 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={isPending}
                className="rounded-xl bg-rose-600 px-5 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-rose-700 disabled:opacity-50"
              >
                {isPending ? "Deleting..." : "Delete Photo"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MANAGE / EDIT ALBUM CATEGORIES MODAL */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-xs">
          <div className="border-border bg-surface relative my-8 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border p-6 shadow-2xl sm:p-8">
            <button
              type="button"
              onClick={() => {
                setIsCategoryModalOpen(false);
                setEditingCategoryKey(null);
                setCategoryActionMessage(null);
              }}
              className="text-text-muted hover:bg-background hover:text-text absolute top-5 right-5 cursor-pointer rounded-full p-2"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="border-border flex items-center gap-3 border-b pb-4">
              <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-xl">
                <Tags className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display text-text text-xl font-bold">
                  Edit Album Categories
                </h2>
                <p className="text-text-muted text-xs">
                  View all photo albums, check photo counts, and rename
                  categories across all photos in one click.
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
                <div className="text-text-muted py-8 text-center text-xs">
                  No categories found. Upload photos to generate albums.
                </div>
              ) : (
                allCategories.map((cat) => {
                  const isEditingThis = editingCategoryKey === cat.key;

                  return (
                    <div
                      key={cat.key}
                      className="border-border bg-background hover:border-primary/30 flex flex-col justify-between gap-3 rounded-2xl border p-3.5 transition-colors sm:flex-row sm:items-center"
                    >
                      {isEditingThis ? (
                        <div className="flex flex-1 flex-col items-stretch gap-2 sm:flex-row sm:items-center">
                          <input
                            type="text"
                            value={editingCategoryName}
                            onChange={(e) =>
                              setEditingCategoryName(e.target.value)
                            }
                            placeholder="New category name..."
                            autoFocus
                            className="border-primary bg-surface text-text flex-1 rounded-xl border px-3 py-1.5 text-xs focus:outline-none"
                          />
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              disabled={
                                isPending || !editingCategoryName.trim()
                              }
                              onClick={() => handleSaveCategoryRename(cat.key)}
                              className="cursor-pointer rounded-xl bg-[#0b2e1e] px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#124d34] disabled:opacity-50"
                            >
                              {isPending ? "Saving..." : "Save"}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingCategoryKey(null);
                                setEditingCategoryName("");
                              }}
                              className="border-border bg-surface text-text hover:bg-background cursor-pointer rounded-xl border px-3 py-1.5 text-xs font-medium"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-3">
                            <span className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold">
                              <Tags className="h-4 w-4" />
                            </span>
                            <div>
                              <div className="text-text text-xs font-bold sm:text-sm">
                                {cat.label}
                              </div>
                              <div className="text-text-muted font-mono text-[11px]">
                                slug: {cat.key}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="bg-surface border-border text-text-muted rounded-full border px-2.5 py-1 text-[11px] font-semibold">
                              {cat.count} {cat.count === 1 ? "photo" : "photos"}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingCategoryKey(cat.key);
                                setEditingCategoryName(cat.label);
                                setCategoryActionMessage(null);
                              }}
                              className="border-border bg-surface hover:bg-background text-text inline-flex cursor-pointer items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-semibold transition-colors"
                            >
                              <Edit2 className="text-primary h-3.5 w-3.5" />
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

            <div className="border-border mt-6 flex justify-end border-t pt-4">
              <button
                type="button"
                onClick={() => {
                  setIsCategoryModalOpen(false);
                  setEditingCategoryKey(null);
                }}
                className="cursor-pointer rounded-xl bg-[#0b2e1e] px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#124d34]"
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
