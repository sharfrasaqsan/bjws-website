import { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { getAllArticlesAdmin, type Article } from "@/content/news";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { NewsManager } from "@/components/admin/news-manager";
import { Newspaper, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "News & Blog Manager | BJWS Admin",
  description:
    "Publish and manage community announcements, shramadhana reports, and educational articles.",
};

export default async function AdminNewsPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  let articles: Article[] = [];

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createAdminClient();
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order("published_at", { ascending: false });

      if (!error && data) {
        articles = data.map((d) => ({
          id: d.id,
          slug: d.slug,
          title: d.title,
          excerpt: d.excerpt,
          content: d.content,
          category: (d.category as Article["category"]) || "general",
          categoryLabel: {
            en: d.category || "General News",
            ta: "செய்திகள்",
            si: "පුවත්",
          },
          author: d.author || "BJWS Secretariat",
          image_url: d.image_url || "",
          locale: (d.locale as "en" | "ta" | "si") || "en",
          published_at: d.published_at || d.created_at,
          updated_at:
            ((d as Record<string, unknown>).updated_at as string) || undefined,
          is_published: d.is_published ?? true,
          read_time_minutes: Math.max(
            1,
            Math.ceil((d.content?.split(/\s+/).length || 200) / 180)
          ),
        }));
      }
    } catch (err) {
      console.warn("Could not query Supabase articles table:", err);
      articles = getAllArticlesAdmin();
    }
  } else {
    articles = getAllArticlesAdmin();
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
                Publications
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f3ee] text-[#124d34]">
                <Newspaper className="h-5 w-5" />
              </div>
              <div>
                <h1 className="font-serif text-2xl font-bold tracking-tight text-[#0b2e1e] sm:text-3xl">
                  News &amp; Blog Publications
                </h1>
                <p className="text-xs text-[#6b7280] sm:text-sm">
                  Publish announcements, post event photos and write-ups, and
                  keep the Mahallah informed in all languages.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Client Manager */}
        <NewsManager initialArticles={articles} />
      </div>
    </div>
  );
}
