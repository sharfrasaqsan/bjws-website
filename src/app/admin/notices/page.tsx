import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

import { getAdminSession } from "@/lib/admin-auth";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { getAllNotices, type NoticeRecord } from "@/content/notices";
import { NoticesManager } from "@/components/admin/notices-manager";
import { Megaphone, ArrowLeft } from "lucide-react";

export default async function AdminNoticesPage() {
  await getAdminSession();

  let notices: NoticeRecord[] = [];

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createAdminClient();
      const { data, error } = await supabase
        .from("notices")
        .select("*")
        .order("published_at", { ascending: false });

      if (!error && data) {
        notices = data.map((d: Record<string, unknown>) => ({
          id: String(d.id),
          title: String(d.title),
          body: String(d.body),
          locale: String(d.locale),
          published_at: String(d.published_at),
          updated_at: d.updated_at ? String(d.updated_at) : undefined,
          is_published: Boolean(d.is_published),
          show_on_homepage:
            d.show_on_homepage !== undefined
              ? Boolean(d.show_on_homepage)
              : true,
          image_url: d.image_url ? String(d.image_url) : undefined,
          created_at: d.created_at ? String(d.created_at) : undefined,
        }));
      }
    } catch (err) {
      console.warn("Failed to fetch notices:", err);
      notices = getAllNotices();
    }
  } else {
    notices = getAllNotices();
  }

  return (
    <div className="py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Link
                href="/admin"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#124d34] hover:underline"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Dashboard</span>
              </Link>
              <span className="text-[#cbd5e1]">/</span>
              <span className="text-xs font-medium text-[#6b7280]">
                Announcements
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f3ee] text-[#124d34]">
                <Megaphone className="h-5 w-5" />
              </div>
              <div>
                <h1 className="font-serif text-2xl font-bold tracking-tight text-[#0b2e1e] sm:text-3xl">
                  Community Bulletins &amp; Notices
                </h1>
                <p className="text-xs text-[#6b7280] sm:text-sm">
                  Broadcast Janaza announcements, Shramadhana alerts, and
                  community notices in Tamil, English, and Sinhala.
                </p>
              </div>
            </div>
          </div>
        </div>

        <NoticesManager initialNotices={notices} />
      </div>
    </div>
  );
}
