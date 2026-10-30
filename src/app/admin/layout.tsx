import type { Metadata } from "next";
import Link from "next/link";
import { Inter, Playfair_Display } from "next/font/google";
import { getAdminSession, logoutAdminAction } from "@/lib/admin-auth";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { AdminNav } from "@/components/admin/admin-nav";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ThemeScript } from "@/components/theme-script";
import { ExternalLink, LogOut, ShieldCheck } from "lucide-react";
import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Executive Admin Portal | Buhary Janaza Welfare Society",
  description:
    "Official administrative management console for Buhary Janaza Welfare Society, Mullipothanai (Reg: DS/TH/SS/VSSO/2023/01).",
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

  let counts = { messagesNew: 0, membershipsPending: 0 };
  if (session) {
    if (session.id === "demo-admin-id" || !isSupabaseConfigured()) {
      counts = { messagesNew: 2, membershipsPending: 3 };
    } else {
      try {
        const supabase = await createClient();
        const [{ count: msgCount }, { count: memCount }] = await Promise.all([
          supabase
            .from("contact_messages")
            .select("*", { count: "exact", head: true })
            .eq("status", "new"),
          supabase
            .from("membership_requests")
            .select("*", { count: "exact", head: true })
            .eq("status", "pending"),
        ]);
        counts = {
          messagesNew: msgCount || 0,
          membershipsPending: memCount || 0,
        };
      } catch (err) {
        console.warn("Failed to query admin navbar counts:", err);
      }
    }
  }

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <head>
        <ThemeScript />
      </head>
      <body
        suppressHydrationWarning
        className="flex min-h-full flex-col bg-[#fbfaf6] font-sans text-[#1c2420] antialiased selection:bg-[#124d34]/15 selection:text-[#0b2e1e]"
      >
        {session && (
          <header className="sticky top-0 z-40 border-b border-[#1a432f] bg-[#062316] text-white shadow-md">
            {/* Top Identity & Controls Tier */}
            <div className="border-b border-[#1a432f]/80">
              <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Organization Emblem & Monogram */}
                <Link
                  href="/admin"
                  className="group flex items-center gap-3 transition-opacity hover:opacity-95"
                >
                  <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#124d34] to-[#041a10] ring-1 ring-[#c99a45]/40 shadow-inner">
                    <span className="font-serif text-xs font-bold tracking-wider text-[#f5eedf]">
                      BJWS
                    </span>
                    <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-[#c99a45] ring-2 ring-[#062316]" />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="font-serif text-sm font-bold tracking-tight text-white group-hover:text-[#f5eedf]">
                        BJWS Management
                      </span>
                      <span className="hidden rounded bg-[#14553a] px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-[#c99a45] ring-1 ring-[#c99a45]/20 sm:inline-block">
                        OFFICER DESK
                      </span>
                    </div>
                    <span className="text-[11px] text-[#a7c5b6]">
                      Mullipothanai, Sri Lanka
                    </span>
                  </div>
                </Link>

                {/* Right Side Identity & Controls */}
                <div className="flex items-center gap-2 sm:gap-3">
                  {/* Theme Switcher */}
                  <ThemeToggle variant="admin" />

                  {/* Live Public Site Button */}
                  <Link
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#1a432f] bg-[#0b2e1e]/60 px-2.5 py-1.5 text-xs font-medium text-[#d1fae5] transition-colors hover:border-[#c99a45]/40 hover:bg-[#124d34] hover:text-white"
                  >
                    <ExternalLink className="h-3.5 w-3.5 text-[#c99a45]" />
                    <span className="hidden sm:inline">Public Site</span>
                  </Link>

                  <div className="hidden h-5 w-px bg-[#1a432f] sm:block" />

                  {/* Signed-in User Pill */}
                  <div className="hidden items-center gap-2 rounded-lg bg-[#0b2e1e] px-2.5 py-1.5 ring-1 ring-white/10 sm:flex">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#c99a45]" />
                    <span className="font-mono text-[11px] font-medium text-[#e2f0e8]">
                      {session.email}
                    </span>
                  </div>

                  {/* Logout Form Action */}
                  <form action={logoutAdminAction}>
                    <button
                      type="submit"
                      title="Sign Out of Admin Console"
                      className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#1a432f] bg-[#0b2e1e] px-2.5 py-1.5 text-xs font-semibold text-[#fecdd3] transition-colors hover:border-red-500/40 hover:bg-red-950/40 hover:text-white"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Sign Out</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Sub-Bar: Navigation Tabs Strip */}
            <div className="bg-[#051c11]">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <AdminNav counts={counts} />
              </div>
            </div>
          </header>
        )}

        {/* Admin Page Content Area */}
        <main className="flex-1 pb-16">{children}</main>

        {/* Institutional Admin Footer */}
        {session && (
          <footer className="border-t border-[#e6e4dc] bg-white py-6 text-center text-xs text-[#4b5563]">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-2 text-[11px]">
                <span className="font-semibold text-[#0b2e1e]">
                  Buhary Janaza Welfare Society
                </span>
                <span>•</span>
                <span>Registration: DS/TH/SS/VSSO/2023/01</span>
              </div>
              <p className="text-[11px] text-[#6b7280]">
                Mullipothanai, Eastern Province, Sri Lanka • Official Management System
              </p>
            </div>
          </footer>
        )}
      </body>
    </html>
  );
}
