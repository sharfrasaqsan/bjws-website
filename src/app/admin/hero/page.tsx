import { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

import { getAdminSession } from "@/lib/admin-auth";
import type { HeroBanner } from "@/content/hero-banners";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { HeroManager } from "@/components/admin/hero-manager";
import { ArrowLeft, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Hero Banners Management | BJWS Admin",
  description:
    "Manage and customize homepage hero slideshow banners, reorder slides, and upload high-resolution banner images.",
};

export default async function AdminHeroPage() {
  await getAdminSession();

  let banners: HeroBanner[] = [];

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createAdminClient();
      const { data, error } = await supabase
        .from("hero_banners")
        .select("*")
        .order("order_index", { ascending: true });

      if (!error && data) {
        banners = data.map((d) => ({
          id: d.id,
          src: d.src,
          alt: d.alt,
          label: d.label || undefined,
          title: d.title || undefined,
          subtitle: d.subtitle || undefined,
          order_index: d.order_index ?? 0,
          is_active: d.is_active ?? true,
          created_at: d.created_at,
          updated_at: d.updated_at,
        }));
      } else {
        banners = [];
      }
    } catch (err) {
      console.warn("Could not query Supabase hero_banners table:", err);
      banners = [];
    }
  } else {
    banners = [];
  }

  return (
    <div className="py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:space-y-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Link
                href="/admin"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#124d34] hover:underline dark:text-[#a7c5b6]"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Dashboard Overview</span>
              </Link>
              <span className="text-gray-300 dark:text-gray-600">/</span>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Hero Banners
              </span>
            </div>
            <h1 className="font-serif text-2xl font-bold tracking-tight text-[#0b2e1e] sm:text-3xl dark:text-white">
              Homepage Hero Banners
            </h1>
            <p className="mt-1 text-xs text-gray-600 sm:text-sm dark:text-gray-300">
              Control the rotating full-bleed slideshow at the top of the
              homepage. Reorder slides, upload high-res imagery, and customize
              category badges.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#e6e4dc] bg-white px-3.5 py-2 text-xs font-semibold text-[#1c2420] shadow-2xs transition-all hover:border-[#124d34] hover:bg-[#fbfaf6] dark:border-[#1a432f] dark:bg-[#0c2419] dark:text-[#e2f0e8] dark:hover:bg-[#123624]"
            >
              <span>View Live Homepage</span>
              <ExternalLink className="h-3.5 w-3.5 text-[#124d34] dark:text-[#c99a45]" />
            </Link>
          </div>
        </div>

        {/* Manager Component */}
        <HeroManager initialBanners={banners} />
      </div>
    </div>
  );
}
