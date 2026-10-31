"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  Megaphone,
  FileText,
  Newspaper,
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
    href: "/admin/reports",
    label: "Audited Reports",
    icon: FileText,
  },
];

export function AdminNav({ counts }: AdminNavProps) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <nav
      className="flex items-center gap-1 overflow-x-auto py-0 -mb-px [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      aria-label="Admin Navigation Tabs"
    >
      {navItems.map((item) => {
        const active = isActive(item.href, item.exact);
        const Icon = item.icon;
        const badgeCount = item.badgeKey ? counts?.[item.badgeKey] : undefined;

        return (
          <Link
            key={item.href}
            href={item.href}
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
  );
}
