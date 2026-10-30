"use client";

import * as React from "react";
import { useState, useTransition, useActionState } from "react";
import {
  createNoticeAction,
  toggleNoticePublishAction,
  deleteNoticeAction,
} from "@/lib/admin-actions";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/form-field";

export interface NoticeRecord {
  id: string;
  title: string;
  body: string;
  locale: string;
  published_at: string;
  is_published: boolean;
  created_at?: string;
}

interface NoticesManagerProps {
  initialNotices: NoticeRecord[];
}

const initialFormState = {
  error: undefined,
  success: false,
};

export function NoticesManager({ initialNotices }: NoticesManagerProps) {
  const [notices, setNotices] = useState<NoticeRecord[]>(initialNotices);
  const [showCreate, setShowCreate] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [formState, formAction, isFormSubmitting] = useActionState(
    async (
      prevState: { error?: string; success?: boolean } | null,
      formData: FormData
    ) => {
      const res = await createNoticeAction(prevState, formData);
      if (res.success) {
        setShowCreate(false);
        const newNotice: NoticeRecord = {
          id: "temp-" + Date.now(),
          title: formData.get("title") as string,
          body: formData.get("body") as string,
          locale: (formData.get("locale") as string) || "ta",
          published_at: new Date().toISOString(),
          is_published: formData.get("is_published") === "on",
        };
        setNotices((prev) => [newNotice, ...prev]);
      }
      return res;
    },
    initialFormState
  );

  const handleTogglePublish = (id: string, currentState: boolean) => {
    startTransition(async () => {
      try {
        await toggleNoticePublishAction(id, currentState);
        setNotices((prev) =>
          prev.map((n) =>
            n.id === id ? { ...n, is_published: !currentState } : n
          )
        );
      } catch (err) {
        alert("Failed to toggle publish status: " + (err as Error).message);
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this notice?")) return;
    startTransition(async () => {
      try {
        await deleteNoticeAction(id);
        setNotices((prev) => prev.filter((n) => n.id !== id));
      } catch (err) {
        alert("Failed to delete notice: " + (err as Error).message);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="border-border flex items-center justify-between border-b pb-4">
        <div>
          <span className="text-text-muted text-xs font-semibold">
            Total Notices: {notices.length}
          </span>
        </div>
        <Button
          variant={showCreate ? "outline" : "primary"}
          size="sm"
          onClick={() => setShowCreate(!showCreate)}
        >
          {showCreate ? "Cancel" : "+ New Notice"}
        </Button>
      </div>

      {/* Notice Creation Form Accordion/Card */}
      {showCreate && (
        <Card className="border-primary/30 bg-surface p-6 shadow-xs">
          <CardHeader className="border-border mb-4 border-b p-0 pb-4">
            <CardTitle as="h2" className="text-base">
              Create Community Announcement
            </CardTitle>
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
                  <FormField id="title" label="Announcement Title" required>
                    <Input
                      id="title"
                      name="title"
                      placeholder="e.g. Annual Cemetery Shramadhana Program"
                      required
                      disabled={isFormSubmitting}
                    />
                  </FormField>
                </div>

                <div>
                  <FormField id="locale" label="Language Target" required>
                    <select
                      id="locale"
                      name="locale"
                      className="border-border bg-surface text-text focus:border-primary focus:ring-primary w-full rounded-lg border px-3 py-2 text-xs focus:ring-1 sm:text-sm"
                      disabled={isFormSubmitting}
                      defaultValue="ta"
                    >
                      <option value="ta">Tamil (தமிழ்)</option>
                      <option value="en">English</option>
                      <option value="si">Sinhala (සිංහල)</option>
                    </select>
                  </FormField>
                </div>
              </div>

              <FormField id="body" label="Announcement Details" required>
                <Textarea
                  id="body"
                  name="body"
                  rows={4}
                  placeholder="Provide full description, date, time, and instructions for community members..."
                  required
                  disabled={isFormSubmitting}
                />
              </FormField>

              <div className="flex items-center gap-2 pt-1">
                <input
                  id="is_published"
                  name="is_published"
                  type="checkbox"
                  defaultChecked
                  disabled={isFormSubmitting}
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
                  onClick={() => setShowCreate(false)}
                  disabled={isFormSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={isFormSubmitting}
                >
                  Save & Publish Notice
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Notices List */}
      {notices.length === 0 ? (
        <div className="border-border text-text-muted rounded-xl border border-dashed p-12 text-center">
          <p className="text-sm">No community notices posted yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notices.map((item) => (
            <div
              key={item.id}
              className="border-border bg-surface rounded-xl border p-5 transition-shadow"
            >
              <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-text text-base font-bold">
                      {item.title}
                    </span>
                    <Badge
                      variant={item.is_published ? "primary" : "outline"}
                      size="sm"
                    >
                      {item.is_published ? "Published" : "Draft"}
                    </Badge>
                    <span className="bg-surface-muted text-text-muted rounded px-1.5 py-0.5 font-mono text-[11px] uppercase">
                      {item.locale}
                    </span>
                  </div>
                  <p className="text-text-muted text-xs">
                    Published:{" "}
                    {new Date(item.published_at).toLocaleDateString("en-GB", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
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
                    onClick={() => handleDelete(item.id)}
                    className="h-8 px-2.5 text-xs"
                  >
                    Delete
                  </Button>
                </div>
              </div>

              <div className="bg-surface-muted/50 text-text rounded-lg p-3.5 text-xs leading-relaxed whitespace-pre-wrap sm:text-sm">
                {item.body}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
