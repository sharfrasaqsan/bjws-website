"use client";

import * as React from "react";
import { useState, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { type GalleryCategory } from "@/content/gallery";
import { batchUploadGalleryAction } from "@/lib/admin-actions";
import {
  UploadCloud,
  X,
  CheckCircle2,
  AlertCircle,
  FileImage,
  Sparkles,
  Loader2,
  Trash2,
} from "lucide-react";

interface BatchItem {
  id: string;
  originalFile: File;
  compressedBlob: Blob;
  previewUrl: string;
  name: string;
  originalSize: number;
  compressedSize: number;
  caption: string;
}

interface BatchGalleryUploaderProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (count: number) => void;
  existingCategories?: Array<{ key: string; label: string }>;
}

/**
 * Client-side Canvas compressor:
 * Converts raw smartphone photos (often 5-15MB) into lightweight WebP (150-250KB)
 * directly in the browser within milliseconds.
 */
async function compressImageInBrowser(
  file: File,
  maxDimension: number = 1920,
  quality: number = 0.85
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    // If not an image, return raw
    if (!file.type.startsWith("image/")) {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error("Failed to load image into memory"));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Downscale if exceeds maxDimension
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          resolve(file);
          return;
        }

        // Draw image smoothly
        ctx.drawImage(img, 0, 0, width, height);

        // Export as WebP
        canvas.toBlob(
          (blob) => {
            if (blob && blob.size < file.size) {
              resolve(blob);
            } else {
              // Fallback to original if compression doesn't decrease size
              resolve(file);
            }
          },
          "image/webp",
          quality
        );
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export function BatchGalleryUploader({
  isOpen,
  onClose,
  onSuccess,
  existingCategories = [],
}: BatchGalleryUploaderProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [items, setItems] = useState<BatchItem[]>([]);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  // Batch Form State
  const initialCategory =
    existingCategories.length > 0 ? existingCategories[0].key : "";
  const [category, setCategory] = useState<string>(initialCategory);
  const [isCustomCategory, setIsCustomCategory] = useState<boolean>(
    existingCategories.length === 0
  );
  const [customCategoryInput, setCustomCategoryInput] = useState<string>("");
  const [location, setLocation] = useState<string>("Mullipothana");
  const [commonCaption, setCommonCaption] = useState<string>("");
  const [approved, setApproved] = useState<boolean>(true);

  // Upload Progress & Errors
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successCount, setSuccessCount] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleFiles = async (fileList: FileList | File[]) => {
    setErrorMsg(null);
    setSuccessCount(null);
    const filesArray = Array.from(fileList).filter((f) =>
      f.type.startsWith("image/")
    );

    if (filesArray.length === 0) {
      setErrorMsg("Please select valid image files (JPG, PNG, WebP).");
      return;
    }

    setIsCompressing(true);

    const newItems: BatchItem[] = [];
    for (let i = 0; i < filesArray.length; i++) {
      const file = filesArray[i];
      try {
        const compressedBlob = await compressImageInBrowser(file, 1920, 0.85);
        const previewUrl = URL.createObjectURL(compressedBlob);
        const cleanName = file.name
          .replace(/\.[^/.]+$/, "")
          .replace(/[-_]+/g, " ")
          .replace(/\s+/g, " ")
          .trim();

        const defaultCaption = commonCaption.trim()
          ? `${commonCaption.trim()} (${items.length + i + 1})`
          : cleanName;

        newItems.push({
          id: `batch-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`,
          originalFile: file,
          compressedBlob,
          previewUrl,
          name: file.name,
          originalSize: file.size,
          compressedSize: compressedBlob.size,
          caption: defaultCaption,
        });
      } catch (err) {
        console.warn(`Compression error for ${file.name}:`, err);
      }
    }

    setItems((prev) => [...prev, ...newItems]);
    setIsCompressing(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((item) => item.id !== id);
    });
  };

  const handleClearAll = () => {
    items.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    setItems([]);
    setErrorMsg(null);
    setSuccessCount(null);
  };

  const handleUpdateItemCaption = (id: string, newCaption: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, caption: newCaption } : item
      )
    );
  };

  const handleApplyCommonTitle = () => {
    const prefix = commonCaption.trim();
    if (!prefix) return;
    setItems((prev) =>
      prev.map((item, idx) => ({
        ...item,
        caption: prev.length === 1 ? prefix : `${prefix} (${idx + 1})`,
      }))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setErrorMsg("Please add at least one photo before uploading.");
      return;
    }

    setErrorMsg(null);

    startTransition(async () => {
      try {
        const formData = new FormData();

        // Convert compressed blobs to files with individual captions
        items.forEach((item, index) => {
          const extension = item.name.split(".").pop() || "webp";
          const baseName = item.name.replace(/\.[^/.]+$/, "");
          const cleanFileName = `${baseName}-${index + 1}.${
            extension === "png" || extension === "jpeg" || extension === "jpg"
              ? "webp"
              : extension
          }`;
          const fileToUpload = new File([item.compressedBlob], cleanFileName, {
            type: item.compressedBlob.type || "image/webp",
          });
          formData.append("files", fileToUpload);
          formData.append("captions", item.caption.trim() || item.name);
        });

        const finalCategory =
          isCustomCategory || !category
            ? customCategoryInput
                .trim()
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "") || "general"
            : category;

        formData.append("category", finalCategory);
        formData.append("location", location);
        formData.append("captionPrefix", commonCaption);
        formData.append("approved", approved ? "true" : "false");

        const res = await batchUploadGalleryAction(formData);

        if (res.error) {
          setErrorMsg(res.error);
        } else {
          setSuccessCount(res.count || items.length);
          items.forEach((item) => URL.revokeObjectURL(item.previewUrl));
          setItems([]);
          router.refresh();
          if (onSuccess) {
            onSuccess(res.count || items.length);
          }
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Batch upload failed.";
        setErrorMsg(msg);
      }
    });
  };

  const totalOriginalSize = items.reduce((acc, cur) => acc + cur.originalSize, 0);
  const totalCompressedSize = items.reduce(
    (acc, cur) => acc + cur.compressedSize,
    0
  );
  const percentSaved =
    totalOriginalSize > 0
      ? Math.round(
          ((totalOriginalSize - totalCompressedSize) / totalOriginalSize) * 100
        )
      : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-6 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl border border-border bg-surface p-5 sm:p-8 shadow-2xl my-6 max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isPending}
          className="absolute right-5 top-5 rounded-full p-2 text-text-muted hover:bg-background hover:text-text transition-colors disabled:opacity-30 cursor-pointer"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-border pb-4 shrink-0">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#124d34] text-white shadow-xs">
            <UploadCloud className="h-6 w-6 text-[#d4af37]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-lg sm:text-xl font-bold text-text">
                Batch Upload Gallery Photos
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-600/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                <Sparkles className="h-3 w-3" />
                Auto-WebP
              </span>
            </div>
            <p className="text-xs text-text-muted">
              Select multiple photos at once. You can edit individual titles for every photo below.
            </p>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto py-5 space-y-5">
          {/* Success Banner */}
          {successCount !== null && (
            <div className="flex items-center justify-between rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 p-4 border border-emerald-600/30 text-emerald-800 dark:text-emerald-200">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold">
                    Successfully Uploaded {successCount} Photos!
                  </h4>
                  <p className="text-xs opacity-90">
                    The gallery has been refreshed and updated with all new photos.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-1.5 text-xs font-semibold shadow-xs cursor-pointer"
              >
                Done
              </button>
            </div>
          )}

          {/* Error Banner */}
          {errorMsg && (
            <div className="flex items-center gap-2 rounded-2xl bg-rose-50 dark:bg-rose-950/40 p-4 text-xs font-semibold text-rose-700 dark:text-rose-300 border border-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Drag & Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 sm:p-8 text-center cursor-pointer transition-all ${
              isDragging
                ? "border-primary bg-primary/5 scale-[1.005]"
                : "border-[#d8d5cb] hover:border-primary/60 hover:bg-[#faf9f5]"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files) handleFiles(e.target.files);
              }}
            />

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f3f1ea] group-hover:bg-[#e8f3ee] text-[#124d34] transition-colors mb-3">
              {isCompressing ? (
                <Loader2 className="h-7 w-7 animate-spin text-primary" />
              ) : (
                <UploadCloud className="h-7 w-7" />
              )}
            </div>

            <h3 className="text-sm sm:text-base font-bold text-text">
              {isCompressing
                ? "Optimizing and converting images to WebP..."
                : "Drag & drop photos here, or click to browse"}
            </h3>
            <p className="mt-1 text-xs text-text-muted max-w-md">
              Supports selecting 50+ photos at once (JPG, PNG, WebP). Automatic client-side compression reduces bandwidth by ~90%.
            </p>
          </div>

          {/* Common Event Title Helper */}
          <div className="rounded-2xl border border-border bg-surface p-4 space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-text-muted">
                Common Event Name (Optional Prefix)
              </label>
              {items.length > 0 && commonCaption.trim() && (
                <button
                  type="button"
                  onClick={handleApplyCommonTitle}
                  className="text-[11px] font-bold text-primary hover:underline cursor-pointer flex items-center gap-1"
                >
                  <span>Apply to All {items.length} Photos</span>
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={commonCaption}
                onChange={(e) => setCommonCaption(e.target.value)}
                placeholder="e.g. Mahallah Cemetery Annual Shramadhana"
                disabled={isPending}
                className="flex-1 rounded-xl border border-border bg-background px-3.5 py-2 text-xs sm:text-sm text-text focus:border-primary focus:outline-none"
              />
              {items.length > 0 && (
                <button
                  type="button"
                  onClick={handleApplyCommonTitle}
                  disabled={!commonCaption.trim() || isPending}
                  className="rounded-xl border border-primary/40 bg-primary/10 hover:bg-primary/20 text-primary px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-colors disabled:opacity-40 cursor-pointer"
                >
                  Apply to All
                </button>
              )}
            </div>
            <p className="text-[11px] text-text-muted">
              You can type a common title and click &quot;Apply to All&quot;, or customize individual titles for each photo below.
            </p>
          </div>

          {/* Selected Photos List with Individual Titles */}
          {items.length > 0 && (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border pb-2">
                <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-text">
                  <FileImage className="h-4 w-4 text-primary" />
                  <span>
                    {items.length} {items.length === 1 ? "Photo" : "Photos"} Selected
                  </span>
                  <span className="text-text-muted font-normal">
                    ({formatBytes(totalCompressedSize)})
                  </span>
                  {percentSaved > 0 && (
                    <span className="rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 px-2 py-0.5 text-[10px] font-bold">
                      Saved {percentSaved}% ({formatBytes(totalOriginalSize)} → {formatBytes(totalCompressedSize)})
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleClearAll}
                  disabled={isPending}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors self-start sm:self-auto cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Clear All</span>
                </button>
              </div>

              {/* Photos with individual caption inputs */}
              <div className="max-h-72 overflow-y-auto space-y-2.5 p-2 rounded-2xl bg-background border border-border">
                {items.map((item, idx) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-surface border border-border hover:border-primary/40 transition-colors"
                  >
                    {/* Thumbnail */}
                    <div className="relative h-14 w-18 shrink-0 rounded-lg overflow-hidden border border-border bg-black/5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.previewUrl}
                        alt={item.caption || item.name}
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute top-1 left-1 rounded bg-black/75 px-1 py-0.2 text-[9px] font-bold text-white">
                        #{idx + 1}
                      </span>
                    </div>

                    {/* Caption Input & File Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted truncate">
                          Photo #{idx + 1} Event Title / Caption *
                        </label>
                        <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 shrink-0">
                          {formatBytes(item.compressedSize)}
                        </span>
                      </div>
                      <input
                        type="text"
                        value={item.caption}
                        onChange={(e) =>
                          handleUpdateItemCaption(item.id, e.target.value)
                        }
                        placeholder="Enter specific event title for this photo..."
                        required
                        disabled={isPending}
                        className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-text placeholder:text-text-muted/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>

                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={isPending}
                      className="rounded-lg p-2 text-text-muted hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors shrink-0 cursor-pointer"
                      title="Remove photo"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Batch Settings Form */}
          <form
            id="batch-upload-form"
            onSubmit={handleSubmit}
            className="space-y-4 pt-2 border-t border-border"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Category */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted">
                    Album Category *
                  </label>
                  {existingCategories.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomCategory(!isCustomCategory);
                        setCustomCategoryInput("");
                      }}
                      className="text-[11px] font-semibold text-primary hover:underline cursor-pointer"
                    >
                      {isCustomCategory ? "Choose Existing" : "+ New Category"}
                    </button>
                  )}
                </div>
                {isCustomCategory || existingCategories.length === 0 ? (
                  <input
                    type="text"
                    value={customCategoryInput}
                    onChange={(e) => setCustomCategoryInput(e.target.value)}
                    placeholder="e.g. Ramadan Relief 2026"
                    required
                    disabled={isPending}
                    className="w-full rounded-xl border border-primary bg-background px-3 py-2 text-xs text-text focus:border-primary focus:outline-none"
                  />
                ) : (
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as GalleryCategory)}
                    disabled={isPending}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-text focus:border-primary focus:outline-none"
                  >
                    {existingCategories.map((cat) => (
                      <option key={cat.key} value={cat.key}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5">
                  Location *
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  disabled={isPending}
                  required
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-text focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            {/* Approved Toggle */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="batch-approved"
                checked={approved}
                onChange={(e) => setApproved(e.target.checked)}
                disabled={isPending}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
              />
              <label
                htmlFor="batch-approved"
                className="text-xs font-semibold text-text cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Approve all photos for immediate public display on website</span>
              </label>
            </div>
          </form>
        </div>

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between border-t border-border pt-4 shrink-0">
          <div className="text-xs text-text-muted">
            {items.length > 0 ? (
              <span>
                Ready to upload {items.length}{" "}
                {items.length === 1 ? "photo" : "photos"}
              </span>
            ) : (
              <span>No photos selected yet</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-text hover:bg-background transition-colors disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="batch-upload-form"
              disabled={isPending || items.length === 0}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0b2e1e] hover:bg-[#124d34] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all disabled:opacity-50 cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-[#d4af37]" />
                  <span>Uploading {items.length} Photos...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="h-4 w-4 text-[#d4af37]" />
                  <span>
                    Upload {items.length > 0 ? `${items.length} Photos` : "Photos"}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
