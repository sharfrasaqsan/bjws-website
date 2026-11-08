import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

import { getAdminSession } from "@/lib/admin-auth";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { formatAdminDate } from "@/lib/utils";
import { getAllTeamMembersAdmin } from "@/content/team";
import { getAllGalleryImagesAdmin } from "@/content/gallery";
import { getAllArticlesAdmin } from "@/content/news";
import {
  MessageSquare,
  Users,
  FileText,
  ArrowRight,
  Plus,
  ExternalLink,
  Phone,
  Clock,
  UserCheck,
  Image as ImageIcon,
  Newspaper,
  CheckCircle2,
  Inbox,
} from "lucide-react";

export default async function AdminDashboardPage() {
  await getAdminSession();

  let messageStats = { total: 0, new: 0 };
  let membershipStats = { total: 0, pending: 0 };
  let noticeStats = { total: 0, published: 0 };
  let reportStats = { total: 0, published: 0 };

  // Team, Gallery, and News stats (initialized with local fallback)
  const fallbackTeam = getAllTeamMembersAdmin();
  let teamStats = {
    total: fallbackTeam.length,
    active: fallbackTeam.filter((m) => !m.isInactive).length,
  };

  const fallbackGallery = getAllGalleryImagesAdmin();
  let galleryStats = {
    total: fallbackGallery.length,
    approved: fallbackGallery.filter((g) => g.approved).length,
  };

  const fallbackArticles = getAllArticlesAdmin();
  let newsStats = {
    total: fallbackArticles.length,
    published: fallbackArticles.filter((a) => a.is_published).length,
  };

  let recentMessages: Array<{
    id: string;
    name: string;
    phone: string;
    status: string;
    created_at: string;
  }> = [];

  let recentMemberships: Array<{
    id: string;
    full_name: string;
    phone: string;
    plan: string;
    status: string;
    created_at: string;
  }> = [];

  const isConfigured = isSupabaseConfigured();

  if (isConfigured) {
    try {
      const supabase = await createAdminClient();

      // Parallel metric fetching across all 7 operational collections
      const [
        { data: messages },
        { data: memberships },
        { data: notices },
        { data: reports },
        { data: dbTeam },
        { data: dbGallery },
        { data: dbArticles },
      ] = await Promise.all([
        supabase
          .from("contact_messages")
          .select("id, name, phone, status, created_at")
          .order("created_at", { ascending: false }),
        supabase
          .from("membership_requests")
          .select("id, full_name, phone, plan, status, created_at")
          .order("created_at", { ascending: false }),
        supabase.from("notices").select("id, is_published"),
        supabase.from("reports").select("id, is_published"),
        supabase.from("team_members").select("id, is_inactive"),
        supabase.from("gallery_images").select("id, approved"),
        supabase.from("articles").select("id, is_published"),
      ]);

      if (messages) {
        messageStats = {
          total: messages.length,
          new: messages.filter((m) => m.status === "new").length,
        };
        recentMessages = messages.slice(0, 5);
      }

      if (memberships) {
        membershipStats = {
          total: memberships.length,
          pending: memberships.filter((m) => m.status === "pending").length,
        };
        recentMemberships = memberships.slice(0, 5);
      }

      if (notices) {
        noticeStats = {
          total: notices.length,
          published: notices.filter((n) => n.is_published).length,
        };
      }

      if (reports) {
        reportStats = {
          total: reports.length,
          published: reports.filter((r) => r.is_published).length,
        };
      }

      if (dbTeam && dbTeam.length > 0) {
        teamStats = {
          total: dbTeam.length,
          active: dbTeam.filter((m) => !m.is_inactive).length,
        };
      }

      if (dbGallery && dbGallery.length > 0) {
        galleryStats = {
          total: dbGallery.length,
          approved: dbGallery.filter((g) => g.approved).length,
        };
      }

      if (dbArticles && dbArticles.length > 0) {
        newsStats = {
          total: dbArticles.length,
          published: dbArticles.filter((a) => a.is_published).length,
        };
      }
    } catch (err) {
      console.warn("Failed to load dashboard metrics from Supabase:", err);
    }
  }

  return (
    <div className="py-6 sm:py-8">
      <div className="mx-auto max-w-7xl space-y-6 px-4 sm:space-y-8 sm:px-6 lg:px-8">
        {/* Executive Header Bar */}
        <div className="flex flex-col gap-4 border-b border-[#e6e4dc] pb-6 sm:flex-row sm:items-center sm:justify-between dark:border-[#1a432f]">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#124d34] uppercase dark:text-[#a7c5b6]">
              <span>Executive Overview</span>
              <span className="text-[#c99a45]">•</span>
              <span className="font-normal text-[#6b7280] normal-case dark:text-[#9ca3af]">
                Buhary Janaza Welfare Society
              </span>
            </div>
            <h1 className="mt-1 font-serif text-2xl font-bold tracking-tight text-[#0b2e1e] sm:text-3xl dark:text-white">
              Administrative Console
            </h1>
          </div>

          {/* Quick Actions & DB Status */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              <span>{isConfigured ? "Supabase Live" : "Demo Mode"}</span>
            </div>

            <Link
              href="/admin/notices"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#e6e4dc] bg-white px-3.5 py-2 text-xs font-semibold text-[#1c2420] shadow-2xs transition-all hover:border-[#124d34] hover:bg-[#fbfaf6] dark:border-[#1a432f] dark:bg-[#0c2419] dark:text-[#e2f0e8] dark:hover:bg-[#123624]"
            >
              <Plus className="h-3.5 w-3.5 text-[#124d34] dark:text-[#c99a45]" />
              <span>Post Notice</span>
            </Link>

            <Link
              href="/admin/news"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#e6e4dc] bg-white px-3.5 py-2 text-xs font-semibold text-[#1c2420] shadow-2xs transition-all hover:border-[#124d34] hover:bg-[#fbfaf6] dark:border-[#1a432f] dark:bg-[#0c2419] dark:text-[#e2f0e8] dark:hover:bg-[#123624]"
            >
              <Plus className="h-3.5 w-3.5 text-[#124d34] dark:text-[#c99a45]" />
              <span>New Article</span>
            </Link>

            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#124d34] px-3.5 py-2 text-xs font-semibold text-white shadow-2xs transition-all hover:bg-[#0b2e1e]"
            >
              <span>Public Site</span>
              <ExternalLink className="h-3.5 w-3.5 text-[#c99a45]" />
            </Link>
          </div>
        </div>

        {/* Primary Operational Action Cards (Messages & Memberships) */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Card 1: Contact Inquiries */}
          <Link
            href="/admin/messages"
            className="group relative overflow-hidden rounded-2xl border border-[#e6e4dc] bg-white p-6 shadow-xs transition-all hover:border-[#124d34] hover:shadow-md dark:border-[#1a432f] dark:bg-[#0c2419] dark:hover:border-[#c99a45]"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8f3ee] text-[#124d34] transition-colors group-hover:bg-[#124d34] group-hover:text-white dark:bg-[#14553a]/50 dark:text-[#a7c5b6]">
                <MessageSquare className="h-6 w-6" />
              </div>
              {messageStats.new > 0 ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-300 bg-rose-100 px-3 py-1 text-xs font-bold text-rose-800 dark:border-rose-800 dark:bg-rose-950/60 dark:text-rose-300">
                  <span className="h-2 w-2 animate-ping rounded-full bg-rose-600" />
                  {messageStats.new} Action Needed
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  All Handled
                </span>
              )}
            </div>

            <div className="mt-5">
              <div className="font-serif text-3xl font-extrabold text-[#0b2e1e] sm:text-4xl dark:text-white">
                {messageStats.total}
              </div>
              <h3 className="mt-1 text-sm font-semibold text-[#1c2420] dark:text-[#e2f0e8]">
                Contact Inquiries
              </h3>
              <p className="mt-0.5 text-xs text-[#6b7280] dark:text-[#9ca3af]">
                Public messages and inquiries submitted via web forms
              </p>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-[#f3f1ea] pt-4 text-xs font-semibold text-[#124d34] dark:border-[#1a432f] dark:text-[#c99a45]">
              <span>Open Inquiries Inbox</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Card 2: Membership Applications */}
          <Link
            href="/admin/memberships"
            className="group relative overflow-hidden rounded-2xl border border-[#e6e4dc] bg-white p-6 shadow-xs transition-all hover:border-[#124d34] hover:shadow-md dark:border-[#1a432f] dark:bg-[#0c2419] dark:hover:border-[#c99a45]"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f5eedf] text-[#8b651e] transition-colors group-hover:bg-[#c99a45] group-hover:text-white dark:bg-[#2a2416] dark:text-[#f5d78e]">
                <Users className="h-6 w-6" />
              </div>
              {membershipStats.pending > 0 ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-amber-600" />
                  {membershipStats.pending} Awaiting Review
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Up to Date
                </span>
              )}
            </div>

            <div className="mt-5">
              <div className="font-serif text-3xl font-extrabold text-[#0b2e1e] sm:text-4xl dark:text-white">
                {membershipStats.total}
              </div>
              <h3 className="mt-1 text-sm font-semibold text-[#1c2420] dark:text-[#e2f0e8]">
                Membership Applications
              </h3>
              <p className="mt-0.5 text-xs text-[#6b7280] dark:text-[#9ca3af]">
                Community welfare and funeral coverage registrations
              </p>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-[#f3f1ea] pt-4 text-xs font-semibold text-[#124d34] dark:border-[#1a432f] dark:text-[#c99a45]">
              <span>Review Applications</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        </div>

        {/* Content & Governance Directory (4 Cards Grid) */}
        <div>
          <h2 className="mb-3.5 text-xs font-bold tracking-wider text-[#6b7280] uppercase dark:text-[#9ca3af]">
            Content & Governance Directory
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Team Directory */}
            <Link
              href="/admin/team"
              className="group rounded-2xl border border-[#e6e4dc] bg-white p-5 shadow-2xs transition-all hover:border-[#124d34] hover:shadow-xs dark:border-[#1a432f] dark:bg-[#0c2419] dark:hover:border-[#c99a45]"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e8f3ee] text-[#124d34] dark:bg-[#14553a]/40 dark:text-[#a7c5b6]">
                  <UserCheck className="h-4.5 w-4.5" />
                </div>
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                  {teamStats.active} Active
                </span>
              </div>
              <div className="mt-3">
                <div className="font-serif text-2xl font-bold text-[#0b2e1e] dark:text-white">
                  {teamStats.total}
                </div>
                <div className="text-xs font-medium text-[#6b7280] dark:text-[#9ca3af]">
                  Officers & Council
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-[#f3f1ea] pt-2.5 text-[11px] font-semibold text-[#124d34] dark:border-[#1a432f] dark:text-[#c99a45]">
                <span>Manage Team</span>
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>

            {/* News & Updates */}
            <Link
              href="/admin/news"
              className="group rounded-2xl border border-[#e6e4dc] bg-white p-5 shadow-2xs transition-all hover:border-[#124d34] hover:shadow-xs dark:border-[#1a432f] dark:bg-[#0c2419] dark:hover:border-[#c99a45]"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e8f3ee] text-[#124d34] dark:bg-[#14553a]/40 dark:text-[#a7c5b6]">
                  <Newspaper className="h-4.5 w-4.5" />
                </div>
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                  {newsStats.published} Live
                </span>
              </div>
              <div className="mt-3">
                <div className="font-serif text-2xl font-bold text-[#0b2e1e] dark:text-white">
                  {newsStats.total}
                </div>
                <div className="text-xs font-medium text-[#6b7280] dark:text-[#9ca3af]">
                  Articles & Blogs
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-[#f3f1ea] pt-2.5 text-[11px] font-semibold text-[#124d34] dark:border-[#1a432f] dark:text-[#c99a45]">
                <span>Manage News</span>
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>

            {/* Media Gallery */}
            <Link
              href="/admin/gallery"
              className="group rounded-2xl border border-[#e6e4dc] bg-white p-5 shadow-2xs transition-all hover:border-[#124d34] hover:shadow-xs dark:border-[#1a432f] dark:bg-[#0c2419] dark:hover:border-[#c99a45]"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f5eedf] text-[#8b651e] dark:bg-[#2a2416] dark:text-[#f5d78e]">
                  <ImageIcon className="h-4.5 w-4.5" />
                </div>
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                  {galleryStats.approved} Live
                </span>
              </div>
              <div className="mt-3">
                <div className="font-serif text-2xl font-bold text-[#0b2e1e] dark:text-white">
                  {galleryStats.total}
                </div>
                <div className="text-xs font-medium text-[#6b7280] dark:text-[#9ca3af]">
                  Photo Gallery Assets
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-[#f3f1ea] pt-2.5 text-[11px] font-semibold text-[#124d34] dark:border-[#1a432f] dark:text-[#c99a45]">
                <span>Manage Gallery</span>
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>

            {/* Notices & Reports */}
            <div className="group rounded-2xl border border-[#e6e4dc] bg-white p-5 shadow-2xs transition-all hover:border-[#124d34] hover:shadow-xs dark:border-[#1a432f] dark:bg-[#0c2419] dark:hover:border-[#c99a45]">
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f5eedf] text-[#8b651e] dark:bg-[#2a2416] dark:text-[#f5d78e]">
                  <FileText className="h-4.5 w-4.5" />
                </div>
                <span className="rounded-full border border-[#c99a45]/30 bg-[#f5eedf] px-2 py-0.5 text-[11px] font-bold text-[#8b651e] dark:bg-[#2a2416] dark:text-[#f5d78e]">
                  {noticeStats.published + reportStats.published} Active
                </span>
              </div>
              <div className="mt-3">
                <div className="font-serif text-2xl font-bold text-[#0b2e1e] dark:text-white">
                  {noticeStats.total + reportStats.total}
                </div>
                <div className="text-xs font-medium text-[#6b7280] dark:text-[#9ca3af]">
                  Notices & Reports
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-[#f3f1ea] pt-2.5 text-[11px] font-semibold text-[#124d34] dark:border-[#1a432f] dark:text-[#c99a45]">
                <Link href="/admin/notices" className="hover:underline">
                  Notices ({noticeStats.total})
                </Link>
                <span>•</span>
                <Link href="/admin/reports" className="hover:underline">
                  Reports ({reportStats.total})
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Inquiries & Memberships Activity */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent Inquiries */}
          <div className="overflow-hidden rounded-2xl border border-[#e6e4dc] bg-white shadow-xs dark:border-[#1a432f] dark:bg-[#0c2419]">
            <div className="flex items-center justify-between border-b border-[#e6e4dc] bg-[#fbfaf6] px-5 py-3.5 dark:border-[#1a432f] dark:bg-[#081e14]">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-[#124d34] dark:text-[#c99a45]" />
                <h3 className="font-serif text-sm font-bold text-[#0b2e1e] dark:text-white">
                  Recent Inquiries
                </h3>
              </div>
              <Link
                href="/admin/messages"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#124d34] hover:underline dark:text-[#c99a45]"
              >
                <span>All Messages</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="divide-y divide-[#f3f1ea] px-5 dark:divide-[#1a432f]/60">
              {recentMessages.length === 0 ? (
                <div className="py-10 text-center">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-white/5">
                    <Inbox className="h-5 w-5" />
                  </div>
                  <p className="mt-2 text-xs text-[#6b7280] dark:text-[#9ca3af]">
                    No messages received yet.
                  </p>
                </div>
              ) : (
                recentMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className="flex items-center justify-between gap-3 py-3 transition-colors hover:bg-[#fbfaf6] dark:hover:bg-[#123624]/40"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-xs font-semibold text-[#1c2420] sm:text-sm dark:text-[#e2f0e8]">
                          {msg.name}
                        </span>
                        <span
                          className={`rounded px-1.5 py-0.5 text-[9px] font-bold tracking-wider uppercase ${
                            msg.status === "new"
                              ? "border border-rose-200 bg-rose-100 text-rose-800 dark:border-rose-900 dark:bg-rose-950/60 dark:text-rose-300"
                              : "bg-gray-100 text-gray-700 dark:bg-white/5 dark:text-gray-300"
                          }`}
                        >
                          {msg.status}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-2.5 text-[11px] text-[#6b7280] dark:text-[#9ca3af]">
                        <a
                          href={`tel:${msg.phone}`}
                          className="flex items-center gap-1 font-mono text-[#124d34] hover:underline dark:text-[#a7c5b6]"
                        >
                          <Phone className="h-3 w-3" />
                          <span>{msg.phone}</span>
                        </a>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-[#9ca3af]" />
                          <span>{formatAdminDate(msg.created_at)}</span>
                        </span>
                      </div>
                    </div>

                    <Link
                      href="/admin/messages"
                      className="rounded-lg border border-[#e6e4dc] bg-white px-2.5 py-1 text-xs font-semibold text-[#124d34] shadow-2xs hover:bg-[#f5eedf] dark:border-[#1a432f] dark:bg-[#143d28] dark:text-[#e2f0e8] dark:hover:bg-[#1a4f34]"
                    >
                      View
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Memberships */}
          <div className="overflow-hidden rounded-2xl border border-[#e6e4dc] bg-white shadow-xs dark:border-[#1a432f] dark:bg-[#0c2419]">
            <div className="flex items-center justify-between border-b border-[#e6e4dc] bg-[#fbfaf6] px-5 py-3.5 dark:border-[#1a432f] dark:bg-[#081e14]">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-[#8b651e] dark:text-[#f5d78e]" />
                <h3 className="font-serif text-sm font-bold text-[#0b2e1e] dark:text-white">
                  Recent Memberships
                </h3>
              </div>
              <Link
                href="/admin/memberships"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#124d34] hover:underline dark:text-[#c99a45]"
              >
                <span>All Members</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="divide-y divide-[#f3f1ea] px-5 dark:divide-[#1a432f]/60">
              {recentMemberships.length === 0 ? (
                <div className="py-10 text-center">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-white/5">
                    <Inbox className="h-5 w-5" />
                  </div>
                  <p className="mt-2 text-xs text-[#6b7280] dark:text-[#9ca3af]">
                    No membership applications submitted yet.
                  </p>
                </div>
              ) : (
                recentMemberships.map((mem) => (
                  <div
                    key={mem.id}
                    className="flex items-center justify-between gap-3 py-3 transition-colors hover:bg-[#fbfaf6] dark:hover:bg-[#123624]/40"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-xs font-semibold text-[#1c2420] sm:text-sm dark:text-[#e2f0e8]">
                          {mem.full_name}
                        </span>
                        <span
                          className={`rounded px-1.5 py-0.5 text-[9px] font-bold tracking-wider uppercase ${
                            mem.status === "pending"
                              ? "border border-amber-200 bg-amber-100 text-amber-800 dark:border-amber-900 dark:bg-amber-950/60 dark:text-amber-300"
                              : "border border-emerald-200 bg-emerald-100 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300"
                          }`}
                        >
                          {mem.status}
                        </span>
                        <span className="rounded bg-[#f5eedf] px-1.5 py-0.5 text-[9px] font-semibold text-[#8b651e] capitalize dark:bg-[#2a2416] dark:text-[#f5d78e]">
                          {mem.plan}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-2.5 text-[11px] text-[#6b7280] dark:text-[#9ca3af]">
                        <a
                          href={`tel:${mem.phone}`}
                          className="flex items-center gap-1 font-mono text-[#124d34] hover:underline dark:text-[#a7c5b6]"
                        >
                          <Phone className="h-3 w-3" />
                          <span>{mem.phone}</span>
                        </a>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-[#9ca3af]" />
                          <span>{formatAdminDate(mem.created_at)}</span>
                        </span>
                      </div>
                    </div>

                    <Link
                      href="/admin/memberships"
                      className="rounded-lg border border-[#e6e4dc] bg-white px-2.5 py-1 text-xs font-semibold text-[#124d34] shadow-2xs hover:bg-[#f5eedf] dark:border-[#1a432f] dark:bg-[#143d28] dark:text-[#e2f0e8] dark:hover:bg-[#1a4f34]"
                    >
                      Review
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
