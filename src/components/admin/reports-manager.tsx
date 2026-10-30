"use client";

import * as React from "react";
import { useState, useTransition, useActionState } from "react";
import {
  uploadReportAction,
  toggleReportPublishAction,
  deleteReportAction,
} from "@/lib/admin-actions";
import {
  FileText,
  Plus,
  Eye,
  EyeOff,
  Trash2,
  ExternalLink,
  Upload,
  AlertCircle,
  CheckCircle2,
  X,
} from "lucide-react";

export interface ReportRecord {
  id: string;
  title: string;
  year: number;
  file_path: string;
  file_size: string | null;
  is_published: boolean;
  created_at?: string;
}

interface ReportsManagerProps {
  initialReports: ReportRecord[];
}

const initialFormState = {
  error: undefined,
  success: false,
};

export function ReportsManager({ initialReports }: ReportsManagerProps) {
  const [reports, setReports] = useState<ReportRecord[]>(initialReports);
  const [showUpload, setShowUpload] = useState(false);
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [isPending, startTransition] = useTransition();

  const [formState, formAction, isUploading] = useActionState(
    async (
      prevState: { error?: string; success?: boolean } | null,
      formData: FormData
    ) => {
      const res = await uploadReportAction(prevState, formData);
      if (res.success) {
        setShowUpload(false);
        const file = formData.get("file") as File | null;
        const newReport: ReportRecord = {
          id: "temp-" + Date.now(),
          title: formData.get("title") as string,
          year: parseInt(formData.get("year") as string, 10),
          file_path: file
            ? `/documents/reports/${file.name}`
            : "/documents/report.pdf",
          file_size: file
            ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
            : "1.5 MB",
          is_published: formData.get("is_published") === "on",
        };
        setReports((prev) => [newReport, ...prev]);
      }
      return res;
    },
    initialFormState
  );

  const handleTogglePublish = (id: string, currentState: boolean) => {
    startTransition(async () => {
      try {
        await toggleReportPublishAction(id, currentState);
        setReports((prev) =>
          prev.map((r) =>
            r.id === id ? { ...r, is_published: !currentState } : r
          )
        );
      } catch (err) {
        alert(
          "Failed to toggle report publish status: " + (err as Error).message
        );
      }
    });
  };

  const handleDelete = (id: string, filePath: string) => {
    if (
      !confirm(
        "Are you sure you want to permanently delete this report from database and storage?"
      )
    )
      return;
    startTransition(async () => {
      try {
        await deleteReportAction(id, filePath);
        setReports((prev) => prev.filter((r) => r.id !== id));
      } catch (err) {
        alert("Failed to delete report: " + (err as Error).message);
      }
    });
  };

  const filteredReports = reports.filter((r) => {
    if (filter === "published") return r.is_published;
    if (filter === "draft") return !r.is_published;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-[#e6e4dc] bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5">
          {[
            { key: "all" as const, label: "All Reports", count: reports.length },
            {
              key: "published" as const,
              label: "Live Published",
              count: reports.filter((r) => r.is_published).length,
            },
            {
              key: "draft" as const,
              label: "Drafts",
              count: reports.filter((r) => !r.is_published).length,
            },
          ].map((tab) => {
            const isSelected = filter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  isSelected
                    ? "bg-[#124d34] text-white shadow-2xs"
                    : "bg-[#fbfaf6] text-[#4b5563] hover:bg-[#f3f1ea] hover:text-[#1c2420]"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : "bg-[#e6e4dc] text-[#6b7280]"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Upload Button */}
        <button
          onClick={() => setShowUpload(!showUpload)}
          className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold shadow-xs transition-colors ${
            showUpload
              ? "border border-[#e6e4dc] bg-white text-[#4b5563] hover:bg-[#f3f1ea]"
              : "bg-[#124d34] text-white hover:bg-[#0b2e1e]"
          }`}
        >
          {showUpload ? (
            <>
              <X className="h-3.5 w-3.5" />
              <span>Cancel</span>
            </>
          ) : (
            <>
              <Plus className="h-3.5 w-3.5 text-[#c99a45]" />
              <span>Upload Audited PDF</span>
            </>
          )}
        </button>
      </div>

      {/* Upload Form Card */}
      {showUpload && (
        <div className="overflow-hidden rounded-2xl border border-[#e6e4dc] border-t-4 border-t-[#c99a45] bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 border-b border-[#e6e4dc] pb-4">
            <h2 className="font-serif text-lg font-bold text-[#0b2e1e]">
              Upload Audited Financial Report (PDF)
            </h2>
            <p className="mt-1 text-xs text-[#6b7280]">
              Files are securely uploaded directly to Supabase Storage and made accessible on the public transparency page.
            </p>
          </div>

          <form action={formAction} className="space-y-4">
            {formState?.error && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-800"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                <span>{formState.error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <label
                  htmlFor="title"
                  className="mb-1 block text-xs font-semibold text-[#1c2420]"
                >
                  Report Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  name="title"
                  placeholder="e.g. Annual Activities & Financial Summary Report 2025"
                  required
                  disabled={isUploading}
                  className="w-full rounded-lg border border-[#e6e4dc] bg-[#fbfaf6] px-3.5 py-2 text-xs text-[#1c2420] placeholder-[#9ca3af] transition-colors focus:border-[#124d34] focus:bg-white focus:outline-none sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="year"
                  className="mb-1 block text-xs font-semibold text-[#1c2420]"
                >
                  Fiscal / Audit Year <span className="text-red-500">*</span>
                </label>
                <input
                  id="year"
                  name="year"
                  type="number"
                  min={2020}
                  max={2030}
                  defaultValue={2025}
                  required
                  disabled={isUploading}
                  className="w-full rounded-lg border border-[#e6e4dc] bg-[#fbfaf6] px-3 py-2 text-xs text-[#1c2420] transition-colors focus:border-[#124d34] focus:bg-white focus:outline-none sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="file"
                className="mb-1 block text-xs font-semibold text-[#1c2420]"
              >
                Audited Document (.pdf only, max 20MB) <span className="text-red-500">*</span>
              </label>
              <div className="rounded-xl border border-dashed border-[#cbd5e1] bg-[#fbfaf6] p-4 text-center">
                <Upload className="mx-auto h-8 w-8 text-[#9ca3af]" />
                <div className="mt-2">
                  <input
                    id="file"
                    name="file"
                    type="file"
                    accept="application/pdf"
                    required
                    disabled={isUploading}
                    className="cursor-pointer text-xs text-[#4b5563] file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-[#124d34] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-[#0b2e1e]"
                  />
                </div>
                <p className="mt-1 text-[11px] text-[#9ca3af]">
                  PDF format required for official public transparency records
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 rounded-lg border border-[#e6e4dc] bg-[#fbfaf6] p-3">
              <input
                id="is_published"
                name="is_published"
                type="checkbox"
                defaultChecked
                disabled={isUploading}
                className="h-4 w-4 cursor-pointer rounded border-[#cbd5e1] text-[#124d34] focus:ring-[#124d34]"
              />
              <label
                htmlFor="is_published"
                className="cursor-pointer text-xs font-medium text-[#1c2420] select-none"
              >
                Publish immediately to public reports repository
              </label>
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowUpload(false)}
                disabled={isUploading}
                className="cursor-pointer rounded-lg border border-[#e6e4dc] bg-white px-3.5 py-2 text-xs font-semibold text-[#4b5563] shadow-2xs hover:bg-[#f3f1ea] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUploading}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#124d34] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#0b2e1e] disabled:opacity-50"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-[#c99a45]" />
                <span>
                  {isUploading ? "Uploading to Storage..." : "Upload & Register Report"}
                </span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reports List */}
      {filteredReports.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#e6e4dc] bg-white p-12 text-center">
          <p className="font-serif text-base font-bold text-[#0b2e1e]">
            No reports registered
          </p>
          <p className="mt-1 text-xs text-[#6b7280]">
            No audited financial records are currently filed under &ldquo;{filter}&rdquo;.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReports.map((item) => (
            <div
              key={item.id}
              className={`overflow-hidden rounded-2xl border bg-white shadow-xs transition-all ${
                item.is_published
                  ? "border-[#124d34]/30"
                  : "border-[#e6e4dc] opacity-80"
              }`}
            >
              <div className="flex flex-col gap-4 border-b border-[#f3f1ea] bg-[#fbfaf6] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-700">
                    <FileText className="h-6 w-6" />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-serif text-base font-bold text-[#0b2e1e]">
                        {item.title}
                      </span>

                      {/* Year Badge */}
                      <span className="rounded-full bg-[#f5eedf] px-2.5 py-0.5 font-serif text-[11px] font-bold text-[#8b651e] ring-1 ring-[#c99a45]/30">
                        {item.year} Audit
                      </span>

                      {/* Publication Status */}
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                          item.is_published
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {item.is_published ? (
                          <>
                            <Eye className="h-3 w-3 text-emerald-700" />
                            <span>Publicly Visible</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-3 w-3 text-gray-500" />
                            <span>Draft / Unlisted</span>
                          </>
                        )}
                      </span>
                    </div>

                    <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-[#6b7280]">
                      {item.file_size && (
                        <span className="rounded bg-white px-2 py-0.5 font-mono text-[11px] text-[#4b5563] shadow-2xs">
                          {item.file_size}
                        </span>
                      )}

                      <a
                        href={item.file_path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-semibold text-[#124d34] hover:underline"
                      >
                        <span>Open / Download PDF Document</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-2 sm:self-center">
                  <button
                    disabled={isPending}
                    onClick={() =>
                      handleTogglePublish(item.id, item.is_published)
                    }
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#e6e4dc] bg-white px-3 py-1.5 text-xs font-semibold text-[#1c2420] shadow-2xs hover:bg-[#fbfaf6] disabled:opacity-50"
                  >
                    {item.is_published ? (
                      <>
                        <EyeOff className="h-3.5 w-3.5 text-[#6b7280]" />
                        <span>Unpublish</span>
                      </>
                    ) : (
                      <>
                        <Eye className="h-3.5 w-3.5 text-[#124d34]" />
                        <span>Publish</span>
                      </>
                    )}
                  </button>

                  <button
                    disabled={isPending}
                    onClick={() => handleDelete(item.id, item.file_path)}
                    className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-red-200 bg-white px-2 py-1.5 text-xs font-medium text-red-600 shadow-2xs hover:bg-red-50 disabled:opacity-50"
                    title="Delete permanently"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
