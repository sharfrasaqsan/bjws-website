import Link from "next/link";
import { getAdminSession } from "@/lib/admin-auth";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { formatAdminDate } from "@/lib/utils";
import {
  MessageSquare,
  Users,
  Megaphone,
  FileText,
  ArrowRight,
  Plus,
  ExternalLink,
  ShieldCheck,
  Phone,
  Clock,
  Building,
  CheckCircle2,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const session = await getAdminSession();

  let messageStats = { total: 0, new: 0 };
  let membershipStats = { total: 0, pending: 0 };
  let noticeStats = { total: 0, published: 0 };
  let reportStats = { total: 0, published: 0 };

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
      const supabase = await createClient();

      // Fetch all dashboard metrics in parallel to eliminate sequential latency
      const [
        { data: messages },
        { data: memberships },
        { data: notices },
        { data: reports },
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
    } catch (err) {
      console.warn("Failed to load dashboard metrics from Supabase:", err);
    }
  } else {
    // Verified demo preview metrics
    messageStats = { total: 3, new: 2 };
    membershipStats = { total: 5, pending: 3 };
    noticeStats = { total: 3, published: 3 };
    reportStats = { total: 2, published: 2 };

    recentMessages = [
      {
        id: "demo-msg-1",
        name: "M. Mohamed Nizam",
        phone: "0771234567",
        status: "new",
        created_at: "2026-03-01T10:30:00Z",
      },
      {
        id: "demo-msg-2",
        name: "A. Farook",
        phone: "0759876543",
        status: "new",
        created_at: "2026-02-28T14:15:00Z",
      },
      {
        id: "demo-msg-3",
        name: "S. K. Rizwan",
        phone: "0712345678",
        status: "read",
        created_at: "2026-02-25T11:00:00Z",
      },
    ];

    recentMemberships = [
      {
        id: "demo-mem-1",
        full_name: "K. Rauff Mohamed",
        phone: "0765551234",
        plan: "monthly",
        status: "pending",
        created_at: "2026-03-01T09:00:00Z",
      },
      {
        id: "demo-mem-2",
        full_name: "S. Haleem",
        phone: "0718889999",
        plan: "annual",
        status: "pending",
        created_at: "2026-02-27T16:45:00Z",
      },
      {
        id: "demo-mem-3",
        full_name: "M. T. Nawas",
        phone: "0773334444",
        plan: "monthly",
        status: "approved",
        created_at: "2026-02-20T11:20:00Z",
      },
    ];
  }

  return (
    <div className="py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Institutional Welcome Banner */}
        <div className="mb-8 rounded-2xl border border-[#e6e4dc] bg-white p-6 shadow-xs sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-2.5 inline-flex items-center gap-2 rounded-full border border-[#124d34]/20 bg-[#f5eedf]/60 px-3 py-1 text-xs font-semibold text-[#124d34]">
                <ShieldCheck className="h-3.5 w-3.5 text-[#c99a45]" />
                <span>Executive Council Operational Portal</span>
                <span className="text-[#a7c5b6]">•</span>
                <span className="font-mono text-[11px] text-[#8b651e]">
                  DS/TH/SS/VSSO/2023/01
                </span>
              </div>
              <h1 className="font-serif text-2xl font-bold tracking-tight text-[#0b2e1e] sm:text-3xl">
                Society Administrative Overview
              </h1>
              <p className="mt-1 text-xs text-[#4b5563] sm:text-sm">
                Managing community inquiries, memberships, notices, and audited records for{" "}
                <strong className="text-[#1c2420]">
                  Buhary Janaza Welfare Society, Mullipothana
                </strong>
                .
              </p>
            </div>

            {/* Quick Action Toolbar */}
            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                href="/admin/notices"
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#e6e4dc] bg-white px-3 py-2 text-xs font-semibold text-[#1c2420] shadow-xs transition-colors hover:border-[#124d34] hover:bg-[#fbfaf6]"
              >
                <Plus className="h-3.5 w-3.5 text-[#124d34]" />
                <span>Post Notice</span>
              </Link>
              <Link
                href="/admin/reports"
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#124d34] px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#0b2e1e]"
              >
                <Plus className="h-3.5 w-3.5 text-[#c99a45]" />
                <span>Upload Report</span>
              </Link>
              <Link
                href="/"
                target="_blank"
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#e6e4dc] bg-[#fbfaf6] px-3 py-2 text-xs font-medium text-[#4b5563] transition-colors hover:bg-white hover:text-[#0b2e1e]"
              >
                <span>Live Site</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-y-2 gap-x-6 border-t border-[#f3f1ea] pt-4 text-xs text-[#6b7280]">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Signed in as:</span>
              <strong className="font-mono text-[#0b2e1e]">{session?.email}</strong>
            </div>
            <div className="flex items-center gap-1.5">
              <Building className="h-3.5 w-3.5 text-[#9ca3af]" />
              <span>Database Status:</span>
              <span className="font-medium text-[#1c2420]">
                {isConfigured ? "Connected (Supabase Cloud)" : "Demo Simulation"}
              </span>
            </div>
          </div>
        </div>

        {/* 4 Metric Cards Grid */}
        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Inquiries */}
          <div className="group rounded-2xl border border-[#e6e4dc] bg-white p-5 shadow-xs transition-all hover:border-[#124d34]/40 hover:shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f3ee] text-[#124d34] transition-colors group-hover:bg-[#124d34] group-hover:text-white">
                <MessageSquare className="h-5 w-5" />
              </div>
              {messageStats.new > 0 ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse" />
                  {messageStats.new} New
                </span>
              ) : (
                <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                  All Handled
                </span>
              )}
            </div>
            <div className="mt-4">
              <div className="font-serif text-3xl font-extrabold text-[#0b2e1e]">
                {messageStats.total}
              </div>
              <p className="mt-0.5 text-xs font-medium text-[#6b7280]">
                Contact Inquiries Received
              </p>
            </div>
            <div className="mt-4 border-t border-[#f3f1ea] pt-3">
              <Link
                href="/admin/messages"
                className="flex items-center justify-between text-xs font-semibold text-[#124d34] transition-colors hover:text-[#0b2e1e]"
              >
                <span>View Messages Inbox</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          {/* Card 2: Memberships */}
          <div className="group rounded-2xl border border-[#e6e4dc] bg-white p-5 shadow-xs transition-all hover:border-[#124d34]/40 hover:shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5eedf] text-[#8b651e] transition-colors group-hover:bg-[#c99a45] group-hover:text-white">
                <Users className="h-5 w-5" />
              </div>
              {membershipStats.pending > 0 ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
                  {membershipStats.pending} Pending
                </span>
              ) : (
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                  Up to date
                </span>
              )}
            </div>
            <div className="mt-4">
              <div className="font-serif text-3xl font-extrabold text-[#0b2e1e]">
                {membershipStats.total}
              </div>
              <p className="mt-0.5 text-xs font-medium text-[#6b7280]">
                Total Membership Applications
              </p>
            </div>
            <div className="mt-4 border-t border-[#f3f1ea] pt-3">
              <Link
                href="/admin/memberships"
                className="flex items-center justify-between text-xs font-semibold text-[#124d34] transition-colors hover:text-[#0b2e1e]"
              >
                <span>Review Applications</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          {/* Card 3: Notices */}
          <div className="group rounded-2xl border border-[#e6e4dc] bg-white p-5 shadow-xs transition-all hover:border-[#124d34]/40 hover:shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f3ee] text-[#124d34] transition-colors group-hover:bg-[#124d34] group-hover:text-white">
                <Megaphone className="h-5 w-5" />
              </div>
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                {noticeStats.published} Live
              </span>
            </div>
            <div className="mt-4">
              <div className="font-serif text-3xl font-extrabold text-[#0b2e1e]">
                {noticeStats.total}
              </div>
              <p className="mt-0.5 text-xs font-medium text-[#6b7280]">
                Community Bulletins & Notices
              </p>
            </div>
            <div className="mt-4 border-t border-[#f3f1ea] pt-3">
              <Link
                href="/admin/notices"
                className="flex items-center justify-between text-xs font-semibold text-[#124d34] transition-colors hover:text-[#0b2e1e]"
              >
                <span>Manage Community Notices</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          {/* Card 4: Audited Reports */}
          <div className="group rounded-2xl border border-[#e6e4dc] bg-white p-5 shadow-xs transition-all hover:border-[#124d34]/40 hover:shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5eedf] text-[#8b651e] transition-colors group-hover:bg-[#c99a45] group-hover:text-white">
                <FileText className="h-5 w-5" />
              </div>
              <span className="rounded-full border border-[#c99a45]/30 bg-[#f5eedf]/80 px-2.5 py-0.5 text-xs font-semibold text-[#8b651e]">
                {reportStats.published} Published
              </span>
            </div>
            <div className="mt-4">
              <div className="font-serif text-3xl font-extrabold text-[#0b2e1e]">
                {reportStats.total}
              </div>
              <p className="mt-0.5 text-xs font-medium text-[#6b7280]">
                Audited PDF Reports & Storage
              </p>
            </div>
            <div className="mt-4 border-t border-[#f3f1ea] pt-3">
              <Link
                href="/admin/reports"
                className="flex items-center justify-between text-xs font-semibold text-[#124d34] transition-colors hover:text-[#0b2e1e]"
              >
                <span>Manage Financial Reports</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Split Section: Recent Activity Tables */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Column 1: Recent Inquiries */}
          <div className="overflow-hidden rounded-2xl border border-[#e6e4dc] bg-white shadow-xs">
            <div className="flex items-center justify-between border-b border-[#e6e4dc] bg-[#fbfaf6] px-6 py-4">
              <div>
                <h2 className="font-serif text-base font-bold text-[#0b2e1e]">
                  Recent Community Inquiries
                </h2>
                <p className="text-xs text-[#6b7280]">
                  Public contact messages awaiting secretarial response
                </p>
              </div>
              <Link
                href="/admin/messages"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#124d34] hover:text-[#0b2e1e] hover:underline"
              >
                <span>All Messages</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="divide-y divide-[#f3f1ea] px-6">
              {recentMessages.length === 0 ? (
                <div className="py-10 text-center text-xs text-[#6b7280]">
                  No messages received yet.
                </div>
              ) : (
                recentMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className="flex items-center justify-between gap-4 py-3.5 transition-colors hover:bg-[#fbfaf6]"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate font-semibold text-sm text-[#1c2420]">
                          {msg.name}
                        </span>
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                            msg.status === "new"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {msg.status}
                        </span>
                      </div>
                      <div className="mt-0.5 flex items-center gap-3 text-xs text-[#6b7280]">
                        <a
                          href={`tel:${msg.phone}`}
                          className="flex items-center gap-1 text-[#124d34] hover:underline"
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
                      className="rounded-lg border border-[#e6e4dc] bg-white px-2.5 py-1 text-xs font-medium text-[#124d34] shadow-2xs hover:bg-[#f5eedf]"
                    >
                      View
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Column 2: Recent Memberships */}
          <div className="overflow-hidden rounded-2xl border border-[#e6e4dc] bg-white shadow-xs">
            <div className="flex items-center justify-between border-b border-[#e6e4dc] bg-[#fbfaf6] px-6 py-4">
              <div>
                <h2 className="font-serif text-base font-bold text-[#0b2e1e]">
                  Recent Membership Requests
                </h2>
                <p className="text-xs text-[#6b7280]">
                  Mahallah residents registered for funeral welfare coverage
                </p>
              </div>
              <Link
                href="/admin/memberships"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#124d34] hover:text-[#0b2e1e] hover:underline"
              >
                <span>All Members</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="divide-y divide-[#f3f1ea] px-6">
              {recentMemberships.length === 0 ? (
                <div className="py-10 text-center text-xs text-[#6b7280]">
                  No membership applications submitted yet.
                </div>
              ) : (
                recentMemberships.map((mem) => (
                  <div
                    key={mem.id}
                    className="flex items-center justify-between gap-4 py-3.5 transition-colors hover:bg-[#fbfaf6]"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate font-semibold text-sm text-[#1c2420]">
                          {mem.full_name}
                        </span>
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                            mem.status === "pending"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {mem.status}
                        </span>
                        <span className="rounded bg-[#f5eedf] px-1.5 py-0.5 text-[10px] font-medium text-[#8b651e] capitalize">
                          {mem.plan}
                        </span>
                      </div>
                      <div className="mt-0.5 flex items-center gap-3 text-xs text-[#6b7280]">
                        <a
                          href={`tel:${mem.phone}`}
                          className="flex items-center gap-1 text-[#124d34] hover:underline"
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
                      className="rounded-lg border border-[#e6e4dc] bg-white px-2.5 py-1 text-xs font-medium text-[#124d34] shadow-2xs hover:bg-[#f5eedf]"
                    >
                      Review
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Institutional Society Reference Footer Strip */}
        <div className="mt-8 rounded-2xl border border-[#e6e4dc] bg-[#fbfaf6] p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#124d34] text-white">
                <CheckCircle2 className="h-5 w-5 text-[#c99a45]" />
              </div>
              <div>
                <h3 className="font-serif text-sm font-bold text-[#0b2e1e]">
                  Official Society Registration & Verification
                </h3>
                <p className="text-xs text-[#4b5563]">
                  Registered under Voluntary Social Service Organizations (VSSO) Act No. 31 of 1980 • Divisional Secretariat Thambalagamuwa • Reg: DS/TH/SS/VSSO/2023/01
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 text-xs">
              <span className="rounded-md border border-[#c99a45]/30 bg-white px-2.5 py-1 font-mono font-medium text-[#8b651e]">
                Mullipothana, LK
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
