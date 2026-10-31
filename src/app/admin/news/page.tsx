import { Metadata } from "next";
import { getAllArticlesAdmin, type Article } from "@/content/news";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { NewsManager } from "@/components/admin/news-manager";
import { Newspaper, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "News & Blog Manager | BJWS Admin",
  description: "Publish and manage community announcements, shramadhana reports, and educational articles.",
};

export default async function AdminNewsPage() {
  let articles: Article[] = getAllArticlesAdmin();

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order("published_at", { ascending: false });

      if (!error && data && data.length > 0) {
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
          image_url: d.image_url || "/images/gallery/shramadana-01.webp",
          locale: (d.locale as "en" | "ta" | "si") || "en",
          published_at: d.published_at || d.created_at,
          is_published: d.is_published ?? true,
          read_time_minutes: Math.max(1, Math.ceil((d.content?.split(/\s+/).length || 200) / 180)),
        }));
      }
    } catch (err) {
      console.warn("Could not query Supabase articles table, using fallback store:", err);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#e6e4dc] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#c99a45]">
            <ShieldCheck className="h-4 w-4" />
            <span>Community Editorial Desk</span>
          </div>
          <h1 className="mt-1 font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#0b2e1e]">
            News & Blog Publications
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#4b5563]">
            Publish announcements, post event photos and write-ups, and keep the Mahallah informed.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-surface px-4 py-2 border border-border text-xs font-semibold text-text-muted">
          <Newspaper className="h-4 w-4 text-[#c99a45]" />
          <span>Live Editorial Mode</span>
        </div>
      </div>

      {/* Main Client Manager */}
      <NewsManager initialArticles={articles} />
    </div>
  );
}

