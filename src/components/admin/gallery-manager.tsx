"use client";

import * as React from "react";
import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  type GalleryImage,
  GALLERY_CATEGORIES,
} from "@/content/gallery";
import {
  createGalleryImageAction,
  updateGalleryImageAction,
  deleteGalleryImageAction,
  toggleGalleryApprovalAction,
} from "@/lib/admin-actions";
import { formatGoogleDriveImageUrl } from "@/lib/utils";
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
  Calendar,
  ShieldCheck,
  ShieldAlert,
  X,
  FileCheck,
  Lock,
} from "lucide-react";

interface GalleryManagerProps {
  initialImages: GalleryImage[];
}

const PRESET_GALLERY_PHOTOS = [
  { label: "Cemetery Shramadana 01", path: "/images/gallery/shramadana-01.webp" },
  { label: "Cemetery Shramadana 02", path: "/images/gallery/shramadana-02.webp" },
  { label: "Ghusl Training 01", path: "/images/gallery/ghusl-01.webp" },
  { label: "Ghusl Training 02", path: "/images/gallery/ghusl-02.webp" },
  { label: "Iftar Function 01", path: "/images/gallery/iftar-01.webp" },
  { label: "Iftar Function 02", path: "/images/gallery/iftar-02.webp" },
  { label: "Water & Concrete Project", path: "/images/gallery/water-concrete-01.webp" },
  { label: "Livelihood Welfare 01", path: "/images/gallery/livelihood-01.webp" },
  { label: "Cemetery Road Project", path: "/images/gallery/cemetery-road-01.webp" },
];

