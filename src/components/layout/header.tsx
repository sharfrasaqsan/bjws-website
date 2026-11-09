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
  Megaphone,
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
  const [isScrolled, setIsScrolled] = React.useState(false);

  // Dynamic scroll elevation listener
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
          href: "/notices",
          label: t("nav.notices"),
          description: t("nav.noticesDesc"),
          icon: Megaphone,
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
      <div className="relative z-50 overflow-x-clip border-b border-emerald-950/80 bg-[#062115] text-xs text-emerald-100/90">
        {/* Subtle Islamic lattice texture */}
        <IslamicPattern
          opacity={0.03}
          className="pointer-events-none text-emerald-200"
        />

        <Container size="xl">
          <div className="flex min-h-[38px] items-center justify-between gap-2 py-1 sm:gap-3">
            {/* Left: Contact Info & Reg No */}
            <div className="flex min-w-0 items-center gap-2.5 text-xs font-normal sm:gap-4">
              {/* Phone / Emergency Hotline */}
              <a
                href="tel:+94776227323"
                className="inline-flex shrink-0 items-center gap-1.5 rounded text-emerald-100 transition-colors hover:text-white focus-visible:ring-1 focus-visible:ring-amber-300 focus-visible:outline-none"
              >
                <Phone
                  className="h-3.5 w-3.5 shrink-0 text-[#c99a45]"
                  aria-hidden="true"
                />
                <span className="text-[11px] font-medium sm:text-xs">
                  <span className="hidden text-emerald-200/70 sm:inline">
                    {t("common.hotline")}:{" "}
                  </span>
                  077 622 7323
                </span>
              </a>

              {/* Divider */}
              <span
                className="hidden text-emerald-800/80 md:inline"
                aria-hidden="true"
              >
                |
              </span>

              {/* Email */}
              <a
                href="mailto:bjwsociety@gmail.com"
                className="hidden items-center gap-1.5 rounded text-emerald-100 transition-colors hover:text-white focus-visible:ring-1 focus-visible:ring-amber-300 focus-visible:outline-none md:inline-flex"
              >
                <Mail
                  className="h-3.5 w-3.5 shrink-0 text-emerald-300/80"
                  aria-hidden="true"
                />
                <span>bjwsociety@gmail.com</span>
              </a>

              {/* Divider */}
              <span
                className="hidden text-emerald-800/80 lg:inline"
                aria-hidden="true"
              >
                |
              </span>

              {/* Registration badge */}
              <div className="hidden items-center gap-1.5 text-[11px] text-emerald-200/70 lg:inline-flex">
                <ShieldCheck
                  className="h-3.5 w-3.5 text-[#c99a45]"
                  aria-hidden="true"
                />
                <span>{t("common.regNo")}</span>
              </div>
            </div>

            {/* Right: Language Switcher, Theme Switcher & Social Link */}
            <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
              {/* Theme Toggle (Dark / Light) */}
              <ThemeToggle variant="topbar" />

              {/* Divider */}
              <span className="text-emerald-800/80" aria-hidden="true">
                |
              </span>

              {/* Language Switcher */}
              <LanguageSwitcher variant="topbar" />

              {/* Divider (Desktop only) */}
              <span
                className="hidden text-emerald-800/80 sm:inline"
                aria-hidden="true"
              >
                |
              </span>

              {/* Social Links (Desktop only) */}
              <div className="hidden items-center gap-1 sm:flex">
                <a
                  href="https://www.facebook.com/profile.php?id=61553295778772"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="BJWS Facebook Community"
                  title="Facebook"
                  className="inline-flex h-6 w-6 items-center justify-center rounded text-emerald-200/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-1 focus-visible:ring-amber-300 focus-visible:outline-none"
                >
                  <svg
                    className="h-3.5 w-3.5 fill-current"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="https://x.com/bjwsociety"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="BJWS on X"
                  title="X (Twitter)"
                  className="inline-flex h-6 w-6 items-center justify-center rounded text-emerald-200/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-1 focus-visible:ring-amber-300 focus-visible:outline-none"
                >
                  <svg
                    className="h-3.5 w-3.5 fill-current"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://www.youtube.com/@bjwsociety"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="BJWS YouTube Channel"
                  title="YouTube"
                  className="inline-flex h-6 w-6 items-center justify-center rounded text-emerald-200/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-1 focus-visible:ring-amber-300 focus-visible:outline-none"
                >
                  <svg
                    className="h-3.5 w-3.5 fill-current"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* 2. STICKY HEADER (Logo, Nav, Solid "Donate" Button) */}
      <header
        className={cn(
          "sticky top-0 z-40 w-full border-b transition-all duration-300",
          isScrolled
            ? "bg-surface/95 border-[#e6e4dc]/80 shadow-md backdrop-blur-md dark:bg-[#0c2117]/95"
            : "bg-surface/98 border-[#e6e4dc] shadow-2xs backdrop-blur-md"
        )}
      >
        <Container size="xl">
          <div className="flex min-h-[4.25rem] items-center justify-between gap-2 py-2 sm:h-20 sm:gap-4 sm:py-0">
            {/* Brand Logo & Title */}
            <Link
              href="/"
              className="group focus-visible:ring-ring flex min-w-0 items-center gap-2.5 rounded-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none sm:gap-3"
            >
              {/* Real BJWS Logo WebP */}
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-emerald-900/15 bg-white p-1 shadow-2xs transition-transform group-hover:scale-105 sm:h-12 sm:w-12">
                <Image
                  src="/images/bjws logo.webp"
                  alt="Buhary Janaza Welfare Society Logo"
                  width={48}
                  height={48}
                  priority
                  className="h-full w-full object-contain"
                />
              </div>

              {/* Brand Typography */}
              <div className="flex min-w-0 flex-col">
                <span className="font-display truncate text-sm leading-snug font-bold tracking-tight text-[#0b2e1e] sm:overflow-visible sm:text-lg lg:text-xl">
                  {t("common.societyName")}
                </span>
                <div className="text-text-muted flex items-center gap-1.5 truncate text-[10px] font-medium sm:gap-2 sm:text-[11px]">
                  <span>{t("common.location")}</span>
                  <span className="font-bold text-[#c99a45]">•</span>
                  <span>{t("common.foundedYear")}</span>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation with Sub-Section Dropdowns */}
            <nav
              ref={navRef}
              className="hidden items-center gap-1 lg:flex xl:gap-2"
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
                        "relative rounded-md px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors xl:text-sm",
                        "focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none",
                        isActive
                          ? "font-semibold text-[#0b2e1e] after:absolute after:right-3 after:bottom-0 after:left-3 after:h-0.5 after:rounded-full after:bg-[#124d34] dark:text-[#f5eedf] dark:after:bg-[#c99a45]"
                          : "text-[#374151] hover:bg-[#f4f2ea]/60 hover:text-[#124d34] dark:text-emerald-100/80 dark:hover:bg-white/5 dark:hover:text-white"
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
                        "relative inline-flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors xl:text-sm",
                        "focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none",
                        isAnyChildActive
                          ? "font-semibold text-[#0b2e1e] after:absolute after:right-3 after:bottom-0 after:left-3 after:h-0.5 after:rounded-full after:bg-[#124d34] dark:text-[#f5eedf] dark:after:bg-[#c99a45]"
                          : "text-[#374151] hover:bg-[#f4f2ea]/60 hover:text-[#124d34] dark:text-emerald-100/80 dark:hover:bg-white/5 dark:hover:text-white",
                        isOpen &&
                          "bg-[#f4f2ea]/80 text-[#124d34] dark:bg-white/10 dark:text-white"
                      )}
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        className={cn(
                          "h-3.5 w-3.5 text-[#6b7280] transition-transform duration-200 dark:text-emerald-200/70",
                          isOpen && "text-primary rotate-180"
                        )}
                        aria-hidden="true"
                      />
                    </button>

                    {/* Dropdown Popover Panel */}
                    <div
                      className={cn(
                        "absolute top-full left-0 z-50 origin-top-left pt-2 transition-all duration-150",
                        isOpen
                          ? "pointer-events-auto scale-100 opacity-100"
                          : "pointer-events-none scale-95 opacity-0"
                      )}
                    >
                      <div className="bg-surface/98 w-[300px] rounded-2xl border border-emerald-950/10 p-2 shadow-xl ring-1 ring-black/5 backdrop-blur-md sm:w-[320px] dark:border-emerald-800/40 dark:bg-[#062115]">
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
                                    ? "bg-emerald-50 ring-1 ring-emerald-500/20 dark:bg-[#0c3121]"
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
                                <div className="flex min-w-0 flex-col">
                                  <div className="flex items-center gap-1.5">
                                    <span
                                      className={cn(
                                        "text-xs leading-tight font-semibold",
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
                                  <span className="text-text-muted mt-0.5 text-[11px] leading-snug dark:text-emerald-300/70">
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
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              {/* Solid ThemeForest Charity "Donate" Button */}
              <Link href="/donate" className="hidden sm:inline-flex">
                <button
                  type="button"
                  className={cn(
                    "inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-[#124d34] px-4 py-2 text-xs font-semibold text-white shadow-xs transition-all duration-200 xl:gap-2 xl:px-5 xl:py-2.5 xl:text-sm",
                    "hover:-translate-y-0.5 hover:bg-[#0b2e1e] hover:shadow-md",
                    "focus-visible:ring-2 focus-visible:ring-[#124d34] focus-visible:ring-offset-2 focus-visible:outline-none"
                  )}
                >
                  <Heart
                    className="h-3.5 w-3.5 fill-white/20 transition-transform hover:scale-110 xl:h-4 xl:w-4"
                    aria-hidden="true"
                  />
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
                className="hover:bg-muted focus-visible:ring-ring rounded-md p-2 text-[#1c2420] transition-colors focus-visible:ring-2 focus-visible:outline-none lg:hidden dark:text-emerald-100"
              >
                <Menu className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
        </Container>
      </header>

      {/* Floating Dynamic Island Notice Announcement Widget (Replaced old top bar) */}
      <JanazaTicker notices={notices} />

      {/* Accessible Mobile Menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navItems={navItems}
      />
    </>
  );
}
