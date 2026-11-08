"use server";

import fs from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/admin-auth";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/server";
import {
  addArticleStore,
  updateArticleStore,
  deleteArticleStore,
  addUnifiedArticleStore,
  updateUnifiedArticleStore,
  deleteUnifiedArticleStore,
  toggleUnifiedArticlePublishStore,
  extractBaseSlug,
  getArticles,
  type Article,
  type ArticleImage,
} from "@/content/news";
import {
  addTeamMemberStore,
  updateTeamMemberStore,
  deleteTeamMemberStore,
  toggleTeamMemberActiveStore,
  reorderTeamMembersStore,
  regenerateMemberVerificationTokenStore,
  type TeamMember,
} from "@/content/team";
import {
  addGalleryImageStore,
  updateGalleryImageStore,
  deleteGalleryImageStore,
  toggleGalleryApprovalStore,
  renameGalleryCategoryStore,
  type GalleryImage,
  type GalleryCategory,
  DEFAULT_BLUR,
} from "@/content/gallery";
import {
  addUnifiedNoticeStore,
  updateUnifiedNoticeStore,
  deleteUnifiedNoticeStore,
  toggleUnifiedNoticePublishStore,
  groupNotices,
  getAllNotices,
  type NoticeRecord,
} from "@/content/notices";

// ====================================================================
// Contact Messages Actions
// ====================================================================

export async function updateMessageStatusAction(
  id: string,
  status: "new" | "read" | "replied" | "archived"
) {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");

  if (isSupabaseConfigured()) {
    const supabase = await createAdminClient();
    const { error } = await supabase
      .from("contact_messages")
      .update({ status })
      .eq("id", id);

    if (error) throw new Error(error.message);
  }

  revalidatePath("/admin/messages");
  revalidatePath("/admin");
  return { success: true };
}

export async function deleteMessageAction(id: string) {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");

  if (isSupabaseConfigured()) {
    const supabase = await createAdminClient();
    const { error } = await supabase
      .from("contact_messages")
      .delete()
      .eq("id", id);

    if (error) throw new Error(error.message);
  }

  revalidatePath("/admin/messages");
  revalidatePath("/admin");
  return { success: true };
}

// ====================================================================
// Membership Requests Actions
// ====================================================================

export async function updateMembershipStatusAction(
  id: string,
  status: "pending" | "approved" | "rejected"
) {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");

  if (isSupabaseConfigured()) {
    const supabase = await createAdminClient();
    const { error } = await supabase
      .from("membership_requests")
      .update({ status })
      .eq("id", id);

    if (error) throw new Error(error.message);
  }

  revalidatePath("/admin/memberships");
  revalidatePath("/admin");
  return { success: true };
}

export async function deleteMembershipAction(id: string) {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");

  if (isSupabaseConfigured()) {
    const supabase = await createAdminClient();
    const { error } = await supabase
      .from("membership_requests")
      .delete()
      .eq("id", id);

    if (error) throw new Error(error.message);
  }

  revalidatePath("/admin/memberships");
  revalidatePath("/admin");
  return { success: true };
}

// ====================================================================
// Community Notices Actions (Unified Multilingual)
// ====================================================================

export async function createMultilingualNoticeAction(
  _prevState: { error?: string; success?: boolean } | null,
  formData: FormData
) {
  const session = await getAdminSession();
  if (!session) return { error: "Unauthorized" };

  const title_ta = (formData.get("title_ta") as string)?.trim();
  const body_ta = (formData.get("body_ta") as string)?.trim();
  const title_en = (formData.get("title_en") as string)?.trim();
  const body_en = (formData.get("body_en") as string)?.trim();
  const title_si = (formData.get("title_si") as string)?.trim();
  const body_si = (formData.get("body_si") as string)?.trim();
  const is_published = formData.get("is_published") === "on";

  if (
    (!title_ta || !body_ta) &&
    (!title_en || !body_en) &&
    (!title_si || !body_si)
  ) {
    return {
      error:
        "Please provide announcement details (title and description) for at least one language.",
    };
  }

  const published_at = new Date().toISOString();

  const entries: NoticeRecord[] = [];

  if (title_ta && body_ta) {
    entries.push({
      id: crypto.randomUUID(),
      title: title_ta,
      body: body_ta,
      locale: "ta",
      is_published,
      published_at,
    });
  }
  if (title_en && body_en) {
    entries.push({
      id: crypto.randomUUID(),
      title: title_en,
      body: body_en,
      locale: "en",
      is_published,
      published_at,
    });
  }
  if (title_si && body_si) {
    entries.push({
      id: crypto.randomUUID(),
      title: title_si,
      body: body_si,
      locale: "si",
      is_published,
      published_at,
    });
  }

  // Always update in-memory live store for instant reactivity and development persistence
  addUnifiedNoticeStore(entries);

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createAdminClient();
      const { error } = await supabase.from("notices").insert(entries);
      if (error) {
        console.warn("Supabase insert multilingual notices warning:", error.message);
      }
    } catch (err) {
      console.warn("Supabase insert multilingual notices warning:", err);
    }
  }

  revalidatePath("/admin/notices");
  revalidatePath("/admin");
  revalidatePath("/[locale]", "layout");
  revalidatePath("/[locale]/reports", "page");
  return { success: true };
}

export async function updateMultilingualNoticeAction(
  baseId: string,
  _prevState: { error?: string; success?: boolean } | null,
  formData: FormData
) {
  const session = await getAdminSession();
  if (!session) return { error: "Unauthorized" };

  const title_ta = (formData.get("title_ta") as string)?.trim();
  const body_ta = (formData.get("body_ta") as string)?.trim();
  const title_en = (formData.get("title_en") as string)?.trim();
  const body_en = (formData.get("body_en") as string)?.trim();
  const title_si = (formData.get("title_si") as string)?.trim();
  const body_si = (formData.get("body_si") as string)?.trim();
  const is_published = formData.get("is_published") === "on";

  if (
    (!title_ta || !body_ta) &&
    (!title_en || !body_en) &&
    (!title_si || !body_si)
  ) {
    return {
      error:
        "Please provide announcement details for at least one language.",
    };
  }

  updateUnifiedNoticeStore(
    baseId,
    {
      ta: title_ta && body_ta ? { title: title_ta, body: body_ta } : undefined,
      en: title_en && body_en ? { title: title_en, body: body_en } : undefined,
      si: title_si && body_si ? { title: title_si, body: body_si } : undefined,
    },
    is_published
  );

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createAdminClient();
      const allGroups = groupNotices(getAllNotices());
      const targetGroup = allGroups.find((g) => g.baseId === baseId);

      if (targetGroup) {
        for (const loc of ["ta", "en", "si"] as const) {
          const t = targetGroup.translations[loc];
          const newTitle = loc === "ta" ? title_ta : loc === "en" ? title_en : title_si;
          const newBody = loc === "ta" ? body_ta : loc === "en" ? body_en : body_si;

          if (newTitle && newBody) {
            if (t?.id) {
              await supabase
                .from("notices")
                .update({ title: newTitle, body: newBody, is_published })
                .eq("id", t.id);
            } else {
              await supabase.from("notices").insert({
                id: crypto.randomUUID(),
                title: newTitle,
                body: newBody,
                locale: loc,
                is_published,
                published_at: targetGroup.published_at || new Date().toISOString(),
              });
            }
          }
        }
      }
    } catch (err) {
      console.warn("Supabase update multilingual notice warning:", err);
    }
  }

  revalidatePath("/admin/notices");
  revalidatePath("/admin");
  revalidatePath("/[locale]", "layout");
  revalidatePath("/[locale]/reports", "page");
  return { success: true };
}

