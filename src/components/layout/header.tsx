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
import {
  Phone,
  Mail,
  Heart,
  Menu,
  ShieldCheck,
} from "lucide-react";

interface HeaderProps {
  notices?: NoticeItem[];
}

export function Header({ notices = [] }: HeaderProps) {
  const t = useTranslations();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const desktopNavLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/about", label: t("nav.about") },
    { href: "/services", label: t("nav.services") },
    { href: "/achievements", label: t("nav.achievements") },
    { href: "/gallery", label: t("nav.gallery") },
    { href: "/membership", label: t("nav.membership") },
    { href: "/contact", label: t("nav.contact") },
  ];

  const mobileNavLinks = [
    ...desktopNavLinks,
    { href: "/reports", label: t("nav.reports") },
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
                href="tel:+94753738349"
                className="inline-flex items-center gap-1.5 text-emerald-100 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-300 rounded shrink-0"
              >
                <Phone className="h-3.5 w-3.5 text-[#c99a45] shrink-0" aria-hidden="true" />
                <span className="font-medium text-[11px] sm:text-xs">
                  <span className="hidden sm:inline text-emerald-200/70">{t("common.hotline")}: </span>
                  075 373 8349
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

            {/* Desktop Navigation */}
            <nav
              className="hidden items-center gap-0.5 xl:gap-1.5 lg:flex"
              aria-label="Main Navigation"
            >
              {desktopNavLinks.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "relative rounded-md px-2 xl:px-2.5 py-1.5 text-xs xl:text-sm font-medium whitespace-nowrap transition-colors",
                      "focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none",
                      isActive
                        ? "text-[#0b2e1e] font-semibold after:absolute after:bottom-0 after:left-2 after:right-2 after:h-0.5 after:bg-[#124d34] after:rounded-full"
                        : "text-[#374151] hover:text-[#124d34] hover:bg-[#f4f2ea]/60"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Side: Solid "Donate" Button & Mobile Toggle */}
            <div className="flex items-center gap-3">
              {/* Solid ThemeForest Charity "Donate" Button */}
              <Link href="/donate" className="hidden sm:inline-flex">
                <button
                  type="button"
                  className={cn(
                    "cursor-pointer inline-flex items-center gap-2 rounded-md bg-[#124d34] px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition-all duration-200",
                    "hover:bg-[#0b2e1e] hover:shadow-md hover:-translate-y-0.5",
                    "focus-visible:ring-2 focus-visible:ring-[#124d34] focus-visible:ring-offset-2 focus-visible:outline-none"
                  )}
                >
                  <Heart className="h-4 w-4 fill-white/20 transition-transform hover:scale-110" aria-hidden="true" />
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
                className="text-[#1c2420] hover:bg-muted focus-visible:ring-ring rounded-md p-2 focus-visible:ring-2 focus-visible:outline-none lg:hidden transition-colors"
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
        navLinks={mobileNavLinks}
      />
    </>
  );
}
