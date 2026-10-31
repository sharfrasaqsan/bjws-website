"use client";

import * as React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { Container } from "@/components/ui/container";
import { LanguageSwitcher } from "./language-switcher";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { MobileMenu } from "./mobile-menu";
import { JanazaTicker, type NoticeItem } from "./janaza-ticker";
import { IslamicPattern } from "@/components/ui/islamic-pattern";
import { cn } from "@/lib/utils";
import type { NavItem } from "./nav-items";
import {
  Phone,
  Mail,
  Heart,
  Menu,
  ShieldCheck,
  ChevronDown,
  Info,
  Users,
  Award,
  FileText,
  Newspaper,
  Images,
} from "lucide-react";

interface HeaderProps {
  notices?: NoticeItem[];
}

export function Header({ notices = [] }: HeaderProps) {
  const t = useTranslations();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const navRef = React.useRef<HTMLElement>(null);

  // Reset dropdown when pathname changes
  const [prevPathname, setPrevPathname] = React.useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setOpenDropdown(null);
  }

  // Click outside and Escape key to close dropdown
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleMouseEnter = (id: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setOpenDropdown(id);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  };

  const toggleDropdown = (id: string) => {
    setOpenDropdown((prev) => (prev === id ? null : id));
  };

  const navItems: NavItem[] = [
    { type: "link", href: "/", label: t("nav.home") },
    {
      type: "dropdown",
      id: "about",
      label: t("nav.aboutGroup"),
      items: [
        {
          href: "/about",
          label: t("nav.aboutBJWS"),
          description: t("nav.aboutDesc"),
          icon: Info,
        },
        {
          href: "/team",
          label: t("nav.team"),
          description: t("nav.teamDesc"),
          icon: Users,
        },
        {
          href: "/achievements",
          label: t("nav.achievements"),
          description: t("nav.achievementsDesc"),
          icon: Award,
        },
        {
          href: "/reports",
          label: t("nav.reports"),
          description: t("nav.reportsDesc"),
          icon: FileText,
        },
      ],
    },
    { type: "link", href: "/services", label: t("nav.services") },
    {
      type: "dropdown",
      id: "media",
      label: t("nav.mediaGroup"),
      items: [
        {
          href: "/news",
          label: t("nav.news"),
          description: t("nav.newsDesc"),
          icon: Newspaper,
        },
        {
          href: "/gallery",
          label: t("nav.gallery"),
          description: t("nav.galleryDesc"),
          icon: Images,
        },
      ],
    },
    { type: "link", href: "/membership", label: t("nav.membership") },
    { type: "link", href: "/contact", label: t("nav.contact") },
  ];

  return (
    <>
      {/* 1. TOP UTILITY BAR (Email, Phone, Language Switcher, Social Link) */}
      <div className="relative z-50 bg-[#062115] text-emerald-100/90 border-b border-emerald-950/80 text-xs overflow-x-clip">
        {/* Subtle Islamic lattice texture */}
        <IslamicPattern opacity={0.03} className="text-emerald-200 pointer-events-none" />

        <Container size="xl">
          <div className="flex min-h-[38px] items-center justify-between gap-2 sm:gap-3 py-1">
            {/* Left: Contact Info & Reg No */}
            <div className="flex items-center gap-2.5 sm:gap-4 text-xs font-normal min-w-0">
              {/* Phone / Emergency Hotline */}
              <a
                href="tel:+94776227323"
                className="inline-flex items-center gap-1.5 text-emerald-100 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-300 rounded shrink-0"
              >
                <Phone className="h-3.5 w-3.5 text-[#c99a45] shrink-0" aria-hidden="true" />
                <span className="font-medium text-[11px] sm:text-xs">
                  <span className="hidden sm:inline text-emerald-200/70">{t("common.hotline")}: </span>
                  077 622 7323
                </span>
              </a>

              {/* Divider */}
              <span className="hidden md:inline text-emerald-800/80" aria-hidden="true">|</span>

              {/* Email */}
              <a
                href="mailto:mbjwsociety@gmail.com"
                className="hidden md:inline-flex items-center gap-1.5 text-emerald-100 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-300 rounded"
              >
                <Mail className="h-3.5 w-3.5 text-emerald-300/80 shrink-0" aria-hidden="true" />
                <span>mbjwsociety@gmail.com</span>
              </a>

              {/* Divider */}
              <span className="hidden lg:inline text-emerald-800/80" aria-hidden="true">|</span>

              {/* Registration badge */}
              <div className="hidden lg:inline-flex items-center gap-1.5 text-emerald-200/70 text-[11px]">
                <ShieldCheck className="h-3.5 w-3.5 text-[#c99a45]" aria-hidden="true" />
                <span>{t("common.regNo")}</span>
              </div>
            </div>

            {/* Right: Language Switcher, Theme Switcher & Social Link */}
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
              {/* Theme Toggle (Dark / Light) */}
              <ThemeToggle variant="topbar" />

              {/* Divider */}
              <span className="text-emerald-800/80" aria-hidden="true">|</span>

              {/* Language Switcher */}
              <LanguageSwitcher variant="topbar" />

              {/* Divider (Desktop only) */}
              <span className="hidden sm:inline text-emerald-800/80" aria-hidden="true">|</span>

              {/* Facebook Link (Desktop only) */}
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="BJWS Facebook Community"
                className="hidden sm:inline-flex items-center justify-center h-6 w-6 rounded text-emerald-200/80 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-300"
              >
                <svg
                  className="h-3.5 w-3.5 fill-current"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>
        </Container>
      </div>

      {/* 2. STICKY HEADER (Logo, Nav, Solid "Donate" Button) */}
      <header className="sticky top-0 z-40 w-full border-b border-[#e6e4dc] bg-surface/98 backdrop-blur-md transition-colors shadow-2xs">
        <Container size="xl">
          <div className="flex min-h-[4.25rem] sm:h-20 items-center justify-between gap-2 sm:gap-4 py-2 sm:py-0">
            {/* Brand Logo & Title */}
            <Link
              href="/"
              className="group focus-visible:ring-ring flex items-center gap-2.5 sm:gap-3 rounded-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none min-w-0"
            >
              {/* Real BJWS Logo WebP */}
              <div className="relative h-10 w-10 sm:h-12 sm:w-12 shrink-0 overflow-hidden rounded-lg border border-emerald-900/15 bg-white p-1 shadow-2xs transition-transform group-hover:scale-105">
                <Image
                  src="/image/bjws logo.webp"
                  alt="Buhary Janaza Welfare Society Logo"
                  width={48}
                  height={48}
                  priority
                  className="h-full w-full object-contain"
                />
              </div>

              {/* Brand Typography */}
              <div className="flex flex-col min-w-0">
                <span className="font-display text-sm font-bold tracking-tight text-[#0b2e1e] leading-snug sm:text-lg lg:text-xl truncate sm:overflow-visible">
                  {t("common.societyName")}
                </span>
                <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] font-medium text-text-muted truncate">
                  <span>{t("common.location")}</span>
                  <span className="text-[#c99a45] font-bold">•</span>
                  <span>{t("common.foundedYear")}</span>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation with Sub-Section Dropdowns */}
            <nav
              ref={navRef}
              className="hidden items-center gap-1 xl:gap-2 lg:flex"
              aria-label="Main Navigation"
            >
              {navItems.map((item) => {
                if (item.type === "link") {
                  const isActive =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "relative rounded-md px-3 py-2 text-xs xl:text-sm font-medium whitespace-nowrap transition-colors",
                        "focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none",
                        isActive
                          ? "text-[#0b2e1e] dark:text-[#f5eedf] font-semibold after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:bg-[#124d34] dark:after:bg-[#c99a45] after:rounded-full"
                          : "text-[#374151] dark:text-emerald-100/80 hover:text-[#124d34] dark:hover:text-white hover:bg-[#f4f2ea]/60 dark:hover:bg-white/5"
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                }

                // Dropdown Item
                const isAnyChildActive = item.items.some((sub) =>
                  pathname.startsWith(sub.href)
                );
                const isOpen = openDropdown === item.id;

                return (
                  <div
                    key={item.id}
                    className="relative"
                    onMouseEnter={() => handleMouseEnter(item.id)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button
                      type="button"
                      onClick={() => toggleDropdown(item.id)}
                      aria-expanded={isOpen}
                      aria-haspopup="true"
                      className={cn(
                        "relative inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-xs xl:text-sm font-medium whitespace-nowrap transition-colors cursor-pointer",
                        "focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none",
                        isAnyChildActive
                          ? "text-[#0b2e1e] dark:text-[#f5eedf] font-semibold after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:bg-[#124d34] dark:after:bg-[#c99a45] after:rounded-full"
                          : "text-[#374151] dark:text-emerald-100/80 hover:text-[#124d34] dark:hover:text-white hover:bg-[#f4f2ea]/60 dark:hover:bg-white/5",
                        isOpen &&
                          "bg-[#f4f2ea]/80 dark:bg-white/10 text-[#124d34] dark:text-white"
                      )}
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        className={cn(
                          "h-3.5 w-3.5 transition-transform duration-200 text-[#6b7280] dark:text-emerald-200/70",
                          isOpen && "rotate-180 text-primary"
                        )}
                        aria-hidden="true"
                      />
                    </button>

                    {/* Dropdown Popover Panel */}
                    <div
                      className={cn(
                        "absolute left-0 top-full pt-2 z-50 transition-all duration-150 origin-top-left",
                        isOpen
                          ? "opacity-100 scale-100 pointer-events-auto"
                          : "opacity-0 scale-95 pointer-events-none"
                      )}
                    >
                      <div className="w-[300px] sm:w-[320px] rounded-2xl border border-emerald-950/10 dark:border-emerald-800/40 bg-surface/98 dark:bg-[#062115] p-2 shadow-xl ring-1 ring-black/5 backdrop-blur-md">
                        <div className="space-y-1">
                          {item.items.map((sub) => {
                            const isSubActive = pathname.startsWith(sub.href);
                            const IconComponent = sub.icon;
                            return (
                              <Link
                                key={sub.href}
                                href={sub.href}
                                onClick={() => setOpenDropdown(null)}
                                className={cn(
                                  "group flex items-start gap-3 rounded-xl p-2.5 transition-all",
                                  isSubActive
                                    ? "bg-emerald-50 dark:bg-[#0c3121] ring-1 ring-emerald-500/20"
                                    : "hover:bg-emerald-50/70 dark:hover:bg-white/5"
                                )}
                              >
                                <div
                                  className={cn(
                                    "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors",
                                    isSubActive
                                      ? "bg-[#124d34] text-white dark:bg-[#c99a45] dark:text-[#062115]"
                                      : "bg-emerald-100/70 text-[#124d34] group-hover:bg-[#124d34] group-hover:text-white dark:bg-emerald-900/40 dark:text-[#52b788] dark:group-hover:bg-[#c99a45] dark:group-hover:text-[#062115]"
                                  )}
                                >
                                  <IconComponent className="h-4 w-4" />
                                </div>
                                <div className="flex flex-col min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span
                                      className={cn(
                                        "text-xs font-semibold leading-tight",
                                        isSubActive
                                          ? "text-primary dark:text-[#e0b85c]"
                                          : "text-text group-hover:text-primary dark:text-emerald-100 dark:group-hover:text-white"
                                      )}
                                    >
                                      {sub.label}
                                    </span>
                                    {isSubActive && (
                                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-amber-400" />
                                    )}
                                  </div>
                                  <span className="mt-0.5 text-[11px] leading-snug text-text-muted dark:text-emerald-300/70">
                                    {sub.description}
                                  </span>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </nav>

            {/* Right Side: Solid "Donate" Button & Mobile Toggle */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Solid ThemeForest Charity "Donate" Button */}
              <Link href="/donate" className="hidden sm:inline-flex">
                <button
                  type="button"
                  className={cn(
                    "cursor-pointer inline-flex items-center gap-1.5 xl:gap-2 rounded-md bg-[#124d34] px-4 xl:px-5 py-2 xl:py-2.5 text-xs xl:text-sm font-semibold text-white shadow-xs transition-all duration-200",
                    "hover:bg-[#0b2e1e] hover:shadow-md hover:-translate-y-0.5",
                    "focus-visible:ring-2 focus-visible:ring-[#124d34] focus-visible:ring-offset-2 focus-visible:outline-none"
                  )}
                >
                  <Heart className="h-3.5 w-3.5 xl:h-4 xl:w-4 fill-white/20 transition-transform hover:scale-110" aria-hidden="true" />
                  <span>{t("nav.donate")}</span>
                </button>
              </Link>

              {/* Mobile menu toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
                aria-label={t("common.openMenu")}
                className="text-[#1c2420] dark:text-emerald-100 hover:bg-muted focus-visible:ring-ring rounded-md p-2 focus-visible:ring-2 focus-visible:outline-none lg:hidden transition-colors"
              >
                <Menu className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
        </Container>

        {/* 2b. SLIM JANAZA ANNOUNCEMENTS TICKER (Fed by notices table, hidden if empty) */}
        <JanazaTicker notices={notices} />
      </header>

      {/* Accessible Mobile Menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navItems={navItems}
      />
    </>
  );
}
