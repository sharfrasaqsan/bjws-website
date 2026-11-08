"use client";

import * as React from "react";
import { useState, useRef } from "react";
import { UploadCloud, CheckCircle2, Loader2 } from "lucide-react";
import { uploadSingleImageAction } from "@/lib/admin-actions";

interface SingleImageDropzoneProps {
  value: string;
  onChange: (url: string) => void;
  folder?: "gallery" | "news" | "team" | "general";
  label?: string;
  helperText?: string;
  name?: string;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

/**
 * Client-side Canvas WebP compressor for single images
 */
async function compressImage(file: File, maxDim: number = 1920): Promise<Blob> {
  if (!file.type.startsWith("image/")) return file;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error("Failed to load image"));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
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

        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob && blob.size < file.size) {
              resolve(blob);
            } else {
              resolve(file);
            }
          },
          "image/webp",
          0.85
        );
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export function SingleImageDropzone({
  value,
  onChange,
  folder = "gallery",
  label = "Upload Image",
  helperText = "Drag & drop an image or click to browse (auto-compressed to WebP)",
  name,
}: SingleImageDropzoneProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showManualInput, setShowManualInput] = useState<boolean>(false);
  const [compressionStats, setCompressionStats] = useState<{
    original: number;
    compressed: number;
  } | null>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image (JPG, PNG, WebP).");
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      const compressedBlob = await compressImage(file, 1920);
      const cleanFileName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
      const fileToUpload = new File([compressedBlob], cleanFileName, {
        type: "image/webp",
      });

      setCompressionStats({
        original: file.size,
        compressed: compressedBlob.size,
      });

      const formData = new FormData();
      formData.append("file", fileToUpload);
      formData.append("folder", folder);

      const res = await uploadSingleImageAction(formData);

      if (res.error) {
        setError(res.error);
      } else if (res.url) {
        onChange(res.url);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload failed.";
      setError(msg);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      {name && <input type="hidden" name={name} value={value} />}
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-text-muted block text-xs font-bold tracking-wider uppercase">
            {label}
          </label>
          <button
            type="button"
            onClick={() => setShowManualInput(!showManualInput)}
            className="text-primary text-[11px] font-semibold hover:underline"
          >
            {showManualInput ? "Use Dropzone" : "Paste URL / Path"}
          </button>
        </div>
      )}

      {error && (
        <p className="rounded-lg bg-rose-50 p-2 text-xs font-semibold text-rose-600">
          {error}
        </p>
      )}

      {/* Manual text input if toggled */}
      {showManualInput ? (
        <div className="space-y-1.5">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="e.g. /images/gallery/photo.webp or https://..."
            className="border-border bg-background text-text focus:border-primary w-full rounded-xl border px-3 py-2 text-xs focus:outline-none"
          />
        </div>
      ) : value ? (
        /* Image Preview Box with Replace / Remove controls */
        <div className="bg-background border-border flex items-center gap-3 rounded-2xl border p-3">
          <div className="border-border relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border bg-black/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Preview"
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Image Attached</span>
            </div>
            <p className="text-text-muted mt-0.5 truncate font-mono text-[11px]">
              {value}
            </p>
            {compressionStats &&
              compressionStats.original > compressionStats.compressed && (
                <span className="mt-1 inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  Auto-WebP: {formatBytes(compressionStats.original)} →{" "}
                  {formatBytes(compressionStats.compressed)} (-
                  {Math.round(
                    ((compressionStats.original - compressionStats.compressed) /
                      compressionStats.original) *
                      100
                  )}
                  %)
                </span>
              )}
            <div className="mt-1.5 flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="text-primary cursor-pointer text-[11px] font-semibold hover:underline"
              >
                Change Photo
              </button>
              <span className="text-text-muted/40">•</span>
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setCompressionStats(null);
                }}
                disabled={isUploading}
                className="cursor-pointer text-[11px] font-semibold text-rose-600 hover:underline"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty Drag & Drop Dropzone */
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDragging(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              handleFile(e.dataTransfer.files[0]);
            }
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-4 text-center transition-all sm:p-5 ${
            isDragging
              ? "border-primary bg-primary/5"
              : "hover:border-primary/60 border-[#d8d5cb] hover:bg-[#faf9f5]"
          }`}
        >
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-[#f3f1ea] text-[#124d34]">
            {isUploading ? (
              <Loader2 className="text-primary h-5 w-5 animate-spin" />
            ) : (
              <UploadCloud className="h-5 w-5" />
            )}
          </div>

          <p className="text-text text-xs font-bold">
            {isUploading
              ? "Compressing & Uploading..."
              : "Click to select or drag photo here"}
          </p>
          <p className="text-text-muted mt-0.5 max-w-xs text-[11px]">
            {helperText}
          </p>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
      />
    </div>
  );
}
