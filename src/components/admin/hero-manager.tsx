"use client";

import * as React from "react";
import Image from "next/image";
import {
  Sparkles,
  Plus,
  ArrowUp,
  ArrowDown,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Loader2,
  X,
  Upload,
  Link as LinkIcon,
  Layers,
  CheckCircle2,
} from "lucide-react";
import type { HeroBanner } from "@/content/hero-banners";
import {
  createHeroBannerAction,
  updateHeroBannerAction,
  deleteHeroBannerAction,
  toggleHeroBannerActiveAction,
  reorderHeroBannersAction,
} from "@/lib/admin-actions";

interface HeroManagerProps {
  initialBanners: HeroBanner[];
}

export function HeroManager({ initialBanners }: HeroManagerProps) {
  const [banners, setBanners] = React.useState<HeroBanner[]>(initialBanners);
  const [isPending, startTransition] = React.useTransition();
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(
    null
  );

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [editingBanner, setEditingBanner] = React.useState<HeroBanner | null>(
    null
  );
  const [deletingBanner, setDeletingBanner] = React.useState<HeroBanner | null>(
    null
  );
  const [previewBanner, setPreviewBanner] = React.useState<HeroBanner | null>(
    null
  );

  // Form state for Create / Edit
  const [formImageFile, setFormImageFile] = React.useState<File | null>(null);
  const [formFilePreview, setFormFilePreview] = React.useState<string | null>(
    null
  );
  const [formSrcUrl, setFormSrcUrl] = React.useState("");
  const [formLabel, setFormLabel] = React.useState("");
  const [formAlt, setFormAlt] = React.useState("");
  const [formTitle, setFormTitle] = React.useState("");
  const [formSubtitle, setFormSubtitle] = React.useState("");
  const [formIsActive, setFormIsActive] = React.useState(true);
  const [uploadMode, setUploadMode] = React.useState<"file" | "url">("file");

  // Keep state synced when server props update
  const [prevInitialBanners, setPrevInitialBanners] =
    React.useState(initialBanners);
  if (prevInitialBanners !== initialBanners) {
    setPrevInitialBanners(initialBanners);
    setBanners(initialBanners);
  }

  // Handle auto-clearing feedback messages
  React.useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const resetForm = () => {
    setFormImageFile(null);
    setFormFilePreview(null);
    setFormSrcUrl("");
    setFormLabel("");
    setFormAlt("");
    setFormTitle("");
    setFormSubtitle("");
    setFormIsActive(true);
    setUploadMode("file");
    setErrorMessage(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsCreateOpen(true);
  };

  const openEditModal = (banner: HeroBanner) => {
    resetForm();
    setEditingBanner(banner);
    setFormSrcUrl(banner.src);
    setFormLabel(banner.label || "");
    setFormAlt(banner.alt);
    setFormTitle(banner.title || "");
    setFormSubtitle(banner.subtitle || "");
    setFormIsActive(banner.is_active);
    setUploadMode("url");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormImageFile(file);
      const objectUrl = URL.createObjectURL(file);
      setFormFilePreview(objectUrl);
    }
  };

  // Reordering handlers
  const moveBanner = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= banners.length) return;

    const newBanners = [...banners];
    const [moved] = newBanners.splice(index, 1);
    newBanners.splice(targetIndex, 0, moved);

    // Update local order indices
    const updated = newBanners.map((b, idx) => ({
      ...b,
      order_index: idx + 1,
    }));
    setBanners(updated);

    startTransition(async () => {
      const res = await reorderHeroBannersAction(updated.map((b) => b.id));
      if (res.error) {
        setErrorMessage(res.error);
        setBanners(banners); // revert
      } else {
        setSuccessMessage("Slide sequence reordered successfully.");
      }
    });
  };

  // Toggle active handler
  const handleToggleActive = (banner: HeroBanner) => {
    const nextState = !banner.is_active;
    setBanners((prev) =>
      prev.map((b) => (b.id === banner.id ? { ...b, is_active: nextState } : b))
    );

    startTransition(async () => {
      const res = await toggleHeroBannerActiveAction(banner.id);
      if (res.error) {
        setErrorMessage(res.error);
        setBanners((prev) =>
          prev.map((b) =>
            b.id === banner.id ? { ...b, is_active: banner.is_active } : b
          )
        );
      } else {
        setSuccessMessage(
          nextState
            ? `Slide "${banner.label || banner.id}" is now live on homepage.`
            : `Slide "${banner.label || banner.id}" has been hidden.`
        );
      }
    });
  };

  // Create submission
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const formData = new FormData();
    if (uploadMode === "file" && formImageFile) {
      formData.set("image_file", formImageFile);
    } else if (formSrcUrl.trim()) {
      formData.set("src", formSrcUrl.trim());
    } else {
      setErrorMessage("Please select an image file or provide an image URL.");
      return;
    }

    formData.set(
      "alt",
      formAlt.trim() || "BJWS Official Community Hero Banner"
    );
    formData.set("label", formLabel.trim());
    formData.set("title", formTitle.trim());
    formData.set("subtitle", formSubtitle.trim());
    formData.set("is_active", formIsActive ? "true" : "false");

    startTransition(async () => {
      const res = await createHeroBannerAction(formData);
      if (res.error) {
        setErrorMessage(res.error);
      } else {
        setIsCreateOpen(false);
        resetForm();
        setSuccessMessage("New hero banner slide created and published!");
        window.location.reload();
      }
    });
  };

  // Edit submission
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBanner) return;
    setErrorMessage(null);

    const formData = new FormData();
    if (uploadMode === "file" && formImageFile) {
      formData.set("image_file", formImageFile);
    } else if (formSrcUrl.trim()) {
      formData.set("src", formSrcUrl.trim());
    }

    formData.set("alt", formAlt.trim() || editingBanner.alt);
    formData.set("label", formLabel.trim());
    formData.set("title", formTitle.trim());
    formData.set("subtitle", formSubtitle.trim());
    formData.set("is_active", formIsActive ? "true" : "false");

    startTransition(async () => {
      const res = await updateHeroBannerAction(editingBanner.id, formData);
      if (res.error) {
        setErrorMessage(res.error);
      } else {
        setEditingBanner(null);
        resetForm();
        setSuccessMessage("Hero banner updated successfully.");
        window.location.reload();
      }
    });
  };

  // Delete submission
  const handleDeleteConfirm = () => {
    if (!deletingBanner) return;

    startTransition(async () => {
      const res = await deleteHeroBannerAction(deletingBanner.id);
      if (res.error) {
        setErrorMessage(res.error);
      } else {
        setBanners((prev) => prev.filter((b) => b.id !== deletingBanner.id));
        setDeletingBanner(null);
        setSuccessMessage("Hero banner removed successfully.");
      }
    });
  };

  const activeCount = banners.filter((b) => b.is_active).length;

  return (
    <div className="space-y-6">
      {/* Top Banner Actions & Summary Stats */}
      <div className="flex flex-col gap-4 rounded-2xl border border-[#e6e4dc] bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between dark:border-[#1a432f] dark:bg-[#0c2419]">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f3ee] text-[#124d34] dark:bg-[#14553a]/40 dark:text-[#a7c5b6]">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg font-bold text-[#0b2e1e] dark:text-white">
                {banners.length} Slides Total
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                <Check className="h-3 w-3" />
                {activeCount} Live on Homepage
              </span>
            </div>
            <p className="text-xs text-[#6b7280] dark:text-[#9ca3af]">
              Slides rotate smoothly in order. Drag or use the up/down arrows to
              adjust the sequence.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#124d34] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#0b2e1e] hover:shadow-md"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Slide</span>
        </button>
      </div>

      {/* Global Alerts */}
      {errorMessage && (
        <div className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="cursor-pointer text-rose-600 hover:text-rose-900"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {successMessage && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-medium text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessMessage(null)}
            className="cursor-pointer text-emerald-600 hover:text-emerald-900"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Hero Banners Grid / List */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {banners.map((banner, index) => {
          const isFirst = index === 0;
          const isLast = index === banners.length - 1;

          return (
            <div
              key={banner.id}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border transition-all ${
                banner.is_active
                  ? "border-[#e6e4dc] bg-white shadow-2xs hover:border-[#124d34] hover:shadow-md dark:border-[#1a432f] dark:bg-[#0c2419]"
                  : "border-gray-200 bg-gray-50/70 opacity-75 dark:border-gray-800 dark:bg-gray-900/40"
              }`}
            >
              {/* Image Preview & Badges */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-black/10">
                <Image
                  src={banner.src}
                  alt={banner.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Scrim Overlay */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

                {/* Top Left: Slide Sequence Number & Status */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-black/60 font-mono text-xs font-bold text-[#d4af37] shadow-sm backdrop-blur-md">
                    #{index + 1}
                  </span>

                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold shadow-sm backdrop-blur-md ${
                      banner.is_active
                        ? "border border-emerald-400/30 bg-emerald-950/80 text-emerald-300"
                        : "border border-gray-400/30 bg-gray-900/80 text-gray-300"
                    }`}
                  >
                    {banner.is_active ? "Live" : "Hidden"}
                  </span>
                </div>

                {/* Top Right: Label Badge if set */}
                {banner.label && (
                  <div className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/60 px-2.5 py-0.5 text-[11px] font-semibold text-[#d4af37] shadow-sm backdrop-blur-md">
                    <Sparkles className="h-3 w-3" />
                    <span>{banner.label}</span>
                  </div>
                )}

                {/* Bottom Overlay Info */}
                <div className="absolute right-3 bottom-3 left-3 text-white">
                  {banner.title && (
                    <div className="font-serif text-sm font-bold text-white drop-shadow-md">
                      {banner.title}
                    </div>
                  )}
                  <p className="line-clamp-2 text-xs text-gray-200 drop-shadow-xs">
                    {banner.alt}
                  </p>
                </div>
              </div>

              {/* Card Footer Controls */}
              <div className="flex items-center justify-between border-t border-[#f0eee6] bg-[#fbfaf6] p-3 text-xs dark:border-[#1a432f] dark:bg-[#081a12]">
                {/* Reordering Controls */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={isFirst || isPending}
                    onClick={() => moveBanner(index, "up")}
                    title="Move slide earlier in rotation"
                    className="cursor-pointer rounded-lg border border-[#e6e4dc] bg-white p-1.5 text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>

                  <button
                    type="button"
                    disabled={isLast || isPending}
                    onClick={() => moveBanner(index, "down")}
                    title="Move slide later in rotation"
                    className="cursor-pointer rounded-lg border border-[#e6e4dc] bg-white p-1.5 text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleActive(banner)}
                    disabled={isPending}
                    title={banner.is_active ? "Hide slide" : "Make slide live"}
                    className={`ml-1 inline-flex cursor-pointer items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-semibold transition-colors ${
                      banner.is_active
                        ? "border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                        : "border-gray-300 bg-gray-100 text-gray-600 hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                    }`}
                  >
                    {banner.is_active ? (
                      <>
                        <Eye className="h-3 w-3" />
                        <span>Visible</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-3 w-3" />
                        <span>Hidden</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Edit & Delete Controls */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPreviewBanner(banner)}
                    title="Full preview"
                    className="cursor-pointer rounded-lg border border-[#e6e4dc] bg-white p-1.5 text-gray-600 hover:bg-gray-100 hover:text-[#124d34] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => openEditModal(banner)}
                    title="Edit slide details"
                    className="cursor-pointer rounded-lg border border-[#e6e4dc] bg-white p-1.5 text-[#124d34] hover:bg-[#e8f3ee] dark:border-gray-700 dark:bg-gray-800 dark:text-[#a7c5b6]"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeletingBanner(banner)}
                    title="Delete slide"
                    className="cursor-pointer rounded-lg border border-rose-200 bg-rose-50 p-1.5 text-rose-600 hover:bg-rose-100 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-400"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ==================================================================== */}
      {/* Create / Add Modal */}
      {/* ==================================================================== */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-[#e6e4dc] bg-white p-6 shadow-2xl dark:border-[#1a432f] dark:bg-[#0c2419]">
            <div className="mb-5 flex items-center justify-between border-b border-[#f0eee6] pb-4 dark:border-[#1a432f]">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e8f3ee] text-[#124d34] dark:bg-[#14553a]/40 dark:text-[#a7c5b6]">
                  <Plus className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#0b2e1e] dark:text-white">
                    Add Hero Banner Slide
                  </h3>
                  <p className="text-xs text-[#6b7280] dark:text-[#9ca3af]">
                    Upload an image or specify an image URL to add to the
                    rotation.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="cursor-pointer rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              {/* Image Input Mode Toggle */}
              <div>
                <label className="mb-1.5 block text-xs font-bold text-gray-700 dark:text-gray-300">
                  Image Source *
                </label>
                <div className="mb-3 flex rounded-xl border border-[#e6e4dc] bg-[#fbfaf6] p-1 text-xs dark:border-gray-700 dark:bg-gray-800">
                  <button
                    type="button"
                    onClick={() => setUploadMode("file")}
                    className={`flex-1 cursor-pointer rounded-lg py-1.5 font-semibold transition-colors ${
                      uploadMode === "file"
                        ? "bg-white text-[#124d34] shadow-xs dark:bg-gray-700 dark:text-white"
                        : "text-gray-500 hover:text-gray-800 dark:text-gray-400"
                    }`}
                  >
                    <Upload className="mr-1.5 inline h-3.5 w-3.5" />
                    Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadMode("url")}
                    className={`flex-1 cursor-pointer rounded-lg py-1.5 font-semibold transition-colors ${
                      uploadMode === "url"
                        ? "bg-white text-[#124d34] shadow-xs dark:bg-gray-700 dark:text-white"
                        : "text-gray-500 hover:text-gray-800 dark:text-gray-400"
                    }`}
                  >
                    <LinkIcon className="mr-1.5 inline h-3.5 w-3.5" />
                    Image URL
                  </button>
                </div>

                {uploadMode === "file" ? (
                  <div className="space-y-2">
                    <label className="flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#e6e4dc] bg-[#fbfaf6] p-4 text-center transition-colors hover:border-[#124d34] dark:border-gray-700 dark:bg-gray-800/40">
                      <Upload className="mb-2 h-6 w-6 text-gray-400" />
                      <span className="text-xs font-semibold text-[#124d34] dark:text-[#a7c5b6]">
                        {formImageFile
                          ? formImageFile.name
                          : "Choose a banner image"}
                      </span>
                      <span className="mt-1 text-[11px] text-gray-400">
                        Supports WebP, JPEG, PNG (recommended 1920x1080)
                      </span>
                      <input
                        type="file"
                        accept="image/webp,image/jpeg,image/png"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>

                    {formFilePreview && (
                      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-emerald-500/30">
                        <Image
                          src={formFilePreview}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <input
                      type="text"
                      placeholder="e.g. /images/hero/my-banner.webp or https://..."
                      value={formSrcUrl}
                      onChange={(e) => setFormSrcUrl(e.target.value)}
                      className="w-full rounded-xl border border-[#e6e4dc] bg-white px-3.5 py-2 text-xs text-gray-900 focus:border-[#124d34] focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    />
                    {formSrcUrl && (
                      <div className="relative mt-2 aspect-[16/9] w-full overflow-hidden rounded-xl border border-gray-200">
                        <Image
                          src={formSrcUrl}
                          alt="URL Preview"
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Tag / Category Badge */}
              <div>
                <label className="mb-1 block text-xs font-bold text-gray-700 dark:text-gray-300">
                  Badge Label (e.g. &quot;24/7 Janaza Care&quot;, &quot;Cemetery
                  Upkeep&quot;)
                </label>
                <input
                  type="text"
                  placeholder="Short gold badge tag displayed on the slide"
                  value={formLabel}
                  onChange={(e) => setFormLabel(e.target.value)}
                  className="w-full rounded-xl border border-[#e6e4dc] bg-white px-3.5 py-2 text-xs text-gray-900 focus:border-[#124d34] focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              {/* Alt Text */}
              <div>
                <label className="mb-1 block text-xs font-bold text-gray-700 dark:text-gray-300">
                  Descriptive Alt Text *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Describe the image for screen readers and SEO"
                  value={formAlt}
                  onChange={(e) => setFormAlt(e.target.value)}
                  className="w-full rounded-xl border border-[#e6e4dc] bg-white px-3.5 py-2 text-xs text-gray-900 focus:border-[#124d34] focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              {/* Optional Title & Subtitle */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold text-gray-700 dark:text-gray-300">
                    Heading Title (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Short title"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full rounded-xl border border-[#e6e4dc] bg-white px-3.5 py-2 text-xs text-gray-900 focus:border-[#124d34] focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-gray-700 dark:text-gray-300">
                    Subtitle (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Secondary caption"
                    value={formSubtitle}
                    onChange={(e) => setFormSubtitle(e.target.value)}
                    className="w-full rounded-xl border border-[#e6e4dc] bg-white px-3.5 py-2 text-xs text-gray-900 focus:border-[#124d34] focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>

              {/* Is Active */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="formIsActiveCreate"
                  checked={formIsActive}
                  onChange={(e) => setFormIsActive(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-[#124d34] focus:ring-[#124d34]"
                />
                <label
                  htmlFor="formIsActiveCreate"
                  className="text-xs font-semibold text-gray-700 dark:text-gray-300"
                >
                  Make this slide immediately live on the homepage slideshow
                </label>
              </div>

              <div className="flex items-center justify-end gap-2.5 border-t border-[#f0eee6] pt-4 dark:border-[#1a432f]">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="cursor-pointer rounded-xl border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#124d34] px-5 py-2 text-xs font-bold text-white hover:bg-[#0b2e1e] disabled:opacity-50"
                >
                  {isPending && (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  )}
                  <span>Save Slide</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* Edit Modal */}
      {/* ==================================================================== */}
      {editingBanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-[#e6e4dc] bg-white p-6 shadow-2xl dark:border-[#1a432f] dark:bg-[#0c2419]">
            <div className="mb-5 flex items-center justify-between border-b border-[#f0eee6] pb-4 dark:border-[#1a432f]">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e8f3ee] text-[#124d34] dark:bg-[#14553a]/40 dark:text-[#a7c5b6]">
                  <Edit2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#0b2e1e] dark:text-white">
                    Edit Hero Banner Slide
                  </h3>
                  <p className="text-xs text-[#6b7280] dark:text-[#9ca3af]">
                    Update image, badge label, alt description, and visibility.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingBanner(null)}
                className="cursor-pointer rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              {/* Image preview & replacement */}
              <div>
                <label className="mb-1.5 block text-xs font-bold text-gray-700 dark:text-gray-300">
                  Current Image
                </label>
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-[#e6e4dc] bg-black/10">
                  <Image
                    src={formFilePreview || formSrcUrl || editingBanner.src}
                    alt={editingBanner.alt}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Replace Image Option */}
              <div>
                <label className="mb-1 block text-xs font-bold text-gray-700 dark:text-gray-300">
                  Replace Image (Optional)
                </label>
                <div className="mb-2 flex rounded-xl border border-[#e6e4dc] bg-[#fbfaf6] p-1 text-xs dark:border-gray-700 dark:bg-gray-800">
                  <button
                    type="button"
                    onClick={() => setUploadMode("url")}
                    className={`flex-1 cursor-pointer rounded-lg py-1 font-semibold transition-colors ${
                      uploadMode === "url"
                        ? "bg-white text-[#124d34] shadow-xs dark:bg-gray-700 dark:text-white"
                        : "text-gray-500 hover:text-gray-800 dark:text-gray-400"
                    }`}
                  >
                    Image URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadMode("file")}
                    className={`flex-1 cursor-pointer rounded-lg py-1 font-semibold transition-colors ${
                      uploadMode === "file"
                        ? "bg-white text-[#124d34] shadow-xs dark:bg-gray-700 dark:text-white"
                        : "text-gray-500 hover:text-gray-800 dark:text-gray-400"
                    }`}
                  >
                    Upload New File
                  </button>
                </div>

                {uploadMode === "file" ? (
                  <input
                    type="file"
                    accept="image/webp,image/jpeg,image/png"
                    onChange={handleFileChange}
                    className="w-full text-xs text-gray-600 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-[#124d34] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-[#0b2e1e]"
                  />
                ) : (
                  <input
                    type="text"
                    placeholder="Image URL or relative path"
                    value={formSrcUrl}
                    onChange={(e) => setFormSrcUrl(e.target.value)}
                    className="w-full rounded-xl border border-[#e6e4dc] bg-white px-3.5 py-2 text-xs text-gray-900 focus:border-[#124d34] focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                )}
              </div>

              {/* Tag / Category Badge */}
              <div>
                <label className="mb-1 block text-xs font-bold text-gray-700 dark:text-gray-300">
                  Badge Label (e.g. &quot;24/7 Janaza Care&quot;)
                </label>
                <input
                  type="text"
                  placeholder="Short gold badge tag"
                  value={formLabel}
                  onChange={(e) => setFormLabel(e.target.value)}
                  className="w-full rounded-xl border border-[#e6e4dc] bg-white px-3.5 py-2 text-xs text-gray-900 focus:border-[#124d34] focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              {/* Alt Text */}
              <div>
                <label className="mb-1 block text-xs font-bold text-gray-700 dark:text-gray-300">
                  Descriptive Alt Text *
                </label>
                <input
                  type="text"
                  required
                  value={formAlt}
                  onChange={(e) => setFormAlt(e.target.value)}
                  className="w-full rounded-xl border border-[#e6e4dc] bg-white px-3.5 py-2 text-xs text-gray-900 focus:border-[#124d34] focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              {/* Optional Title & Subtitle */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold text-gray-700 dark:text-gray-300">
                    Heading Title
                  </label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full rounded-xl border border-[#e6e4dc] bg-white px-3.5 py-2 text-xs text-gray-900 focus:border-[#124d34] focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-gray-700 dark:text-gray-300">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={formSubtitle}
                    onChange={(e) => setFormSubtitle(e.target.value)}
                    className="w-full rounded-xl border border-[#e6e4dc] bg-white px-3.5 py-2 text-xs text-gray-900 focus:border-[#124d34] focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>

              {/* Is Active */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="formIsActiveEdit"
                  checked={formIsActive}
                  onChange={(e) => setFormIsActive(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-[#124d34] focus:ring-[#124d34]"
                />
                <label
                  htmlFor="formIsActiveEdit"
                  className="text-xs font-semibold text-gray-700 dark:text-gray-300"
                >
                  Visible in rotation on homepage
                </label>
              </div>

              <div className="flex items-center justify-end gap-2.5 border-t border-[#f0eee6] pt-4 dark:border-[#1a432f]">
                <button
                  type="button"
                  onClick={() => setEditingBanner(null)}
                  className="cursor-pointer rounded-xl border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#124d34] px-5 py-2 text-xs font-bold text-white hover:bg-[#0b2e1e] disabled:opacity-50"
                >
                  {isPending && (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  )}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* Delete Confirmation Modal */}
      {/* ==================================================================== */}
      {deletingBanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-[#e6e4dc] bg-white p-6 shadow-2xl dark:border-[#1a432f] dark:bg-[#0c2419]">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-[#0b2e1e] dark:text-white">
                  Remove Hero Slide?
                </h3>
                <p className="text-xs text-gray-500">
                  This will remove the slide from the homepage rotation.
                </p>
              </div>
            </div>

            <div className="relative mb-4 aspect-[16/9] w-full overflow-hidden rounded-xl border border-gray-200">
              <Image
                src={deletingBanner.src}
                alt={deletingBanner.alt}
                fill
                className="object-cover"
              />
            </div>

            <p className="mb-5 text-xs text-gray-600 dark:text-gray-300">
              Are you sure you want to delete slide &ldquo;
              {deletingBanner.label || deletingBanner.alt}&rdquo;?
            </p>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeletingBanner(null)}
                className="cursor-pointer rounded-xl border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={handleDeleteConfirm}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-rose-600 px-5 py-2 text-xs font-bold text-white hover:bg-rose-700 disabled:opacity-50"
              >
                {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                <span>Delete Slide</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* Full Preview Modal */}
      {/* ==================================================================== */}
      {previewBanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div className="relative max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-3xl border border-white/20 bg-[#072115] shadow-2xl">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setPreviewBanner(null)}
              className="absolute top-4 right-4 z-30 cursor-pointer rounded-full bg-black/60 p-2 text-white/80 hover:bg-black/90 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Simulated Hero Section with Ambient Overlay and Scrim */}
            <div className="relative aspect-[16/9] w-full overflow-hidden">
              <Image
                src={previewBanner.src}
                alt={previewBanner.alt}
                fill
                priority
                className="object-cover"
              />

              {/* Scrim Overlay exactly matching homepage */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#04190f]/90 via-[#062416]/50 to-[#04190f]/20 sm:bg-gradient-to-r" />

              {/* Badge Preview */}
              {previewBanner.label && (
                <div className="absolute top-6 left-6 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/50 px-3.5 py-1 text-xs font-semibold text-[#d4af37] shadow-lg backdrop-blur-md">
                  <Sparkles className="h-3.5 w-3.5 text-[#d4af37]" />
                  <span>{previewBanner.label}</span>
                </div>
              )}

              {/* Overlay Content Preview */}
              <div className="absolute right-6 bottom-6 left-6 max-w-2xl text-white">
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-950/80 px-3 py-1 text-[11px] font-semibold text-[#d4af37]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#d4af37]" />
                  <span>Homepage Hero Live Preview</span>
                </div>
                {previewBanner.title && (
                  <h3 className="font-serif text-2xl font-bold text-white drop-shadow-lg sm:text-3xl">
                    {previewBanner.title}
                  </h3>
                )}
                <p className="mt-1 text-sm text-emerald-50 drop-shadow-md">
                  {previewBanner.alt}
                </p>
                {previewBanner.subtitle && (
                  <p className="mt-1 text-xs text-emerald-100/80">
                    {previewBanner.subtitle}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
