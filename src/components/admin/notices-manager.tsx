"use client";

import * as React from "react";
import { useState, useTransition, useActionState } from "react";
import {
  createNoticeAction,
  updateNoticeAction,
  toggleNoticePublishAction,
  deleteNoticeAction,
} from "@/lib/admin-actions";
import { formatAdminDate } from "@/lib/utils";
import {
  Plus,
  Eye,
  EyeOff,
  Trash2,
  Calendar,
  Globe,
  CheckCircle2,
  AlertCircle,
  X,
  Pencil,
  Bell,
  Sparkles,
} from "lucide-react";

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
  const [editingNotice, setEditingNotice] = useState<NoticeRecord | null>(null);
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [isPending, startTransition] = useTransition();

  // Create notice action hook
  const [createFormState, createAction, isCreating] = useActionState(
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

  // Edit notice action hook
  const [editFormState, editAction, isEditing] = useActionState(
    async (
      prevState: { error?: string; success?: boolean } | null,
      formData: FormData
    ) => {
      if (!editingNotice) return { error: "No notice selected for editing." };
      const res = await updateNoticeAction(editingNotice.id, prevState, formData);
      if (res.success) {
        const updatedNotice: NoticeRecord = {
          ...editingNotice,
          title: formData.get("title") as string,
          body: formData.get("body") as string,
          locale: (formData.get("locale") as string) || "ta",
          is_published: formData.get("is_published") === "on",
        };
        setNotices((prev) =>
          prev.map((n) => (n.id === editingNotice.id ? updatedNotice : n))
        );
        setEditingNotice(null);
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
    if (!confirm("Are you sure you want to permanently delete this announcement?"))
      return;
    startTransition(async () => {
      try {
        await deleteNoticeAction(id);
        setNotices((prev) => prev.filter((n) => n.id !== id));
      } catch (err) {
        alert("Failed to delete notice: " + (err as Error).message);
      }
    });
  };

  const filteredNotices = notices.filter((n) => {
    if (filter === "published") return n.is_published;
    if (filter === "draft") return !n.is_published;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-[#e6e4dc] bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5">
          {[
            { key: "all" as const, label: "All Notices", count: notices.length },
            {
              key: "published" as const,
              label: "Live Published",
              count: notices.filter((n) => n.is_published).length,
            },
            {
              key: "draft" as const,
              label: "Drafts",
              count: notices.filter((n) => !n.is_published).length,
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

        {/* Create Button */}
        <button
          onClick={() => {
            setEditingNotice(null);
            setShowCreate(!showCreate);
          }}
          className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold shadow-xs transition-colors ${
            showCreate
              ? "border border-[#e6e4dc] bg-white text-[#4b5563] hover:bg-[#f3f1ea]"
              : "bg-[#124d34] text-white hover:bg-[#0b2e1e]"
          }`}
        >
          {showCreate ? (
            <>
              <X className="h-3.5 w-3.5" />
              <span>Cancel</span>
            </>
          ) : (
            <>
              <Plus className="h-3.5 w-3.5 text-[#c99a45]" />
              <span>Post New Notice</span>
            </>
          )}
        </button>
      </div>

      {/* Notice Creation Form Card */}
      {showCreate && (
        <div className="overflow-hidden rounded-2xl border border-[#e6e4dc] border-t-4 border-t-[#c99a45] bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 border-b border-[#e6e4dc] pb-4">
            <h2 className="font-serif text-lg font-bold text-[#0b2e1e]">
              Compose Community Announcement
            </h2>
            <p className="mt-1 text-xs text-[#6b7280]">
              Published notices will be prominently displayed on the homepage announcement bar and public notices repository.
            </p>
          </div>

          <form action={createAction} className="space-y-4">
            {createFormState?.error && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-800"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                <span>{createFormState.error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <label
                  htmlFor="title"
                  className="mb-1 block text-xs font-semibold text-[#1c2420]"
                >
                  Announcement Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  name="title"
                  placeholder="e.g. Annual Cemetery Shramadhana Program / Janaza Announcement"
                  required
                  disabled={isCreating}
                  className="w-full rounded-lg border border-[#e6e4dc] bg-[#fbfaf6] px-3.5 py-2 text-xs text-[#1c2420] placeholder-[#9ca3af] transition-colors focus:border-[#124d34] focus:bg-white focus:outline-none sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="locale"
                  className="mb-1 block text-xs font-semibold text-[#1c2420]"
                >
                  Target Language <span className="text-red-500">*</span>
                </label>
                <select
                  id="locale"
                  name="locale"
                  defaultValue="ta"
                  disabled={isCreating}
                  className="w-full rounded-lg border border-[#e6e4dc] bg-[#fbfaf6] px-3 py-2 text-xs text-[#1c2420] transition-colors focus:border-[#124d34] focus:bg-white focus:outline-none sm:text-sm"
                >
                  <option value="ta">Tamil (தமிழ்) - Primary</option>
                  <option value="en">English (Official)</option>
                  <option value="si">Sinhala (සිංහල)</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="body"
                className="mb-1 block text-xs font-semibold text-[#1c2420]"
              >
                Announcement Details &amp; Instructions <span className="text-red-500">*</span>
              </label>
              <textarea
                id="body"
                name="body"
                rows={4}
                placeholder="Provide complete event information, date, venue, contacts, and guidelines for the community..."
                required
                disabled={isCreating}
                className="w-full rounded-lg border border-[#e6e4dc] bg-[#fbfaf6] p-3 text-xs leading-relaxed text-[#1c2420] placeholder-[#9ca3af] transition-colors focus:border-[#124d34] focus:bg-white focus:outline-none sm:text-sm"
              />
            </div>

            <div className="flex items-center gap-2.5 rounded-lg border border-[#e6e4dc] bg-[#fbfaf6] p-3">
              <input
                id="is_published"
                name="is_published"
                type="checkbox"
                defaultChecked
                disabled={isCreating}
                className="h-4 w-4 cursor-pointer rounded border-[#cbd5e1] text-[#124d34] focus:ring-[#124d34]"
              />
              <label
                htmlFor="is_published"
                className="cursor-pointer text-xs font-medium text-[#1c2420] select-none"
              >
                Publish immediately to homepage announcement notice bar and ticker
              </label>
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                disabled={isCreating}
                className="cursor-pointer rounded-lg border border-[#e6e4dc] bg-white px-3.5 py-2 text-xs font-semibold text-[#4b5563] shadow-2xs hover:bg-[#f3f1ea] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreating}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#124d34] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#0b2e1e] disabled:opacity-50"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-[#c99a45]" />
                <span>
                  {isCreating ? "Broadcasting Notice..." : "Save & Broadcast Notice"}
                </span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Notice Form Card */}
      {editingNotice && (
        <div className="overflow-hidden rounded-2xl border border-[#c99a45] border-t-4 border-t-[#124d34] bg-white p-6 shadow-md sm:p-8">
          <div className="mb-6 flex items-center justify-between border-b border-[#e6e4dc] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-[#f5eedf] px-2 py-0.5 font-serif text-[11px] font-bold text-[#8b651e]">
                  EDITING ANNOUNCEMENT
                </span>
                <span className="font-mono text-[11px] text-[#9ca3af]">
                  ID: {editingNotice.id}
                </span>
              </div>
              <h2 className="mt-1 font-serif text-lg font-bold text-[#0b2e1e]">
                Update Announcement Data
              </h2>
            </div>
            <button
              onClick={() => setEditingNotice(null)}
              className="cursor-pointer rounded-lg p-1 text-[#6b7280] hover:bg-[#f3f1ea]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form action={editAction} className="space-y-4">
            {editFormState?.error && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-800"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                <span>{editFormState.error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <label
                  htmlFor="edit-title"
                  className="mb-1 block text-xs font-semibold text-[#1c2420]"
                >
                  Announcement Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="edit-title"
                  name="title"
                  defaultValue={editingNotice.title}
                  required
                  disabled={isEditing}
                  className="w-full rounded-lg border border-[#e6e4dc] bg-[#fbfaf6] px-3.5 py-2 text-xs text-[#1c2420] transition-colors focus:border-[#124d34] focus:bg-white focus:outline-none sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="edit-locale"
                  className="mb-1 block text-xs font-semibold text-[#1c2420]"
                >
                  Target Language <span className="text-red-500">*</span>
                </label>
                <select
                  id="edit-locale"
                  name="locale"
                  defaultValue={editingNotice.locale}
                  disabled={isEditing}
                  className="w-full rounded-lg border border-[#e6e4dc] bg-[#fbfaf6] px-3 py-2 text-xs text-[#1c2420] transition-colors focus:border-[#124d34] focus:bg-white focus:outline-none sm:text-sm"
                >
                  <option value="ta">Tamil (தமிழ்)</option>
                  <option value="en">English (Official)</option>
                  <option value="si">Sinhala (සිංහල)</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="edit-body"
                className="mb-1 block text-xs font-semibold text-[#1c2420]"
              >
                Announcement Details &amp; Instructions <span className="text-red-500">*</span>
              </label>
              <textarea
                id="edit-body"
                name="body"
                rows={5}
                defaultValue={editingNotice.body}
                required
                disabled={isEditing}
                className="w-full rounded-lg border border-[#e6e4dc] bg-[#fbfaf6] p-3 text-xs leading-relaxed text-[#1c2420] transition-colors focus:border-[#124d34] focus:bg-white focus:outline-none sm:text-sm"
              />
            </div>

            <div className="flex items-center gap-2.5 rounded-lg border border-[#e6e4dc] bg-[#fbfaf6] p-3">
              <input
                id="edit-is_published"
                name="is_published"
                type="checkbox"
                defaultChecked={editingNotice.is_published}
                disabled={isEditing}
                className="h-4 w-4 cursor-pointer rounded border-[#cbd5e1] text-[#124d34] focus:ring-[#124d34]"
              />
              <label
                htmlFor="edit-is_published"
                className="cursor-pointer text-xs font-medium text-[#1c2420] select-none"
              >
                Keep notice live on public homepage announcement bar
              </label>
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setEditingNotice(null)}
                disabled={isEditing}
                className="cursor-pointer rounded-lg border border-[#e6e4dc] bg-white px-3.5 py-2 text-xs font-semibold text-[#4b5563] shadow-2xs hover:bg-[#f3f1ea] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isEditing}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#124d34] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#0b2e1e] disabled:opacity-50"
              >
                <Sparkles className="h-3.5 w-3.5 text-[#c99a45]" />
                <span>
                  {isEditing ? "Updating Database..." : "Save Announcement Updates"}
                </span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Notices List */}
      {filteredNotices.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#e6e4dc] bg-white p-12 text-center">
          <p className="font-serif text-base font-bold text-[#0b2e1e]">
            No announcements found
          </p>
          <p className="mt-1 text-xs text-[#6b7280]">
            No notices are currently registered under &ldquo;{filter}&rdquo;.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotices.map((item) => {
            const isJanaza =
              item.title.toLowerCase().includes("janaza") ||
              item.title.includes("ஜனாஸா") ||
              item.title.includes("ජනාසා") ||
              item.body.toLowerCase().includes("janaza") ||
              item.body.includes("ஜனாஸா");

            return (
              <div
                key={item.id}
                className={`overflow-hidden rounded-2xl border bg-white shadow-xs transition-all ${
                  item.is_published
                    ? "border-[#124d34]/30"
                    : "border-[#e6e4dc] opacity-80"
                }`}
              >
                {/* Header row */}
                <div className="flex flex-col gap-4 border-b border-[#f3f1ea] bg-[#fbfaf6] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-serif text-base font-bold text-[#0b2e1e]">
                        {item.title}
                      </span>

                      {/* Janaza Beacon Indicator */}
                      {isJanaza && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#f5eedf] px-2 py-0.5 text-[10px] font-bold text-[#8b651e] ring-1 ring-[#c99a45]/40">
                          <Bell className="h-3 w-3 text-[#c99a45]" />
                          <span>Janaza Alert</span>
                        </span>
                      )}

                      {/* Status Pill */}
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
                            <span>Live on Homepage</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-3 w-3 text-gray-500" />
                            <span>Draft / Hidden</span>
                          </>
                        )}
                      </span>

                      {/* Language Badge */}
                      <span className="inline-flex items-center gap-1 rounded bg-[#f5eedf] px-2 py-0.5 font-mono text-[10px] font-semibold text-[#8b651e] uppercase">
                        <Globe className="h-2.5 w-2.5" />
                        <span>
                          {item.locale === "ta"
                            ? "Tamil"
                            : item.locale === "si"
                              ? "Sinhala"
                              : "English"}
                        </span>
                      </span>
                    </div>

                    <div className="mt-1 flex items-center gap-2 text-xs text-[#6b7280]">
                      <Calendar className="h-3 w-3 text-[#9ca3af]" />
                      <span>
                        Published on {formatAdminDate(item.published_at)}
                      </span>
                    </div>
                  </div>

                  {/* Actions: Edit, Publish Toggle, Delete */}
                  <div className="flex shrink-0 items-center gap-2 sm:self-center">
                    {/* EDIT BUTTON */}
                    <button
                      disabled={isPending}
                      onClick={() => {
                        setShowCreate(false);
                        setEditingNotice(item);
                      }}
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#c99a45]/40 bg-[#fbfaf6] px-3 py-1.5 text-xs font-semibold text-[#0b2e1e] shadow-2xs hover:bg-[#f5eedf] transition-colors disabled:opacity-50"
                      title="Edit Notice Details"
                    >
                      <Pencil className="h-3.5 w-3.5 text-[#c99a45]" />
                      <span>Edit</span>
                    </button>

                    {/* PUBLISH TOGGLE */}
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

                    {/* DELETE BUTTON */}
                    <button
                      disabled={isPending}
                      onClick={() => handleDelete(item.id)}
                      className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-red-200 bg-white px-2 py-1.5 text-xs font-medium text-red-600 shadow-2xs hover:bg-red-50 disabled:opacity-50"
                      title="Delete permanently"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Body Preview */}
                <div className="p-4 sm:p-5">
                  <div className="rounded-xl border border-[#f3f1ea] bg-[#fbfaf6] p-4 text-xs leading-relaxed text-[#1c2420] whitespace-pre-wrap sm:text-sm">
                    {item.body}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
