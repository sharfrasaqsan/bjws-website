"use client";

import * as React from "react";
import { useState, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { GALLERY_CATEGORIES, type GalleryCategory } from "@/content/gallery";
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
}

interface BatchGalleryUploaderProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (count: number) => void;
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
}: BatchGalleryUploaderProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [items, setItems] = useState<BatchItem[]>([]);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  // Batch Form State
  const [category, setCategory] = useState<GalleryCategory>("cemetery-shramadana");
  const [isCustomCategory, setIsCustomCategory] = useState<boolean>(false);
  const [customCategoryInput, setCustomCategoryInput] = useState<string>("");
  const [date, setDate] = useState<string>(new Date().getFullYear().toString());
  const [location, setLocation] = useState<string>("Mullipothana");
  const [captionPrefix, setCaptionPrefix] = useState<string>("");
  const [approved, setApproved] = useState<boolean>(true);
  const [consentNotes, setConsentNotes] = useState<string>("");

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

        newItems.push({
          id: `batch-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`,
          originalFile: file,
          compressedBlob,
          previewUrl,
          name: file.name,
          originalSize: file.size,
          compressedSize: compressedBlob.size,
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

        // Convert compressed blobs to files
        items.forEach((item, index) => {
          const extension = item.name.split(".").pop() || "webp";
          const baseName = item.name.replace(/\.[^/.]+$/, "");
          const cleanFileName = `${baseName}-${index + 1}.${extension === "png" || extension === "jpeg" || extension === "jpg" ? "webp" : extension}`;
          const fileToUpload = new File([item.compressedBlob], cleanFileName, {
            type: item.compressedBlob.type || "image/webp",
          });
          formData.append("files", fileToUpload);
        });

        const finalCategory = isCustomCategory
          ? customCategoryInput
              .trim()
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-+|-+$/g, "") || "general"
          : category;

        formData.append("category", finalCategory);
        formData.append("date", date);
        formData.append("location", location);
        formData.append("captionPrefix", captionPrefix);
        formData.append("approved", approved ? "true" : "false");
        formData.append("consentNotes", consentNotes);

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
  const totalCompressedSize = items.reduce((acc, cur) => acc + cur.compressedSize, 0);
  const percentSaved =
    totalOriginalSize > 0
      ? Math.round(((totalOriginalSize - totalCompressedSize) / totalOriginalSize) * 100)
      : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-6 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl border border-border bg-surface p-5 sm:p-8 shadow-2xl my-6 max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isPending}
          className="absolute right-5 top-5 rounded-full p-2 text-text-muted hover:bg-background hover:text-text transition-colors disabled:opacity-30"
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
              Select 10, 50, or more photos at once. Photos are automatically compressed to fast WebP before upload.
            </p>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto py-5 space-y-6">
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
                className="rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-1.5 text-xs font-semibold shadow-xs"
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

          {/* Selected Photos List & Compression Stats */}
          {items.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-text">
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
                  className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Clear All</span>
                </button>
              </div>

              {/* Thumbnails Grid Preview */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 max-h-56 overflow-y-auto p-2 rounded-2xl bg-background border border-border">
                {items.map((item, idx) => (
                  <div
                    key={item.id}
                    className="group/item relative aspect-4/3 rounded-xl overflow-hidden border border-border bg-black/5"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.previewUrl}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />

                    {/* Sequential badge */}
                    <span className="absolute top-1 left-1 rounded-md bg-black/70 px-1.5 py-0.5 text-[9px] font-bold text-white">
                      #{idx + 1}
                    </span>

                    {/* Size badge */}
                    <span className="absolute bottom-1 left-1 rounded-md bg-black/70 px-1.5 py-0.5 text-[9px] font-mono text-emerald-300">
                      {formatBytes(item.compressedSize)}
                    </span>

                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={isPending}
                      className="absolute top-1 right-1 rounded-full bg-black/70 p-1 text-white hover:bg-rose-600 transition-colors opacity-0 group-hover/item:opacity-100"
                      aria-label="Remove photo"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Batch Settings Form */}
          <form id="batch-upload-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Category */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted">
                    Album Category *
                  </label>
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
                </div>
                {isCustomCategory ? (
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
                    {GALLERY_CATEGORIES.map((cat) => (
                      <option key={cat.key} value={cat.key}>
                        {cat.key.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Year / Date */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5">
                  Year / Date *
                </label>
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  disabled={isPending}
                  required
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-text focus:border-primary focus:outline-none"
                />
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

            {/* Common Caption / Prefix */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5">
                Common Caption / Event Title
              </label>
              <input
                type="text"
                value={captionPrefix}
                onChange={(e) => setCaptionPrefix(e.target.value)}
                disabled={isPending}
                placeholder="e.g. Mahallah Cemetery Shramadana volunteer cleanup drive"
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs sm:text-sm text-text focus:border-primary focus:outline-none"
              />
              <p className="text-[11px] text-text-muted mt-1">
                Sequential numbers will be added automatically, e.g. &quot;{captionPrefix || "Photo"} (1)&quot;, &quot;{captionPrefix || "Photo"} (2)&quot;.
              </p>
            </div>

            {/* Privacy & Consent Notes */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5">
                Privacy & Consent Verification Notes
              </label>
              <input
                type="text"
                value={consentNotes}
                onChange={(e) => setConsentNotes(e.target.value)}
                disabled={isPending}
                placeholder="e.g. Consent verified for community volunteers. No sensitive burial rites shown."
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-text focus:border-primary focus:outline-none"
              />
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
              <span>Ready to upload {items.length} {items.length === 1 ? "photo" : "photos"}</span>
            ) : (
              <span>No photos selected yet</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-text hover:bg-background transition-colors disabled:opacity-50"
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
                  <span>Upload {items.length > 0 ? `${items.length} Photos` : "Photos"}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

