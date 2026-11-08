"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  Megaphone,
  FileText,
  Newspaper,
  UserCheck,
  Image as ImageIcon,
  ChevronDown,
} from "lucide-react";

interface AdminNavProps {
  counts?: {
    messagesNew?: number;
    membershipsPending?: number;
  };
}

const navItems = [
  {
    href: "/admin",
    label: "Overview",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: "/admin/messages",
    label: "Messages",
    icon: MessageSquare,
    badgeKey: "messagesNew" as const,
  },
  {
    href: "/admin/memberships",
    label: "Memberships",
    icon: Users,
    badgeKey: "membershipsPending" as const,
  },
  {
    href: "/admin/notices",
    label: "Community Notices",
    icon: Megaphone,
  },
  {
    href: "/admin/news",
    label: "News & Blog",
    icon: Newspaper,
  },
  {
    href: "/admin/team",
    label: "Team Directory",
    icon: UserCheck,
  },
  {
    href: "/admin/gallery",
    label: "Photo Gallery",
    icon: ImageIcon,
  },
  {
    href: "/admin/reports",
    label: "Audited Reports",
    icon: FileText,
  },
];

export function AdminNav({ counts }: AdminNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const activeLinkRef = React.useRef<HTMLAnchorElement | null>(null);

  const cleanPath = (pathname || "").replace(/\/$/, "");

  const isActive = (href: string, exact?: boolean) => {
    if (!cleanPath) return false;
    if (exact) {
      return cleanPath === href;
    }
    return cleanPath === href || cleanPath.startsWith(`${href}/`);
  };

  // Find currently active item for mobile dropdown
  const activeItem = navItems.find((item) => isActive(item.href, item.exact));
  const currentActiveHref = activeItem?.href || "/admin";

  // Auto-scroll active tab into view on mount and navigation
  React.useEffect(() => {
    if (activeLinkRef.current) {
      activeLinkRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [pathname]);

  return (
    <div className="w-full">
      {/* Mobile Selector Dropdown (visible on small screens) */}
      <div className="py-2.5 sm:hidden">
        <label htmlFor="admin-nav-mobile" className="sr-only">
          Select Admin Section
        </label>
        <div className="relative">
          <select
            id="admin-nav-mobile"
            value={currentActiveHref}
            onChange={(e) => router.push(e.target.value)}
            className="w-full cursor-pointer appearance-none rounded-xl border border-[#1a432f] bg-[#0c2e1e] px-3.5 py-2 pr-8 text-xs font-semibold text-white shadow-xs focus:border-[#c99a45] focus:outline-none"
          >
            {navItems.map((item) => {
              const badgeCount = item.badgeKey
                ? counts?.[item.badgeKey]
                : undefined;
              return (
                <option key={item.href} value={item.href}>
                  {item.label}
                  {typeof badgeCount === "number" && badgeCount > 0
                    ? ` (${badgeCount} pending)`
                    : ""}
                </option>
              );
            })}
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 h-4 w-4 -translate-y-1/2 text-[#a7c5b6]" />
        </div>
      </div>

      {/* Horizontal Scrollable Tabs Bar */}
      <nav
        className="-mb-px flex [scrollbar-width:none] items-center gap-1 overflow-x-auto py-0 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Admin Navigation Tabs"
      >
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact);
          const Icon = item.icon;
          const badgeCount = item.badgeKey
            ? counts?.[item.badgeKey]
            : undefined;

          return (
            <Link
              key={item.href}
              href={item.href}
              ref={active ? activeLinkRef : undefined}
              className={`group inline-flex shrink-0 items-center gap-2 border-b-2 px-3.5 py-2.5 text-xs font-semibold tracking-wide transition-all ${
                active
                  ? "border-[#c99a45] bg-[#14553a]/40 text-white"
                  : "border-transparent text-[#a7c5b6] hover:border-[#1a432f] hover:bg-[#124d34]/20 hover:text-white"
              }`}
            >
              <Icon
                className={`h-4 w-4 transition-colors ${
                  active
                    ? "text-[#c99a45]"
                    : "text-[#a7c5b6] group-hover:text-white"
                }`}
              />
              <span>{item.label}</span>
              {typeof badgeCount === "number" && badgeCount > 0 && (
                <span
                  className={`ml-1 inline-flex h-4 min-w-[1.1rem] items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
                    active
                      ? "bg-[#c99a45] text-[#062316]"
                      : "bg-[#e11d48] text-white"
                  }`}
                >
                  {badgeCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