export async function toggleNoticeGroupPublishAction(
  baseId: string,
  currentState: boolean,
  translationIds?: string[]
) {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");

  const newState = !currentState;
  toggleUnifiedNoticePublishStore(baseId, currentState);

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createAdminClient();
      const idsToUpdate = new Set<string>();

      if (translationIds && translationIds.length > 0) {
        translationIds.forEach((id) => id && idsToUpdate.add(id));
      }

      // Add baseId and localized variants
      idsToUpdate.add(baseId);
      idsToUpdate.add(`${baseId}-ta`);
      idsToUpdate.add(`${baseId}-en`);
      idsToUpdate.add(`${baseId}-si`);

      if (baseId === "notice-shramadhana-seed") {
        idsToUpdate.add("notice-seed-ta");
        idsToUpdate.add("notice-seed-en");
        idsToUpdate.add("notice-seed-si");
        idsToUpdate.add("notice-1");
        idsToUpdate.add("notice-2");
        idsToUpdate.add("notice-3");
      }

      const allGroups = groupNotices(getAllNotices());
      const target = allGroups.find((g) => g.baseId === baseId);
      if (target) {
        Object.values(target.translations).forEach((t) => {
          if (t?.id) idsToUpdate.add(t.id);
        });
      }

      const idList = Array.from(idsToUpdate);
      if (idList.length > 0) {
        await supabase
          .from("notices")
          .update({ is_published: newState })
          .in("id", idList);
      }
    } catch (err) {
      console.warn("Supabase toggle notice publish warning:", err);
    }
  }

  revalidatePath("/admin/notices");
  revalidatePath("/admin");
  revalidatePath("/[locale]", "layout");
  revalidatePath("/[locale]/reports", "page");
  return { success: true };
}

export async function deleteNoticeGroupAction(
  baseId: string,
  translationIds?: string[]
) {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");

  deleteUnifiedNoticeStore(baseId);

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createAdminClient();
      const idsToDelete = new Set<string>();

      if (translationIds && translationIds.length > 0) {
        translationIds.forEach((id) => id && idsToDelete.add(id));
      }

      idsToDelete.add(baseId);
      idsToDelete.add(`${baseId}-ta`);
      idsToDelete.add(`${baseId}-en`);
      idsToDelete.add(`${baseId}-si`);

      if (baseId === "notice-shramadhana-seed") {
        idsToDelete.add("notice-seed-ta");
        idsToDelete.add("notice-seed-en");
        idsToDelete.add("notice-seed-si");
        idsToDelete.add("notice-1");
        idsToDelete.add("notice-2");
        idsToDelete.add("notice-3");
      }

      const allGroups = groupNotices(getAllNotices());
      const target = allGroups.find((g) => g.baseId === baseId);
      if (target) {
        Object.values(target.translations).forEach((t) => {
          if (t?.id) idsToDelete.add(t.id);
        });
      }

      const idList = Array.from(idsToDelete);
      if (idList.length > 0) {
        await supabase.from("notices").delete().in("id", idList);
      }
    } catch (err) {
      console.warn("Supabase delete notice warning:", err);
    }
  }

  revalidatePath("/admin/notices");
  revalidatePath("/admin");
  revalidatePath("/[locale]", "layout");
  revalidatePath("/[locale]/reports", "page");
  return { success: true };
}

// Single-record fallbacks for compatibility
export async function createNoticeAction(
  _prevState: { error?: string; success?: boolean } | null,
  formData: FormData
) {
  return createMultilingualNoticeAction(_prevState, formData);
}

export async function updateNoticeAction(
  id: string,
  _prevState: { error?: string; success?: boolean } | null,
  formData: FormData
) {
  return updateMultilingualNoticeAction(id, _prevState, formData);
}

export async function toggleNoticePublishAction(
  id: string,
  currentState: boolean
) {
  return toggleNoticeGroupPublishAction(id, currentState);
}

export async function deleteNoticeAction(id: string) {
  return deleteNoticeGroupAction(id);
}

// ====================================================================
// Reports & PDF Storage Actions
// ====================================================================

