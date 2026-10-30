"use client";

import * as React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { LanguageSwitcher } from "./language-switcher";
import { cn } from "@/lib/utils";
import { X, Heart, Phone, Mail, MapPin } from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: { href: string; label: string }[];
}

export function MobileMenu({ isOpen, onClose, navLinks }: MobileMenuProps) {
  const t = useTranslations();
  const pathname = usePathname();
  const menuRef = React.useRef<HTMLDivElement>(null);
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);

  // Focus trapping and Escape key handling
  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === "Tab" && menuRef.current) {
        const focusableElements =
          menuRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement =
          focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", handleKeyDown);
    const timer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timer);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t("common.openMenu")}
      className="fixed inset-0 z-50 lg:hidden"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div
        ref={menuRef}
        id="mobile-menu"
        className={cn(
          "bg-surface border-border fixed inset-y-0 right-0 w-full max-w-sm border-l shadow-2xl",
          "flex flex-col justify-between overflow-y-auto p-6 transition-transform duration-200 motion-reduce:duration-0"
        )}
      >
        <div>
          {/* Header row with logo */}
          <div className="border-border flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md border border-emerald-900/10">
                <Image
                  src="/image/bjws logo.webp"
                  alt="BJWS Emblem"
                  width={40}
                  height={40}
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <div className="font-display text-sm font-bold text-[#0b2e1e] leading-tight">
                  {t("common.societyShort")}
                </div>
                <div className="text-text-muted flex items-center gap-1 text-[11px]">
                  <MapPin className="h-3 w-3 text-primary" />
                  <span>{t("common.location")}</span>
                </div>
              </div>
            </div>

            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label={t("common.closeMenu")}
              className="text-text-muted hover:text-text hover:bg-muted focus-visible:ring-ring rounded-md p-2 focus-visible:ring-2 focus-visible:outline-none transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav
            className="mt-6 flex flex-col space-y-1"
            aria-label="Mobile Navigation"
          >
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "rounded-md px-3.5 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-[#124d34] text-white font-semibold shadow-2xs"
                      : "text-text hover:bg-muted hover:text-primary"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions & Contact Info */}
        <div className="border-border space-y-4 border-t pt-5">
          {/* Quick Contact */}
          <div className="space-y-1.5 text-xs text-text-muted">
            <a
              href="tel:+94753738349"
              className="flex items-center gap-2 text-primary font-medium hover:underline"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>075 373 8349 ({t("common.emergencyBadge")})</span>
            </a>
            <a
              href="mailto:mbjwsociety@gmail.com"
              className="flex items-center gap-2 hover:underline"
            >
              <Mail className="h-3.5 w-3.5 text-text-muted" />
              <span>mbjwsociety@gmail.com</span>
            </a>
          </div>

          {/* Language selection */}
          <div>
            <div className="text-text-muted mb-2 text-xs font-semibold tracking-wider uppercase">
              {t("common.language")}
            </div>
            <LanguageSwitcher
              variant="pills"
              className="w-full justify-center"
            />
          </div>

          {/* Donate Button */}
          <Link href="/donate" onClick={onClose} className="block">
            <button
              type="button"
              className="w-full bg-[#124d34] hover:bg-[#0b2e1e] text-white font-semibold py-3 px-4 rounded-md shadow-sm transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <Heart className="h-4 w-4 fill-white/20" />
              <span>{t("nav.donate")}</span>
            </button>
          </Link>

          <p className="text-text-muted text-center text-[11px]">
            {t("common.regNo")}
          </p>
        </div>
      </div>
    </div>
  );
}
