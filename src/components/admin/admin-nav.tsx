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
  HeartHandshake,
  Image as ImageIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Sparkles,
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
    href: "/admin/hero",
    label: "Hero Banners",
    icon: Sparkles,
  },
  {
    href: "/admin/notices",
    label: "Notices",
    fullLabel: "Community Notices",
    icon: Megaphone,
  },
  {
    href: "/admin/news",
    label: "News & Blog",
    icon: Newspaper,
  },
  {
    href: "/admin/gallery",
    label: "Gallery",
    fullLabel: "Photo Gallery",
    icon: ImageIcon,
  },
  {
    href: "/admin/team",
    label: "Committee",
    icon: UserCheck,
  },
  {
    href: "/admin/volunteers",
    label: "Volunteers",
    icon: HeartHandshake,
  },
  {
    href: "/admin/reports",
    label: "Reports",
    fullLabel: "Audited Reports",
    icon: FileText,
  },
];

export function AdminNav({ counts }: AdminNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const activeLinkRef = React.useRef<HTMLAnchorElement | null>(null);
  const navContainerRef = React.useRef<HTMLElement | null>(null);

  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);

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

  const checkScroll = React.useCallback(() => {
    const el = navContainerRef.current;
    if (!el) return;
    const hasOverflow = el.scrollWidth > el.clientWidth + 1;
    setCanScrollLeft(hasOverflow && el.scrollLeft > 4);
    setCanScrollRight(
      hasOverflow && el.scrollLeft < el.scrollWidth - el.clientWidth - 4
    );
  }, []);

  // Monitor scroll position and resize
  React.useEffect(() => {
    const el = navContainerRef.current;
    if (!el) return;

    const rafId = requestAnimationFrame(checkScroll);

    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);

    return () => {
      cancelAnimationFrame(rafId);
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  // Keep active tab smoothly in view without forcing center misalignment
  React.useEffect(() => {
    if (activeLinkRef.current) {
      activeLinkRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest",
      });
      const timer = setTimeout(checkScroll, 350);
      return () => clearTimeout(timer);
    }
  }, [pathname, checkScroll]);

  const scrollByAmount = (distance: number) => {
    if (navContainerRef.current) {
      navContainerRef.current.scrollBy({ left: distance, behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full">
      {/* Mobile Selector Dropdown (visible on small mobile screens < sm) */}
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
                  {item.fullLabel || item.label}
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

      {/* Desktop & Tablet Tabs Bar with Smooth Overflow Controls */}
      <div className="relative hidden sm:block">
        {/* Left scroll chevron button (appears only if scrolled right) */}
        {canScrollLeft && (
          <div className="pointer-events-none absolute top-0 bottom-0 left-0 z-10 flex items-center bg-gradient-to-r from-[#051c11] via-[#051c11] to-transparent pr-4">
            <button
              type="button"
              onClick={() => scrollByAmount(-220)}
              aria-label="Scroll navigation tabs left"
              className="pointer-events-auto flex h-7 w-7 items-center justify-center rounded-full border border-[#1a432f] bg-[#0c2e1e] text-[#a7c5b6] shadow-md transition-colors hover:border-[#c99a45] hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Horizontal Tabs Bar */}
        <nav
          ref={navContainerRef}
          className="-mb-px flex [scrollbar-width:none] items-center gap-0.5 overflow-x-auto py-0 [-ms-overflow-style:none] sm:gap-1 [&::-webkit-scrollbar]:hidden"
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
                title={item.fullLabel || item.label}
                className={`group inline-flex shrink-0 items-center gap-1.5 border-b-2 px-2.5 py-2 text-xs font-semibold tracking-wide transition-all sm:gap-2 sm:px-3 sm:py-2.5 ${
                  active
                    ? "border-[#c99a45] bg-[#14553a]/40 text-white"
                    : "border-transparent text-[#a7c5b6] hover:border-[#1a432f] hover:bg-[#124d34]/20 hover:text-white"
                }`}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 transition-colors ${
                    active
                      ? "text-[#c99a45]"
                      : "text-[#a7c5b6] group-hover:text-white"
                  }`}
                />
                <span className="whitespace-nowrap">{item.label}</span>
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

        {/* Right scroll chevron button (appears only if overflow exists to the right) */}
        {canScrollRight && (
          <div className="pointer-events-none absolute top-0 right-0 bottom-0 z-10 flex items-center bg-gradient-to-l from-[#051c11] via-[#051c11] to-transparent pl-4">
            <button
              type="button"
              onClick={() => scrollByAmount(220)}
              aria-label="Scroll navigation tabs right"
              className="pointer-events-auto flex h-7 w-7 items-center justify-center rounded-full border border-[#1a432f] bg-[#0c2e1e] text-[#a7c5b6] shadow-md transition-colors hover:border-[#c99a45] hover:text-white"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
