"use server";

import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/admin-auth";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

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
    const supabase = await createClient();
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
    const supabase = await createClient();
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
    const supabase = await createClient();
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
    const supabase = await createClient();
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
// Community Notices Actions
// ====================================================================

export async function createNoticeAction(
  _prevState: { error?: string; success?: boolean } | null,
  formData: FormData
) {
  const session = await getAdminSession();
  if (!session) return { error: "Unauthorized" };

  const title = (formData.get("title") as string)?.trim();
  const body = (formData.get("body") as string)?.trim();
  const locale = (formData.get("locale") as string) || "ta";
  const is_published = formData.get("is_published") === "on";

  if (!title || !body) {
    return { error: "Both title and body are required." };
  }

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { error } = await supabase.from("notices").insert({
      title,
      body,
      locale,
      is_published,
      published_at: new Date().toISOString(),
    });

    if (error) return { error: error.message };
  }

  revalidatePath("/admin/notices");
  revalidatePath("/[locale]/reports", "page");
  return { success: true };
}

export async function toggleNoticePublishAction(
  id: string,
  currentState: boolean
) {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { error } = await supabase
      .from("notices")
      .update({ is_published: !currentState })
      .eq("id", id);

    if (error) throw new Error(error.message);
  }

  revalidatePath("/admin/notices");
  revalidatePath("/[locale]/reports", "page");
  return { success: true };
}

export async function deleteNoticeAction(id: string) {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { error } = await supabase.from("notices").delete().eq("id", id);

    if (error) throw new Error(error.message);
  }

  revalidatePath("/admin/notices");
  revalidatePath("/[locale]/reports", "page");
  return { success: true };
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
    const supabase = await createClient();

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
    const supabase = await createClient();
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
    const supabase = await createClient();

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