export function GalleryManager({ initialImages }: GalleryManagerProps) {
  const router = useRouter();
  const [images, setImages] = useState<GalleryImage[]>(initialImages);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [approvalFilter, setApprovalFilter] = useState<"all" | "approved" | "unapproved">("all");
  const [isPending, startTransition] = useTransition();

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Photo selector state for modal
  const [selectedPhoto, setSelectedPhoto] = useState<string>("");
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string>("");

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
      img.date.toLowerCase().includes(q) ||
      (img.consentNotes && img.consentNotes.toLowerCase().includes(q));

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
    const rawPhoto = customPhotoUrl.trim() || selectedPhoto;
    if (!rawPhoto) {
      setFormError("Please select a preset photo or enter an image URL.");
      return;
    }
    const photoToUse = formatGoogleDriveImageUrl(rawPhoto);
    formData.set("src", photoToUse);

    startTransition(async () => {
      const res = await createGalleryImageAction(null, formData);
      if (res?.error) {
        setFormError(res.error);
      } else {
        setIsCreateOpen(false);
        setSelectedPhoto("");
        setCustomPhotoUrl("");
        window.location.reload();
      }
    });
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    const formData = new FormData(e.currentTarget);
    const rawPhoto = customPhotoUrl.trim() || (formData.get("src") as string)?.trim() || selectedPhoto;
    if (rawPhoto) {
      formData.set("src", formatGoogleDriveImageUrl(rawPhoto));
    }

    startTransition(async () => {
      const res = await updateGalleryImageAction(null, formData);
      if (res?.error) {
        setFormError(res.error);
      } else {
        setEditingImage(null);
        setSelectedPhoto("");
        setCustomPhotoUrl("");
        window.location.reload();
      }
    });
  };

  const openEditModal = (image: GalleryImage) => {
    setEditingImage(image);
    setSelectedPhoto(image.src);
    setCustomPhotoUrl(
      !PRESET_GALLERY_PHOTOS.some((p) => p.path === image.src) ? image.src : ""
    );
    setFormError(null);
  };

  const openCreateModal = () => {
    setIsCreateOpen(true);
    setSelectedPhoto(PRESET_GALLERY_PHOTOS[0].path);
    setCustomPhotoUrl("");
    setFormError(null);
  };

  return (
    <div className="space-y-6">
      {/* Privacy Policy Warning & Governance Banner */}
      <div className="rounded-2xl border border-[#c99a45]/30 bg-amber-500/5 p-4 sm:p-5 text-xs text-text shadow-xs">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#c99a45]/20 text-[#c99a45]">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h4 className="font-display text-sm font-bold text-[#0b2e1e] dark:text-[#d4a359]">
              Strict Privacy & Dignity Policy Enforced
            </h4>
            <p className="text-text-muted leading-relaxed">
              Every photo in the registry requires an explicit <code className="font-bold text-[#0b2e1e] dark:text-[#c99a45]">approved: true</code> flag to appear on the public website. Funeral preparation, ghusl, or shrouding photos must <strong>never depict the deceased</strong>. Photos of community members, women, or youth require documented consent.
            </p>
          </div>
        </div>
      </div>

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
            {GALLERY_CATEGORIES.map((cat) => (
              <option key={cat.key} value={cat.key}>
                {cat.key.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              </option>
            ))}
          </select>

          {/* Add Button */}
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#0b2e1e] hover:bg-[#124d34] px-4 py-2 text-xs font-semibold text-white shadow-xs transition-colors shrink-0"
          >
            <Plus className="h-4 w-4 text-[#c99a45]" />
            <span>Add Photo</span>
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
                    src={formatGoogleDriveImageUrl(img.src)}
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

                  <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{img.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate max-w-[160px]">{img.location}</span>
                    </div>
                  </div>

                  {img.consentNotes && (
                    <div className="rounded-xl bg-background border border-border p-2.5 text-[11px] text-text-muted flex items-start gap-2">
                      <FileCheck className="h-3.5 w-3.5 text-[#c99a45] shrink-0 mt-0.5" />
                      <span className="line-clamp-2 italic">
                        {img.consentNotes}
                      </span>
                    </div>
                  )}
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
              No Photos Found
            </h3>
            <p className="mt-1 text-xs text-text-muted">
              Try adjusting your search query or album filter.
            </p>
          </div>
        )}
      </div>

      {/* CREATE PHOTO MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl border border-border bg-surface p-6 sm:p-8 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
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
              {/* Photo Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                  Select Photo *
                </label>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 max-h-44 overflow-y-auto p-2 rounded-xl border border-border bg-background">
                    {PRESET_GALLERY_PHOTOS.map((preset) => {
                      const isSel = selectedPhoto === preset.path;
                      return (
                        <button
                          key={preset.path}
                          type="button"
                          onClick={() => {
                            setSelectedPhoto(preset.path);
                            setCustomPhotoUrl("");
                          }}
                          className={`relative aspect-[16/10] rounded-xl overflow-hidden border-2 transition-all ${
                            isSel
                              ? "border-primary ring-2 ring-primary/40 scale-95"
                              : "border-transparent opacity-70 hover:opacity-100"
                          }`}
                          title={preset.label}
                        >
                          <Image
                            src={preset.path}
                            alt={preset.label}
                            fill
                            className="object-cover"
                            sizes="96px"
                          />
                          {isSel && (
                            <div className="absolute inset-0 bg-primary/40 flex items-center justify-center text-white">
                              <CheckCircle2 className="h-4 w-4" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-text-muted shrink-0">
                        Photo URL / Google Drive:
                      </span>
                      <input
                        type="text"
                        value={customPhotoUrl}
                        onChange={(e) => {
                          setCustomPhotoUrl(e.target.value);
                          setSelectedPhoto("");
                        }}
                        placeholder="Paste Google Drive share link or direct URL..."
                        className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-xs text-text focus:border-primary focus:outline-none"
                      />
                    </div>
                    <p className="text-[11px] text-text-muted/80">
                      Supports Google Drive links (ensure &quot;Anyone with the link can view&quot; is turned on). Automatically converts to high-speed CDN.
                    </p>
                    {customPhotoUrl && (
                      <div className="flex items-center gap-3 p-2 rounded-xl bg-background border border-border">
                        <div className="relative h-12 w-16 rounded-lg overflow-hidden border border-border bg-black/5 shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={formatGoogleDriveImageUrl(customPhotoUrl)}
                            alt="Preview"
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = "none";
                            }}
                          />
                        </div>
                        <div className="text-[11px] text-text-muted truncate">
                          Previewing: <span className="font-mono text-primary font-medium">{formatGoogleDriveImageUrl(customPhotoUrl)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
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
                  placeholder="e.g. Mahallah Cemetery Shramadana volunteer restoration drive"
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs sm:text-sm text-text focus:border-primary focus:outline-none"
                />
              </div>

              {/* Category, Date, Location */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">
                    Album Category *
                  </label>
                  <select
                    name="category"
                    required
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-text focus:border-primary focus:outline-none"
                  >
                    {GALLERY_CATEGORIES.map((cat) => (
                      <option key={cat.key} value={cat.key}>
                        {cat.key.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">
                    Event Year / Date *
                  </label>
                  <input
                    type="text"
                    name="date"
                    required
                    defaultValue={new Date().getFullYear().toString()}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-text focus:border-primary focus:outline-none"
                  />
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

              {/* Consent Notes */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">
                  Privacy & Consent Verification Notes
                </label>
                <textarea
                  name="consentNotes"
                  rows={2}
                  placeholder="e.g. Explicit consent confirmed for all volunteers. No grieving individuals or sensitive burial procedures shown."
                  className="w-full rounded-xl border border-border bg-background p-3 text-xs text-text focus:border-primary focus:outline-none"
                />
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
                  onClick={() => setIsCreateOpen(false)}
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
              onClick={() => setEditingImage(null)}
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

              {/* Photo Preview & Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                  Photo Path / Google Drive URL
                </label>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="relative h-16 w-24 rounded-xl overflow-hidden border border-border shrink-0 bg-background">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={formatGoogleDriveImageUrl(customPhotoUrl || editingImage.src)}
                        alt="Preview"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    </div>
                    <input
                      type="text"
                      name="src"
                      defaultValue={editingImage.src}
                      onChange={(e) => setCustomPhotoUrl(e.target.value)}
                      required
                      placeholder="Paste Google Drive share link or image URL..."
                      className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-xs text-text focus:border-primary focus:outline-none"
                    />
                  </div>
                  <p className="text-[11px] text-text-muted/80">
                    Supports Google Drive links (ensure &quot;Anyone with the link can view&quot; is turned on).
                  </p>
                </div>
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

              {/* Category, Date, Location */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">
                    Album Category *
                  </label>
                  <select
                    name="category"
                    required
                    defaultValue={editingImage.category}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-text focus:border-primary focus:outline-none"
                  >
                    {GALLERY_CATEGORIES.map((cat) => (
                      <option key={cat.key} value={cat.key}>
                        {cat.key.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">
                    Event Year / Date *
                  </label>
                  <input
                    type="text"
                    name="date"
                    required
                    defaultValue={editingImage.date}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-text focus:border-primary focus:outline-none"
                  />
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

              {/* Consent Notes */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">
                  Privacy & Consent Verification Notes
                </label>
                <textarea
                  name="consentNotes"
                  rows={2}
                  defaultValue={editingImage.consentNotes || ""}
                  className="w-full rounded-xl border border-border bg-background p-3 text-xs text-text focus:border-primary focus:outline-none"
                />
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
                  onClick={() => setEditingImage(null)}
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
    </div>
  );
}
