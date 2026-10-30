"use client";

import * as React from "react";
import { useState, useTransition, useActionState } from "react";
import {
  uploadReportAction,
  toggleReportPublishAction,
  deleteReportAction,
} from "@/lib/admin-actions";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";

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
        "Are you sure you want to delete this report from database and storage?"
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

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="border-border flex items-center justify-between border-b pb-4">
        <div>
          <span className="text-text-muted text-xs font-semibold">
            Audited Reports: {reports.length}
          </span>
        </div>
        <Button
          variant={showUpload ? "outline" : "primary"}
          size="sm"
          onClick={() => setShowUpload(!showUpload)}
        >
          {showUpload ? "Cancel" : "+ Upload Audited Report (PDF)"}
        </Button>
      </div>

      {/* Upload Form Card */}
      {showUpload && (
        <Card className="border-primary/30 bg-surface p-6 shadow-xs">
          <CardHeader className="border-border mb-4 border-b p-0 pb-4">
            <CardTitle as="h2" className="text-base">
              Upload Official PDF to Supabase Storage
            </CardTitle>
            <p className="text-text-muted text-xs">
              PDFs are uploaded directly to the secured &apos;reports&apos;
              bucket and registered in the database.
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <form action={formAction} className="space-y-4">
              {formState?.error && (
                <div
                  role="alert"
                  className="border-destructive/30 text-destructive rounded-lg border bg-red-50 p-3 text-xs font-medium"
                >
                  {formState.error}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <FormField id="title" label="Report Title" required>
                    <Input
                      id="title"
                      name="title"
                      placeholder="e.g. Annual Activities & Financial Summary Report 2025"
                      required
                      disabled={isUploading}
                    />
                  </FormField>
                </div>

                <div>
                  <FormField id="year" label="Audit Year" required>
                    <Input
                      id="year"
                      name="year"
                      type="number"
                      min={2023}
                      max={2030}
                      defaultValue={2025}
                      required
                      disabled={isUploading}
                    />
                  </FormField>
                </div>
              </div>

              <FormField
                id="file"
                label="Select Audited PDF Document"
                required
                hint="Only .pdf files up to 20MB are permitted."
              >
                <input
                  id="file"
                  name="file"
                  type="file"
                  accept="application/pdf"
                  required
                  disabled={isUploading}
                  className="text-text file:bg-primary file:text-primary-foreground w-full cursor-pointer text-xs file:mr-4 file:rounded-md file:border-0 file:px-4 file:py-2 file:text-xs file:font-semibold hover:file:opacity-90"
                />
              </FormField>

              <div className="flex items-center gap-2 pt-1">
                <input
                  id="is_published"
                  name="is_published"
                  type="checkbox"
                  defaultChecked
                  disabled={isUploading}
                  className="border-border text-primary focus:ring-primary h-4 w-4 cursor-pointer rounded"
                />
                <label
                  htmlFor="is_published"
                  className="text-text cursor-pointer text-xs font-medium select-none sm:text-sm"
                >
                  Publish immediately to public website
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowUpload(false)}
                  disabled={isUploading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={isUploading}
                >
                  Upload & Register Report
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Reports List */}
      {reports.length === 0 ? (
        <div className="border-border text-text-muted rounded-xl border border-dashed p-12 text-center">
          <p className="text-sm">No audited reports registered yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((item) => (
            <div
              key={item.id}
              className="border-border bg-surface rounded-xl border p-5 transition-shadow"
            >
              <div className="mb-3 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="mb-1.5 flex items-center gap-2">
                    <Badge variant="primary" size="sm">
                      {item.year} Audit
                    </Badge>
                    <span className="text-text text-base font-bold">
                      {item.title}
                    </span>
                    <Badge
                      variant={item.is_published ? "primary" : "outline"}
                      size="sm"
                    >
                      {item.is_published ? "Published" : "Draft"}
                    </Badge>
                  </div>
                  <div className="text-text-muted flex flex-wrap items-center gap-3 text-xs">
                    {item.file_size && <span>File size: {item.file_size}</span>}
                    <span>•</span>
                    <a
                      href={item.file_path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary inline-flex items-center gap-1 font-medium hover:underline"
                    >
                      <span>Download PDF</span>
                      <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isPending}
                    onClick={() =>
                      handleTogglePublish(item.id, item.is_published)
                    }
                    className="h-8 px-2.5 text-xs"
                  >
                    {item.is_published ? "Unpublish" : "Publish"}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={isPending}
                    onClick={() => handleDelete(item.id, item.file_path)}
                    className="h-8 px-2.5 text-xs"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
