import Link from "next/link";
import { getAdminSession } from "@/lib/admin-auth";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { Container } from "@/components/ui/container";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();

      // Fetch messages summary
      const { data: messages } = await supabase
        .from("contact_messages")
        .select("id, name, phone, status, created_at")
        .order("created_at", { ascending: false });

      if (messages) {
        messageStats = {
          total: messages.length,
          new: messages.filter((m) => m.status === "new").length,
        };
        recentMessages = messages.slice(0, 4);
      }

      // Fetch memberships summary
      const { data: memberships } = await supabase
        .from("membership_requests")
        .select("id, full_name, phone, plan, status, created_at")
        .order("created_at", { ascending: false });

      if (memberships) {
        membershipStats = {
          total: memberships.length,
          pending: memberships.filter((m) => m.status === "pending").length,
        };
        recentMemberships = memberships.slice(0, 4);
      }

      // Fetch notices count
      const { data: notices } = await supabase
        .from("notices")
        .select("id, is_published");

      if (notices) {
        noticeStats = {
          total: notices.length,
          published: notices.filter((n) => n.is_published).length,
        };
      }

      // Fetch reports count
      const { data: reports } = await supabase
        .from("reports")
        .select("id, is_published");

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
    ];

    recentMemberships = [
      {
        id: "demo-mem-1",
        full_name: "K. Rauff",
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
    ];
  }

  return (
    <div className="py-8 sm:py-10">
      <Container size="xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="border-primary/20 text-primary mb-2 inline-flex items-center gap-2 rounded-full border bg-[#e8f3ee] px-3 py-0.5 text-xs font-semibold">
              <span>Executive Officer View</span>
            </div>
            <h1 className="text-text text-2xl font-bold tracking-tight sm:text-3xl">
              Society Administration Dashboard
            </h1>
            <p className="text-text-muted mt-1 text-xs sm:text-sm">
              Signed in as{" "}
              <span className="text-text font-semibold">{session?.email}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/notices"
              className="border-border bg-surface text-text hover:bg-surface-muted inline-flex h-8 items-center justify-center rounded-md border px-3 text-xs font-medium shadow-2xs transition-colors"
            >
              Post Notice
            </Link>
            <Link
              href="/admin/reports"
              className="bg-primary text-primary-foreground hover:bg-primary-hover inline-flex h-8 items-center justify-center rounded-md px-3 text-xs font-medium shadow-2xs transition-colors"
            >
              Upload Report
            </Link>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Contact Messages */}
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-text-muted text-xs font-semibold tracking-wider uppercase">
                Messages
              </span>
              {messageStats.new > 0 ? (
                <Badge variant="destructive" size="sm">
                  {messageStats.new} New
                </Badge>
              ) : (
                <Badge variant="outline" size="sm">
                  All Read
                </Badge>
              )}
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-text text-3xl font-extrabold">
                {messageStats.total}
              </span>
              <span className="text-text-muted text-xs">total received</span>
            </div>
            <div className="border-border mt-4 border-t pt-3">
              <Link
                href="/admin/messages"
                className="text-primary flex items-center justify-between text-xs font-semibold hover:underline"
              >
                <span>View all messages</span>
                <span>→</span>
              </Link>
            </div>
          </Card>

          {/* Membership Requests */}
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-text-muted text-xs font-semibold tracking-wider uppercase">
                Memberships
              </span>
              {membershipStats.pending > 0 ? (
                <Badge variant="primary" size="sm">
                  {membershipStats.pending} Pending
                </Badge>
              ) : (
                <Badge variant="outline" size="sm">
                  Processed
                </Badge>
              )}
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-text text-3xl font-extrabold">
                {membershipStats.total}
              </span>
              <span className="text-text-muted text-xs">total requests</span>
            </div>
            <div className="border-border mt-4 border-t pt-3">
              <Link
                href="/admin/memberships"
                className="text-primary flex items-center justify-between text-xs font-semibold hover:underline"
              >
                <span>Process applications</span>
                <span>→</span>
              </Link>
            </div>
          </Card>

          {/* Community Notices */}
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-text-muted text-xs font-semibold tracking-wider uppercase">
                Notices
              </span>
              <Badge variant="outline" size="sm">
                {noticeStats.published} Live
              </Badge>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-text text-3xl font-extrabold">
                {noticeStats.total}
              </span>
              <span className="text-text-muted text-xs">announcements</span>
            </div>
            <div className="border-border mt-4 border-t pt-3">
              <Link
                href="/admin/notices"
                className="text-primary flex items-center justify-between text-xs font-semibold hover:underline"
              >
                <span>Manage notices</span>
                <span>→</span>
              </Link>
            </div>
          </Card>

          {/* Published Reports */}
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-text-muted text-xs font-semibold tracking-wider uppercase">
                Reports & Storage
              </span>
              <Badge variant="outline" size="sm">
                {reportStats.published} Published
              </Badge>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-text text-3xl font-extrabold">
                {reportStats.total}
              </span>
              <span className="text-text-muted text-xs">PDF documents</span>
            </div>
            <div className="border-border mt-4 border-t pt-3">
              <Link
                href="/admin/reports"
                className="text-primary flex items-center justify-between text-xs font-semibold hover:underline"
              >
                <span>Manage reports</span>
                <span>→</span>
              </Link>
            </div>
          </Card>
        </div>

        {/* Recent Items Preview Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Recent Messages */}
          <Card className="p-6">
            <CardHeader className="border-border mb-4 flex flex-row items-center justify-between border-b p-0 pb-4">
              <div>
                <CardTitle as="h2" className="text-base">
                  Recent Inquiries
                </CardTitle>
                <p className="text-text-muted text-xs">
                  Latest contact inquiries from the public
                </p>
              </div>
              <Link
                href="/admin/messages"
                className="text-primary text-xs font-semibold hover:underline"
              >
                View all
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {recentMessages.length === 0 ? (
                <p className="text-text-muted py-4 text-center text-xs">
                  No contact messages received yet.
                </p>
              ) : (
                <div className="divide-border divide-y">
                  {recentMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className="flex items-center justify-between gap-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="text-text truncate text-sm font-semibold">
                          {msg.name}
                        </p>
                        <p className="text-text-muted text-xs">{msg.phone}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <Badge
                          variant={
                            msg.status === "new" ? "destructive" : "outline"
                          }
                          size="sm"
                        >
                          {msg.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Membership Applications */}
          <Card className="p-6">
            <CardHeader className="border-border mb-4 flex flex-row items-center justify-between border-b p-0 pb-4">
              <div>
                <CardTitle as="h2" className="text-base">
                  Recent Membership Requests
                </CardTitle>
                <p className="text-text-muted text-xs">
                  Applications awaiting review & enrollment
                </p>
              </div>
              <Link
                href="/admin/memberships"
                className="text-primary text-xs font-semibold hover:underline"
              >
                View all
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {recentMemberships.length === 0 ? (
                <p className="text-text-muted py-4 text-center text-xs">
                  No membership applications submitted yet.
                </p>
              ) : (
                <div className="divide-border divide-y">
                  {recentMemberships.map((mem) => (
                    <div
                      key={mem.id}
                      className="flex items-center justify-between gap-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="text-text truncate text-sm font-semibold">
                          {mem.full_name}
                        </p>
                        <p className="text-text-muted text-xs">
                          {mem.phone} • {mem.plan}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <Badge
                          variant={
                            mem.status === "pending" ? "primary" : "outline"
                          }
                          size="sm"
                        >
                          {mem.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
}
