import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import {
  getAllGalleryImagesAdmin,
  type GalleryImage,
  type GalleryCategory,
  DEFAULT_BLUR,
} from "@/content/gallery";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { GalleryManager } from "@/components/admin/gallery-manager";
import { Image as ImageIcon, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Gallery Photos Management | BJWS Admin",
  description:
    "Manage community photo archives, verify privacy and consent guidelines, and publish shramadana and welfare photos.",
};

export default async function AdminGalleryPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  let images: GalleryImage[] = [];

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createAdminClient();
      const { data, error } = await supabase
        .from("gallery_images")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        images = data.map((d) => ({
          id: d.id,
          src: d.src,
          captionKey: d.caption,
          altKey: d.caption,
          category: (d.category as GalleryCategory) || "cemetery-shramadana",
          date: d.date,
          location: d.location,
          width: 1200,
          height: 800,
          blurDataURL: DEFAULT_BLUR,
          approved: d.approved,
          consentNotes: d.consent_notes || undefined,
        }));
      }
    } catch (err) {
      console.warn(
        "Could not query Supabase gallery_images table, using fallback store:",
        err
      );
      images = getAllGalleryImagesAdmin();
    }
  } else {
    images = getAllGalleryImagesAdmin();
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
                Photo Gallery
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5eedf] text-[#8b651e]">
                <ImageIcon className="h-5 w-5" />
              </div>
              <div>
                <h1 className="font-serif text-2xl font-bold tracking-tight text-[#0b2e1e] sm:text-3xl">
                  Photo Gallery &amp; Media Assets
                </h1>
                <p className="text-xs text-[#6b7280] sm:text-sm">
                  Curate photo albums, enforce strict community privacy
                  policies, and approve photos for public release.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Client Manager */}
        <GalleryManager initialImages={images} />
      </div>
    </div>
  );
}
