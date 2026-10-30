import type { Metadata } from "next";
import Link from "next/link";
import { getAdminSession, logoutAdminAction } from "@/lib/admin-auth";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "BJWS Admin Portal",
  description: "Administrative dashboard for Buhary Janaza Welfare Society",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f7f5] font-sans text-[#111827] antialiased">
      {/* Top Admin Header Bar */}
      {session && (
        <header className="border-border bg-surface/95 sticky top-0 z-40 border-b shadow-2xs backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-6">
              <Link
                href="/admin"
                className="text-primary flex items-center gap-2.5 font-bold tracking-tight transition-opacity hover:opacity-90"
              >
                <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-lg text-xs font-black">
                  BJWS
                </div>
                <div className="flex flex-col">
                  <span className="text-text text-sm leading-none font-bold">
                    Admin Portal
                  </span>
                  <span className="text-text-muted text-[10px] leading-tight">
                    Mullipothanai
                  </span>
                </div>
              </Link>

              {/* Navigation Tabs */}
              <nav
                className="border-border hidden items-center gap-1 border-l pl-4 md:flex"
                aria-label="Admin Navigation"
              >
                <Link
                  href="/admin"
                  className="text-text hover:bg-surface-muted rounded-md px-3 py-1.5 text-xs font-semibold transition-colors"
                >
                  Overview
                </Link>
                <Link
                  href="/admin/messages"
                  className="text-text-muted hover:text-text hover:bg-surface-muted rounded-md px-3 py-1.5 text-xs font-semibold transition-colors"
                >
                  Messages
                </Link>
                <Link
                  href="/admin/memberships"
                  className="text-text-muted hover:text-text hover:bg-surface-muted rounded-md px-3 py-1.5 text-xs font-semibold transition-colors"
                >
                  Memberships
                </Link>
                <Link
                  href="/admin/notices"
                  className="text-text-muted hover:text-text hover:bg-surface-muted rounded-md px-3 py-1.5 text-xs font-semibold transition-colors"
                >
                  Notices
                </Link>
                <Link
                  href="/admin/reports"
                  className="text-text-muted hover:text-text hover:bg-surface-muted rounded-md px-3 py-1.5 text-xs font-semibold transition-colors"
                >
                  Reports & Storage
                </Link>
              </nav>
            </div>

            {/* Right side controls */}
            <div className="flex items-center gap-3">
              <Link
                href="/"
                target="_blank"
                className="text-text-muted hover:text-text hover:bg-surface-muted hidden items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors sm:inline-flex"
              >
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                <span>Live Site</span>
              </Link>

              <form action={logoutAdminAction}>
                <Button
                  type="submit"
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                >
                  Sign Out
                </Button>
              </form>
            </div>
          </div>

          {/* Mobile sub-bar navigation */}
          <div className="border-border bg-surface flex gap-2 overflow-x-auto border-t px-4 py-2 md:hidden">
            <Link
              href="/admin"
              className="bg-surface-muted text-text rounded px-2.5 py-1 text-xs font-medium whitespace-nowrap"
            >
              Overview
            </Link>
            <Link
              href="/admin/messages"
              className="text-text-muted hover:text-text rounded px-2.5 py-1 text-xs font-medium whitespace-nowrap"
            >
              Messages
            </Link>
            <Link
              href="/admin/memberships"
              className="text-text-muted hover:text-text rounded px-2.5 py-1 text-xs font-medium whitespace-nowrap"
            >
              Memberships
            </Link>
            <Link
              href="/admin/notices"
              className="text-text-muted hover:text-text rounded px-2.5 py-1 text-xs font-medium whitespace-nowrap"
            >
              Notices
            </Link>
            <Link
              href="/admin/reports"
              className="text-text-muted hover:text-text rounded px-2.5 py-1 text-xs font-medium whitespace-nowrap"
            >
              Reports
            </Link>
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main className="flex-1 pb-16">{children}</main>
    </div>
  );
}
