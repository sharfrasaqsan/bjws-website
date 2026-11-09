"use client";

import * as React from "react";
import { useState, useTransition, useActionState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  createMultilingualNoticeAction,
  updateMultilingualNoticeAction,
  toggleNoticeGroupPublishAction,
  deleteNoticeGroupAction,
  toggleNoticeHomepageAction,
} from "@/lib/admin-actions";
import {
  groupNotices,
  type NoticeRecord,
  type UnifiedNoticeRecord,
} from "@/content/notices";
import { formatAdminDate } from "@/lib/utils";
import { SingleImageDropzone } from "@/components/admin/single-image-dropzone";
import {
  Plus,
  Eye,
  EyeOff,
  Trash2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  X,
  Pencil,
  Sparkles,
  Layers,
  MessageCircle,
  Clock,
  Megaphone,
  ImageIcon,
} from "lucide-react";

export type { NoticeRecord, UnifiedNoticeRecord };

interface NoticesManagerProps {
  initialNotices: NoticeRecord[];
}

const initialFormState = {
  error: undefined,
  success: false,
};

export function NoticesManager({ initialNotices }: NoticesManagerProps) {
  const router = useRouter();
  const [unifiedNotices, setUnifiedNotices] = useState<UnifiedNoticeRecord[]>(
    () => groupNotices(initialNotices)
  );
  const [showCreate, setShowCreate] = useState(false);
  const [editingNotice, setEditingNotice] =
    useState<UnifiedNoticeRecord | null>(null);
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [isPending, startTransition] = useTransition();

  const createFormRef = useRef<HTMLDivElement>(null);
  const editFormRef = useRef<HTMLDivElement>(null);

  // Active language tab in create / edit modals
  const [activeFormTab, setActiveFormTab] = useState<"ta" | "en" | "si">("ta");

  // Local card preview language per baseId
  const [cardPreviewLang, setCardPreviewLang] = useState<
    Record<string, "ta" | "en" | "si">
  >({});

  // Controlled form state for live tab badge indicators
  const [createFields, setCreateFields] = useState({
    title_ta: "",
    body_ta: "",
    title_en: "",
    body_en: "",
    title_si: "",
    body_si: "",
    image_url: "",
  });

  const [editFields, setEditFields] = useState({
    title_ta: "",
    body_ta: "",
    title_en: "",
    body_en: "",
    title_si: "",
    body_si: "",
    image_url: "",
    is_published: true,
  });

  // Open edit modal and populate state
  const handleOpenEdit = (item: UnifiedNoticeRecord) => {
    setShowCreate(false);
    setEditingNotice(item);
    setEditFields({
      title_ta: item.translations.ta?.title || "",
      body_ta: item.translations.ta?.body || "",
      title_en: item.translations.en?.title || "",
      body_en: item.translations.en?.body || "",
      title_si: item.translations.si?.title || "",
      body_si: item.translations.si?.body || "",
      image_url: item.image_url || "",
      is_published: item.is_published,
    });
    // Set default tab to the first non-empty translation
    if (item.translations.ta?.title) setActiveFormTab("ta");
    else if (item.translations.en?.title) setActiveFormTab("en");
    else if (item.translations.si?.title) setActiveFormTab("si");
    else setActiveFormTab("ta");

    setTimeout(() => {
      editFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 60);
  };

  // Create notice action hook
  const [createFormState, createAction, isCreating] = useActionState(
    async (
      prevState: { error?: string; success?: boolean } | null,
      formData: FormData
    ) => {
      formData.set("image_url", createFields.image_url.trim());
      const res = await createMultilingualNoticeAction(prevState, formData);
      if (res.success) {
        setShowCreate(false);
        const timestamp = Date.now();
        const published_at = new Date().toISOString();
        const is_published = formData.get("is_published") === "on";
        const image_url = createFields.image_url.trim() || undefined;

        const newTranslations: UnifiedNoticeRecord["translations"] = {};
        if (createFields.title_ta && createFields.body_ta) {
          newTranslations.ta = {
            id: `notice-${timestamp}-ta`,
            title: createFields.title_ta,
            body: createFields.body_ta,
            locale: "ta",
            published_at,
            is_published,
            image_url,
          };
        }
        if (createFields.title_en && createFields.body_en) {
          newTranslations.en = {
            id: `notice-${timestamp}-en`,
            title: createFields.title_en,
            body: createFields.body_en,
            locale: "en",
            published_at,
            is_published,
            image_url,
          };
        }
        if (createFields.title_si && createFields.body_si) {
          newTranslations.si = {
            id: `notice-${timestamp}-si`,
            title: createFields.title_si,
            body: createFields.body_si,
            locale: "si",
            published_at,
            is_published,
            image_url,
          };
        }

        const newNotice: UnifiedNoticeRecord = {
          baseId: `notice-${timestamp}`,
          published_at,
          is_published,
          image_url,
          translations: newTranslations,
        };

        setUnifiedNotices((prev) => [newNotice, ...prev]);
        setCreateFields({
          title_ta: "",
          body_ta: "",
          title_en: "",
          body_en: "",
          title_si: "",
          body_si: "",
          image_url: "",
        });
        router.refresh();
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
      formData.set("image_url", editFields.image_url.trim());
      const res = await updateMultilingualNoticeAction(
        editingNotice.baseId,
        prevState,
        formData
      );
      if (res.success) {
        const is_published = formData.get("is_published") === "on";
        const published_at = editingNotice.published_at;
        const image_url = editFields.image_url.trim() || undefined;

        const updatedTranslations: UnifiedNoticeRecord["translations"] = {
          ...editingNotice.translations,
        };

        if (editFields.title_ta && editFields.body_ta) {
          updatedTranslations.ta = {
            id:
              editingNotice.translations.ta?.id || `${editingNotice.baseId}-ta`,
            title: editFields.title_ta,
            body: editFields.body_ta,
            locale: "ta",
            published_at,
            is_published,
            image_url,
          };
        }
        if (editFields.title_en && editFields.body_en) {
          updatedTranslations.en = {
            id:
              editingNotice.translations.en?.id || `${editingNotice.baseId}-en`,
            title: editFields.title_en,
            body: editFields.body_en,
            locale: "en",
            published_at,
            is_published,
            image_url,
          };
        }
        if (editFields.title_si && editFields.body_si) {
          updatedTranslations.si = {
            id:
              editingNotice.translations.si?.id || `${editingNotice.baseId}-si`,
            title: editFields.title_si,
            body: editFields.body_si,
            locale: "si",
            published_at,
            is_published,
            image_url,
          };
        }

        const updatedItem: UnifiedNoticeRecord = {
          ...editingNotice,
          is_published,
          image_url,
          translations: updatedTranslations,
        };

        setUnifiedNotices((prev) =>
          prev.map((n) => (n.baseId === editingNotice.baseId ? updatedItem : n))
        );
        setEditingNotice(null);
        router.refresh();
      }
      return res;
    },
    initialFormState
  );

  const handleTogglePublish = (
    baseId: string,
    currentState: boolean,
    translationIds?: string[]
  ) => {
    startTransition(async () => {
      try {
        await toggleNoticeGroupPublishAction(
          baseId,
          currentState,
          translationIds
        );
        setUnifiedNotices((prev) =>
          prev.map((n) =>
            n.baseId === baseId
              ? {
                  ...n,
                  is_published: !currentState,
                  translations: Object.fromEntries(
                    Object.entries(n.translations).map(([k, v]) => [
                      k,
                      v ? { ...v, is_published: !currentState } : v,
                    ])
                  ),
                }
              : n
          )
        );
        router.refresh();
      } catch (err) {
        alert("Failed to toggle publish status: " + (err as Error).message);
      }
    });
  };

  const handleToggleHomepageBar = (
    baseId: string,
    currentHomepageState: boolean,
    translationIds?: string[]
  ) => {
    startTransition(async () => {
      try {
        await toggleNoticeHomepageAction(
          baseId,
          currentHomepageState,
          translationIds
        );
        setUnifiedNotices((prev) =>
          prev.map((n) =>
            n.baseId === baseId
              ? {
                  ...n,
                  show_on_homepage: !currentHomepageState,
                  translations: Object.fromEntries(
                    Object.entries(n.translations).map(([k, v]) => [
                      k,
                      v ? { ...v, show_on_homepage: !currentHomepageState } : v,
                    ])
                  ),
                }
              : n
          )
        );
        router.refresh();
      } catch (err) {
        alert("Failed to toggle homepage display: " + (err as Error).message);
      }
    });
  };

  const handleDelete = (baseId: string, translationIds?: string[]) => {
    if (
      !confirm(
        "Are you sure you want to permanently delete this announcement across all languages?"
      )
    )
      return;
    startTransition(async () => {
      try {
        await deleteNoticeGroupAction(baseId, translationIds);
        setUnifiedNotices((prev) => prev.filter((n) => n.baseId !== baseId));
        router.refresh();
      } catch (err) {
        alert("Failed to delete notice: " + (err as Error).message);
      }
    });
  };

  const filteredNotices = unifiedNotices.filter((n) => {
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
            {
              key: "all" as const,
              label: "All Notices",
              count: unifiedNotices.length,
            },
            {
              key: "published" as const,
              label: "Live Published",
              count: unifiedNotices.filter((n) => n.is_published).length,
            },
            {
              key: "draft" as const,
              label: "Drafts",
              count: unifiedNotices.filter((n) => !n.is_published).length,
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
                  className={`py-0.2 rounded-full px-1.5 text-[10px] font-bold ${
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
            setShowCreate((prev) => {
              const next = !prev;
              if (next) {
                setTimeout(() => {
                  createFormRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }, 60);
              }
              return next;
            });
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
              <span>Post New Notice (All Languages)</span>
            </>
          )}
        </button>
      </div>

      {/* Notice Creation Form Card (Multilingual) */}
      {showCreate && (
        <div
          ref={createFormRef}
          className="animate-fade-in overflow-hidden rounded-2xl border border-t-4 border-[#e6e4dc] border-t-[#c99a45] bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="mb-6 border-b border-[#e6e4dc] pb-4">
            <div className="flex items-center gap-2">
              <span className="rounded bg-[#f5eedf] px-2 py-0.5 font-mono text-[10px] font-bold text-[#8b651e] uppercase">
                Multilingual Creator
              </span>
            </div>
            <h2 className="mt-1 font-serif text-lg font-bold text-[#0b2e1e]">
              Compose Unified Community Announcement
            </h2>
            <p className="mt-1 text-xs text-[#6b7280]">
              Create an announcement in Tamil, English, and Sinhala in one
              place. You can fill one, two, or all three languages.
            </p>
          </div>

          <form action={createAction} className="space-y-6">
            {createFormState?.error && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-800"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                <span>{createFormState.error}</span>
              </div>
            )}

            {/* Language Selection Tabs */}
            <div className="flex flex-wrap items-center gap-2 border-b border-[#e6e4dc] pb-3">
              {[
                {
                  code: "ta" as const,
                  label: "Tamil (தமிழ்) - முதன்மை",
                  filled: Boolean(
                    createFields.title_ta && createFields.body_ta
                  ),
                },
                {
                  code: "en" as const,
                  label: "English (Official)",
                  filled: Boolean(
                    createFields.title_en && createFields.body_en
                  ),
                },
                {
                  code: "si" as const,
                  label: "Sinhala (සිංහල)",
                  filled: Boolean(
                    createFields.title_si && createFields.body_si
                  ),
                },
              ].map((tab) => (
                <button
                  type="button"
                  key={tab.code}
                  onClick={() => setActiveFormTab(tab.code)}
                  className={`inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                    activeFormTab === tab.code
                      ? "bg-[#124d34] text-white shadow-xs"
                      : "bg-[#fbfaf6] text-[#4b5563] hover:bg-[#f3f1ea]"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`h-2 w-2 rounded-full ${
                      tab.filled ? "bg-emerald-400" : "bg-gray-300"
                    }`}
                    title={tab.filled ? "Content entered" : "Empty"}
                  />
                </button>
              ))}
            </div>

            {/* Tamil Tab Pane (Always mounted in DOM for form submission) */}
            <div
              className={
                activeFormTab === "ta" ? "space-y-4" : "hidden space-y-4"
              }
            >
              <div>
                <label
                  htmlFor="title_ta"
                  className="mb-1 block text-xs font-semibold text-[#1c2420]"
                >
                  அறிவித்தல் தலைப்பு (Tamil Title){" "}
                  <span className="text-xs font-normal text-[#6b7280]">
                    - e.g. மஹல்லா மையவாடி சிரமதானப் பணி அழைப்பு
                  </span>
                </label>
                <input
                  id="title_ta"
                  name="title_ta"
                  value={createFields.title_ta}
                  onChange={(e) =>
                    setCreateFields((p) => ({ ...p, title_ta: e.target.value }))
                  }
                  placeholder="அறிவித்தல் தலைப்பை உள்ளிடவும்..."
                  disabled={isCreating}
                  className="w-full rounded-lg border border-[#e6e4dc] bg-[#fbfaf6] px-3.5 py-2 text-xs text-[#1c2420] placeholder-[#9ca3af] transition-colors focus:border-[#124d34] focus:bg-white focus:outline-none sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="body_ta"
                  className="mb-1 block text-xs font-semibold text-[#1c2420]"
                >
                  அறிவித்தல் விபரம் (Tamil Details)
                </label>
                <textarea
                  id="body_ta"
                  name="body_ta"
                  rows={4}
                  value={createFields.body_ta}
                  onChange={(e) =>
                    setCreateFields((p) => ({ ...p, body_ta: e.target.value }))
                  }
                  placeholder="முழுமையான விபரங்கள், திகதி, இடம் மற்றும் வழிகாட்டல்களை உள்ளிடவும்..."
                  disabled={isCreating}
                  className="w-full rounded-lg border border-[#e6e4dc] bg-[#fbfaf6] p-3 text-xs leading-relaxed text-[#1c2420] placeholder-[#9ca3af] transition-colors focus:border-[#124d34] focus:bg-white focus:outline-none sm:text-sm"
                />
              </div>
            </div>

            {/* English Tab Pane */}
            <div
              className={
                activeFormTab === "en" ? "space-y-4" : "hidden space-y-4"
              }
            >
              <div>
                <label
                  htmlFor="title_en"
                  className="mb-1 block text-xs font-semibold text-[#1c2420]"
                >
                  Announcement Title (English)
                </label>
                <input
                  id="title_en"
                  name="title_en"
                  value={createFields.title_en}
                  onChange={(e) =>
                    setCreateFields((p) => ({ ...p, title_en: e.target.value }))
                  }
                  placeholder="e.g. Annual Cemetery Shramadhana Program / Janaza Alert"
                  disabled={isCreating}
                  className="w-full rounded-lg border border-[#e6e4dc] bg-[#fbfaf6] px-3.5 py-2 text-xs text-[#1c2420] placeholder-[#9ca3af] transition-colors focus:border-[#124d34] focus:bg-white focus:outline-none sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="body_en"
                  className="mb-1 block text-xs font-semibold text-[#1c2420]"
                >
                  Announcement Details &amp; Instructions (English)
                </label>
                <textarea
                  id="body_en"
                  name="body_en"
                  rows={4}
                  value={createFields.body_en}
                  onChange={(e) =>
                    setCreateFields((p) => ({ ...p, body_en: e.target.value }))
                  }
                  placeholder="Provide event information, date, venue, contacts, and guidelines..."
                  disabled={isCreating}
                  className="w-full rounded-lg border border-[#e6e4dc] bg-[#fbfaf6] p-3 text-xs leading-relaxed text-[#1c2420] placeholder-[#9ca3af] transition-colors focus:border-[#124d34] focus:bg-white focus:outline-none sm:text-sm"
                />
              </div>
            </div>

            {/* Sinhala Tab Pane */}
            <div
              className={
                activeFormTab === "si" ? "space-y-4" : "hidden space-y-4"
              }
            >
              <div>
                <label
                  htmlFor="title_si"
                  className="mb-1 block text-xs font-semibold text-[#1c2420]"
                >
                  නිවේදන මාතෘකාව (Sinhala Title)
                </label>
                <input
                  id="title_si"
                  name="title_si"
                  value={createFields.title_si}
                  onChange={(e) =>
                    setCreateFields((p) => ({ ...p, title_si: e.target.value }))
                  }
                  placeholder="නිවේදන මාතෘකාව ඇතුළත් කරන්න..."
                  disabled={isCreating}
                  className="w-full rounded-lg border border-[#e6e4dc] bg-[#fbfaf6] px-3.5 py-2 text-xs text-[#1c2420] placeholder-[#9ca3af] transition-colors focus:border-[#124d34] focus:bg-white focus:outline-none sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="body_si"
                  className="mb-1 block text-xs font-semibold text-[#1c2420]"
                >
                  නිවේදන විස්තර (Sinhala Details)
                </label>
                <textarea
                  id="body_si"
                  name="body_si"
                  rows={4}
                  value={createFields.body_si}
                  onChange={(e) =>
                    setCreateFields((p) => ({ ...p, body_si: e.target.value }))
                  }
                  placeholder="දිනය, වේලාව, ස්ථානය සහ උපදෙස් ඇතුළත් කරන්න..."
                  disabled={isCreating}
                  className="w-full rounded-lg border border-[#e6e4dc] bg-[#fbfaf6] p-3 text-xs leading-relaxed text-[#1c2420] placeholder-[#9ca3af] transition-colors focus:border-[#124d34] focus:bg-white focus:outline-none sm:text-sm"
                />
              </div>
            </div>

            {/* Optional Notice Image / Flyer */}
            <div>
              <SingleImageDropzone
                name="image_url"
                value={createFields.image_url}
                onChange={(url) =>
                  setCreateFields((p) => ({ ...p, image_url: url }))
                }
                folder="notices"
                label="Notice Image / Circular / Flyer (Optional)"
                helperText="Attach an official flyer, banner, or announcement circular (auto-compressed to WebP)."
              />
            </div>

            {/* Publication and Homepage settings */}
            <div className="grid grid-cols-1 gap-4 rounded-xl border border-[#e6e4dc] bg-[#fbfaf6] p-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="published_at"
                  className="mb-1 block text-xs font-semibold text-[#1c2420]"
                >
                  Publish Date <span className="text-red-500">*</span>
                </label>
                <input
                  id="published_at"
                  name="published_at"
                  type="date"
                  defaultValue={new Date().toISOString().slice(0, 10)}
                  required
                  disabled={isCreating}
                  className="w-full rounded-lg border border-[#e6e4dc] bg-white px-3 py-2 text-xs text-[#1c2420] transition-colors focus:border-[#124d34] focus:outline-none"
                />
              </div>

              <div className="space-y-2 pt-1 sm:pt-4">
                <div className="flex items-center gap-2">
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
                    Active / Published (Live in Notices Directory)
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    id="show_on_homepage"
                    name="show_on_homepage"
                    type="checkbox"
                    defaultChecked
                    disabled={isCreating}
                    className="h-4 w-4 cursor-pointer rounded border-[#cbd5e1] text-[#c99a45] focus:ring-[#c99a45]"
                  />
                  <label
                    htmlFor="show_on_homepage"
                    className="flex cursor-pointer items-center gap-1.5 text-xs font-bold text-[#8b651e] select-none"
                  >
                    <Megaphone className="h-3.5 w-3.5 text-[#c99a45]" />
                    <span>Display in Homepage Announcement Notice Bar</span>
                  </label>
                </div>
              </div>
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
                  {isCreating
                    ? "Broadcasting Notice..."
                    : "Save & Broadcast Notice"}
                </span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Notice Form Card (Multilingual) */}
      {editingNotice && (
        <div
          ref={editFormRef}
          className="animate-fade-in overflow-hidden rounded-2xl border border-t-4 border-[#c99a45] border-t-[#124d34] bg-white p-6 shadow-md sm:p-8"
        >
          <div className="mb-6 flex items-center justify-between border-b border-[#e6e4dc] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-[#f5eedf] px-2 py-0.5 font-serif text-[11px] font-bold text-[#8b651e]">
                  EDITING MULTILINGUAL ANNOUNCEMENT
                </span>
                <span className="font-mono text-[11px] text-[#9ca3af]">
                  GROUP: {editingNotice.baseId}
                </span>
              </div>
              <h2 className="mt-1 font-serif text-lg font-bold text-[#0b2e1e]">
                Update All Language Translations
              </h2>
            </div>
            <button
              onClick={() => setEditingNotice(null)}
              className="cursor-pointer rounded-lg p-1 text-[#6b7280] hover:bg-[#f3f1ea]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form action={editAction} className="space-y-6">
            {editFormState?.error && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-800"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                <span>{editFormState.error}</span>
              </div>
            )}

            {/* Language Selection Tabs */}
            <div className="flex flex-wrap items-center gap-2 border-b border-[#e6e4dc] pb-3">
              {[
                {
                  code: "ta" as const,
                  label: "Tamil (தமிழ்)",
                  filled: Boolean(editFields.title_ta && editFields.body_ta),
                },
                {
                  code: "en" as const,
                  label: "English (Official)",
                  filled: Boolean(editFields.title_en && editFields.body_en),
                },
                {
                  code: "si" as const,
                  label: "Sinhala (සිංහල)",
                  filled: Boolean(editFields.title_si && editFields.body_si),
                },
              ].map((tab) => (
                <button
                  type="button"
                  key={tab.code}
                  onClick={() => setActiveFormTab(tab.code)}
                  className={`inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                    activeFormTab === tab.code
                      ? "bg-[#124d34] text-white shadow-xs"
                      : "bg-[#fbfaf6] text-[#4b5563] hover:bg-[#f3f1ea]"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`h-2 w-2 rounded-full ${
                      tab.filled ? "bg-emerald-400" : "bg-gray-300"
                    }`}
                    title={tab.filled ? "Has translation" : "Empty"}
                  />
                </button>
              ))}
            </div>

            {/* Tamil Tab Pane */}
            <div
              className={
                activeFormTab === "ta" ? "space-y-4" : "hidden space-y-4"
              }
            >
              <div>
                <label
                  htmlFor="edit_title_ta"
                  className="mb-1 block text-xs font-semibold text-[#1c2420]"
                >
                  அறிவித்தல் தலைப்பு (Tamil Title)
                </label>
                <input
                  id="edit_title_ta"
                  name="title_ta"
                  value={editFields.title_ta}
                  onChange={(e) =>
                    setEditFields((p) => ({ ...p, title_ta: e.target.value }))
                  }
                  placeholder="அறிவித்தல் தலைப்பு..."
                  disabled={isEditing}
                  className="w-full rounded-lg border border-[#e6e4dc] bg-[#fbfaf6] px-3.5 py-2 text-xs text-[#1c2420] transition-colors focus:border-[#124d34] focus:bg-white focus:outline-none sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="edit_body_ta"
                  className="mb-1 block text-xs font-semibold text-[#1c2420]"
                >
                  அறிவித்தல் விபரம் (Tamil Details)
                </label>
                <textarea
                  id="edit_body_ta"
                  name="body_ta"
                  rows={5}
                  value={editFields.body_ta}
                  onChange={(e) =>
                    setEditFields((p) => ({ ...p, body_ta: e.target.value }))
                  }
                  placeholder="அறிவித்தல் விபரங்களை உள்ளிடவும்..."
                  disabled={isEditing}
                  className="w-full rounded-lg border border-[#e6e4dc] bg-[#fbfaf6] p-3 text-xs leading-relaxed text-[#1c2420] transition-colors focus:border-[#124d34] focus:bg-white focus:outline-none sm:text-sm"
                />
              </div>
            </div>

            {/* English Tab Pane */}
            <div
              className={
                activeFormTab === "en" ? "space-y-4" : "hidden space-y-4"
              }
            >
              <div>
                <label
                  htmlFor="edit_title_en"
                  className="mb-1 block text-xs font-semibold text-[#1c2420]"
                >
                  Announcement Title (English)
                </label>
                <input
                  id="edit_title_en"
                  name="title_en"
                  value={editFields.title_en}
                  onChange={(e) =>
                    setEditFields((p) => ({ ...p, title_en: e.target.value }))
                  }
                  placeholder="Announcement title in English..."
                  disabled={isEditing}
                  className="w-full rounded-lg border border-[#e6e4dc] bg-[#fbfaf6] px-3.5 py-2 text-xs text-[#1c2420] transition-colors focus:border-[#124d34] focus:bg-white focus:outline-none sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="edit_body_en"
                  className="mb-1 block text-xs font-semibold text-[#1c2420]"
                >
                  Announcement Details &amp; Instructions (English)
                </label>
                <textarea
                  id="edit_body_en"
                  name="body_en"
                  rows={5}
                  value={editFields.body_en}
                  onChange={(e) =>
                    setEditFields((p) => ({ ...p, body_en: e.target.value }))
                  }
                  placeholder="Announcement details in English..."
                  disabled={isEditing}
                  className="w-full rounded-lg border border-[#e6e4dc] bg-[#fbfaf6] p-3 text-xs leading-relaxed text-[#1c2420] transition-colors focus:border-[#124d34] focus:bg-white focus:outline-none sm:text-sm"
                />
              </div>
            </div>

            {/* Sinhala Tab Pane */}
            <div
              className={
                activeFormTab === "si" ? "space-y-4" : "hidden space-y-4"
              }
            >
              <div>
                <label
                  htmlFor="edit_title_si"
                  className="mb-1 block text-xs font-semibold text-[#1c2420]"
                >
                  නිවේදන මාතෘකාව (Sinhala Title)
                </label>
                <input
                  id="edit_title_si"
                  name="title_si"
                  value={editFields.title_si}
                  onChange={(e) =>
                    setEditFields((p) => ({ ...p, title_si: e.target.value }))
                  }
                  placeholder="නිවේදන මාතෘකාව..."
                  disabled={isEditing}
                  className="w-full rounded-lg border border-[#e6e4dc] bg-[#fbfaf6] px-3.5 py-2 text-xs text-[#1c2420] transition-colors focus:border-[#124d34] focus:bg-white focus:outline-none sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="edit_body_si"
                  className="mb-1 block text-xs font-semibold text-[#1c2420]"
                >
                  නිවේදන විස්තර (Sinhala Details)
                </label>
                <textarea
                  id="edit_body_si"
                  name="body_si"
                  rows={5}
                  value={editFields.body_si}
                  onChange={(e) =>
                    setEditFields((p) => ({ ...p, body_si: e.target.value }))
                  }
                  placeholder="නිවේදන විස්තර..."
                  disabled={isEditing}
                  className="w-full rounded-lg border border-[#e6e4dc] bg-[#fbfaf6] p-3 text-xs leading-relaxed text-[#1c2420] transition-colors focus:border-[#124d34] focus:bg-white focus:outline-none sm:text-sm"
                />
              </div>
            </div>

            {/* Optional Notice Image / Flyer */}
            <div>
              <SingleImageDropzone
                name="image_url"
                value={editFields.image_url}
                onChange={(url) =>
                  setEditFields((p) => ({ ...p, image_url: url }))
                }
                folder="notices"
                label="Notice Image / Circular / Flyer (Optional)"
                helperText="Attach an official flyer, banner, or announcement circular (auto-compressed to WebP)."
              />
            </div>

            {/* Publication and Homepage settings */}
            <div className="grid grid-cols-1 gap-4 rounded-xl border border-[#e6e4dc] bg-[#fbfaf6] p-4 sm:grid-cols-2">
              <div className="space-y-3">
                <div>
                  <label
                    htmlFor="edit_published_at"
                    className="mb-1 block text-xs font-semibold text-[#1c2420]"
                  >
                    Original Publish Date{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="edit_published_at"
                    name="published_at"
                    type="date"
                    defaultValue={
                      editingNotice.published_at
                        ? editingNotice.published_at.slice(0, 10)
                        : new Date().toISOString().slice(0, 10)
                    }
                    required
                    disabled={isEditing}
                    className="w-full rounded-lg border border-[#e6e4dc] bg-white px-3 py-2 text-xs text-[#1c2420] transition-colors focus:border-[#124d34] focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="edit_updated_at"
                    className="mb-1 block text-xs font-semibold text-[#1c2420]"
                  >
                    Last Updated Date
                  </label>
                  <input
                    id="edit_updated_at"
                    name="updated_at"
                    type="date"
                    defaultValue={new Date().toISOString().slice(0, 10)}
                    disabled={isEditing}
                    className="w-full rounded-lg border border-[#e6e4dc] bg-white px-3 py-2 text-xs text-[#1c2420] transition-colors focus:border-[#124d34] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-1 sm:pt-4">
                <div className="flex items-center gap-2">
                  <input
                    id="edit_is_published"
                    name="is_published"
                    type="checkbox"
                    defaultChecked={editingNotice.is_published}
                    disabled={isEditing}
                    className="h-4 w-4 cursor-pointer rounded border-[#cbd5e1] text-[#124d34] focus:ring-[#124d34]"
                  />
                  <label
                    htmlFor="edit_is_published"
                    className="cursor-pointer text-xs font-medium text-[#1c2420] select-none"
                  >
                    Active / Published in Notices Directory
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    id="edit_show_on_homepage"
                    name="show_on_homepage"
                    type="checkbox"
                    defaultChecked={editingNotice.show_on_homepage ?? true}
                    disabled={isEditing}
                    className="h-4 w-4 cursor-pointer rounded border-[#cbd5e1] text-[#c99a45] focus:ring-[#c99a45]"
                  />
                  <label
                    htmlFor="edit_show_on_homepage"
                    className="flex cursor-pointer items-center gap-1.5 text-xs font-bold text-[#8b651e] select-none"
                  >
                    <Megaphone className="h-3.5 w-3.5 text-[#c99a45]" />
                    <span>Display in Homepage Announcement Notice Bar</span>
                  </label>
                </div>
              </div>
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
                  {isEditing
                    ? "Updating Database..."
                    : "Save Announcement Updates"}
                </span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Notices List */}
      {filteredNotices.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#e6e4dc] bg-white p-12 text-center">
          <Layers className="mx-auto mb-2 h-8 w-8 text-[#c99a45] opacity-80" />
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
            // Pick active preview translation or fallback
            const currentPreviewLang =
              cardPreviewLang[item.baseId] ||
              (item.translations.ta
                ? "ta"
                : item.translations.en
                  ? "en"
                  : "si");

            const activeTrans =
              item.translations[currentPreviewLang] ||
              item.translations.ta ||
              item.translations.en ||
              item.translations.si;

            return (
              <div
                key={item.baseId}
                className={`overflow-hidden rounded-2xl border bg-white shadow-xs transition-all ${
                  item.is_published
                    ? "border-[#124d34]/30"
                    : "border-[#e6e4dc] opacity-80"
                }`}
              >
                {/* Header row */}
                <div className="flex flex-col gap-4 border-b border-[#f3f1ea] bg-[#fbfaf6] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-serif text-base font-bold text-[#0b2e1e]">
                        {activeTrans?.title || "Untitled Announcement"}
                      </span>

                      {/* Image Indicator */}
                      {item.image_url && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800 ring-1 ring-emerald-300">
                          <ImageIcon className="h-3 w-3 text-emerald-600" />
                          <span>Image Attached</span>
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
                            <span>Directory Live</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-3 w-3 text-gray-500" />
                            <span>Draft / Hidden</span>
                          </>
                        )}
                      </span>

                      {/* Homepage Bar Badge */}
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                          item.show_on_homepage
                            ? "bg-amber-100 text-amber-900 ring-1 ring-amber-500/30"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        <Megaphone
                          className={`h-3 w-3 ${
                            item.show_on_homepage
                              ? "text-amber-600"
                              : "text-gray-400"
                          }`}
                        />
                        <span>
                          {item.show_on_homepage
                            ? "Homepage Bar Active"
                            : "Not on Homepage Bar"}
                        </span>
                      </span>
                    </div>

                    {/* Language Availability & Dates */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-[#6b7280]">
                      <span className="text-[11px] font-semibold text-[#8b651e]">
                        Languages:
                      </span>
                      <div className="inline-flex items-center gap-1 rounded-lg bg-[#e8f3ee] px-2 py-0.5">
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                            item.translations.ta
                              ? "bg-[#124d34] text-white"
                              : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          தமிழ் (TA)
                        </span>
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                            item.translations.en
                              ? "bg-[#124d34] text-white"
                              : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          EN
                        </span>
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                            item.translations.si
                              ? "bg-[#124d34] text-white"
                              : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          සිංහල (SI)
                        </span>
                      </div>

                      <span>•</span>
                      <div className="flex items-center gap-1 font-mono text-[11px] text-[#8b651e]">
                        <Calendar className="h-3 w-3 text-[#c99a45]" />
                        <span>
                          Published: {formatAdminDate(item.published_at)}
                        </span>
                      </div>

                      {item.updated_at && (
                        <>
                          <span>•</span>
                          <div className="flex items-center gap-1 font-mono text-[11px] text-emerald-700">
                            <Clock className="h-3 w-3 text-emerald-600" />
                            <span>
                              Updated: {formatAdminDate(item.updated_at)}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions: Edit, Publish Toggle, Delete */}
                  <div className="flex shrink-0 items-center gap-2 sm:self-center">
                    {/* HOMEPAGE BAR PIN / TOGGLE BUTTON */}
                    <button
                      disabled={isPending}
                      type="button"
                      onClick={() =>
                        handleToggleHomepageBar(
                          item.baseId,
                          item.show_on_homepage ?? true,
                          Object.values(item.translations)
                            .map((t) => t?.id)
                            .filter(Boolean) as string[]
                        )
                      }
                      className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold shadow-2xs transition-colors disabled:opacity-50 ${
                        item.show_on_homepage
                          ? "border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100"
                          : "border-[#e6e4dc] bg-white text-[#4b5563] hover:bg-[#f3f1ea]"
                      }`}
                      title={
                        item.show_on_homepage
                          ? "Notice is showing in homepage bar. Click to hide from homepage bar."
                          : "Notice is hidden from homepage bar. Click to display in homepage bar."
                      }
                    >
                      <Megaphone
                        className={`h-3.5 w-3.5 ${
                          item.show_on_homepage
                            ? "text-amber-600"
                            : "text-[#9ca3af]"
                        }`}
                      />
                      <span>
                        {item.show_on_homepage
                          ? "In Homepage Bar"
                          : "+ Pin to Bar"}
                      </span>
                    </button>

                    {/* WHATSAPP BROADCAST BUTTON */}
                    <button
                      type="button"
                      onClick={() => {
                        const activeNotice =
                          item.translations[currentPreviewLang] ||
                          item.translations.ta ||
                          item.translations.en;
                        if (!activeNotice) return;
                        const msg = `📢 *BUHARY JANAZA WELFARE SOCIETY (BJWS)*\nReg No: DS/TH/SS/VSSO/2023/01 • Mullipothana\n\n*${activeNotice.title}*\n\n${activeNotice.body}\n\n🗓 Date: ${formatAdminDate(
                          item.published_at
                        )}\n📞 Immediate 24/7 Hotline: 077 622 7323\n🌐 Official Website: https://bjws.org`;
                        window.open(
                          `https://wa.me/?text=${encodeURIComponent(msg)}`,
                          "_blank"
                        );
                      }}
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-2.5 py-1.5 text-xs font-bold text-emerald-800 shadow-2xs transition-colors hover:bg-emerald-100"
                      title="Broadcast this notice to WhatsApp community groups"
                    >
                      <MessageCircle className="h-3.5 w-3.5 text-[#25d366]" />
                      <span>WhatsApp</span>
                    </button>

                    {/* EDIT BUTTON */}
                    <button
                      disabled={isPending}
                      onClick={() => handleOpenEdit(item)}
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#c99a45]/40 bg-[#fbfaf6] px-3 py-1.5 text-xs font-semibold text-[#0b2e1e] shadow-2xs transition-colors hover:bg-[#f5eedf] disabled:opacity-50"
                      title="Edit Notice in All Languages"
                    >
                      <Pencil className="h-3.5 w-3.5 text-[#c99a45]" />
                      <span>Edit (All)</span>
                    </button>

                    {/* PUBLISH TOGGLE */}
                    <button
                      disabled={isPending}
                      onClick={() =>
                        handleTogglePublish(
                          item.baseId,
                          item.is_published,
                          Object.values(item.translations)
                            .map((t) => t?.id)
                            .filter(Boolean) as string[]
                        )
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
                      onClick={() =>
                        handleDelete(
                          item.baseId,
                          Object.values(item.translations)
                            .map((t) => t?.id)
                            .filter(Boolean) as string[]
                        )
                      }
                      className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-red-200 bg-white px-2 py-1.5 text-xs font-medium text-red-600 shadow-2xs hover:bg-red-50 disabled:opacity-50"
                      title="Delete notice in all languages"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Body Preview with Language Switcher */}
                <div className="space-y-3 p-4 sm:p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold tracking-wider text-[#6b7280] uppercase">
                      Preview Content:
                    </span>
                    <div className="flex items-center gap-1">
                      {(["ta", "en", "si"] as const).map((code) => {
                        const hasTrans = Boolean(item.translations[code]);
                        const isCurrent = currentPreviewLang === code;
                        return (
                          <button
                            key={code}
                            type="button"
                            onClick={() =>
                              setCardPreviewLang((p) => ({
                                ...p,
                                [item.baseId]: code,
                              }))
                            }
                            className={`rounded px-2 py-0.5 text-[11px] font-semibold transition-all ${
                              isCurrent
                                ? "bg-[#124d34] text-white"
                                : hasTrans
                                  ? "bg-[#fbfaf6] text-[#4b5563] hover:bg-[#e6e4dc]"
                                  : "cursor-not-allowed bg-gray-100 text-gray-400"
                            }`}
                            disabled={!hasTrans}
                          >
                            {code === "ta"
                              ? "தமிழ்"
                              : code === "en"
                                ? "English"
                                : "සිංහල"}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex flex-col items-start gap-4 rounded-xl border border-[#f3f1ea] bg-[#fbfaf6] p-4 text-xs leading-relaxed text-[#1c2420] sm:flex-row sm:text-sm">
                    {item.image_url && (
                      <div className="relative h-24 w-36 shrink-0 overflow-hidden rounded-xl border border-[#e6e4dc] bg-stone-100 shadow-2xs">
                        <Image
                          src={item.image_url}
                          alt={activeTrans?.title || "Notice flyer"}
                          fill
                          className="object-cover"
                          sizes="144px"
                        />
                      </div>
                    )}
                    <div className="flex-1 whitespace-pre-wrap">
                      {activeTrans?.body ||
                        "(No translation for this language)"}
                    </div>
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