export async function uploadReportAction(
  _prevState: { error?: string; success?: boolean } | null,
  formData: FormData
) {
  const session = await getAdminSession();
  if (!session) return { error: "Unauthorized" };

  const title = (formData.get("title") as string)?.trim();
  const yearStr = formData.get("year") as string;
  const year = parseInt(yearStr, 10);
  const file = formData.get("file") as File | null;
  const is_published = formData.get("is_published") === "on";

  if (!title || isNaN(year) || !file || file.size === 0) {
    return { error: "Title, year, and a valid PDF file are required." };
  }

  if (!file.name.toLowerCase().endsWith(".pdf")) {
    return { error: "Only PDF documents are allowed." };
  }

  const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1) + " MB";
  let filePath = `/documents/reports/${file.name}`;

  if (isSupabaseConfigured()) {
    const supabase = await createAdminClient();

    // 1. Upload to Supabase Storage bucket 'reports'
    const storagePath = `${year}/${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from("reports")
      .upload(storagePath, buffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return { error: `Storage upload failed: ${uploadError.message}` };
    }

    const { data: publicUrlData } = supabase.storage
      .from("reports")
      .getPublicUrl(storagePath);

    filePath = publicUrlData.publicUrl;

    // 2. Insert record into reports table
    const { error: dbError } = await supabase.from("reports").insert({
      title,
      year,
      file_path: filePath,
      file_size: fileSizeMB,
      is_published,
    });

    if (dbError) {
      return { error: `Database insert failed: ${dbError.message}` };
    }
  }

  revalidatePath("/admin/reports");
  revalidatePath("/[locale]/reports", "page");
  return { success: true };
}

export async function toggleReportPublishAction(
  id: string,
  currentState: boolean
) {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");

  if (isSupabaseConfigured()) {
    const supabase = await createAdminClient();
    const { error } = await supabase
      .from("reports")
      .update({ is_published: !currentState })
      .eq("id", id);

    if (error) throw new Error(error.message);
  }

  revalidatePath("/admin/reports");
  revalidatePath("/[locale]/reports", "page");
  return { success: true };
}

export async function deleteReportAction(id: string, filePath?: string) {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");

  if (isSupabaseConfigured()) {
    const supabase = await createAdminClient();

    // Delete record from DB
    const { error } = await supabase.from("reports").delete().eq("id", id);
    if (error) throw new Error(error.message);

    // If file is in Supabase storage, remove it
    if (filePath && filePath.includes("/reports/")) {
      const parts = filePath.split("/reports/");
      if (parts[1]) {
        await supabase.storage.from("reports").remove([parts[1]]);
      }
    }
  }

  revalidatePath("/admin/reports");
  revalidatePath("/[locale]/reports", "page");
  return { success: true };
}

// ====================================================================
// News & Blog Articles Actions (Unified Multilingual)
// ====================================================================

export async function createMultilingualArticleAction(
  _prevState: { error?: string; success?: boolean } | null,
  formData: FormData
) {
  const session = await getAdminSession();
  if (!session) return { error: "Unauthorized" };

  const slugInput = (formData.get("slug") as string)?.trim();
  const category =
    (formData.get("category") as Article["category"]) || "general";
  const author =
    (formData.get("author") as string)?.trim() || "BJWS Editorial Board";
  const image_url = ((formData.get("image_url") as string)?.trim()) || "";
  const is_published = formData.get("is_published") === "on";

  const title_en = (formData.get("title_en") as string)?.trim();
  const excerpt_en = (formData.get("excerpt_en") as string)?.trim();
  const content_en = (formData.get("content_en") as string)?.trim();

  const title_ta = (formData.get("title_ta") as string)?.trim();
  const excerpt_ta = (formData.get("excerpt_ta") as string)?.trim();
  const content_ta = (formData.get("content_ta") as string)?.trim();

  const title_si = (formData.get("title_si") as string)?.trim();
  const excerpt_si = (formData.get("excerpt_si") as string)?.trim();
  const content_si = (formData.get("content_si") as string)?.trim();

  let gallery: ArticleImage[] = [];
  const galleryRaw = formData.get("gallery") as string;
  if (galleryRaw) {
    try {
      const parsed = JSON.parse(galleryRaw);
      if (Array.isArray(parsed)) {
        gallery = parsed
          .filter(
            (item: unknown): item is { url?: unknown; alt?: unknown; caption?: unknown } =>
              Boolean(item && typeof item === "object")
          )
          .filter((item) => typeof item.url === "string" && item.url.trim().length > 0)
          .map((item) => ({
            url: String(item.url).trim(),
            alt: typeof item.alt === "string" ? item.alt.trim() : "",
            caption: typeof item.caption === "string" ? item.caption.trim() : undefined,
          }));
      }
    } catch {
      // ignore JSON parse error
    }
  }

  if (
    (!title_en || !content_en) &&
    (!title_ta || !content_ta) &&
    (!title_si || !content_si)
  ) {
    return {
      error:
        "Please provide article title and content for at least one language.",
    };
  }

  const rawSlug = slugInput || title_en || title_ta || "article-" + Date.now();
  const baseSlug =
    extractBaseSlug(
      rawSlug
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/--+/g, "-")
        .trim()
    ) || `article-${Date.now()}`;

  const baseTimestamp = Date.now();
  const published_at = new Date().toISOString();

  const categoryLabels: Record<
    Article["category"],
    { en: string; ta: string; si: string }
  > = {
    cemetery: {
      en: "Cemetery Care",
      ta: "மையவாடி பராமரிப்பு",
      si: "සුසාන භූමි නඩත්තුව",
    },
    welfare: {
      en: "Welfare Relief",
      ta: "உலர் உணவு நிவாரணம்",
      si: "සුභසාධන සහන",
    },
    sunnah: {
      en: "Sunnah Education",
      ta: "சுன்னாஹ் வழிகாட்டல்",
      si: "ඉස්ලාමීය අධ්‍යාපනය",
    },
    announcements: {
      en: "Announcements",
      ta: "அறிவித்தல்கள்",
      si: "නිවේදන",
    },
    general: {
      en: "General News",
      ta: "பொதுச் செய்திகள்",
      si: "පොදු පුවත්",
    },
  };

  const newArticles: Article[] = [];

  if (title_en && content_en) {
    newArticles.push({
      id: `art-${baseTimestamp}-en`,
      slug: baseSlug,
      title: title_en,
      excerpt: excerpt_en || content_en.slice(0, 160) + "...",
      content: content_en,
      category,
      categoryLabel: categoryLabels[category] || categoryLabels.general,
      author,
      image_url,
      gallery: gallery.length > 0 ? gallery : undefined,
      locale: "en",
      published_at,
      is_published,
      read_time_minutes: Math.max(
        1,
        Math.ceil((content_en.split(/\s+/).length || 200) / 180)
      ),
    });
  }

  if (title_ta && content_ta) {
    newArticles.push({
      id: `art-${baseTimestamp}-ta`,
      slug: `${baseSlug}-ta`,
      title: title_ta,
      excerpt: excerpt_ta || content_ta.slice(0, 160) + "...",
      content: content_ta,
      category,
      categoryLabel: categoryLabels[category] || categoryLabels.general,
      author,
      image_url,
      gallery: gallery.length > 0 ? gallery : undefined,
      locale: "ta",
      published_at,
      is_published,
      read_time_minutes: Math.max(
        1,
        Math.ceil((content_ta.split(/\s+/).length || 200) / 180)
      ),
    });
  }

  if (title_si && content_si) {
    newArticles.push({
      id: `art-${baseTimestamp}-si`,
      slug: `${baseSlug}-si`,
      title: title_si,
      excerpt: excerpt_si || content_si.slice(0, 160) + "...",
      content: content_si,
      category,
      categoryLabel: categoryLabels[category] || categoryLabels.general,
      author,
      image_url,
      gallery: gallery.length > 0 ? gallery : undefined,
      locale: "si",
      published_at,
      is_published,
      read_time_minutes: Math.max(
        1,
        Math.ceil((content_si.split(/\s+/).length || 200) / 180)
      ),
    });
  }

  addUnifiedArticleStore(newArticles);

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createAdminClient();
      await supabase.from("articles").insert(
        newArticles.map((a) => ({
          id: a.id,
          slug: a.slug,
          title: a.title,
          excerpt: a.excerpt,
          content: a.content,
          category: a.category,
          author: a.author,
          image_url: a.image_url,
          locale: a.locale,
          is_published: a.is_published,
          published_at: a.published_at,
        }))
      );
    } catch (err) {
      console.warn("Supabase insert multilingual article warning:", err);
    }
  }

  revalidatePath("/admin/news");
  revalidatePath("/[locale]/news", "page");
  return { success: true };
}

export async function updateMultilingualArticleAction(
  baseSlug: string,
  _prevState: { error?: string; success?: boolean } | null,
  formData: FormData
) {
  const session = await getAdminSession();
  if (!session) return { error: "Unauthorized" };

  const category =
    (formData.get("category") as Article["category"]) || "general";
  const author =
    (formData.get("author") as string)?.trim() || "BJWS Editorial Board";
  const image_url = ((formData.get("image_url") as string)?.trim()) || "";
  const is_published = formData.get("is_published") === "on";

  const title_en = (formData.get("title_en") as string)?.trim();
  const excerpt_en = (formData.get("excerpt_en") as string)?.trim();
  const content_en = (formData.get("content_en") as string)?.trim();

  const title_ta = (formData.get("title_ta") as string)?.trim();
  const excerpt_ta = (formData.get("excerpt_ta") as string)?.trim();
  const content_ta = (formData.get("content_ta") as string)?.trim();

  const title_si = (formData.get("title_si") as string)?.trim();
  const excerpt_si = (formData.get("excerpt_si") as string)?.trim();
  const content_si = (formData.get("content_si") as string)?.trim();

  let gallery: ArticleImage[] = [];
  const galleryRaw = formData.get("gallery") as string;
  if (galleryRaw) {
    try {
      const parsed = JSON.parse(galleryRaw);
      if (Array.isArray(parsed)) {
        gallery = parsed
          .filter(
            (item: unknown): item is { url?: unknown; alt?: unknown; caption?: unknown } =>
              Boolean(item && typeof item === "object")
          )
          .filter((item) => typeof item.url === "string" && item.url.trim().length > 0)
          .map((item) => ({
            url: String(item.url).trim(),
            alt: typeof item.alt === "string" ? item.alt.trim() : "",
            caption: typeof item.caption === "string" ? item.caption.trim() : undefined,
          }));
      }
    } catch {
      // ignore JSON parse error
    }
  }

  if (
    (!title_en || !content_en) &&
    (!title_ta || !content_ta) &&
    (!title_si || !content_si)
  ) {
    return {
      error:
        "Please provide article title and content for at least one language.",
    };
  }

  const normalizedBase = extractBaseSlug(baseSlug);

  const categoryLabels: Record<
    Article["category"],
    { en: string; ta: string; si: string }
  > = {
    cemetery: {
      en: "Cemetery Care",
      ta: "மையவாடி பராமரிப்பு",
      si: "සුසාන භූමි නඩත්තුව",
    },
    welfare: {
      en: "Welfare Relief",
      ta: "உலர் உணவு நிவாரணம்",
      si: "සුභසාධන සහන",
    },
    sunnah: {
      en: "Sunnah Education",
      ta: "சுன்னாஹ் வழிகாட்டல்",
      si: "ඉස්ලාමීය අධ්‍යාපනය",
    },
    announcements: {
      en: "Announcements",
      ta: "அறிவித்தல்கள்",
      si: "නිවේදන",
    },
    general: {
      en: "General News",
      ta: "பொதுச் செய்திகள்",
      si: "පොදු පුවත්",
    },
  };

  const commonUpdates: Partial<Article> = {
    category,
    categoryLabel: categoryLabels[category] || categoryLabels.general,
    author,
    image_url,
    gallery,
    is_published,
  };

  const translationUpdates: Partial<
    Record<
      "en" | "ta" | "si",
      { title: string; excerpt: string; content: string }
    >
  > = {};
  if (title_en && content_en) {
    translationUpdates.en = {
      title: title_en,
      excerpt: excerpt_en || content_en.slice(0, 160) + "...",
      content: content_en,
    };
  }
  if (title_ta && content_ta) {
    translationUpdates.ta = {
      title: title_ta,
      excerpt: excerpt_ta || content_ta.slice(0, 160) + "...",
      content: content_ta,
    };
  }
  if (title_si && content_si) {
    translationUpdates.si = {
      title: title_si,
      excerpt: excerpt_si || content_si.slice(0, 160) + "...",
      content: content_si,
    };
  }

  updateUnifiedArticleStore(normalizedBase, commonUpdates, translationUpdates);

  const existingArticles = getArticles("en", true);
  const langSpecs = [
    {
      loc: "en" as const,
      title: title_en,
      excerpt: excerpt_en,
      content: content_en,
      slugSuffix: "",
    },
    {
      loc: "ta" as const,
      title: title_ta,
      excerpt: excerpt_ta,
      content: content_ta,
      slugSuffix: "-ta",
    },
    {
      loc: "si" as const,
      title: title_si,
      excerpt: excerpt_si,
      content: content_si,
      slugSuffix: "-si",
    },
  ];

  for (const spec of langSpecs) {
    if (spec.title && spec.content) {
      const alreadyHasLang = existingArticles.some(
        (a) =>
          extractBaseSlug(a.slug) === normalizedBase && a.locale === spec.loc
      );
      if (!alreadyHasLang) {
        addUnifiedArticleStore([
          {
            id: `art-${Date.now()}-${spec.loc}`,
            slug: `${normalizedBase}${spec.slugSuffix}`,
            title: spec.title,
            excerpt: spec.excerpt || spec.content.slice(0, 160) + "...",
            content: spec.content,
            category,
            categoryLabel: categoryLabels[category] || categoryLabels.general,
            author,
            image_url,
            locale: spec.loc,
            published_at: new Date().toISOString(),
            is_published,
            read_time_minutes: Math.max(
              1,
              Math.ceil((spec.content.split(/\s+/).length || 200) / 180)
            ),
          },
        ]);
      }
    }
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createAdminClient();
      for (const spec of langSpecs) {
        if (spec.title && spec.content) {
          const s = `${normalizedBase}${spec.slugSuffix}`;
          await supabase.from("articles").upsert(
            {
              slug: s,
              title: spec.title,
              excerpt: spec.excerpt || spec.content.slice(0, 160) + "...",
              content: spec.content,
              category,
              author,
              image_url,
              locale: spec.loc,
              is_published,
            },
            { onConflict: "slug" }
          );
        }
      }
    } catch (err) {
      console.warn("Supabase update multilingual article warning:", err);
    }
  }

  revalidatePath("/admin/news");
  revalidatePath("/[locale]/news", "page");
  return { success: true };
}

export async function toggleUnifiedArticlePublishAction(
  baseSlug: string,
  currentState: boolean
) {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");

  const newState = !currentState;
  const normalizedBase = extractBaseSlug(baseSlug);
  toggleUnifiedArticlePublishStore(normalizedBase, newState);

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createAdminClient();
      await supabase
        .from("articles")
        .update({ is_published: newState })
        .in("slug", [
          normalizedBase,
          `${normalizedBase}-ta`,
          `${normalizedBase}-si`,
          `${normalizedBase}-en`,
        ]);
    } catch (err) {
      console.warn("Supabase toggle publish warning:", err);
    }
  }

  revalidatePath("/admin/news");
  revalidatePath("/[locale]/news", "page");
  return { success: true };
}

export async function deleteUnifiedArticleAction(baseSlug: string) {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");

  const normalizedBase = extractBaseSlug(baseSlug);
  deleteUnifiedArticleStore(normalizedBase);

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createAdminClient();
      await supabase
        .from("articles")
        .delete()
        .in("slug", [
          normalizedBase,
          `${normalizedBase}-ta`,
          `${normalizedBase}-si`,
          `${normalizedBase}-en`,
        ]);
    } catch (err) {
      console.warn("Supabase delete article warning:", err);
    }
  }

  revalidatePath("/admin/news");
  revalidatePath("/[locale]/news", "page");
  return { success: true };
}

export async function createArticleAction(
  _prevState: { error?: string; success?: boolean } | null,
  formData: FormData
) {
  const session = await getAdminSession();
  if (!session) return { error: "Unauthorized" };

  const title = (formData.get("title") as string)?.trim();
  const slugInput = (formData.get("slug") as string)?.trim();
  const excerpt = (formData.get("excerpt") as string)?.trim();
  const content = (formData.get("content") as string)?.trim();
  const category =
    (formData.get("category") as Article["category"]) || "general";
  const author =
    (formData.get("author") as string)?.trim() || "BJWS Editorial Board";
  const locale = (formData.get("locale") as "en" | "ta" | "si") || "en";
  const image_url = ((formData.get("image_url") as string)?.trim()) || "";
  const is_published = formData.get("is_published") === "on";

  if (!title || !content) {
    return { error: "Title and content are required." };
  }

  const slug = (slugInput || title)
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .trim();

  const id = `art-${Date.now()}`;
  const published_at = new Date().toISOString();
  const wordCount = content.split(/\s+/).length;
  const read_time_minutes = Math.max(1, Math.ceil(wordCount / 180));

  const categoryLabels: Record<
    Article["category"],
    { en: string; ta: string; si: string }
  > = {
    cemetery: {
      en: "Cemetery Care",
      ta: "மையவாடி பராமரிப்பு",
      si: "සුසාන භූමි නඩත්තුව",
    },
    welfare: {
      en: "Welfare Relief",
      ta: "உலர் உணவு நிவாரணம்",
      si: "සුභසාධන සහන",
    },
    sunnah: {
      en: "Sunnah Education",
      ta: "சுன்னாஹ் வழிகாட்டல்",
      si: "ඉස්ලාමීය අධ්‍යාපනය",
    },
    announcements: {
      en: "Announcements",
      ta: "அறிவித்தல்கள்",
      si: "නිවේදන",
    },
    general: {
      en: "General News",
      ta: "பொதுச் செய்திகள்",
      si: "පොදු පුවත්",
    },
  };

  const newArticle: Article = {
    id,
    slug,
    title,
    excerpt: excerpt || content.slice(0, 160) + "...",
    content,
    category,
    categoryLabel: categoryLabels[category] || categoryLabels.general,
    author,
    image_url,
    locale,
    published_at,
    is_published,
    read_time_minutes,
  };

  addArticleStore(newArticle);

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createAdminClient();
      await supabase.from("articles").insert({
        id,
        slug,
        title,
        excerpt: newArticle.excerpt,
        content,
        category,
        author,
        image_url,
        locale,
        is_published,
        published_at,
      });
    } catch (err) {
      console.warn("Supabase insert article warning:", err);
    }
  }

  revalidatePath("/admin/news");
  revalidatePath("/[locale]/news", "page");
  revalidatePath(`/[locale]/news/${slug}`, "page");
  return { success: true };
}

export async function updateArticleAction(
  _prevState: { error?: string; success?: boolean } | null,
  formData: FormData
) {
  const session = await getAdminSession();
  if (!session) return { error: "Unauthorized" };

  const id = formData.get("id") as string;
  const title = (formData.get("title") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim();
  const excerpt = (formData.get("excerpt") as string)?.trim();
  const content = (formData.get("content") as string)?.trim();
  const category =
    (formData.get("category") as Article["category"]) || "general";
  const author =
    (formData.get("author") as string)?.trim() || "BJWS Editorial Board";
  const locale = (formData.get("locale") as "en" | "ta" | "si") || "en";
  const image_url = (formData.get("image_url") as string)?.trim();
  const is_published = formData.get("is_published") === "on";

  if (!id || !title || !content) {
    return { error: "ID, title, and content are required." };
  }

  const categoryLabels: Record<
    Article["category"],
    { en: string; ta: string; si: string }
  > = {
    cemetery: {
      en: "Cemetery Care",
      ta: "மையவாடி பராமரிப்பு",
      si: "සුසාන භූමි නඩත්තුව",
    },
    welfare: {
      en: "Welfare Relief",
      ta: "உலர் உணவு நிவாரணம்",
      si: "සුභසාධන සහන",
    },
    sunnah: {
      en: "Sunnah Education",
      ta: "சுன்னாஹ் வழிகாட்டல்",
      si: "ඉස්ලාමීය අධ්‍යාපනය",
    },
    announcements: {
      en: "Announcements",
      ta: "அறிவித்தல்கள்",
      si: "නිවේදන",
    },
    general: {
      en: "General News",
      ta: "பொதுச் செய்திகள்",
      si: "පොදු පුවත්",
    },
  };

  const updates: Partial<Article> = {
    title,
    slug,
    excerpt: excerpt || content.slice(0, 160) + "...",
    content,
    category,
    categoryLabel: categoryLabels[category] || categoryLabels.general,
    author,
    locale,
    is_published,
    ...(image_url ? { image_url } : {}),
  };

  updateArticleStore(id, updates);

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createAdminClient();
      await supabase
        .from("articles")
        .update({
          title,
          slug,
          excerpt: updates.excerpt,
          content,
          category,
          author,
          locale,
          is_published,
          ...(image_url ? { image_url } : {}),
        })
        .eq("id", id);
    } catch (err) {
      console.warn("Supabase update article warning:", err);
    }
  }

  revalidatePath("/admin/news");
  revalidatePath("/[locale]/news", "page");
  revalidatePath(`/[locale]/news/${slug}`, "page");
  return { success: true };
}

export async function toggleArticlePublishAction(
  id: string,
  currentState: boolean
) {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");

  const newState = !currentState;
  updateArticleStore(id, { is_published: newState });

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createAdminClient();
      await supabase
        .from("articles")
        .update({ is_published: newState })
        .eq("id", id);
    } catch (err) {
      console.warn("Supabase toggle publish warning:", err);
    }
  }

  revalidatePath("/admin/news");
  revalidatePath("/[locale]/news", "page");
  return { success: true };
}

export async function deleteArticleAction(id: string) {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");

  deleteArticleStore(id);

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createAdminClient();
      await supabase.from("articles").delete().eq("id", id);
    } catch (err) {
      console.warn("Supabase delete article warning:", err);
    }
  }

  revalidatePath("/admin/news");
  revalidatePath("/[locale]/news", "page");
  return { success: true };
}

// ====================================================================
// Team Members Management Actions
// ====================================================================

const TEAM_CATEGORY_LABELS: Record<
  TeamMember["category"],
  { en: string; ta: string; si: string }
> = {
  executive: {
    en: "Executive Council",
    ta: "நிர்வாகக் குழு",
    si: "විධායක සභාව",
  },
  operations: {
    en: "Operations & Committee",
    ta: "செயற்குழு",
    si: "මෙහෙයුම් කමිටුව",
  },
  funeral: {
    en: "Funeral Services",
    ta: "ஜனாஸா சேவைகள்",
    si: "අවමංගල්‍ය සේවා",
  },
  welfare: {
    en: "Community Welfare",
    ta: "பொது நலன்புரி",
    si: "ප්‍රජා සුභසාධන",
  },
  cemetery: {
    en: "Cemetery Care",
    ta: "மையவாடி பராமரிப்பு",
    si: "සුසාන භූමි නඩත්තුව",
  },
};

export async function createTeamMemberAction(
  _prevState: { error?: string; success?: boolean } | null,
  formData: FormData
) {
  const session = await getAdminSession();
  if (!session) return { error: "Unauthorized" };

  const name = (formData.get("name") as string)?.trim();
  const roleEn = (formData.get("roleEn") as string)?.trim();
  const roleTa = (formData.get("roleTa") as string)?.trim() || roleEn;
  const roleSi = (formData.get("roleSi") as string)?.trim() || roleEn;
  const category =
    (formData.get("category") as TeamMember["category"]) || "operations";
  const phone = (formData.get("phone") as string)?.trim() || "";
  const whatsapp = (formData.get("whatsapp") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const address = (formData.get("address") as string)?.trim() || "Mullipothana";
  const initialsInput = (formData.get("initials") as string)?.trim();
  const photo = (formData.get("photo") as string)?.trim() || "";
  const term = (formData.get("term") as string)?.trim() || "2023 - Present";
  const isInactive = formData.get("isInactive") === "on";
  const memberId = (formData.get("memberId") as string)?.trim();
  const nic = (formData.get("nic") as string)?.trim();
  const issueDate = (formData.get("issueDate") as string)?.trim() || "2024-01-01";
  const verificationStatus =
    (formData.get("verificationStatus") as TeamMember["verificationStatus"]) ||
    (isInactive ? "suspended" : "verified");

  if (!name || !roleEn) {
    return { error: "Officer Name and English Role designation are required." };
  }

  // Generate clean initials if not specified
  const initials =
    initialsInput ||
    name
      .split(/[\s.]+/)
      .filter(Boolean)
      .map((w) => w[0].toUpperCase())
      .slice(0, 4)
      .join("");

  const id =
    (name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "member") +
    "-" +
    Date.now().toString().slice(-4);

  const newMember: TeamMember = {
    id,
    name,
    role: {
      en: roleEn,
      ta: roleTa,
      si: roleSi,
    },
    category,
    categoryLabel:
      TEAM_CATEGORY_LABELS[category] || TEAM_CATEGORY_LABELS.operations,
    phone,
    ...(whatsapp ? { whatsapp } : {}),
    ...(email ? { email } : {}),
    address,
    initials,
    ...(photo ? { photo } : {}),
    term,
    ...(isInactive ? { isInactive: true } : {}),
    ...(memberId ? { memberId } : {}),
    ...(nic ? { nic } : {}),
    issueDate,
    verificationStatus,
  };

  addTeamMemberStore(newMember);

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createAdminClient();
      await supabase.from("team_members").upsert(
        {
          id,
          name,
          role_en: roleEn,
          role_ta: roleTa,
          role_si: roleSi,
          category,
          phone,
          whatsapp: whatsapp || null,
          email: email || null,
          address,
          initials,
          photo: photo || null,
          term,
          is_inactive: isInactive,
          member_id: memberId || null,
          nic: nic || null,
          issue_date: issueDate || "2026-01-01",
          verification_status: verificationStatus || "verified",
        },
        { onConflict: "id" }
      );
    } catch (err) {
      console.warn("Supabase insert team member warning:", err);
    }
  }

  revalidatePath("/admin/team");
  revalidatePath("/admin");
  revalidatePath("/[locale]/team", "page");
  revalidatePath("/[locale]/about", "page");
  revalidatePath("/en/team");
  revalidatePath("/ta/team");
  revalidatePath("/si/team");
  revalidatePath("/en/about");
  revalidatePath("/ta/about");
  revalidatePath("/si/about");
  return { success: true };
}

export async function updateTeamMemberAction(
  _prevState: { error?: string; success?: boolean } | null,
  formData: FormData
) {
  const session = await getAdminSession();
  if (!session) return { error: "Unauthorized" };

  const id = formData.get("id") as string;
  const name = (formData.get("name") as string)?.trim();
  const roleEn = (formData.get("roleEn") as string)?.trim();
  const roleTa = (formData.get("roleTa") as string)?.trim() || roleEn;
  const roleSi = (formData.get("roleSi") as string)?.trim() || roleEn;
  const category =
    (formData.get("category") as TeamMember["category"]) || "operations";
  const phone = (formData.get("phone") as string)?.trim() || "";
  const whatsapp = (formData.get("whatsapp") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const address = (formData.get("address") as string)?.trim() || "Mullipothana";
  const initials = (formData.get("initials") as string)?.trim() || "BJWS";
  const photo = (formData.get("photo") as string)?.trim() || "";
  const term = (formData.get("term") as string)?.trim() || "2023 - Present";
  const isInactive = formData.get("isInactive") === "on";
  const memberId = (formData.get("memberId") as string)?.trim();
  const nic = (formData.get("nic") as string)?.trim();
  const issueDate = (formData.get("issueDate") as string)?.trim();
  const verificationStatus =
    (formData.get("verificationStatus") as TeamMember["verificationStatus"]) ||
    (isInactive ? "suspended" : "verified");

  if (!id || !name || !roleEn) {
    return { error: "ID, Name, and Role designation are required." };
  }

  const updates: Partial<TeamMember> = {
    name,
    role: {
      en: roleEn,
      ta: roleTa,
      si: roleSi,
    },
    category,
    categoryLabel:
      TEAM_CATEGORY_LABELS[category] || TEAM_CATEGORY_LABELS.operations,
    phone,
    whatsapp: whatsapp || undefined,
    email: email || undefined,
    address,
    initials,
    photo: photo || undefined,
    term,
    isInactive,
    memberId: memberId || undefined,
    nic: nic || undefined,
    issueDate: issueDate || undefined,
    verificationStatus,
  };

  updateTeamMemberStore(id, updates);

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createAdminClient();
      await supabase.from("team_members").upsert(
        {
          id,
          name,
          role_en: roleEn,
          role_ta: roleTa,
          role_si: roleSi,
          category,
          phone,
          whatsapp: whatsapp || null,
          email: email || null,
          address,
          initials,
          photo: photo || null,
          term,
          is_inactive: isInactive,
          member_id: memberId || null,
          nic: nic || null,
          issue_date: issueDate || "2026-01-01",
          verification_status: verificationStatus || "verified",
        },
        { onConflict: "id" }
      );
    } catch (err) {
      console.warn("Supabase update team member warning:", err);
    }
  }

  revalidatePath("/admin/team");
  revalidatePath("/admin");
  revalidatePath("/[locale]/team", "page");
  revalidatePath("/[locale]/about", "page");
  revalidatePath("/en/team");
  revalidatePath("/ta/team");
  revalidatePath("/si/team");
  revalidatePath("/en/about");
  revalidatePath("/ta/about");
  revalidatePath("/si/about");
  return { success: true };
}

export async function toggleTeamMemberActiveAction(id: string) {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");

  toggleTeamMemberActiveStore(id);

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createAdminClient();
      const { data } = await supabase
        .from("team_members")
        .select("is_inactive")
        .eq("id", id)
        .single();
      if (data) {
        await supabase
          .from("team_members")
          .update({ is_inactive: !data.is_inactive })
          .eq("id", id);
      }
    } catch (err) {
      console.warn("Supabase toggle team member status warning:", err);
    }
  }

  revalidatePath("/admin/team");
  revalidatePath("/admin");
  revalidatePath("/[locale]/team", "page");
  revalidatePath("/[locale]/about", "page");
  return { success: true };
}

export async function deleteTeamMemberAction(id: string) {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");

  deleteTeamMemberStore(id);

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createAdminClient();
      await supabase.from("team_members").delete().eq("id", id);
    } catch (err) {
      console.warn("Supabase delete team member warning:", err);
    }
  }

  revalidatePath("/admin/team");
  revalidatePath("/admin");
  revalidatePath("/[locale]/team", "page");
  revalidatePath("/[locale]/about", "page");
  return { success: true };
}

export async function reorderTeamMembersAction(orderedIds: string[]) {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");

  reorderTeamMembersStore(orderedIds);

  revalidatePath("/admin/team");
  revalidatePath("/admin");
  revalidatePath("/[locale]/team", "page");
  revalidatePath("/[locale]/about", "page");
  return { success: true };
}

export async function regenerateMemberVerificationTokenAction(id: string) {
  const session = await getAdminSession();
  if (!session) return { error: "Unauthorized" };

  const token = regenerateMemberVerificationTokenStore(id);
  if (!token) return { error: "Team member not found" };

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createAdminClient();
      await supabase
        .from("team_members")
        .update({ verification_token: token })
        .eq("id", id);
    } catch (err) {
      console.warn("Supabase update verification token warning:", err);
    }
  }

  revalidatePath("/admin/team");
  revalidatePath("/[locale]/verify/credential", "page");
  return { success: true, token };
}

// ====================================================================
// Gallery Photos Management Actions
// ====================================================================

export async function createGalleryImageAction(
  _prevState: { error?: string; success?: boolean } | null,
  formData: FormData
) {
  const session = await getAdminSession();
  if (!session) return { error: "Unauthorized" };

  const src = (formData.get("src") as string)?.trim() || "";
  const caption = (formData.get("caption") as string)?.trim();
  const category =
    ((formData.get("category") as string)?.trim() as GalleryCategory) || "general";
  const date =
    (formData.get("date") as string)?.trim() ||
    new Date().getFullYear().toString();
  const location =
    (formData.get("location") as string)?.trim() || "Mullipothana";
  const approved = formData.get("approved") === "on";
  const consentNotes = (formData.get("consentNotes") as string)?.trim();

  if (!src || !caption) {
    return { error: "Image URL and Caption are required." };
  }

  const id = "gal-" + Date.now().toString();

  const newImage: GalleryImage = {
    id,
    src,
    altKey: caption,
    captionKey: caption,
    category,
    date,
    location,
    width: 1200,
    height: 800,
    blurDataURL: DEFAULT_BLUR,
    approved,
    ...(consentNotes ? { consentNotes } : {}),
  };

  addGalleryImageStore(newImage);

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createAdminClient();
      await supabase.from("gallery_images").insert({
        id,
        src,
        caption,
        category,
        date,
        location,
        approved,
        consent_notes: consentNotes,
      });
    } catch (err) {
      console.warn("Supabase insert gallery image warning:", err);
    }
  }

  revalidatePath("/admin/gallery");
  revalidatePath("/admin");
  revalidatePath("/[locale]/gallery", "page");
  revalidatePath("/[locale]", "page");
  return { success: true };
}

export async function updateGalleryImageAction(
  _prevState: { error?: string; success?: boolean } | null,
  formData: FormData
) {
  const session = await getAdminSession();
  if (!session) return { error: "Unauthorized" };

  const id = formData.get("id") as string;
  const src = (formData.get("src") as string)?.trim() || "";
  const caption = (formData.get("caption") as string)?.trim();
  const category =
    ((formData.get("category") as string)?.trim() as GalleryCategory) || "general";
  const date =
    (formData.get("date") as string)?.trim() ||
    new Date().getFullYear().toString();
  const location =
    (formData.get("location") as string)?.trim() || "Mullipothana";
  const approved = formData.get("approved") === "on";
  const consentNotes = (formData.get("consentNotes") as string)?.trim();

  if (!id || !src || !caption) {
    return { error: "ID, Image URL, and Caption are required." };
  }

  const updates: Partial<GalleryImage> = {
    src,
    captionKey: caption,
    altKey: caption,
    category,
    date,
    location,
    approved,
    consentNotes: consentNotes || undefined,
  };

  updateGalleryImageStore(id, updates);

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createAdminClient();
      await supabase
        .from("gallery_images")
        .update({
          src,
          caption,
          category,
          date,
          location,
          approved,
          consent_notes: consentNotes,
        })
        .eq("id", id);
    } catch (err) {
      console.warn("Supabase update gallery image warning:", err);
    }
  }

  revalidatePath("/admin/gallery");
  revalidatePath("/admin");
  revalidatePath("/[locale]/gallery", "page");
  revalidatePath("/[locale]", "page");
  return { success: true };
}

export async function toggleGalleryApprovalAction(
  id: string,
  currentApproved: boolean
) {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");

  const newApproved = !currentApproved;
  toggleGalleryApprovalStore(id);

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createAdminClient();
      await supabase
        .from("gallery_images")
        .update({ approved: newApproved })
        .eq("id", id);
    } catch (err) {
      console.warn("Supabase toggle gallery approval warning:", err);
    }
  }

  revalidatePath("/admin/gallery");
  revalidatePath("/admin");
  revalidatePath("/[locale]/gallery", "page");
  revalidatePath("/[locale]", "page");
  return { success: true };
}

export async function deleteGalleryImageAction(id: string) {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");

  deleteGalleryImageStore(id);

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createAdminClient();
      await supabase.from("gallery_images").delete().eq("id", id);
    } catch (err) {
      console.warn("Supabase delete gallery image warning:", err);
    }
  }

  revalidatePath("/admin/gallery");
  revalidatePath("/admin");
  revalidatePath("/[locale]/gallery", "page");
  revalidatePath("/[locale]", "page");
  return { success: true };
}

// ====================================================================
// Modern Image Upload Pipeline (Supabase Storage + Local Fallback)
// ====================================================================

async function saveUploadedImageFile(
  file: File,
  folder: string = "gallery"
): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const cleanName = file.name
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const extension = path.extname(cleanName) || ".webp";
  const baseName = path.basename(cleanName, extension) || "photo";
  const uniqueFileName = `${Date.now()}-${baseName}${extension}`;

  // 1. Try Supabase Storage if configured
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createAdminClient();
      const storagePath = `${folder}/${uniqueFileName}`;
      const contentType =
        file.type || (extension === ".webp" ? "image/webp" : "image/jpeg");

      const { error: uploadError } = await supabase.storage
        .from("gallery")
        .upload(storagePath, buffer, {
          contentType,
          upsert: true,
        });

      if (!uploadError) {
        const { data: publicUrlData } = supabase.storage
          .from("gallery")
          .getPublicUrl(storagePath);
        if (publicUrlData?.publicUrl) {
          return publicUrlData.publicUrl;
        }
      } else {
        console.warn(
          "Supabase Storage bucket upload warning, falling back to local storage:",
          uploadError.message
        );
      }
    } catch (storageErr) {
      console.warn(
        "Supabase Storage exception, using local storage fallback:",
        storageErr
      );
    }
  }

  // 2. Local File System Fallback (public/images/uploads/)
  const uploadDir = path.join(
    process.cwd(),
    "public",
    "images",
    "uploads",
    folder
  );
  await fs.mkdir(uploadDir, { recursive: true });
  const localFilePath = path.join(uploadDir, uniqueFileName);
  await fs.writeFile(localFilePath, buffer);

  return `/images/uploads/${folder}/${uniqueFileName}`;
}

export async function uploadSingleImageAction(
  formData: FormData
): Promise<{ success?: boolean; url?: string; error?: string }> {
  const session = await getAdminSession();
  if (!session) return { error: "Unauthorized" };

  const file = formData.get("file") as File | null;
  const folder = (formData.get("folder") as string)?.trim() || "gallery";

  if (!file || file.size === 0) {
    return { error: "No image file provided." };
  }

  try {
    const url = await saveUploadedImageFile(file, folder);
    return { success: true, url };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Image upload failed.";
    return { error: msg };
  }
}

export async function batchUploadGalleryAction(
  formData: FormData
): Promise<{ success?: boolean; count?: number; error?: string }> {
  const session = await getAdminSession();
  if (!session) return { error: "Unauthorized" };

  const files = formData.getAll("files") as File[];
  const captions = formData.getAll("captions") as string[];
  const category =
    ((formData.get("category") as string)?.trim() as GalleryCategory) || "general";
  const date =
    (formData.get("date") as string)?.trim() ||
    new Date().getFullYear().toString();
  const location =
    (formData.get("location") as string)?.trim() || "Mullipothana";
  const approved =
    formData.get("approved") === "on" || formData.get("approved") === "true";
  const captionPrefix = (formData.get("captionPrefix") as string)?.trim() || "";
  const consentNotes = (formData.get("consentNotes") as string)?.trim();

  if (!files || files.length === 0) {
    return { error: "Please select at least one image file to upload." };
  }

  const validFiles = files.filter((f) => f && f.size > 0);
  if (validFiles.length === 0) {
    return { error: "No valid image files received." };
  }

  let uploadedCount = 0;
  const newImagesToInsert: Array<{
    id: string;
    src: string;
    caption: string;
    category: GalleryCategory;
    date: string;
    location: string;
    approved: boolean;
    consent_notes?: string;
  }> = [];

  for (let i = 0; i < validFiles.length; i++) {
    const file = validFiles[i];
    try {
      const src = await saveUploadedImageFile(file, "gallery");
      const id = `gal-${Date.now()}-${i + 1}-${Math.random()
        .toString(36)
        .substring(2, 7)}`;
      const individualCaption = captions[i]?.trim();
      const caption =
        individualCaption ||
        (validFiles.length === 1 && captionPrefix
          ? captionPrefix
          : captionPrefix
          ? `${captionPrefix} (${i + 1})`
          : `Community Activity - Photo ${i + 1}`);

      const newImage: GalleryImage = {
        id,
        src,
        altKey: caption,
        captionKey: caption,
        category,
        date,
        location,
        width: 1200,
        height: 800,
        blurDataURL: DEFAULT_BLUR,
        approved,
        ...(consentNotes ? { consentNotes } : {}),
      };

      addGalleryImageStore(newImage);

      newImagesToInsert.push({
        id,
        src,
        caption,
        category,
        date,
        location,
        approved,
        ...(consentNotes ? { consent_notes: consentNotes } : {}),
      });

      uploadedCount++;
    } catch (uploadErr) {
      console.error(`Error processing file ${file.name}:`, uploadErr);
    }
  }

  if (isSupabaseConfigured() && newImagesToInsert.length > 0) {
    try {
      const supabase = await createAdminClient();
      await supabase.from("gallery_images").insert(newImagesToInsert);
    } catch (err) {
      console.warn("Supabase batch insert gallery warning:", err);
    }
  }

  revalidatePath("/admin/gallery");
  revalidatePath("/admin");
  revalidatePath("/[locale]/gallery", "page");
  revalidatePath("/[locale]", "page");

  return { success: true, count: uploadedCount };
}

export async function renameGalleryCategoryAction(
  oldCategory: string,
  newCategory: string
): Promise<{ success?: boolean; updatedCount?: number; error?: string }> {
  const session = await getAdminSession();
  if (!session) return { error: "Unauthorized" };

  const cleanOld = oldCategory?.trim();
  const cleanNew = newCategory
    ?.trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!cleanOld || !cleanNew) {
    return { error: "Both old and new category names are required." };
  }

  if (cleanOld === cleanNew) {
    return { success: true, updatedCount: 0 };
  }

  // Update in-memory store
  const updatedCount = renameGalleryCategoryStore(cleanOld, cleanNew);

  // Update Supabase if configured
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createAdminClient();
      const { error } = await supabase
        .from("gallery_images")
        .update({ category: cleanNew })
        .eq("category", cleanOld);

      if (error) {
        console.warn("Supabase rename gallery category warning:", error.message);
      }
    } catch (err) {
      console.warn("Supabase rename category exception:", err);
    }
  }

  revalidatePath("/admin/gallery");
  revalidatePath("/admin");
  revalidatePath("/[locale]/gallery", "page");
  revalidatePath("/[locale]", "page");

  return { success: true, updatedCount };
}
